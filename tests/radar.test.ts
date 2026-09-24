import { describe, expect, it } from "vitest";
import { RadarEngine } from "../src/server/radar.ts";

describe("RadarEngine", () => {
  it("calculateRvol correctly calculates relative volume", () => {
    const engine = new RadarEngine();
    // 20 historical periods of 100 volume, current is 250
    const volumes = Array(20).fill(100).concat([250]);
    const rvol = engine.calculateRvol(volumes, 20);
    expect(rvol).toBe(2.5);
  });

  it("detectAbsorptionWick detects rejection wick", () => {
    const engine = new RadarEngine();
    const candle = {
      timestamp: Date.now(),
      open: 100,
      high: 105,
      low: 90,
      close: 102,
      volume: 500,
      quoteVolume: 50000,
    };
    const result = engine.detectAbsorptionWick(candle);
    expect(result.isAbsorption).toBe(true);
    expect(result.lowerWickRatio).toBeGreaterThanOrEqual(0.4);
  });
});
