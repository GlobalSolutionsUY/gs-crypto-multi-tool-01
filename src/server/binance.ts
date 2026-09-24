/**
 * Binance Spot Market Data Ingestion Adapter (Read-Only)
 */

import type { MarketCandle } from "../shared/contracts";
import { config } from "./config";
import { logger } from "./logger";

export class BinanceAdapter {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.binance.baseUrl;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "User-Agent": "Crypto-Multi-Tool/0.1.0",
      Accept: "application/json",
    };
    if (config.binance.apiKey) {
      headers["X-MBX-APIKEY"] = config.binance.apiKey;
    }
    return headers;
  }

  /**
   * Test connectivity to the Binance REST API.
   */
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v3/ping`, {
        headers: this.getHeaders(),
      });
      return res.ok;
    } catch (err) {
      logger.error("Failed to ping Binance REST API", {
        error: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  }

  /**
   * Fetch 24-hour rolling ticker price change statistics.
   */
  async get24hrTicker(symbol?: string): Promise<unknown> {
    const endpoint = symbol
      ? `${this.baseUrl}/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`
      : `${this.baseUrl}/api/v3/ticker/24hr`;

    const res = await fetch(endpoint, { headers: this.getHeaders() });
    if (!res.ok) {
      throw new Error(`Binance API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Fetch candlestick (K-line) data for a given symbol and interval.
   */
  async getKlines(symbol: string, interval = "1h", limit = 100): Promise<MarketCandle[]> {
    const url = new URL(`${this.baseUrl}/api/v3/klines`);
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("interval", interval);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), { headers: this.getHeaders() });
    if (!res.ok) {
      throw new Error(`Failed to fetch klines for ${symbol}: ${res.statusText}`);
    }

    const rawData = (await res.json()) as Array<
      [
        number, // 0: Open time
        string, // 1: Open
        string, // 2: High
        string, // 3: Low
        string, // 4: Close
        string, // 5: Volume
        number, // 6: Close time
        string, // 7: Quote asset volume
        number, // 8: Number of trades
        string, // 9: Taker buy base asset volume
        string, // 10: Taker buy quote asset volume
        string, // 11: Ignore
      ]
    >;

    return rawData.map((k) => ({
      timestamp: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      quoteVolume: parseFloat(k[7]),
      tradesCount: k[8],
      isClosed: true,
    }));
  }
}

export const binanceAdapter = new BinanceAdapter();
