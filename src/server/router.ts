/**
 * Central API Request Router (TypeScript)
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import type { HealthResponse, RadarStatusResponse } from "../shared/contracts";
import { binanceAdapter } from "./binance";
import { config } from "./config";
import { logger } from "./logger";

function sendJson(res: ServerResponse, statusCode: number, data: unknown): void {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  _req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  // 1. Healthcheck endpoints
  if (pathname === "/health" || pathname === "/api/health") {
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
    sendJson(res, 200, health);
    return true;
  }

  // 2. Radar Status endpoint
  if (pathname === "/api/radar/status") {
    const status: RadarStatusResponse = {
      daemon: "running",
      scanned: 50,
      filtered: 44,
      watch_count: 4,
      ready_count: 2,
      btc_regime: "SIDEWAYS_SAFE",
      last_scan_utc: new Date().toISOString(),
    };
    sendJson(res, 200, status);
    return true;
  }

  // 3. Binance Ping Connectivity
  if (pathname === "/api/binance/ping") {
    try {
      const isAlive = await binanceAdapter.ping();
      sendJson(res, isAlive ? 200 : 503, {
        service: "binance",
        connected: isAlive,
        base_url: config.binance.baseUrl,
      });
    } catch (err) {
      sendJson(res, 500, {
        error: "Failed to connect to Binance API",
        details: err instanceof Error ? err.message : String(err),
      });
    }
    return true;
  }

  // Not an API route or unrecognized /api route
  if (pathname.startsWith("/api/")) {
    logger.warn(`API endpoint not found: ${pathname}`);
    sendJson(res, 404, { error: "Endpoint not found", path: pathname });
    return true;
  }

  return false;
}
