# Especificación Técnica: Motor Spot Opportunity Radar (V1 Core)

- **Módulo:** Tool 1 - Spot Opportunity Radar
- **Fase:** V1 (MVP en producción)
- **Playbook Referencia:** Reversión Temprana / Rebote Táctico (Setup ZEC/ALLO)
- **Target Operativo:** Movimientos de +3% a +10% en pocas velas / días
- **Estado:** Especificado y Aprobado
- **Última Actualización:** 2026-09-23

---

## 1. Alcance y Universo de Activos

El módulo procesa de forma continua los activos más líquidos del mercado Spot:
- **Universo de Escaneo:** Top 30 a 50 pares en Binance Spot contra USDT ordenados por volumen efectivo diario (> $10M USD 24h).
- **Timeframes Primarios:**
  - **Macro / Contexto:** 4h y 1d (para validar que la estructura mayor no esté en caída libre catastrófica).
  - **Táctico / Ejecución:** 1h y 15m (para detectar la absorción, velas de rechazo y aumento de RVOL).

---

## 2. Definición Matemática de Indicadores

### 2.1 Volumen Relativo (RVOL)
Mide la aceleración del volumen actual comparado con el promedio móvil de los periodos recientes:

$$\text{SMA\_Vol}_{k} = \frac{1}{K} \sum_{i=1}^{K} \text{Volumen}_{t-i} \quad (K = 20)$$

$$\text{RVOL}_{t} = \frac{\text{Volumen}_{t}}{\text{SMA\_Vol}_{k}}$$

- **Condición de Alerta:** $\text{RVOL} \ge 1.25$ (óptimo $\ge 1.4$). Indica absorción y presencia de participantes reales en el rebote.

---

### 2.2 Volatilidad Media (Average True Range - ATR)
Calcula el rango de movimiento real esperado para fijar márgenes de invalidación y targets acordes a la volatilidad del par:

$$\text{TR}_{t} = \max \Big( (\text{High}_{t} - \text{Low}_{t}), \, |\text{High}_{t} - \text{Close}_{t-1}|, \, |\text{Low}_{t} - \text{Close}_{t-1}| \Big)$$

$$\text{ATR}_{14} = \text{EMA}_{14}(\text{TR})$$

---

### 2.3 Medición de Contracción Porcentual ($\Delta P_{\text{drop}}$)
Se analiza la caída desde el precio máximo local dentro de una ventana de retroceso ($W = 36$ velas de 1h):

$$P_{\max} = \max_{i=0 \dots W} (\text{High}_{t-i})$$

$$\Delta P_{\text{drop}} = \frac{P_{t} - P_{\max}}{P_{\max}} \times 100$$

- **Criterio de Inclusión:** $-15.0\% \le \Delta P_{\text{drop}} \le -3.5\%$  
*(Caídas menores al $-3.5\%$ carecen de descuento táctico suficiente; caídas superiores al $-20\%$ en pocas horas suelen indicar eventos de liquidación desordenada o colapso fundamental).*

---

### 2.4 Detección Heurística de Absorción / Rechazo de Mínimos
Para verificar que el soporte está siendo defendido por compradores institucionales:

1. **Ratio de Mecha Inferior (Absorption Wick Ratio):**
   $$\text{Wick}_{\text{lower}} = \min(\text{Open}_{t}, \text{Close}_{t}) - \text{Low}_{t}$$
   $$\text{Range}_{\text{candle}} = \text{High}_{t} - \text{Low}_{t}$$
   $$\text{Ratio}_{\text{wick}} = \frac{\text{Wick}_{\text{lower}}}{\text{Range}_{\text{candle}}}$$
   - **Condición:** $\text{Ratio}_{\text{wick}} \ge 0.35$ en al menos una de las últimas 3 velas de 1h que tocaron el soporte.
2. **Desaceleración de la fuerza bajista:** El rango de las velas bajistas disminuye progresivamente en las últimas 3 velas previas al giro.
3. **Cierre de vela:** El cierre debe situarse en la mitad superior de su rango total.

---

### 2.5 Proyección Dinámica de Niveles (Entrada, Stop y Targets)

Cuando se cumplen las condiciones del setup, el motor calcula automáticamente los niveles operativos:

1. **Rango de Entrada Sugerido ($P_{\text{entry}}$):**
   $$\text{Entry}_{\min} = P_{\text{close}} - 0.25 \times \text{ATR}_{14}$$
   $$\text{Entry}_{\max} = P_{\text{close}} + 0.10 \times \text{ATR}_{14}$$

2. **Nivel de Invalidación / Stop Técnico ($P_{\text{inval}}$):**
   $$P_{\text{inval}} = \min_{i=0 \dots 3}(\text{Low}_{t-i}) - (0.3\% \times P_{\text{close}})$$

3. **Objetivo Técnico 1 ($TP_1$):**
   $$TP_1 = P_{\text{close}} + \max(1.5 \times \text{ATR}_{14}, \, 0.04 \times P_{\text{close}})$$

4. **Objetivo Técnico 2 ($TP_2$):**
   $$TP_2 = P_{\text{close}} + \max(3.0 \times \text{ATR}_{14}, \, 0.08 \times P_{\text{close}})$$

5. **Ratio Beneficio / Riesgo ($R:R$):**
   $$R:R = \frac{TP_1 - \text{Entry}_{\max}}{\text{Entry}_{\max} - P_{\text{inval}}}$$
   - **Regla de Rechazo:** Si $R:R < 1.8$, la oportunidad es descartada de forma automática por el [Risk Filter](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/risk-filter.md).

---

## 3. Desacoplamiento de Responsabilidades: App vs. Agente

### Capa de la Aplicación (Spot Math Engine)
1. Ingesta las velas mediante el [Data Ingestion Layer](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/data-ingestion.md).
2. Calcula de forma vectorial (NumPy / Polars) RVOL, ATR y niveles de soporte/resistencia.
3. Aplica el **Filtro Negativo**: descarta automáticamente el 85-90% de pares que no cumplen los umbrales mínimos.
4. Si un par supera el filtro inicial, lo sitúa en estado `WATCH`.
5. Solicita al [Visual Rendering Engine](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/heatmap-engine.md) la generación del gráfico anotado y el mapa de calor de liquidez.

### Capa del Agente (Agent Reasoning via FastMCP)
1. El agente recibe la notificación de candidatos en `WATCH` mediante la tool MCP `get_spot_radar_candidates()`.
2. Ejecuta el [Agent MCP SOP](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/specs/agent-mcp-sop.md) en 5 pasos sistemáticos.
3. Audita visualmente la imagen del gráfico y la matriz de liquidez.
4. Redacta el diagnóstico causal y promueve la oportunidad a `READY` para su despacho inmediato.
