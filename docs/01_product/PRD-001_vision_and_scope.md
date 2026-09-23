# PRD-001: Visión del Producto y Alcance General

**Documento:** Product Requirements Document (PRD)  
**Código:** PRD-001  
**Versión:** 1.0.0  
**Estado:** Aprobado para Fase 1 (MVP)  
**Stakeholders / Operadores:** Ger & Freya  
**Equipo de Desarrollo:** Global Solutions UY  
**Última Actualización:** 2026-09-23  

---

## 1. Resumen Ejecutivo

El **Crypto Multi-Tool (Radar & Copilot)** es una plataforma de software diseñada para asistir a operadores discrecionales cuantitativos en la detección temprana, calificación algorítmica y filtrado de riesgo de oportunidades en el mercado cripto.

El sistema no opera fondos de manera automática. Su valor reside en **comprimir drásticamente el tiempo de análisis de mercado**: monitorea cientos de pares, descarta la masa de activos sin confluencia estadística, y destaca únicamente anomalías relevantes acompañadas de un diagnóstico causal claro y conciso.

---

## 2. Principios Fundamentales del Sistema

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FILOSOFÍA OPERATIVA DEL SISTEMA                      │
│                                                                         │
│   1. Copiloto, NO Bot Autónomo     ──>  El humano retiene la ejecución   │
│   2. Selección Negativa Estricta   ──>  Saber decir "NO hay oportunidad"│
│   3. Desacoplamiento de Exchanges  ──>  El mercado manda, no Binance    │
│   4. Explicabilidad Causal         ──>  Cero cajas negras               │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Copiloto, no Ejecutor Autónomo (Human-in-the-Loop)
El sistema opera exclusivamente en los niveles de **radar, filtro, calificación y alerta**. La decisión de posicionamiento de capital, tamaño de orden y ejecución física queda bajo control del operador humano.

### 2.2 Filosofía de Selección Negativa
Un error común en bots de trading es forzar operaciones en regímenes de mercado laterales o desfavorables. Este sistema tiene como mandato primordial **descartar**:
> *"El agente no tiene que encontrar una operación porque sí. Debe ser capaz de reportar con total naturalidad: 'en este momento no hay oportunidades que cumplan el estándar de riesgo/beneficio'."*

### 2.3 Desacoplamiento de Fuentes de Mercado
Binance se utiliza como el primer adaptador de datos por su liquidez y disponibilidad de API pública, pero la arquitectura del núcleo es **100% agnóstica de exchange**. En etapas posteriores se integrarán Bitunix, Bitget, Trading Different, y proveedores on-chain sin alterar el motor de análisis.

### 2.4 Explicabilidad Determinista vs. Cajas Negras
Cada señal emitida debe contener los motivos cuantitativos exactos de su calificación (ej. variación porcentual, ratio de volumen relativo, nivel de soporte testeado, ATR). No se aceptan puntuaciones opacas o modelos de machine learning no interpretables.

---

## 3. Personas y Actores Clave

### Operadores Principales: Ger & Freya
- **Perfil:** Operadores de criptomonedas discrecionales y tácticos con sólida lectura de estructura de mercado, zonas de liquidez y volumen.
- **Dolor actual:** La dispersión del mercado. Monitorear manualmente docenas de gráficos consume horas de pantalla y provoca fatiga visual o entradas tardías (perseguir movimientos de +5% o +10% ya iniciados).
- **Necesidad:** Un "radar de alerta temprana" que les avise: *"Mirá este activo ahora: tuvo una contracción fuerte, agotamiento de ventas, testeo de soporte y el volumen se está reactivando antes del quiebre."*
- **Criterio:** *"El agente encuentra la aguja en el pajar. Nosotros decidimos si vale la pena pincharse con ella."*

---

## 4. Módulos del Ecosistema (Visión Integral)

| Módulo | Tipo de Radar | Horizonte Temporal | Prioridad de Roadmap |
| :--- | :--- | :--- | :--- |
| **RF-01: Spot Opportunity Radar** | Táctico / Dip & Bounce | Horas a Días (+3% a +10%) | **Fase 1 (MVP Inmediato)** |
| **RF-02: Liquidity & Futures Radar** | Derivados / Orderflow | Minutos a Horas (Barridas) | Fase 2 |
| **RF-03: Meme Radar (Early Mover)** | Microcaps / On-Chain DEX | Horas (Volatilidad explosiva) | Fase 2 |
| **RF-04: New Listings & Catalysts** | Event-driven / Tokenomics | Días a Semanas | Fase 3 |
| **RF-05: On-Chain & Whale Telemetry** | Macro / Flujos CEX | Días a Semanas | Fase 3 |
| **RF-06: Central Risk Filter** | Transversal | Evaluación continua | **Fase 1 (MVP Inmediato)** |

---

## 5. Exclusiones Explícitas (Non-Goals para Fase 1)

1. **Sin ejecución automática de órdenes:** No se configuran claves privadas con permisos de trading ni se despachan órdenes de compra/venta a ninguna API de exchange.
2. **Sin modelos predictivos de Machine Learning Blackbox:** No se entrenan redes neuronales para adivinar precios futuros.
3. **Sin infraestructura de Ultra-Baja Latencia (HFT):** El radar opera en velas de 1h / 4h con revisiones por batch o polling continuo de 30 a 60 segundos. No compite en milisegundos.
4. **Sin construcción propia de mapas de calor de liquidaciones:** Para derivados complejos se priorizarán integraciones de APIs especializadas en fases posteriores.

---

## 6. Criterios de Éxito de Negocio

- **Tasa de filtrado efectiva:** El sistema debe ser capaz de analizar entre 30 y 50 pares Spot y filtrar con éxito $\ge 85\%$ del universo, reteniendo un número acotado de candidatos de alta calidad.
- **Anticipación táctica:** Detección de la anomalía en etapa de compresión/soporte, permitiendo una entrada en el rango del setup antes de la confirmación del impulso.
- **Claridad de comunicación:** Una alerta debe poder ser leída y comprendida por los operadores en menos de 5 segundos.
