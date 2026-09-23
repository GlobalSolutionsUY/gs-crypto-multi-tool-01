# Especificación Técnica: Motor Centralizado de Riesgo y Scoring (Risk Filter)

- **Módulo:** Risk & Scoring Engine
- **Fase:** Fase 1 (Transversal V1)
- **Estado:** Especificado y Aprobado
- **Última Actualización:** 2026-09-23

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
- **ALTA:** Contracción profunda limpia en soporte histórico + $RVOL \ge 1.4$ + absorción visible en mecha inferior + ratio $R:R \ge 2.2$.
- **MEDIA:** Cumple condiciones base con $RVOL \in [1.25, 1.4)$ o soporte de menor jerarquía temporal.
- **BAJA:** Parámetros mínimos en el límite de descarte $\rightarrow$ No califica para notificación push.

### 3.2 Criterios de Clasificación de Riesgo
- **BAJO:** Activo de alta capitalización (Top 10), libro de órdenes denso, distancia a invalidación $\le 3.0\%$.
- **MEDIO:** Top 11 a 50 en volumen, volatilidad típica de altcoin líquida, distancia a stop entre $3.0\%$ y $5.5\%$.
- **ALTO:** Activo con noticias de alta volatilidad, desaceleración brusca de BTC simultánea o distancia a stop $> 5.5\%$.

---

## 4. Algoritmo de Scoring Cuantitativo (0 a 100 Puntos)

El score global de la señal se compone de 4 factores ponderados:

$$\text{Score} = (w_1 \cdot S_{\text{rvol}}) + (w_2 \cdot S_{\text{rr}}) + (w_3 \cdot S_{\text{wick}}) + (w_4 \cdot S_{\text{support}})$$

| Componente | Ponderación ($w_i$) | Rango de Valor | Lógica |
| :--- | :--- | :--- | :--- |
| **Volumen (RVOL)** | $30\%$ | 0 a 100 | Proporcional al multiplicador de volumen ($RVOL = 1.25 \rightarrow 50$, $RVOL \ge 2.0 \rightarrow 100$). |
| **Ratio R:R** | $30\%$ | 0 a 100 | Escala lineal entre $R:R = 1.8$ (40 pts) y $R:R \ge 3.0$ (100 pts). |
| **Absorción (Mecha)** | $20\%$ | 0 a 100 | Magnitud de la mecha inferior respecto al cuerpo total de la vela. |
| **Jerarquía de Soporte** | $20\%$ | 0 a 100 | Nivel probado en 4h/1d (100 pts) vs soporte local de 1h (60 pts). |

- **Umbral de Calificación `READY`:** $\text{Score} \ge 70 \text{ pts}$.
- **Umbral de Monitoreo `WATCH`:** $50 \le \text{Score} < 70 \text{ pts}$.
- **Descarte Inmediato:** $\text{Score} < 50 \text{ pts}$.

---

## 5. Explicabilidad Causal Obligatoria

El motor exige la inclusión de 3 bullets causales verificables en cada señal:
1. **Comportamiento del Precio:** Magnitud exacta de la caída y nivel de soporte testeado.
2. **Confirmación de Volumen:** Valor de RVOL y porcentaje de absorción en mecha.
3. **Ecuación Riesgo/Beneficio:** Distancia porcentual al stop y ratio proyectado a TP1 y TP2.
