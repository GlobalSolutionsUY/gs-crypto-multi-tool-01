# SAD-002: Contratos de Datos y Esquemas del Sistema

**Documento:** Data Contracts and Schema Specification  
**Código:** SAD-002  
**Versión:** 1.0.0  
**Estado:** Formalizado  
**Última Actualización:** 2026-09-23  

---

## 1. Introducción

Este documento formaliza las estructuras y tipos de datos que fluyen entre los diferentes componentes del pipeline de **Crypto Multi-Tool**. El objetivo es impedir el acoplamiento rígido con respuestas de APIs específicas de exchanges y garantizar la interoperabilidad y tipado estricto en el código.

---

## 2. Modelos de Datos del Pipeline

### 2.1 Modelo: Vela de Mercado (`MarketCandle`)
Representa una unidad indivisible de serie temporal OHLCV normalizada a UTC.

```typescript
interface MarketCandle {
  timestamp: number;        // Epoch unix en milisegundos (UTC)
  open: number;             // Precio de apertura
  high: number;             // Precio máximo
  low: number;              // Precio mínimo
  close: number;            // Precio de cierre
  volume: number;           // Volumen transaccionado en el activo base
  quoteVolume: number;      // Volumen transaccionado en la moneda cotizada (ej. USDT)
  tradesCount?: number;     // Número total de operaciones (si disponible)
}
```

### 2.2 Modelo: Candidato a Señal (`SignalCandidate`)
Emitido por cualquier motor de análisis (Radar) cuando se detecta un patrón técnico preeliminar.

```typescript
type SignalState = "WATCH" | "READY" | "INVALIDATED";

interface SignalCandidate {
  symbol: string;               // Ej: "ZECUSDT"
  exchange: string;             // Ej: "BINANCE"
  timeframe: string;            // Ej: "1h"
  strategyId: string;           // Ej: "SPOT_DIP_BOUNCE"
  detectedAt: string;           // ISO 8601 UTC
  currentPrice: number;         // Último precio verificado
  entryRange: {
    min: number;                // Límite inferior del rango sugerido
    max: number;                // Límite superior del rango sugerido
  };
  targetPrice: number;          // Precio objetivo estimado
  targetPercentage: number;     // Ganancia porcentual estimada (+X.X%)
  invalidationPrice: number;    // Precio de stop técnico / pérdida de estructura
  rvol: number;                 // Ratio de volumen relativo calculado
  atr: number;                  // Volatilidad promedio del activo
  technicalNotes: string[];     // Observaciones preliminares del radar
}
```

### 2.3 Modelo: Evaluación de Riesgo (`RiskEvaluation`)
Resultado producido por el `Risk Filter` tras auditar un `SignalCandidate`.

```typescript
type OpportunityLevel = "ALTA" | "MEDIA" | "BAJA";
type RiskLevel = "ALTO" | "MEDIO" | "BAJO";

interface RiskEvaluation {
  candidate: SignalCandidate;
  passedFilter: boolean;             // Si supera el corte aduanero
  opportunityLevel: OpportunityLevel;// Calificación de recompensa
  riskLevel: RiskLevel;              // Calificación de riesgo
  riskRewardRatio: number;           // Ratio formal (Target / Invalidation)
  finalState: SignalState;           // "WATCH" | "READY" | "INVALIDATED"
  rejectionReasons: string[];        // Lista vacía si pasó; motivos si falló
  deterministicDiagnosis: string[];  // 3 puntos explicativos del veredicto
}
```

### 2.4 Modelo: Carga de Notificación (`AlertPayload`)
Contrato final enviado a los despachadores (Telegram, Webhook, CLI).

```typescript
interface AlertPayload {
  alertId: string;              // UUID v4 único de la alerta
  symbol: string;               // Ej: "ALLOUSDT"
  moduleSource: string;         // Ej: "SPOT_RADAR"
  state: SignalState;           // "WATCH" | "READY" | "INVALIDATED"
  currentPrice: number;         // Precio al despachar
  setupName: string;            // Ej: "Rebote Táctico (Dip & Bounce)"
  entryRange: string;           // Formato: "0.2080 – 0.2100"
  targetFormatted: string;      // Formato: "+5.2% ≈ 0.2195 USDT"
  invalidationPrice: number;    // Formato numérico exacto
  relativeVolume: string;       // "Aumentando (RVOL 1.45)" | "Estable"
  riskLevel: RiskLevel;         // "BAJO" | "MEDIO" | "ALTO"
  timestampUtc: string;         // "YYYY-MM-DD HH:mm:ss UTC"
  dataSource: string;           // "Binance Spot REST"
  diagnosis: string[];          // Bullets explicativos deterministas
}
```

---

## 3. Ejemplo de Payload JSON Despachado

```json
{
  "alertId": "c8b21ef4-6f81-42ab-92db-59dc9a4731aa",
  "symbol": "ALLOUSDT",
  "moduleSource": "SPOT_RADAR",
  "state": "WATCH",
  "currentPrice": 0.2090,
  "setupName": "Rebote Táctico (Dip & Bounce)",
  "entryRange": "0.2080 – 0.2100",
  "targetFormatted": "+5.0% ≈ 0.2195 USDT",
  "invalidationPrice": 0.2015,
  "relativeVolume": "Aumentando (RVOL 1.38)",
  "riskLevel": "MEDIO",
  "timestampUtc": "2026-09-23 04:15:00 UTC",
  "dataSource": "Binance Spot Public REST",
  "diagnosis": [
    "Contracción acumulada de -7.4% en 36h con preservación de soporte en 0.2050",
    "Agotamiento de volumen vendedor y rechazo de mínimos en temporalidad 1h",
    "Ratio Riesgo/Beneficio proyectado de 2.4 con RVOL relativo de 1.38"
  ]
}
```
