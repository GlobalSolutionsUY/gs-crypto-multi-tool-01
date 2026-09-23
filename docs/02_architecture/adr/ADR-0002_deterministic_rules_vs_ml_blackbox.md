# ADR-0002: Reglas Heurísticas Deterministas vs. Modelos de ML Caja Negra

**Código:** ADR-0002  
**Estado:** Aceptado  
**Fecha:** 2026-09-23  
**Decisores:** Equipo Técnico GlobalSolutionsUY / Operadores (Ger & Freya)  

---

## 1. Contexto

Existe la tentación frecuente de aplicar redes neuronales o modelos complejos de Deep Learning para predecir precios en mercados cripto. Sin embargo, en la práctica:
- Los modelos predictivos sufren sobreajuste severo (*overfitting*) debido al régimen no estacionario y al alto ruido del mercado cripto.
- Operan como "cajas negras" que arrojan probabilidades sin justificación causal comprensible.
- Los operadores discrecionales (Ger & Freya) necesitan entender **exactamente por qué** se emite una alerta (ej. quiebre de soporte, volumen anómalo, compresión de volatilidad) para validar su propia tesis operativa.

## 2. Decisión

Para la Fase 1 (MVP) y el núcleo del sistema, se decide utilizar **reglas estadísticas y algorítmicas deterministas** fundamentadas en conceptos probados de estructura de mercado:
- Cálculo estandarizado de Volatilidad (ATR) y Volumen Relativo (RVOL).
- Detección de mechas de absorción y testeos de soporte/resistencia.
- Criterios matemáticos claros de riesgo/beneficio ($R:R \ge 2.0$).
- En caso de utilizar Modelos de Lenguaje (LLMs), su función se restringirá exclusivamente a la **síntesis y redacción en lenguaje natural** de diagnósticos cuantitativos ya calculados, nunca a la toma de decisión matemática de compra/venta.

## 3. Consecuencias

### Positivas:
- **Trazabilidad total:** Cada alerta es 100% auditable y reproducible.
- **Bajo costo computacional:** Ejecución en segundos sobre hardware estándar, sin necesidad de GPUs o inferencias costosas.
- **Confianza del operador:** El copiloto habla el mismo lenguaje técnico y estructural que los traders.

### Negativas / Compromisos:
- No detecta patrones no lineales imprevistos que requieran aprendizaje profundo (los cuales quedan fuera de la necesidad actual del negocio).
