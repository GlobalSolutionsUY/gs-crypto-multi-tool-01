/**
 * Spot Radar Quantitative Calculation Engine (TypeScript)
 */

import type { MarketCandle } from "../shared/contracts";

export interface AbsorptionWickResult {
  isAbsorption: boolean;
  lowerWickRatio: number;
  upperWickRatio: number;
  bodyRatio: number;
}

export class RadarEngine {
  /**
   * Calculate Relative Volume (RVOL) against a rolling moving average of N periods.
   */
  calculateRvol(volumes: number[], period = 20): number {
    if (volumes.length === 0) return 0;
    const currentVolume = volumes[volumes.length - 1];
    const historical = volumes.slice(-period - 1, -1);

    if (historical.length === 0) return 1.0;

    const sum = historical.reduce((acc, v) => acc + v, 0);
    const mean = sum / historical.length;

    if (mean === 0) return 0;
    return parseFloat((currentVolume / mean).toFixed(2));
  }

  /**
   * Calculate Average True Range (ATR) over N periods.
   */
  calculateAtr(candles: MarketCandle[], period = 14): number {
    if (candles.length < 2) return 0;

    const trueRanges: number[] = [];
    for (let i = 1; i < candles.length; i++) {
      const current = candles[i];
      const previous = candles[i - 1];

      const tr = Math.max(
        current.high - current.low,
        Math.abs(current.high - previous.close),
        Math.abs(current.low - previous.close),
      );
      trueRanges.push(tr);
    }

    const window = trueRanges.slice(-period);
    if (window.length === 0) return 0;

    const sum = window.reduce((acc, v) => acc + v, 0);
    return parseFloat((sum / window.length).toFixed(4));
  }

  /**
   * Analyze candlestick wicks to identify buyer absorption (rejection of lows).
   */
  detectAbsorptionWick(candle: MarketCandle): AbsorptionWickResult {
    const totalRange = candle.high - candle.low;
    if (totalRange === 0) {
      return { isAbsorption: false, lowerWickRatio: 0, upperWickRatio: 0, bodyRatio: 0 };
    }

    const body = Math.abs(candle.close - candle.open);
    const lowerWick = Math.min(candle.open, candle.close) - candle.low;
    const upperWick = candle.high - Math.max(candle.open, candle.close);

    const lowerWickRatio = parseFloat((lowerWick / totalRange).toFixed(2));
    const upperWickRatio = parseFloat((upperWick / totalRange).toFixed(2));
    const bodyRatio = parseFloat((body / totalRange).toFixed(2));

    // Absorption criteria: lower wick represents >= 40% of the entire candle range
    const isAbsorption = lowerWickRatio >= 0.4;

    return {
      isAbsorption,
      lowerWickRatio,
      upperWickRatio,
      bodyRatio,
    };
  }
}

export const radarEngine = new RadarEngine();
