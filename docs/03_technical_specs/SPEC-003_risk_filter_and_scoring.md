# SPEC-003: Motor Centralizado de Riesgo y Scoring (Risk Filter)

**Documento:** Especificación Técnica del Filtro de Riesgo  
**Código:** SPEC-003  
**Versión:** 1.0.0  
**Módulo:** Risk & Scoring Engine  
**Estado:** Especificado  
**Última Actualización:** 2026-09-23  

---

## 1. Misión del Módulo

El **Risk Filter** actúa como la aduana central del sistema. Su misión es materializar la **filosofía de selección negativa**: no importa cuán atractivo parezca un patrón técnico en un radar individual, si no satisface los criterios de liquidez, solidez estructural y relación riesgo/beneficio, es **descartado de inmediato**.

---

## 2. Filtros Duros de Descarte (Hard Rejections)

Un candidato es eliminado automáticamente antes de calcular su score si viola cualquiera de las siguientes restricciones:

| Condición de Descarte | Umbral | Justificación Operativa |
| :--- | :--- | :--- |
| **Volumen 24h insuficiente** | $< \$10,000,000$ USDT | Alto riesgo de slippage e iliquidez al entrar o salir. |
| **Ratio R:R deficiente** | $\text{R:R} < 1.8$ | La recompensa proyectada no compensa la distancia al stop. |
| **Invalidación excesivamente lejana** | Distancia a stop $> 8.0\%$ | Exposición desmedida en operaciones tácticas de spot. |
| **Lagunas de datos (Candle gaps)** | Ausencia de velas $> 2$ periodos | Falla en proveedor de datos o suspensión transitoria del par. |
| **Spread estimado bid/ask** | $> 0.20\%$ | Pérdida de fricción excesiva para objetivos de $+3\%$ a $+5\%$. |

---

## 3. Matriz de Evaluación: Oportunidad vs. Exposición al Riesgo

Las señales que superan los filtros duros son clasificadas en una matriz bidimensional:

```text
                  MATRIZ DE CALIFICACIÓN DE SEÑALES
      ▲
      │  [MEDIA OPORTUNIDAD /   │  [ALTA OPORTUNIDAD /
ALTA  │   ALTO RIESGO]          │   BAJO O RIESGO MEDIO]
      │   (Candidato cauteloso) │   ⭐ (PRIORIDAD OPERADOR)
──────┼─────────────────────────┼─────────────────────────
      │  [BAJA OPORTUNIDAD /    │  [MEDIA OPORTUNIDAD /
BAJA  │   ALTO RIESGO]          │   BAJO RIESGO]
      │   ❌ (DESCARTE)          │   (Setup conservador)
      └─────────────────────────┴─────────────────────────►
        RIESGO ALTO               RIESGO BAJO
```

### 3.1 Criterios de Clasificación de Oportunidad

Calculado mediante una puntuación normalizada de 0 a 100:

$$\text{Score} = (0.25 \times S_{\text{RVOL}}) + (0.25 \times S_{\text{Wick}}) + (0.25 \times S_{\text{RR}}) + (0.25 \times S_{\text{4h\_Trend}})$$

- **`ALTA` ($\text{Score} \ge 75$):** RVOL $\ge 1.40$, mecha de absorción clara ($\ge 40\%$), $R:R \ge 2.5$, soporte en 4h respetado.
- **`MEDIA` ($50 \le \text{Score} < 75$):** Parámetros estándar en rango, $R:R \ge 2.0$.
- **`BAJA` ($\text{Score} < 50$):** Parámetros marginales o debilidad en el rebote $\rightarrow$ Descarte o solo `WATCH`.

### 3.2 Criterios de Clasificación del Nivel de Riesgo

- **`BAJO`:** Activo en Top 15 de volumen, ATR normalizado $< 4\%$ diario, soporte mayor histórico consolidado.
- **`MEDIO`:** Activo en Top 16-50, ATR normalizado entre $4\%$ y $7\%$, corrección técnica estándar.
- **`ALTO`:** ATR $> 7\%$, caídas previas verticales o alta correlación con noticias de alta volatilidad.

---

## 4. Generador de Diagnóstico Causal Determinista

El sistema prohíbe terminantemente calificaciones opacas. Cada evaluación que genera una alerta debe emitir una lista de 3 puntos causales concretos que justifican el veredicto:

```python
diagnosis = [
    f"Contracción reciente de {drop_pct:.1f}% testeando soporte dinámico en {support_price}",
    f"Absorción confirmada con mecha del {wick_pct:.0f}% del rango y RVOL de {rvol:.2f}",
    f"Target técnico proyectado a {target_pct:.1f}% con ratio R:R de {rr_ratio:.2f}"
]
```
