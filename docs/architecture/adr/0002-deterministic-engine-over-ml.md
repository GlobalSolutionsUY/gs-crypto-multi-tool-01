# ADR 0002: Motor Matemático Determinístico vs Modelos Opacos de ML

- **Estado:** Aceptado
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

Existe la tentación frecuente de utilizar redes neuronales o modelos complejos de Machine Learning para predecir precios en mercados financieros. En la práctica, estos modelos:
- Sufren de sobreajuste severo (overfitting) a condiciones pasadas de mercado.
- Operan como "cajas negras": no pueden explicar de forma transparente por qué recomiendan una compra o venta.
- Tienen un alto costo de mantenimiento computacional y latencia elevada.

---

## 2. Decisión

Se decide construir el núcleo de detección de anomalías como un **Motor Matemático Determinístico Basado en Reglas y Heurísticas Claras**:
1. El cálculo de indicadores (RVOL, ATR, medias móviles, soportes estructurales) se realiza mediante funciones vectorizadas exactas en Python (NumPy / Polars).
2. El descarte y la calificación se basan en umbrales explícitos y auditables.
3. El uso de Inteligencia Artificial (LLM) se restringe estrictamente a la **capa de auditoría contextual, correlación visual y síntesis en lenguaje natural** mediante el protocolo MCP.

---

## 3. Consecuencias

### Positivas
- Cero alucinación matemática: los números, distancias y precios de stop son 100% exactos y reproducibles.
- Ejecución en milisegundos y consumo mínimo de CPU en el VPS de Hostinger.
- Trazabilidad y explicabilidad absoluta: cada alerta generada cuenta con un diagnóstico causal fundamentado en datos observables.

### Negativas
- Las reglas heurísticas deben ser refinadas y calibradas periódicamente por los operadores humanos ante cambios estructurales de volatilidad en el mercado.
