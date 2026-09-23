/**
 * Web Cockpit Entry Point - Crypto Multi-Tool
 */

import type { HealthResponse, RadarStatusResponse } from "../shared/contracts";

const appEl = document.getElementById("app");

function renderApp(health?: HealthResponse, radar?: RadarStatusResponse, error?: string): void {
  if (!appEl) return;

  const isOnline = health?.status === "healthy";

  appEl.innerHTML = `
    <header class="navbar">
      <div class="logo-group">
        <span class="brand-badge">SPOT RADAR</span>
        <h1 class="brand-title">Crypto Multi-Tool</h1>
      </div>
      <div class="system-status">
        <span class="status-dot ${isOnline ? "online" : ""}"></span>
        <span>${isOnline ? `Node.js Engine: ${health.environment.toUpperCase()}` : (error ? "Desconectado" : "Conectando...")}</span>
      </div>
    </header>

    <main class="grid-dashboard">
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Motor Cuantitativo (Node.js)</h2>
          <span class="brand-badge">${isOnline ? "ACTIVO" : "OFFLINE"}</span>
        </div>
        <div class="metric-value">${isOnline ? "200 OK" : "---"}</div>
        <div class="metric-label">Runtime: ${health?.node_version || "Node 20+"} | Monoproceso Hostinger</div>
      </section>

      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Adaptador Binance Spot</h2>
          <span class="brand-badge">READ-ONLY</span>
        </div>
        <div class="metric-value">${health?.binance_auth ? "AUTENTICADO" : "PÚBLICO"}</div>
        <div class="metric-label">API REST /ticker/24hr & /klines</div>
      </section>

      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Estado del Radar Spot</h2>
          <span class="brand-badge">${radar?.btc_regime || "SIDEWAYS_SAFE"}</span>
        </div>
        <div class="metric-value">${radar?.ready_count ?? 0} LISTAS / ${radar?.watch_count ?? 0} WATCH</div>
        <div class="metric-label">Escaneados: ${radar?.scanned ?? 0} | Filtrados: ${radar?.filtered ?? 0}</div>
      </section>

      <section class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <h2 class="card-title">Diagnóstico de Entorno y Estado del Sistema</h2>
        </div>
        <pre class="code-preview">${JSON.stringify({ health: health || { error: error || "Esperando conexión..." }, radar: radar || null }, null, 2)}</pre>
      </section>
    </main>
  `;
}

async function fetchDiagnostics(): Promise<void> {
  try {
    const [healthRes, radarRes] = await Promise.all([
      fetch("/health"),
      fetch("/api/radar/status").catch(() => null)
    ]);

    if (!healthRes.ok) throw new Error(`HTTP error ${healthRes.status}`);
    const healthData: HealthResponse = await healthRes.json();
    const radarData: RadarStatusResponse | undefined = radarRes?.ok ? await radarRes.json() : undefined;

    renderApp(healthData, radarData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    renderApp(undefined, undefined, message);
  }
}

// Initial render & fetch
renderApp();
fetchDiagnostics();
