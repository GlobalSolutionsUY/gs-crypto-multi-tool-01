/**
 * Crypto Multi-Tool - Central Hono Application
 * REST API, Server-Sent Events (SSE), and Static SPA Hosting
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import type {
  HealthResponse,
  MarketCandle,
  OpportunitySignal,
  RadarStatusResponse,
} from "../shared/contracts";
import { binanceAdapter } from "./binance";
import { config } from "./config";
import { logger } from "./logger";

export const app = new Hono();

// Enable CORS for development
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// In-memory radar cache & mock candidates for initial testing
let scanCount = 50;
let filteredCount = 44;
const watchCount = 4;
const readyCount = 2;
let lastScanUtc = new Date().toISOString();

const mockCandidates: OpportunitySignal[] = [
  {
    signalId: "sig-allo-001",
    ticker: "ALLOUSDT",
    exchange: "BINANCE",
    toolOrigin: "SPOT_RADAR",
    status: "READY",
    timestampUtc: new Date().toISOString(),
    score: 88,
    marketSnapshot: {
      ticker: "ALLOUSDT",
      exchange: "BINANCE",
      currentPrice: 0.2092,
      change24hPct: -8.4,
      volume24hQuote: 18450000,
      spreadPct: 0.08,
      rvol1h: 2.35,
      atr1h: 0.005,
      nearestSupport: 0.208,
      distanceToSupportPct: 0.57,
      recentDropPct: -9.2,
    },
    tradeParameters: {
      entryZoneMin: 0.208,
      entryZoneMax: 0.21,
      invalidationPrice: 0.203,
      invalidationPct: -2.96,
      tp1Price: 0.22,
      tp1Pct: 5.16,
      tp2Price: 0.23,
      tp2Pct: 9.94,
      riskRewardTp1: 1.74,
      riskRewardTp2: 3.35,
    },
    riskLevel: "MEDIO",
    causalDiagnosis: [
      "Caída de -9.2% en 36h testeando soporte en 0.208 USDT",
      "Mecha de absorción del 45% con RVOL de 2.35x en vela 1h",
      "Ratio Riesgo/Beneficio de 3.3x hacia TP2 sin resistencia inmediata",
    ],
  },
  {
    signalId: "sig-zec-002",
    ticker: "ZECUSDT",
    exchange: "BINANCE",
    toolOrigin: "SPOT_RADAR",
    status: "WATCH",
    timestampUtc: new Date().toISOString(),
    score: 72,
    marketSnapshot: {
      ticker: "ZECUSDT",
      exchange: "BINANCE",
      currentPrice: 38.45,
      change24hPct: -6.1,
      volume24hQuote: 25100000,
      spreadPct: 0.05,
      rvol1h: 1.8,
      atr1h: 1.12,
      nearestSupport: 37.8,
      distanceToSupportPct: 1.71,
      recentDropPct: -7.5,
    },
    tradeParameters: {
      entryZoneMin: 38.0,
      entryZoneMax: 38.5,
      invalidationPrice: 37.2,
      invalidationPct: -3.25,
      tp1Price: 40.5,
      tp1Pct: 5.33,
      tp2Price: 42.0,
      tp2Pct: 9.23,
      riskRewardTp1: 1.64,
      riskRewardTp2: 2.84,
    },
    riskLevel: "MEDIO",
    causalDiagnosis: [
      "Aproximación a zona de soporte mayor en 37.8 USDT",
      "RVOL incrementando a 1.8x pero aún sin vela envolvente confirmada",
      "Estado WATCH: esperar confirmación de mecha en cierre de vela",
    ],
  },
];

// ==============================================================================
// 1. HEALTH & INFO ENDPOINTS
// ==============================================================================

app.get("/health", (c) => {
  const health: HealthResponse = {
    status: "healthy",
    service: "crypto-multi-tool",
    runtime: "nodejs",
    node_version: process.version,
    environment: config.environment,
    binance_auth: config.binance.hasAuth,
    telegram_auth: config.telegram.hasAuth,
    timestamp_utc: new Date().toISOString(),
  };
  return c.json(health);
});

app.get("/api/health", (c) => c.redirect("/health", 301));

// ==============================================================================
// 2. DEBUG & DIAGNOSTICS ENDPOINTS
// ==============================================================================

app.get("/api/debug/state", (c) => {
  const memory = process.memoryUsage();
  return c.json({
    uptime_seconds: Math.floor(process.uptime()),
    memory: {
      rss_mb: (memory.rss / 1024 / 1024).toFixed(2),
      heap_used_mb: (memory.heapUsed / 1024 / 1024).toFixed(2),
      heap_total_mb: (memory.heapTotal / 1024 / 1024).toFixed(2),
    },
    environment: config.environment,
    radar: {
      scanned: scanCount,
      filtered: filteredCount,
      watch: watchCount,
      ready: readyCount,
      last_scan_utc: lastScanUtc,
    },
  });
});

app.get("/api/debug/datasources", async (c) => {
  const start = Date.now();
  let binanceConnected = false;
  let binanceLatencyMs = -1;

  try {
    binanceConnected = await binanceAdapter.ping();
    binanceLatencyMs = Date.now() - start;
  } catch {
    binanceConnected = false;
  }

  return c.json({
    sources: [
      {
        id: "binance_spot",
        name: "Binance Spot Public REST",
        status: binanceConnected ? "ONLINE" : "UNREACHABLE",
        latency_ms: binanceLatencyMs,
        base_url: config.binance.baseUrl,
        read_only: true,
      },
      {
        id: "trading_different",
        name: "Trading Different Liquidity API",
        status: "PLANNED",
        read_only: true,
      },
      {
        id: "dex_screener",
        name: "DEXScreener Meme Filter",
        status: "PLANNED",
        read_only: true,
      },
    ],
  });
});

// ==============================================================================
// 3. MARKET DATA ENDPOINTS (For React Charts & Heatmaps)
// ==============================================================================

app.get("/api/market/tickers", async (c) => {
  try {
    const raw = (await binanceAdapter.get24hrTicker()) as Array<{
      symbol: string;
      lastPrice: string;
      priceChangePercent: string;
      quoteVolume: string;
      count: number;
    }>;

    // Filter Top pairs against USDT, excluding stablecoins & tokens
    const filtered = raw
      .filter(
        (t) =>
          t.symbol.endsWith("USDT") &&
          !t.symbol.includes("UPUSDT") &&
          !t.symbol.includes("DOWNUSDT") &&
          !["USDCUSDT", "FDUSDUSDT", "TUSDUSDT", "EURUSDT"].includes(t.symbol),
      )
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 50)
      .map((t) => ({
        symbol: t.symbol,
        price: parseFloat(t.lastPrice),
        change24hPct: parseFloat(t.priceChangePercent),
        quoteVolume: parseFloat(t.quoteVolume),
        tradesCount: t.count,
      }));

    return c.json({ total: filtered.length, tickers: filtered });
  } catch (err) {
    logger.error("Error fetching market tickers", { error: String(err) });
    return c.json({ error: "Failed to fetch market tickers" }, 502);
  }
});

app.get("/api/market/candles/:symbol", async (c) => {
  const symbol = c.req.param("symbol").toUpperCase();
  const interval = c.req.query("interval") || "1h";
  const limit = Math.min(Number(c.req.query("limit")) || 100, 500);

  try {
    const candles: MarketCandle[] = await binanceAdapter.getKlines(symbol, interval, limit);
    return c.json({
      symbol,
      interval,
      count: candles.length,
      candles,
    });
  } catch (err) {
    logger.error(`Error fetching candles for ${symbol}`, { error: String(err) });
    return c.json({ error: `Failed to fetch candles for ${symbol}` }, 502);
  }
});

// ==============================================================================
// 4. RADAR & COPILOT ENDPOINTS
// ==============================================================================

app.get("/api/radar/status", (c) => {
  const status: RadarStatusResponse = {
    daemon: "running",
    scanned: scanCount,
    filtered: filteredCount,
    watch_count: watchCount,
    ready_count: readyCount,
    btc_regime: "SIDEWAYS_SAFE",
    last_scan_utc: lastScanUtc,
  };
  return c.json(status);
});

app.get("/api/radar/candidates", (c) => {
  const statusFilter = c.req.query("status")?.toUpperCase();
  if (statusFilter) {
    const filtered = mockCandidates.filter((item) => item.status === statusFilter);
    return c.json({ count: filtered.length, candidates: filtered });
  }
  return c.json({ count: mockCandidates.length, candidates: mockCandidates });
});

app.post("/api/radar/scan", (c) => {
  // Trigger on-demand radar scan cycle
  lastScanUtc = new Date().toISOString();
  scanCount = 50;
  filteredCount = 44;
  logger.info("Radar scan triggered via API");
  return c.json({
    message: "Scan executed successfully",
    scanned: scanCount,
    filtered: filteredCount,
    timestamp_utc: lastScanUtc,
    candidates: mockCandidates,
  });
});

// ==============================================================================
// 5. STREAMING (SSE - Server-Sent Events for Live React Cockpit)
// ==============================================================================

app.get("/api/stream/events", (c) => {
  return streamSSE(c, async (stream) => {
    logger.info("Client connected to SSE stream");

    // 1. Initial connection greeting & telemetry
    await stream.writeSSE({
      event: "connected",
      data: JSON.stringify({
        message: "Connected to Crypto Multi-Tool Realtime Stream",
        timestamp_utc: new Date().toISOString(),
      }),
    });

    // 2. Initial state push
    await stream.writeSSE({
      event: "radar_status",
      data: JSON.stringify({
        daemon: "running",
        scanned: scanCount,
        filtered: filteredCount,
        watch_count: watchCount,
        ready_count: readyCount,
        btc_regime: "SIDEWAYS_SAFE",
      }),
    });

    // 3. Heartbeat loop (every 15 seconds)
    while (!stream.aborted) {
      await stream.sleep(15000);
      await stream.writeSSE({
        event: "heartbeat",
        data: JSON.stringify({
          timestamp_utc: new Date().toISOString(),
          uptime: Math.floor(process.uptime()),
        }),
      });
    }
  });
});
