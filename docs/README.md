# Crypto Multi-Tool (Radar & Copilot) — Índice de Documentación

**Proyecto:** Crypto Multi-Tool (Radar & Copilot)  
**Organización:** [GlobalSolutionsUY](https://github.com/GlobalSolutionsUY)  
**Repositorio:** [gs-crypto-multi-tool-01](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)  
**GitHub Project Board:** [Board #1](https://github.com/orgs/GlobalSolutionsUY/projects/1)  
**Estado:** Activo / Fase 1 (MVP)  
**Versión del Sistema:** 0.1.0-alpha  

---

## 1. Visión y Propósito

El sistema **Crypto Multi-Tool (Radar & Copilot)** es una plataforma modular y desacoplada de inteligencia de mercado y asistencia técnica para trading cuantitativo/discrecional. 

Opera bajo la premisa estricta de **Copiloto ("Human-in-the-loop")**: detecta anomalías, aplica selección negativa, califica el riesgo y despacha alertas estructuradas a los operadores (**Ger & Freya**), quienes retienen el 100% de la potestad en la toma de decisiones y ejecución de capital.

---

## 2. Mapa Estructurado de la Documentación

Toda la documentación técnica y de producto sigue una nomenclatura estandarizada:

```text
docs/
├── README.md                                    # Índice general y guía de navegación (este archivo)
├── 01_product/                                  # Definición de producto y requerimientos de negocio
│   ├── PRD-001_vision_and_scope.md             # Visión, principios de diseño, stakeholders y límites
│   └── PRD-002_trading_playbooks.md            # Estrategias y patrones operativos cuantificados
├── 02_architecture/                             # Arquitectura técnica y diseño de sistemas
│   ├── SAD-001_system_architecture.md          # Arquitectura de pipeline, capas desacopladas y diagramas
│   ├── SAD-002_data_contracts_and_schemas.md   # Modelos de datos estandarizados (OHLCV, Signal, Alert)
│   └── adr/                                     # Architecture Decision Records
│       ├── ADR-0001_modular_pipeline_vs_monolith.md
│       ├── ADR-0002_deterministic_rules_vs_ml_blackbox.md
│       └── ADR-0003_human_in_the_loop_isolation.md
├── 03_technical_specs/                          # Especificaciones funcionales y técnicas por módulo
│   ├── SPEC-001_data_ingestion_layer.md        # Conector Binance REST, rate limiting y normalización
│   ├── SPEC-002_spot_radar_engine.md           # Algoritmo de detección, fórmulas y umbrales técnicos
│   ├── SPEC-003_risk_filter_and_scoring.md     # Motor unificado de riesgo y matriz Oportunidad/Riesgo
│   └── SPEC-004_notification_and_dispatch.md   # Formato de alertas, Telegram Bot y CLI Output
├── 04_roadmap/                                  # Planificación y despliegue temporal
│   ├── ROADMAP-001_mvp_implementation.md       # Alcance de Fase 1 (PoC de 3 horas / Spot Radar)
│   └── ROADMAP-002_future_expansions.md        # Fases 2..N (Futures, Memes, On-chain, Execution Engine)
└── draft/                                       # Borradores históricos y notas de ideación
    └── phase_01/
        ├── overview.md
        └── overview_draft.md
```

---

## 3. Matriz de Documentos y Roles

| Documento | Identificador | Público Objetivo | Resumen de Alcance |
| :--- | :--- | :--- | :--- |
| [PRD-001](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/01_product/PRD-001_vision_and_scope.md) | Producto / Negocio | Operadores, PM, Devs | Principios, actores (Ger & Freya), filosofía de selección negativa y qué NO es el sistema. |
| [PRD-002](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/01_product/PRD-002_trading_playbooks.md) | Estrategia de Trading | Operadores, Quants | Playbook Dip & Bounce (ZEC/ALLO), Memes temprano, barridas de liquidez. |
| [SAD-001](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/02_architecture/SAD-001_system_architecture.md) | Arquitectura | Arquitectos, Devs | Tubería desacoplada: Ingesta $\rightarrow$ Normalizador $\rightarrow$ Radars $\rightarrow$ Risk $\rightarrow$ Dispatch. |
| [SAD-002](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/02_architecture/SAD-002_data_contracts_and_schemas.md) | Contratos | Devs | Schemas de validación (OHLCV, MarketCandle, SignalCandidate, AlertPayload). |
| [ADRs](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/02_architecture/adr/) | Decisiones Técnicas | Devs, Leads | Justificación formal de pipeline modular, reglas deterministas y aislamiento del Execution Engine. |
| [SPEC-001](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/03_technical_specs/SPEC-001_data_ingestion_layer.md) | Especificación Técnica | Devs Backend | Ingesta Binance REST (read-only), ponderación de volumen y control de peso de peticiones. |
| [SPEC-002](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/03_technical_specs/SPEC-002_spot_radar_engine.md) | Especificación Técnica | Devs Algorítmicos | Lógica matemática del Spot Radar: RVOL, ATR, contracción porcentual y rechazo de soporte. |
| [SPEC-003](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/03_technical_specs/SPEC-003_risk_filter_and_scoring.md) | Especificación Técnica | Devs Backend / Quants | Matriz de Oportunidad vs Exposición al Riesgo y explicabilidad obligatoria. |
| [SPEC-004](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/03_technical_specs/SPEC-004_notification_and_dispatch.md) | Especificación Técnica | Devs Integraciones | Formato de mensajes Telegram, CLI y webhook estructurado con estados (`WATCH`, `READY`, `INVALIDATED`). |
| [ROADMAP-001](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/04_roadmap/ROADMAP-001_mvp_implementation.md) | Planificación | Todo el equipo | Plan de construcción vertical de 3 horas para la primera versión funcional. |
| [ROADMAP-002](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/04_roadmap/ROADMAP-002_future_expansions.md) | Planificación | Todo el equipo | Roadmap posterior: Liquidity Radar, Meme Radar, On-Chain y Execution Engine opt-in. |

---

## 4. Anexos y Especificaciones de Infraestructura

Adicionalmente, se mantienen disponibles las especificaciones de despliegue y herramientas complementarias:
- **Despliegue e Infraestructura:**
  - [hostinger-vps.md](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/deployment/hostinger-vps.md): Configuración de Docker, Nginx Reverse Proxy y despliegue en VPS Hostinger.
  - [ci-cd-pipeline.md](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/deployment/ci-cd-pipeline.md): Pipeline de integración continua y despliegue automatizado vía GitHub Actions.
- **Interfaces y Extensiones:**
  - [web-client-spec.md](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/web-client-spec.md): Especificación del cliente web SPA y gráficos ligeros.
  - [agent-mcp-sop.md](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/agent-mcp-sop.md): Protocolo de interacción para agentes autónomos vía MCP.
  - [heatmap-engine.md](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/heatmap-engine.md): Especificación del motor de mapas de calor para liquidaciones.
