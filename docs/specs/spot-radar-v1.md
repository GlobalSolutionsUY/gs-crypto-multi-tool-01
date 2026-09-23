# Especificación Técnica: Spot Opportunity Radar (V1 Core)

- **Módulo:** Tool 1 - Spot Opportunity Radar
- **Fase:** V1 (Lanzamiento inicial en producción)
- **Playbook Referencia:** Reversión Temprana / Rebote Táctico (Playbook ZEC/ALLO)
- **Target Operativo:** Movimientos de +3% a +10% en pocas velas / días

---

## 1. Alcance y Universo de Activos

El módulo procesa de forma continua los activos más líquidos del mercado Spot:
- **Universo de Escaneo:** Top 30 a 50 pares en Binance Spot contra USDT ordenados por volumen efectivo diario (> $15M USD 24h).
- **Timeframes Primarios:**
  - **Macro / Contexto:** 4h y 1d (para validar que la estructura mayor no esté en caída libre catastrófica).
  - **Táctico / Ejecución:** 1h y 15m (para detectar la absorción, velas de rechazo y aumento de RVOL).

---

## 2. Heurística Cuantitativa del Playbook

El motor evalúa 4 fases secuenciales antes de calificar un par como candidato:

### Fase 1: Contracción Significativa Previa
- El activo debe haber experimentado una caída reciente medible:
  $$\Delta P = \frac{Price_{actual} - High_{reciente}}{High_{reciente}} \le -6\% \text{ a } -20\%$$
- La caída no debe ser un evento de liquidación total del proyecto (el volumen 24h debe mantenerse activo y el spread bid/ask no debe superar el 0.15%).

### Fase 2: Testeo de Soporte y Agotamiento de Ventas
- El precio debe aproximarse a un soporte estructural identificado (mínimo anterior relevante, nodo de alto volumen o nivel de reversión previa).
- Formación de mechas de absorción inferiores en velas de 1h o contracción en el rango de las velas (disminución del spread de vela indicando que la presión vendedora se seca).

### Fase 3: Aceleración de Volumen Relativo (RVOL)
- El volumen de la vela de rebote o rechazo debe superar la media móvil simple de volumen de las últimas 20 velas:
  $$RVOL = \frac{Volume_{actual}}{SMA(Volume, 20)} \ge 1.4x$$
- Esta condición garantiza que no estamos comprando un rebote muerto sin participantes reales.

### Fase 4: Ratio Riesgo / Beneficio Asimétrico
- **Nivel de Entrada:** Rango entre el precio actual y el precio de cierre de la vela de rechazo.
- **Nivel de Invalidación (Stop Loss):** Ligeramente por debajo del mínimo de la mecha de rechazo (típicamente entre -1.5% y -3.5%).
- **Objetivo Técnico (Take Profit):**
  - TP1: +3% a +5% (primer obstáculo de resistencia menor o retroceso proporcional).
  - TP2: +8% a +10% (resistencia estructural intermedia).
- **Restricción:** El ratio $R/R$ proyectado hasta TP1 debe ser como mínimo $1:2.0$.

---

## 3. Desacoplamiento de Responsabilidades: App vs. Agente

### Capa de la Aplicación (Spot Math Engine)
1. Ingesta las velas mediante llamadas optimizadas al [Exchange Adapter](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/system-architecture.md).
2. Calcula de forma vectorial (NumPy / Polars) RVOL, ATR y niveles de soporte/resistencia.
3. Aplica el **Filtro Negativo**: descarta automáticamente el 85-90% de pares que no cumplen los umbrales mínimos.
4. Si un par supera el filtro inicial, lo sitúa en estado `WATCH`.
5. Solicita al [Visual Rendering Engine](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/heatmap-engine.md) la generación del gráfico anotado y el mapa de calor de liquidez.

### Capa del Agente (Agent Reasoning via MCP)
1. El agente recibe la notificación de candidatos en `WATCH` mediante la tool MCP `get_spot_radar_candidates()`.
2. Ejecuta el [Agent MCP SOP](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/agent-mcp-sop.md) en 5 pasos sistemáticos.
3. Audita visualmente la imagen del gráfico y la matriz de liquidez.
4. Si valida la confluencia, invoca `publish_trading_alert()`, promoviendo el estado a `READY` y disparando la notificación a Telegram y al Web Cockpit.
5. Si detecta trampa o debilidad estructural, invoca `reject_opportunity()`, registrando el motivo en el log auditable.

---

## 4. Esquema de Salida JSON de la Señal

```json
{
  "signal_id": "sig-spot-allo-20260923-001",
  "ticker": "ALLOUSDT",
  "exchange": "BINANCE",
  "tool": "SPOT_OPPORTUNITY_RADAR",
  "status": "READY",
  "timestamp_utc": "2026-09-23T00:50:00Z",
  "market_data": {
    "current_price": 0.2092,
    "rvol_1h": 2.35,
    "atr_1h": 0.0048,
    "drop_from_recent_high_pct": -11.4
  },
  "trade_parameters": {
    "entry_zone": [0.2080, 0.2100],
    "invalidation_price": 0.2030,
    "invalidation_pct": -2.96,
    "tp1_price": 0.2210,
    "tp1_pct": 5.64,
    "tp2_price": 0.2300,
    "tp2_pct": 9.94,
    "risk_reward_tp1": 1.91,
    "risk_reward_tp2": 3.36
  },
  "risk_assessment": {
    "risk_level": "MEDIO",
    "liquidity_spread_pct": 0.06,
    "btc_correlation_state": "NEUTRAL_SAFE"
  },
  "causal_diagnosis": [
    "Caida de -11.4% absorbida con mecha en soporte diario 0.208",
    "RVOL en 1h de 2.35x con recuperacion de estructura en 15m",
    "Espacio libre de resistencia hasta el cluster de 0.221 (TP1)"
  ],
  "visual_artifacts": {
    "annotated_chart_url": "/api/v1/charts/spot/ALLOUSDT-latest.png",
    "liquidity_heatmap_url": "/api/v1/heatmaps/ALLOUSDT-latest.png"
  }
}
```
