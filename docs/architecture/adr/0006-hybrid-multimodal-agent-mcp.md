# ADR 0006: Protocolo MCP y Auditoría Multimodal Agéntica

- **Estado:** Aceptado
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

Integrar agentes de inteligencia artificial (LLMs) directamente en sistemas cuantitativos a menudo produce comportamientos impredecibles, altos costos en tokens y alucinaciones en cálculos numéricos. Por otro lado, no utilizar la capacidad de visión y razonamiento del agente desaprovecha su habilidad para correlacionar noticias, detectar estructuras visuales complejas y sintetizar explicaciones tácticas claras para los operadores humanos.

---

## 2. Decisión

Se adopta una **Arquitectura Agéntica Basada en el Model Context Protocol (MCP)** con auditoría multimodal híbrida:
1. **Separación Estricta:** El backend matemático hace el trabajo pesado continuo (cálculos, filtros y renderizado visual) a costo cero de LLM.
2. **FastMCP Server:** El backend expone un servidor MCP estandarizado (`crypto-multi-tool-mcp`) con herramientas tipadas para que el agente consulte únicamente los pares precalificados en estado `WATCH`.
3. **Auditoría Dual (Datos + Imagen):** El agente recibe simultáneamente las métricas exactas (JSON) y las imágenes pre-cocinadas (gráfico anotado y mapa de calor de liquidez generado por el `HeatmapEngine`).
4. **Procedimiento Operativo Estandarizado (SOP):** El agente está obligado a seguir un flujo en 5 pasos determinísticos para aprobar (`READY`) o descartar una oportunidad.

---

## 3. Consecuencias

### Positivas
- Predictibilidad total y eliminación de alucinaciones sobre números o precios de entrada/SL.
- Ahorro masivo de costos: el agente solo se despierta e invoca cuando un activo califica preliminarmente.
- Interoperabilidad agnóstica: el sistema puede trabajar de forma transparente con Gemini, Claude o agentes locales compatibles con MCP.

### Negativas
- Dependencia de la latencia del proveedor de LLM para la transición de un par de `WATCH` a `READY` (típicamente entre 1 y 3 segundos por análisis).
