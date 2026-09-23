# ADR 0001: Arquitectura de Pipeline Unidireccional Desacoplada

- **Estado:** Aceptado
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

Muchos sistemas de trading fallan en escalar porque su lógica analítica está intrínsecamente acoplada a la API o al SDK de un exchange particular (por ejemplo, Binance). Cuando el equipo desea operar en Bitget, Bitunix o integrar feeds de liquidaciones on-chain, el código debe ser reescrito prácticamente desde cero.

Se requiere una arquitectura que permita conectar múltiples fuentes de datos sin alterar una sola línea del motor de análisis o los radares.

---

## 2. Decisión

Se adopta una **Arquitectura de Pipeline Unidireccional por Capas**:
1. **Exchange Adapters:** Conectores periféricos aislados que conocen los detalles de las APIs externas.
2. **Normalizer Bus:** Transforma los datos brutos a modelos canónicos comunes (`Candle`, `MarketSnapshot`).
3. **Analysis Engines (Radars):** Operan exclusivamente sobre los modelos canónicos sin conocer el origen de los datos.
4. **Opportunity Manager & Dispatch:** Recibe señales agnósticas y las canaliza hacia los consumidores (Web y Telegram).

---

## 3. Consecuencias

### Positivas
- Agregar un nuevo exchange (ej. Bitget) requiere únicamente implementar una nueva subclase de `ExchangeAdapter`.
- Facilidad para crear tests unitarios inyectando datos históricos o simulados sin conexión a internet.
- Aislamiento ante caídas o cambios de versión en las APIs de los exchanges.

### Negativas
- Sobrecarga mínima de serialización/normalización al transformar payloads brutos a objetos tipados en memoria.
