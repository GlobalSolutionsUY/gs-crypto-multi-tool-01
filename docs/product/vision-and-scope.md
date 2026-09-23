# Visión del Producto y Alcance General: Crypto Multi-Tool (Radar & Copilot)

- **Organización:** [GlobalSolutionsUY](https://github.com/GlobalSolutionsUY)
- **Repositorio:** [gs-crypto-multi-tool-01](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)
- **Stakeholders / Operadores:** Ger & Freya
- **Estado:** Activo / Fase 1 (MVP)
- **Versión del Sistema:** 0.1.0-alpha
- **Última Actualización:** 2026-09-23

---

## 1. Resumen Ejecutivo y Misión Operativa

El **Crypto Multi-Tool (Radar & Copilot)** es una plataforma in-house modular y desacoplada de inteligencia de mercado y asistencia técnica para trading discrecional cuantitativo.

El sistema opera bajo la premisa estricta de **Copiloto ("Human-in-the-loop")**: detecta anomalías, aplica selección negativa rigurosa, califica el riesgo y despacha diagnósticos estructurados y artefactos visuales a los operadores (**Ger & Freya**), quienes retienen el 100% de la potestad en la toma de decisiones y asignación de capital.

### 1.1 La Asimetría de Atención en Trading
El mercado de criptoactivos opera 24/7 con más de 500 pares líquidos cotizando simultáneamente. La capacidad cognitiva humana solo permite vigilar con rigor técnico entre 3 y 5 activos a la vez. El propósito de este sistema es:
- **Automatizar el trabajo mecánico:** Escaneo exhaustivo, normalización, cálculo de métricas complejas (RVOL, ATR, distancias a soporte) y descarte masivo de ruido.
- **Potenciar la ventaja humana:** Reservar el análisis de contexto macro, el juicio discrecional y la gestión del riesgo para los operadores.

---

## 2. Principios Fundamentales del Sistema

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FILOSOFÍA OPERATIVA DEL SISTEMA                      │
│                                                                         │
│   1. Copiloto, NO Bot Autónomo     ──>  El humano retiene la ejecución   │
│   2. Selección Negativa Estricta   ──>  Saber decir "NO hay oportunidad"│
│   3. Desacoplamiento de Exchanges  ──>  El mercado manda, no Binance    │
│   4. Explicabilidad Causal         ──>  Cero cajas negras o ML opaco    │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Copiloto, no Ejecutor Autónomo:** El sistema detecta, filtra, califica y notifica. La toma de decisión operativa reside estrictamente en el usuario (operador humano). La ejecución automática de órdenes queda expresamente fuera del alcance de la Fase 1.
2. **Filosofía de Selección Negativa (Filtro Riguroso):** El agente no tiene como mandato forzar operaciones. Debe poseer la capacidad de reportar estados nulos cuando las condiciones de mercado no satisfagan los umbrales mínimos de oportunidad/riesgo.
3. **Desacoplamiento de Proveedores de Datos:** El subsistema de ingesta trata a los exchanges (Binance, Bitget, Bitunix) y fuentes externas (on-chain, liquidaciones) como conectores periféricos reemplazables, nunca como el núcleo del sistema.
4. **Determinismo y Explicabilidad Causal:** Toda señal debe responder a causas exactas, auditables y explicables sin depender de modelos de caja negra.

---

## 3. Catálogo de Módulos (Tools Suite)

La plataforma está concebida como una suite modular de herramientas independientes:

### Tool 1: Spot Opportunity Radar (Prioridad V1 — MVP)
- **Objetivo:** Caza de rebotes tácticos tempranos y recuperaciones de estructura (+3% a +10% en pocas velas/días) en pares líquidos Spot.
- **Insumos:** Series temporales OHLCV (1h y 4h), volumen relativo (RVOL), ATR y distancia porcentual a soportes clave.
- **Playbook:** Caída pronunciada con estructura mayor intacta $\rightarrow$ Agotamiento de ventas y absorción $\rightarrow$ Confirmación temprana de volumen $\rightarrow$ Detección antes de que el rebote consolide un +5%.

### Tool 2: Liquidity & Orderflow Radar (Fase 2)
- **Objetivo:** Detección de zonas densas de liquidez, mapas de liquidación y barridas de stops institucionales en contratos de futuros/perpetuos.
- **Insumos:** Mapas de liquidaciones (Trading Different / APIs externas), libro de órdenes L2/L3, Open Interest (OI), CVD (Cumulative Volume Delta) y Funding Rates.
- **Salida:** Clasificación de zonas de aproximación, barrida confirmada o rechazo (ej. `BTC - Liquidez en 78.2k - Barrida completada con absorción de delta`).

### Tool 3: Meme & High-Beta Radar (Fase 2)
- **Objetivo:** Detección temprana de activos de alta volatilidad aplicando filtros estrictos de supervivencia de capital.
- **Insumos:** Nuevos pares en DEX, aceleración de transacciones y llamadas a contratos inteligentes.
- **Filtros Mandatorios:** Verificación de contratos maliciosos (honeypot/rug indicators), concentración de wallets en top holders $< 25\%$, liquidez bloqueada o quemada.

### Tool 4: Listings & Catalyst Radar (Fase 3)
- **Objetivo:** Monitoreo y puntuación de eventos discretos que generan desequilibrios inmediatos de oferta/demanda.
- **Insumos:** Anuncios oficiales de CEX (Binance Announcements, Launchpools, Upbit listings), lanzamientos DEX y calendarios de desbloqueo de tokens (token unlocks).
- **Lógica:** Evaluación de tokenomics y volumen inicial para evitar comprar picos de euforia mecánicamente.

### Tool 5: On-Chain & Whale Telemetry Radar (Fase 3)
- **Objetivo:** Detección de flujos atípicos de capital inteligente (Smart Money).
- **Insumos:** Transferencias significativas de billeteras ballena, flujos netos hacia/desde exchanges (CEX Net Inflows/Outflows).
- **Rol:** Factor ponderado dentro de la matriz de riesgo y scoring, no disparador aislado de órdenes.

### Tool 6: Central Risk Filter (Transversal — V1 MVP)
- **Objetivo:** Validación estandarizada transversal para todos los módulos de radar antes de despachar cualquier alerta.
- **Matriz de Salida:** Oportunidad (`ALTA` / `MEDIA` / `BAJA`) vs. Riesgo (`ALTO` / `MEDIO` / `BAJO`).

---

## 4. Exclusiones Explícitas (Non-Goals para Fase 1)

1. **Sin ejecución automática de órdenes:** No se configuran claves privadas con permisos de trading ni se despachan órdenes de compra/venta a ninguna API de exchange.
2. **Sin modelos predictivos de Machine Learning Blackbox:** No se entrenan redes neuronales para adivinar precios futuros.
3. **Sin infraestructura de Ultra-Baja Latencia (HFT):** El radar opera en velas de 1h / 4h con revisiones por batch o polling continuo de 30 a 60 segundos. No compite en microsegundos.
4. **Sin construcción propia de mapas de calor de liquidaciones:** Para derivados complejos se priorizarán integraciones de APIs especializadas en fases posteriores.

---

## 5. Criterios de Éxito de Negocio

- **Tasa de filtrado efectiva:** El sistema debe ser capaz de analizar entre 30 y 50 pares Spot y filtrar con éxito $\ge 85\%$ del universo, reteniendo un número acotado de candidatos de alta calidad.
- **Anticipación táctica:** Detección de la anomalía en etapa de compresión/soporte, permitiendo una entrada en el rango del setup antes de la confirmación del impulso.
- **Claridad de comunicación:** Una alerta debe poder ser leída y comprendida por los operadores en menos de 5 segundos.
