# Registro de Decisiones de Arquitectura (ADRs)

Este directorio documenta formalmente las decisiones arquitectónicas clave adoptadas durante el diseño y construcción de `crypto-multi-tool`.

## Índice de Decisiones

| ADR | Título | Estado | Fecha | Contexto / Decisión Central |
| :--- | :--- | :--- | :--- | :--- |
| [0001](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/adr/0001-pipeline-architecture.md) | Arquitectura de Pipeline Unidireccional Desacoplada | Aceptado | 2026-09-23 | Tratar a los exchanges como conectores periféricos reemplazables, aislando el motor analítico de APIs propietarias. |
| [0002](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/adr/0002-deterministic-engine-over-ml.md) | Motor Matemático Determinístico vs Modelos Opacos | Aceptado | 2026-09-23 | Usar cálculo de series temporales exacto y explicable para métricas duras, reservando LLMs solo para síntesis y auditoría. |
| [0003](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/adr/0003-hostinger-docker-deployment.md) | Despliegue en Hostinger VPS con Docker y GitHub Actions | Aceptado | 2026-09-23 | Operación 24/7 en servidor Linux dedicado, con integración y entrega continua sin downtime. |
| [0004](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/adr/0004-human-in-the-loop-boundary.md) | Frontera Estricta Human-in-the-Loop sin Auto-Ejecución | Aceptado | 2026-09-23 | Separación total del análisis de la ejecución de capital; la decisión final recae siempre en Germán y Andrés. |
| [0005](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/adr/0005-web-client-spa-and-charts.md) | Web Cockpit en Tiempo Real y Gráficos Livianos | Aceptado | 2026-09-23 | Construcción de una SPA en tiempo real con WebSocket/SSE y gráficos financieros para inspección de setups. |
| [0006](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/adr/0006-hybrid-multimodal-agent-mcp.md) | Protocolo MCP y Auditoría Multimodal Agéntica | Aceptado | 2026-09-23 | Interfaz MCP en 5 pasos donde el agente audita conjuntamente números calculados e imágenes renderizadas de calor. |
| [0007](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/adr/0007-hostinger-unified-nodejs-deployment.md) | Despliegue Unificado Frontend + Backend en Único Website Node.js en Hostinger | Aceptado | 2026-09-23 | Despliegue monoproceso en Hostinger: el backend Node.js sirve la API y los estáticos compilados de la SPA bajo un único comando `npm start`. |
