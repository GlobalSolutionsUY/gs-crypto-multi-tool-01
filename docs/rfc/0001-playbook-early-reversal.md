# RFC 0001: Playbook de Reversión Temprana Táctica (Setup ZEC/ALLO)

- **Autor:** Germán & Andrés (gsolut)
- **Estado:** Aprobado para V1
- **Fecha:** 2026-09-23
- **Módulo Destino:** Tool 1 - Spot Opportunity Radar

---

## 1. Motivación y Tesis Operativa

La mayoría de los indicadores tradicionales de momentum (RSI, MACD, cruces de medias) generan señales tardías: disparan compras cuando el rebote ya avanzó un +5% o +7%, forzando al operador a perseguir el precio cerca de zonas de resistencia local y degradando severamente el ratio riesgo/beneficio ($R/R$).

El objetivo de este playbook es **identificar el agotamiento de ventas y la presencia de absorción pasiva antes de que el rebote confirme su tracción pública**, permitiendo posicionarse en la base con un stop loss milimétrico.

---

## 2. Anatomía del Patrón (Paso a Paso)

```text
       (Máximo Local)
           ┌───┐
           │   │ 
           └───┘
             ╲
              ╲  FASE 1: Caída pronunciada (-6% a -20%)
               ╲  Estructura mayor (4h/1d) aún intacta
                ╲
                 ▼
      [═════════════════════════════════════════════════] Soporte Mayor
                 ▲
                ╱ ╲  FASE 2: Mecha de rechazo inferior / absorción
               ╱   ╲ Agotamiento de presión vendedora
              ▲
              │ FASE 3: Vela alcista con RVOL > 1.4x (Entrada temprana)
              │
              └───────> ZONA DE ENTRADA (Stop Loss ajustado bajo la mecha)
```

---

## 3. Condiciones Matemáticas de Activación

1. **Magnitud de la Contracción Previa:**
   - La caída desde el máximo más alto de las últimas 48 a 72 horas debe situarse entre un $-6\%$ y un $-20\%$.
   - Si la caída supera el $-25\%$ en menos de 24 horas, el filtro de riesgo la clasifica como evento anómalo de capitulación/noticia destructiva y la penaliza.
2. **Confluencia con Nivel Clave (Soporte Estructural):**
   - El precio mínimo alcanzado durante la caída debe estar a menos de un $\pm 1.5\%$ de un soporte estructural previo identificado en velas de 4h o de un nodo de alto volumen (POC).
3. **Firma de Absorción en Volumen (RVOL):**
   - La vela de reversión (1h o 15m) debe cerrar en la mitad superior de su rango y presentar:
     $$RVOL_{1h} \ge 1.4x$$
   - En el mapa de calor de liquidez, debe observarse una absorción clara de órdenes de venta en los mínimos sin continuidad a la baja.
4. **Parámetros de Trade:**
   - **Invalidación (SL):** Precio mínimo de la mecha de absorción menos un buffer del $0.3\%$ para evitar cacerías de stops superficiales.
   - **Objetivo 1 (TP1):** $+3.5\%$ a $+5.0\%$ (toma de ganancias parcial y reducción de riesgo a break-even).
   - **Objetivo 2 (TP2):** $+8.0\%$ a $+10.0\%$ (proyección hacia resistencia intermedia).
   - **Regla de Rechazo:** Si el ratio $R/R$ calculado hacia TP1 es inferior a $1:1.8$, la oportunidad se descarta automáticamente.
