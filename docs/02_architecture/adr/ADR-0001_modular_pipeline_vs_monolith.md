# ADR-0001: Arquitectura de Pipeline Modular vs. Bot Monolítico

**Código:** ADR-0001  
**Estado:** Aceptado  
**Fecha:** 2026-09-23  
**Decisores:** Equipo Técnico GlobalSolutionsUY / Operadores (Ger & Freya)  

---

## 1. Contexto

La mayoría de los bots de trading tradicionales acoplan en una única base de código la llamada al exchange, la lógica de la estrategia, la gestión de la posición y el envío de órdenes directas. Este enfoque monolítico presenta serios problemas de mantenibilidad:
- Cambiar de exchange (ej. de Binance a Bitget o Bitunix) requiere reescribir la lógica de trading.
- Probar un nuevo radar (ej. Memecoins u On-Chain) obliga a tocar el código crítico de monitoreo existente.
- Un fallo en un conector de API puede detener por completo el análisis de otros mercados.

## 2. Decisión

Se adopta una **Arquitectura de Pipeline Modular (Pipes & Filters)** con inversión de dependencias estricta:
1. **Conectores periféricos:** Adaptadores desacoplados que normalizan los datos hacia un formato agnóstico.
2. **Motores de Radar independientes:** Cada radar (Spot, Futures, Memes) es un filtro autónomo que evalúa series normalizadas.
3. **Filtro común de riesgo:** Una etapa centralizada evalúa y califica todas las señales antes de la salida.
4. **Despachadores intercambiables:** Canales de salida (CLI, Telegram, logs) que consumen un payload estándar.

## 3. Consecuencias

### Positivas:
- **Alta extensibilidad:** Añadir un nuevo exchange solo implica implementar la interfaz de conector, sin tocar los radares.
- **Testeo simplificado:** Los radares pueden ser testeados con datos estáticos (fixtures) sin necesidad de conexión a internet o APIs reales.
- **Resiliencia:** El fallo en un módulo o conector no compromete la estabilidad del resto del pipeline.

### Negativas / Compromisos:
- Mayor cantidad inicial de capas y transformaciones de datos en comparación con un script directo de un solo archivo.
