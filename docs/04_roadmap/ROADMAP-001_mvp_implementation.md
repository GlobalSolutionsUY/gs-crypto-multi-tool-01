# ROADMAP-001: Plan de Implementación del MVP (Fase 1)

**Documento:** Plan de Ejecución Técnica — MVP  
**Código:** ROADMAP-001  
**Versión:** 1.0.0  
**Tiempo Estimado de Ejecución:** ~3 horas  
**Estado:** Listo para Desarrollo  
**Última Actualización:** 2026-09-23  

---

## 1. Objetivo del Sprint MVP

Construir una **versión vertical y funcional de extremo a extremo** del **Spot Opportunity Radar** que opere contra datos en tiempo real de Binance Spot (read-only), filtre 30 a 50 pares líquidos, detecte anomalías de rebote táctico (Dip & Bounce), aplique el filtro de riesgo y despache el diagnóstico a la consola y a Telegram.

> **Meta del MVP:** *"Nuestro copiloto escaneó 50 criptomonedas, descartó 43, identificó 7 en observación, calificó 2 como READY de alta probabilidad y justificó cuantitativamente por qué."*

---

## 2. Desglose de Tareas por Bloques de Tiempo

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

### Bloque 1: Ingesta de Mercado (35 min) — `SPEC-001`
- Implementar cliente HTTP asíncrono para Binance Spot (`/api/v3/ticker/24hr` y `/api/v3/klines`).
- Filtrar los 30 a 50 pares USDT con mayor volumen diario, excluyendo stablecoins y tokens apalancados.
- Implementar manejo de pesos de rate limiting y reintentos ante desconexión.

### Bloque 2: Normalización y Tipado (20 min) — `SAD-002`
- Crear clases fuertemente tipadas ([`MarketCandle`](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/02_architecture/SAD-002_data_contracts_and_schemas.md), `MarketSeries`).
- Estandarizar marcas de tiempo a UTC y tipos numéricos `float` de alta precisión.

### Bloque 3: Motor de Análisis Spot Radar (50 min) — `SPEC-002`
- Cálculo matemático de RVOL (SMA 20 periodos).
- Cálculo de True Range y ATR 14 periodos.
- Detección de contracción porcentual ($\Delta P_{\text{drop}}$ entre $-3.5\%$ y $-15\%$).
- Heurística de rechazo de soporte y mecha de absorción ($\ge 35\%$).
- Proyección automática de stop ($P_{\text{inval}}$), entrada y target ($R:R \ge 2.0$).

### Bloque 4: Motor de Riesgo y Scoring (30 min) — `SPEC-003`
- Filtros duros: descartar activos con volumen bajo o R:R deficiente.
- Asignación de Score (0 a 100) y categorización de Oportunidad (`ALTA` / `MEDIA` / `BAJA`) y Riesgo (`ALTO` / `MEDIO` / `BAJO`).
- Determinación de estados: `WATCH` vs. `READY`.
- Síntesis de los 3 puntos de diagnóstico causal.

### Bloque 5: Despacho y Presentación (30 min) — `SPEC-004`
- Formateador de texto estructurado normalizado.
- Salida por terminal/consola enriquecida con tabla resumen.
- Conector de Telegram Bot / Webhook con gestión de variables de entorno.
- Registro en `logs/alerts.jsonl`.

### Bloque 6: Verificación y Demostración (15 min)
- Corrida en vivo contra Binance Spot.
- Verificación del porcentaje de descarte efectivo ($\ge 85\%$).
- Validación de las alertas generadas por los operadores (Ger & Freya).
