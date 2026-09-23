# Arquitectura Integral del Sistema: crypto-multi-tool

- **Documento:** Arquitectura y Diseño de Sistemas
- **Organización:** gsolut
- **Entorno Productivo:** Hostinger VPS (Ubuntu Linux, Docker Compose)
- **CI/CD:** GitHub Actions

---

## 1. Diagrama de Capas y Flujo de Datos

El sistema implementa una arquitectura desacoplada orientada a tuberías de procesamiento unidireccionales (Pipeline Architecture):

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   CAPA 1: INGESTIÓN Y NORMALIZACIÓN                    │
│                                                                        │
│   ┌──────────────────┐    ┌──────────────────┐    ┌────────────────┐   │
│   │ Binance Adapter  │    │ Bitget / Bitunix*│    │ Liquidity Feed │   │
│   │ (Spot REST / WS) │    │   (Fase 2)       │    │  (Orderbook)   │   │
│   └────────┬─────────┘    └────────┬─────────┘    └────────┬───────┘   │
│            ▼                       ▼                       ▼           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 Data Normalization Bus                         │   │
│   │       (Modelos Canónicos: Asset, Candle, MarketSnapshot)       │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CAPA 2: MOTOR MATEMÁTICO DETERMINÍSTICO              │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ In-Memory Market Store (Series Temporales Recientes OHLCV)     │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Spot Opportunity Math Engine                                   │   │
│   │ - Cálculo de RVOL, ATR, Pivotes de Soporte y Caídas Previas    │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Negative Filter (Descarte masivo de activos sin asimetría)     │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    ▼ Si cumple condiciones preliminares│
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Visual Rendering Engine & Heatmap Service (On-Demand)          │   │
│   │ -> Genera Gráfico Anotado (PNG) y Mapa de Calor de Liquidez    │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CAPA 3: INTERFAZ AGÉNTICA (MCP SERVER)               │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ FastMCP Server (crypto-multi-tool-mcp)                         │   │
│   │ Expone herramientas estandarizadas de datos y visualización    │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Agent Reasoning Core (SOP en 5 pasos - Inspección Multimodal)   │   │
│   │ Audita números + imagen del gráfico + mapa de calor            │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CAPA 4: GESTIÓN DE OPORTUNIDADES Y DESPACHO          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Opportunity State Manager (Máquina de Estados: WATCH -> READY) │   │
│   └───────────────┬────────────────────────────────┬───────────────┘   │
│                   │                                │                   │
│                   ▼                                ▼                   │
│   ┌───────────────────────────────┐  ┌─────────────────────────────┐   │
│   │ Realtime SSE / WebSocket Bus  │  │ Telegram Dispatcher         │   │
│   │ (Actualización instantánea)   │  │ (Alerta Push + Imagen al    │   │
│   │                               │  │  móvil de Germán y Andrés)  │   │
│   └───────────────┬───────────────┘  └─────────────┬───────────────┘   │
└───────────────────┼────────────────────────────────┼───────────────────┘
                    ▼                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CAPA 5: INTERFACES DE DECISIÓN HUMANA                │
│                                                                        │
│   ┌───────────────────────────────┐  ┌─────────────────────────────┐   │
│   │ Web Cockpit (Vite SPA)        │  │ Canal Telegram Privado      │   │
│   │ (Tabla en vivo, heatmaps,     │  │ (Notificaciones tácticas    │   │
│   │  inspección profunda)         │  │  y acciones rápidas)        │   │
│   └───────────────┬───────────────┘  └─────────────┬───────────────┘   │
│                   │                                │                   │
│                   └────────────────┬───────────────┘                   │
│                                    ▼                                   │
│                        GERMÁN & ANDRÉS (gsolut)                        │
│               Evaluación de Contexto y Decisión de Capital             │
└────────────────────────────────────────────────────────────────────────┘

(*) Módulos planificados para fases posteriores.
```

---

## 2. Subsistemas y Responsabilidades Técnicas

### 2.1 Capa de Ingestión y Normalización
- **Aislamiento:** El código analítico jamás interactúa directamente con los endpoints específicos o formatos propietarios de Binance.
- **Normalización:** Transforma la carga útil de la API en modelos canónicos universales fuertemente tipados ([data-contracts.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/data-contracts.md)).

### 2.2 Motor de Cálculo Determinístico
- **Eficiencia:** Implementado en Python utilizando NumPy y Polars para el cálculo de series temporales vectorizadas en milisegundos.
- **Filtrado Negativo:** Diseñado con compuertas de rechazo temprano. Si un activo no tiene volumen relativo suficiente ($RVOL < 1.4x$) o la distancia al soporte supera el umbral, se descarta inmediatamente antes de gastar recursos de renderizado o llamadas a LLM.

### 2.3 Capa Agéntica (MCP Server)
- **FastMCP Protocol:** Servidor que implementa el estándar Model Context Protocol de Anthropic/Open Source, permitiendo que cualquier agente LLM (Claude, Gemini, Antigravity) actúe como copiloto sin requerir código a medida en el agente.
- **Separación de Tareas:** El motor matemático calcula los números; el agente audita la imagen, valida la confluencia de contexto macro y redacta el diagnóstico explicativo.

### 2.4 Despacho y Consumo
- **Entrega Dual:**
  - **Canal Web:** Stream continuo vía Server-Sent Events (SSE) hacia la SPA en el navegador.
  - **Canal Móvil:** Bot asíncrono en Telegram que despacha mensajes con formato rico y la imagen pre-cocinada adjunta tan pronto un activo entra en estado `READY`.
