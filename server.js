/**
 * Crypto Multi-Tool - Unified Node.js Server
 * Hostinger NodeApp Entrypoint (server.js)
 *
 * Implements ADR 0007: Serves the Web Cockpit SPA static files and exposes backend API endpoints.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 8000;
const HOST = "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "production";

// Locate static distribution folder (root dist/ or web/dist/)
function resolveDistDir() {
  const rootDist = path.join(__dirname, "dist");
  if (fs.existsSync(rootDist)) return rootDist;
  const webDist = path.join(__dirname, "web", "dist");
  if (fs.existsSync(webDist)) return webDist;
  return rootDist;
}

const DIST_DIR = resolveDistDir();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8"
};

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error reading file", code: err.code }));
      return;
    }

    const headers = { "Content-Type": contentType };
    if (filePath.includes("assets")) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    } else {
      headers["Cache-Control"] = "no-cache";
    }

    res.writeHead(200, headers);
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  // 1. Healthcheck endpoint
  if (pathname === "/health" || pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        service: "crypto-multi-tool",
        runtime: "nodejs",
        node_version: process.version,
        environment: NODE_ENV,
        binance_auth: Boolean(process.env.BINANCE_API_KEY),
        telegram_auth: Boolean(process.env.TELEGRAM_BOT_TOKEN)
      })
    );
    return;
  }

  // 2. API Endpoints
  if (pathname.startsWith("/api/")) {
    if (pathname === "/api/radar/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          daemon: "running",
          scanned: 50,
          filtered: 44,
          watch_count: 4,
          ready_count: 2,
          btc_regime: "SIDEWAYS_SAFE"
        })
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found", path: pathname }));
    return;
  }

  // 3. Static Files & SPA Fallback
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  if (safePath === "/" || safePath === "\\") {
    safePath = "/index.html";
  }

  const filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      serveFile(res, filePath, contentType);
      return;
    }

    // SPA fallback: return index.html for navigation routes
    const fallbackPath = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(fallbackPath)) {
      serveFile(res, fallbackPath, "text/html; charset=utf-8");
    } else {
      res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Crypto Multi-Tool</h1><p>Building frontend assets... Please refresh shortly.</p>");
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[Crypto Multi-Tool] Unified NodeApp running on http://${HOST}:${PORT}`);
  console.log(`[Crypto Multi-Tool] Serving static assets from: ${DIST_DIR}`);
});
