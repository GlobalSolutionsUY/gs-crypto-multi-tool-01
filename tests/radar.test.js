import test from "node:test";
import assert from "node:assert/strict";
import { RadarEngine } from "../src/server/radar.ts";

test("RadarEngine.calculateRvol correctly calculates relative volume", () => {
  const engine = new RadarEngine();
  // 20 historical periods of 100 volume, current is 250
  const volumes = Array(20).fill(100).concat([250]);
  const rvol = engine.calculateRvol(volumes, 20);
  assert.equal(rvol, 2.5);
});

test("RadarEngine.detectAbsorptionWick detects rejection wick", () => {
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
  assert.equal(result.isAbsorption, true);
  assert.ok(result.lowerWickRatio >= 0.4);
});
