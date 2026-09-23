/**
 * Web Cockpit Entry Point - Crypto Multi-Tool
 */

interface HealthResponse {
  status: string;
  service: string;
  environment: string;
  binance_auth: boolean;
  telegram_auth: boolean;
}

const appEl = document.getElementById("app");

function renderApp(health?: HealthResponse, error?: string): void {
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
        <span>${isOnline ? `Backend: ${health.environment.toUpperCase()}` : (error ? "Desconectado" : "Conectando...")}</span>
      </div>
    </header>

    <main class="grid-dashboard">
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Motor Cuantitativo (FastAPI)</h2>
          <span class="brand-badge">${isOnline ? "ACTIVO" : "OFFLINE"}</span>
        </div>
        <div class="metric-value">${isOnline ? "200 OK" : "---"}</div>
        <div class="metric-label">Puerto 8000 | FastMCP Puerto 8001</div>
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
          <h2 class="card-title">Despachador Telegram</h2>
          <span class="brand-badge">ALERTAS</span>
        </div>
        <div class="metric-value">${health?.telegram_auth ? "CONECTADO" : "NO CONFIGURADO"}</div>
        <div class="metric-label">Canal push para operadores Ger & Freya</div>
      </section>

      <section class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <h2 class="card-title">Diagnóstico de Entorno</h2>
        </div>
        <pre class="code-preview">${JSON.stringify(health || { error: error || "Esperando conexión..." }, null, 2)}</pre>
      </section>
    </main>
  `;
}

async function checkHealth(): Promise<void> {
  try {
    const res = await fetch("/health");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: HealthResponse = await res.json();
    renderApp(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    renderApp(undefined, message);
  }
}

// Initial render & fetch
renderApp();
checkHealth();
