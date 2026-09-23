# Protocolo y Procedimiento Operativo Estándar: Agent MCP SOP

- **Componente:** Agent Reasoning Layer (MCP Server & Agent Protocol)
- **Rol:** Analista Cuantitativo y Auditor Multimodal de Oportunidades
- **Naturaleza:** Interacción determinística y sistemática entre el Agente LLM y el Backend

---

## 1. El Rol del Agente en crypto-multi-tool

El Agente no es un bot probabilístico que adivina precios. Su rol es actuar como un **auditor de control de calidad**:
- El backend matemático calcula números, filtros y renderiza imágenes.
- El agente es invocado cuando un activo supera el filtro preliminar y entra en `WATCH`.
- El agente sigue estrictamente un **Procedimiento Operativo Estándar (SOP)** en 5 pasos predecibles, utilizando las herramientas provistas por el **MCP Server**.

---

## 2. Las Herramientas del Servidor MCP (`crypto-multi-tool-mcp`)

El backend de la aplicación expone las siguientes herramientas estandarizadas:

| Herramienta MCP | Parámetros de Entrada | Salida / Retorno |
| :--- | :--- | :--- |
| `get_spot_radar_candidates` | `status: "WATCH" \| "READY"`, `min_score: int` | Lista de activos candidatos con métricas numéricas esenciales. |
| `get_asset_context` | `ticker: str`, `timeframe: str` | Datos completos de velas recientes, RVOL, ATR, soportes y URL del gráfico anotado. |
| `get_liquidity_heatmap` | `ticker: str`, `depth_levels: int` | URL/Base64 de la imagen del mapa de calor de liquidez y resumen JSON de clusters densos. |
| `get_market_regime` | ninguno | Estado y tendencia de Bitcoin, volatilidad global del mercado y régimen de correlación. |
| `publish_trading_alert` | `signal_payload: JSON` | Promueve el estado a `READY`, notifica al Web Cockpit y envía la alerta a Telegram. |
| `reject_opportunity` | `ticker: str`, `rejection_reason: str` | Registra el motivo del descarte en el log auditable de selección negativa. |

---

## 3. Procedimiento Operativo Estándar (SOP) en 5 Pasos

Todo agente que evalúe candidatos en el sistema debe ejecutar de forma rigurosa la siguiente secuencia:

```text
PASO 1: LEER CANDIDATOS FILTRADOS
   tool: get_spot_radar_candidates(status="WATCH")
   -> Si no hay candidatos, responder: "Sin anomalias calificadas. Mercado filtrado."
   -> Si hay candidatos, seleccionar el primero para inspeccion individual.

PASO 2: RECUPERAR CONTEXTO Y ARTEFACTOS VISUALES
   tool: get_asset_context(ticker=T)
   tool: get_liquidity_heatmap(ticker=T)
   -> Recibe JSON con metricas numericas + URLs de imagen del grafico y mapa de calor.

PASO 3: AUDITORÍA MULTIMODAL (IMAGEN + DATOS)
   El agente examina conjuntamente:
   a) Datos numericos:
      - ¿RVOL >= 1.4x en 1h?
      - ¿Ratio R/R hasta TP1 >= 1:2.0?
      - ¿Distancia porcentual al stop loss <= 3.5%?
   b) Artefactos visuales:
      - ¿El grafico muestra mecha de rechazo limpia en soporte o fue perforado?
      - ¿El mapa de calor muestra barrida de liquidez o hay una pared de venta justo arriba?

PASO 4: AUDITORÍA DE CONTEXTO MACRO (RISK FILTER)
   tool: get_market_regime()
   -> ¿BTC esta en dumping violento? Si BTC capitula, el riesgo se eleva y el setup se descarta.
   -> ¿El spread del activo es < 0.15% y el volumen diario > $15M?

PASO 5: EMISIÓN O DESCARTE FORMAL
   - Si aprueba todos los criterios:
     tool: publish_trading_alert(payload)
     -> Genera el diagnostico causal en 3 lineas y confirma promocion a READY.
   - Si no cumple algun criterio:
     tool: reject_opportunity(ticker=T, rejection_reason="...")
     -> Anota exactamente la causa del rechazo para revision de German y Andres.
```

---

## 4. Garantías de Predictibilidad y Cero Alucinación

1. **Sin invención de números:** El agente tiene prohibido inventar o recalcular precios de entrada, soporte o porcentajes de TP/SL; utiliza exactamente los niveles derivados del modelo de datos entregado por la aplicación.
2. **Causalidad explícita:** Toda alerta aprobada debe listar 3 hechos observables que la sustenten (uno de precio/estructura, uno de volumen y uno de ratio riesgo/beneficio).
3. **Auditabilidad:** La base de datos guarda el log completo de la conversación MCP que generó la alerta para su posterior análisis forense por parte de los operadores.
