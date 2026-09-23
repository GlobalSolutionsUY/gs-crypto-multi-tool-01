# Hoja de Ruta del Proyecto: Crypto Multi-Tool (Radar & Copilot)

- **Organización:** [GlobalSolutionsUY](https://github.com/GlobalSolutionsUY)
- **Repositorio:** [gs-crypto-multi-tool-01](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)
- **Stakeholders / Operadores:** Ger & Freya
- **Estado:** Activo / Fase 1 (MVP)
- **Última Actualización:** 2026-09-23

---

## 1. Visión Evolutiva del Ecosistema

La plataforma evoluciona en fases bien delimitadas, priorizando la entrega de valor inmediato en Spot antes de expandir a derivados, memecoins y automatización:

```text
FASE 1 (MVP Actual)     FASE 2                   FASE 3                   FASE 4
┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│ Spot Radar V1      │──►│ Liquidity Radar    │──►│ Listings & Catalysts│──►│ Execution Engine   │
│ Ingestor Binance   │   │ Meme Radar (Anti-  │   │ On-Chain & Whales  │   │ Asistido (Opt-In)  │
│ Risk Filter        │   │  Rug Filters)      │   │ Integración DEX    │   │ Autorización       │
│ Telegram & Web SPA │   │ Bitget / Bitunix   │   │                    │   │  Manual            │
└────────────────────┘   └────────────────────┘   └────────────────────┘   └────────────────────┘
```

---

## 2. Fase 1: Sprint de Implementación del MVP (Spot Radar V1)

Construcción vertical de extremo a extremo del **Spot Opportunity Radar** que opere contra datos en tiempo real de Binance Spot (read-only), filtre 30 a 50 pares líquidos, detecte anomalías de rebote táctico (Dip & Bounce ZEC/ALLO), aplique el filtro de riesgo y despache el diagnóstico a la consola y a Telegram.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│               CRONOGRAMA DE DESARROLLO (SPRINT DE 3 HORAS)              │
│                                                                         │
│  [00:00 - 00:35] Bloque 1: Ingesta Binance REST & Filtro Universo Top 50 │
│  [00:35 - 00:55] Bloque 2: Normalización OHLCV & Modelos de Dominio     │
│  [00:55 - 01:45] Bloque 3: Algoritmo Spot Radar (RVOL, ATR, Soporte)    │
│  [01:45 - 02:15] Bloque 4: Motor de Riesgo y Matriz Oportunidad/Riesgo  │
│  [02:15 - 02:45] Bloque 5: Formateador & Despacho CLI / Telegram       │
│  [02:45 - 03:00] Bloque 6: Integración Final, Pruebas y Corrida Real    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detalle de Bloques de Ejecución:
1. **Bloque 1: Ingesta de Mercado (`specs/data-ingestion.md`):**
   - Cliente HTTP asíncrono para Binance Spot (`/ticker/24hr` y `/klines`).
   - Filtrar los 30 a 50 pares USDT con mayor volumen diario, excluyendo stablecoins y tokens apalancados.
   - Manejo de pesos de rate limiting y reintentos ante desconexión.
2. **Bloque 2: Normalización y Tipado (`architecture/data-contracts.md`):**
   - Modelos Pydantic (`Candle`, `MarketSnapshot`, `OpportunitySignal`).
   - Estandarización a timestamps UTC y tipos numéricos `float` de alta precisión.
3. **Bloque 3: Motor de Análisis Spot Radar (`specs/spot-radar.md`):**
   - Cálculo vectorial de RVOL (SMA 20) y ATR (14 periodos).
   - Detección de contracción porcentual ($\Delta P_{\text{drop}}$ entre $-3.5\%$ y $-15\%$).
   - Heurística de rechazo de soporte y mecha de absorción ($\ge 35\%$).
   - Proyección automática de stop ($P_{\text{inval}}$), entrada y targets ($R:R \ge 1.8$).
4. **Bloque 4: Motor de Riesgo y Scoring (`specs/risk-filter.md`):**
   - Filtros duros: descarte por volumen bajo o R:R deficiente.
   - Asignación de Score (0 a 100) y categorización de Oportunidad y Riesgo.
   - Determinación de estados: `WATCH` vs. `READY`.
5. **Bloque 5: Despacho y Presentación (`specs/notification-dispatch.md`):**
   - Formateador de texto estructurado normalizado.
   - Salida por terminal/consola enriquecida con tabla resumen.
   - Conector de Telegram Bot con soporte de imagen anotada.
   - Registro en `logs/alerts.jsonl`.
6. **Bloque 6: Verificación y Demostración:**
   - Corrida en vivo contra Binance Spot con verificación de descarte efectivo ($\ge 85\%$).

### Criterios de Aceptación de la Fase 1
1. **Eficiencia en Filtrado Negativo:** De un universo de 30 a 50 pares analizados, el sistema debe descartar de forma limpia y causal al menos el 85% de los pares sin estructura.
2. **Latencia de Escaneo:** El ciclo de ingesta, cálculo matemático y generación de artefactos debe completarse en menos de 20 segundos por corrida.
3. **Calidad de la Alerta:** Toda oportunidad en estado `READY` debe contener niveles numéricos exactos de entrada, invalidación y targets ($R:R \ge 1.8$), junto con diagnóstico causal explicable.

---

## 3. Fases Posteriores (Post-MVP)

### 3.1 Fase 2: Derivados, Memecoins y Multi-Exchange
- **Tool 2 (Liquidity & Futures Radar):** Monitoreo de clusters de liquidación en derivados (Trading Different API), Open Interest y barridas de liquidez (*sweep & reclaim*).
- **Tool 3 (Meme Early Mover Filter):** Detección temprana en Solana/EVM vía DEXScreener con filtros automáticos anti-rug (verificación de LP quemada, concentración top 10 holders $< 25\%$).
- **Multi-Exchange:** Adaptadores para Bitget y Bitunix para comparar discrepancias de precio y spreads.

### 3.2 Fase 3: Eventos, Listings y Telemetría On-Chain
- **Tool 4 (New Listings & Catalizadores):** Monitoreo de anuncios oficiales CEX, Launchpools y evaluación de tokenomics (evitando compra en FOMO).
- **Tool 5 (On-Chain & Whale Telemetry):** Telemetría de flujos netos CEX y acumulación de ballenas.

### 3.3 Fase 4: Execution Engine Desacoplado (Opt-In)
- Microservicio independiente aislado con confirmación de dos factores (2FA / clave física) para operadores que deseen enrutamiento de órdenes asistido.
