# Especificación de Visión y Arquitectura de Negocio: crypto-multi-tool

- **Documento:** Especificación de Requerimientos y Visión de Plataforma
- **Organización:** gsolut
- **Stakeholders:** Germán & Andrés
- **Estado:** Activo / Oficial

---

## 1. Misión y Tesis Operativa

`crypto-multi-tool` es una plataforma in-house de inteligencia de mercado y soporte a la decisión (Decision Support System - DSS), concebida para la mesa de trading cuantitativo y táctico de **gsolut**.

### 1.1 La Asimetría de Atención en Trading
El mercado de criptoactivos opera 24/7 con más de 500 pares líquidos cotizando simultáneamente. La capacidad cognitiva humana solo permite vigilar con rigor técnico entre 3 y 5 activos a la vez. El propósito de este sistema es:
- **Automatizar el trabajo mecánico:** Escaneo exhaustivo, normalización, cálculo de métricas complejas y descarte masivo de ruido.
- **Potenciar la ventaja humana:** Reservar el análisis de contexto macro, el juicio discrecional y la asignación de capital para los operadores (Germán y Andrés).

### 1.2 Principios Fundamentales
1. **Human-in-the-Loop:** El sistema identifica, califica, anota y alerta; la decisión de arriesgar capital reside exclusivamente en el operador humano.
2. **Selección Negativa:** La ventaja competitiva está en la capacidad de decir "el mercado no ofrece condiciones de riesgo/beneficio favorables hoy; no operar". No se fuerzan operaciones.
3. **Desacoplamiento de Exchanges:** Ningún exchange es dueño del sistema. Las fuentes de datos (Binance, Bitget, Bitunix, on-chain, mapas de liquidación) son tratadas como conectores periféricos reemplazables.
4. **Determinismo y Explicabilidad:** Toda señal debe responder a causas exactas, auditables y sin depender de cajas negras estadísticas o redes neuronales opacas.

---

## 2. Catálogo de Módulos (Tools Suite)

La plataforma está diseñada como un conjunto modular de herramientas independientes:

### Tool 1: Spot Opportunity Radar (Prioridad V1)
- **Objetivo:** Caza de rebotes tácticos tempranos y recuperaciones de estructura (+3% a +10% en pocas velas/días) en pares líquidos Spot.
- **Insumos:** Series temporales OHLCV, volumen relativo (RVOL), ATR y distancia porcentual a soportes clave.
- **Playbook:** Caída pronunciada con estructura mayor intacta -> Agotamiento de ventas y absorción -> Confirmación temprana de volumen -> Detección antes de que el rebote consolide un +5%.

### Tool 2: Liquidity & Orderflow Radar
- **Objetivo:** Detección de zonas densas de liquidez, mapas de liquidación y barridas de stops institucionales en contratos de futuros/perpetuos.
- **Insumos:** Mapas de liquidaciones (Trading Different / APIs externas), libro de órdenes L2/L3, Open Interest (OI), CVD (Cumulative Volume Delta) y Funding Rates.
- **Salida:** Clasificación de zonas de aproximación, barrida confirmada o rechazo (ej. `BTC - Liquidez en 78.2k - Barrida completada con absorción de delta`).

### Tool 3: Meme & High-Beta Radar
- **Objetivo:** Detección de activos de altísima volatilidad en etapas tempranas aplicando filtros estrictos de supervivencia de capital.
- **Insumos:** Nuevos pares en DEX, aceleración de transacciones y llamadas a contratos inteligentes.
- **Filtros:** Verificación de contratos maliciosos (honeypot/rug indicators), concentración de wallets en top holders, liquidez bloqueada o quemada.

### Tool 4: Listings & Catalyst Radar
- **Objetivo:** Monitoreo y puntuación de eventos discretos que generan desequilibrios inmediatos de oferta/demanda.
- **Insumos:** Anuncios oficiales de CEX (Binance Announcements, Launchpools, Upbit listings), lanzamientos DEX y calendarios de desbloqueo de tokens (token unlocks).
- **Lógica:** Evaluación de tokenomics y volumen inicial para evitar comprar picos de euforia mecánicamente.

### Tool 5: On-Chain & Whale Telemetry Radar
- **Objetivo:** Detección de flujos atípicos de capital inteligente (Smart Money).
- **Insumos:** Transferencias significativas de billeteras ballena, flujos netos hacia/desde exchanges (CEX Net Inflows/Outflows).
- **Rol:** Factor ponderado dentro de la matriz de riesgo y scoring, no disparador aislado de órdenes.

---

## 3. Matriz Universal de Alertas

Toda alerta emitida por cualquier módulo adopta una estructura unificada y procesable:

```text
[TICKER] : [ORIGIN_TOOL] : [STATUS]
--------------------------------------------------
Precio Actual:     <Decimal>
Setup / Playbook:  <Nombre del Patrón>
Rango de Entrada:  <Min> - <Max>
Objetivo Técnico:  <+X.X%> ≈ <Precio TP1> | TP2: <Precio TP2>
Invalidación (SL): <Precio de Stop> (-X.X%)
Ratio R/R:         1 : <Ratio>
RVOL / Volumen:    <Multiplicador>x sobre media
Nivel de Riesgo:   Bajo | Medio | Alto
Timestamp (UTC):   <YYYY-MM-DD HH:mm:ss>

Diagnóstico Causal:
- <Condición 1: Comportamiento de precio y absorción>
- <Condición 2: Respaldo de volumen y confluencia técnica>
- <Condición 3: Justificación del ratio riesgo/beneficio>
```

---

## 4. Ciclo de Vida del Setup

Una oportunidad transiciona a través de estados bien definidos en el [Opportunity State Manager](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/system-architecture.md):
1. **`DISCOVERY`:** Anomalía detectada por el motor matemático preliminar.
2. **`WATCH`:** La estructura madura en la zona de soporte; se monitorea la confirmación de volumen.
3. **`READY`:** Condiciones cuantitativas cumplidas y auditadas por el Agente vía MCP; lista para evaluación del operador.
4. **`TRIGGERED`:** El precio entra activamente en el rango de compra sugerido.
5. **`INVALIDATED`:** El precio quiebra el nivel de invalidación o la tesis estructural deja de ser válida.
6. **`EXPIRED`:** Transcurrió la ventana máxima de tiempo sin desarrollo del setup.
