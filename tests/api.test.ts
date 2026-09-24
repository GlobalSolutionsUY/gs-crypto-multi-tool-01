import { describe, expect, it } from "vitest";
import { app } from "../src/server/app";

describe("Hono Central API Endpoints", () => {
  it("GET /health returns healthy status", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("crypto-multi-tool");
    expect(body.runtime).toBe("nodejs");
  });

  it("GET /api/debug/state returns system memory and scan telemetry", async () => {
    const res = await app.request("/api/debug/state");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("uptime_seconds");
    expect(body).toHaveProperty("memory");
    expect(body.radar.scanned).toBe(50);
  });

  it("GET /api/radar/status returns daemon status", async () => {
    const res = await app.request("/api/radar/status");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.daemon).toBe("running");
    expect(body.scanned).toBe(50);
    expect(body.btc_regime).toBe("SIDEWAYS_SAFE");
  });

  it("GET /api/radar/candidates returns active signals", async () => {
    const res = await app.request("/api/radar/candidates");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.count).toBeGreaterThan(0);
    expect(body.candidates[0].ticker).toBe("ALLOUSDT");
    expect(body.candidates[0].status).toBe("READY");
  });

  it("POST /api/radar/scan triggers on-demand scan", async () => {
    const res = await app.request("/api/radar/scan", { method: "POST" });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.message).toContain("successfully");
    expect(body.scanned).toBe(50);
  });
});
