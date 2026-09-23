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

Opera bajo la premisa estricta de **Copiloto ("Human-in-the-loop")**: detecta anomalías, aplica selección negativa rigurosa, califica el riesgo y despacha diagnósticos estructurados y artefactos visuales a los operadores (**Ger & Freya**), quienes retienen el 100% de la potestad en la toma de decisiones y ejecución de capital.

---

## 2. Mapa Estructurado de la Documentación

Toda la documentación técnica, de producto y de operaciones se encuentra organizada en secciones semánticas canónicas:

```text
docs/
├── README.md                                    # Índice general y guía de navegación (este archivo)
├── product/                                     # Definición de producto, requerimientos de negocio y estrategias
│   ├── vision-and-scope.md                     # Visión general, principios Human-in-the-Loop y catálogo de herramientas
│   └── trading-playbooks.md                    # Playbooks de trading cuantificados (Dip & Bounce ZEC/ALLO, Liquidity, Memes)
├── architecture/                                # Arquitectura técnica, diseño de sistemas y contratos
│   ├── system-architecture.md                  # Arquitectura de 5 capas, pipeline desacoplado y diagramas
│   ├── data-contracts.md                       # Modelos canónicos tipados (Pydantic Python y TypeScript)
│   ├── heatmap-engine.md                       # Motor de renderizado on-demand de mapas de calor y gráficos anotados
│   ├── tech-stack-and-layout.md                # Selección tecnológica, Hostinger VPS y estructura de directorios
│   └── adr/                                    # Architecture Decision Records (ADRs)
│       ├── README.md                           # Índice general de decisiones de arquitectura
│       ├── 0001-pipeline-architecture.md
│       ├── 0002-deterministic-engine-over-ml.md
│       ├── 0003-hostinger-docker-deployment.md
│       ├── 0004-human-in-the-loop-boundary.md
│       ├── 0005-web-client-spa-and-charts.md
│       ├── 0006-hybrid-multimodal-agent-mcp.md
│       └── 0007-hostinger-unified-nodejs-deployment.md
├── specs/                                       # Especificaciones técnicas funcionales por componente
│   ├── data-ingestion.md                       # Conector Binance REST (read-only), rate limiting y normalización
│   ├── spot-radar.md                           # Algoritmo de detección Spot Radar: RVOL, ATR y proyecciones
│   ├── risk-filter.md                          # Motor central de riesgo, filtros duros y matriz de scoring
│   ├── notification-dispatch.md                # Formato de alertas estructuradas, Telegram Bot y CLI/JSONL
│   ├── web-client.md                           # Especificación del cliente Web Cockpit SPA y streaming SSE
│   └── agent-mcp-sop.md                        # Protocolo de interacción para agentes autónomos vía FastMCP
├── deployment/                                  # Infraestructura, despliegue y automatización
│   ├── hostinger-nodejs-unified.md             # Despliegue monoproceso en único website Node.js en Hostinger
│   ├── hostinger-vps.md                        # Alternativa VPS: Docker Compose, Nginx Reverse Proxy y SSL
│   └── ci-cd-pipeline.md                       # Pipeline de integración continua y despliegue vía GitHub Actions
├── planning/                                    # Planificación temporal y hojas de ruta
│   └── roadmap.md                              # Roadmap consolidado: Sprint 3h MVP + Fases 2..N
└── draft/                                       # Borradores históricos y notas de ideación
    └── phase_01/
        ├── overview.md
        └── overview_draft.md
```

---

## 3. Matriz de Documentos y Enlaces Directos

| Sección | Documento | Resumen de Alcance |
| :--- | :--- | :--- |
| **Product** | [vision-and-scope.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/product/vision-and-scope.md) | Principios rectores, actores (Ger & Freya), filosofía de selección negativa y qué NO es el sistema. |
| **Product** | [trading-playbooks.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/product/trading-playbooks.md) | Playbook Spot Dip & Bounce (ZEC/ALLO), Memes temprano, barridas de liquidez y ciclo de vida formal. |
| **Architecture** | [system-architecture.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/system-architecture.md) | Diagrama de 5 capas: Ingesta $\rightarrow$ Motor Matemático $\rightarrow$ FastMCP $\rightarrow$ Despacho $\rightarrow$ Operadores. |
| **Architecture** | [data-contracts.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/data-contracts.md) | Modelos canónicos Pydantic (`Candle`, `MarketSnapshot`, `OpportunitySignal`) e interfaces TypeScript. |
| **Architecture** | [heatmap-engine.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/heatmap-engine.md) | Renderizado visual de mapas de calor de liquidez y gráficos de velas anotados (PNG). |
| **Architecture** | [tech-stack-and-layout.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/tech-stack-and-layout.md) | Definición formal del stack tecnológico, despliegue en Hostinger VPS (sin AWS) y estructura del repo. |
| **Architecture** | [adr/](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/adr/README.md) | Registro unificado de decisiones de arquitectura (ADR 0001 a 0006). |
| **Specs** | [data-ingestion.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/data-ingestion.md) | Conector Binance REST (read-only), pesos de rate limiting y selección del Top 50 pares en volumen. |
| **Specs** | [spot-radar.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/spot-radar.md) | Lógica matemática del Spot Radar: RVOL, ATR, contracción porcentual y rechazo de soporte. |
| **Specs** | [risk-filter.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/risk-filter.md) | Motor unificado de riesgo, filtros duros de descarte y matriz Oportunidad vs. Riesgo. |
| **Specs** | [notification-dispatch.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/notification-dispatch.md) | Formato de mensajes Telegram con imagen adjunta, consola CLI y archivo `logs/alerts.jsonl`. |
| **Specs** | [web-client.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/web-client.md) | Cockpit SPA en tiempo real con streaming Server-Sent Events (SSE) y gráficos ligeros. |
| **Specs** | [agent-mcp-sop.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/agent-mcp-sop.md) | Procedimiento Operativo Estándar del Agente en 5 pasos sistemáticos y tools FastMCP. |
| **Deployment** | [hostinger-vps.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/deployment/hostinger-vps.md) | Configuración de Docker Compose, Nginx Reverse Proxy y despliegue 24/7 en VPS Hostinger. |
| **Deployment** | [ci-cd-pipeline.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/deployment/ci-cd-pipeline.md) | Pipeline de integración continua y despliegue automatizado vía GitHub Actions (Lint, Test, SSH Deploy). |
| **Planning** | [roadmap.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/planning/roadmap.md) | Hoja de ruta integral: Sprint de 3 horas para MVP V1 y fases de expansión futuras. |
