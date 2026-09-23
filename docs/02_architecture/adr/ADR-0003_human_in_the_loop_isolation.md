# ADR-0003: Principio Human-in-the-Loop y Aislamiento del Execution Engine

**Código:** ADR-0003  
**Estado:** Aceptado  
**Fecha:** 2026-09-23  
**Decisores:** Equipo Técnico GlobalSolutionsUY / Operadores (Ger & Freya)  

---

## 1. Contexto

La automatización total de la ejecución en trading conllevan riesgos catastróficos de capital: fallas en APIs, deslices de liquidez (*slippage*), eventos cisne negro y bugs de software que pueden agotar saldos en minutos.

El objetivo del equipo no es construir un bot autónomo que opere solo, sino una herramienta de radar que ahorre horas de pantalla a los operadores humanos y potencie su juicio discrecional.

## 2. Decisión

1. **Human-in-the-Loop Obligatorio:** Ninguna alerta se convierte en orden sin la intervención consciente y la firma de un operador humano.
2. **Aislamiento del Execution Engine:** El módulo de ejecución no forma parte del código base del radar MVP. En fases posteriores, se implementará como un servicio completamente separado que requerirá autenticación explícita y aprobación manual por parte del operador antes de interactuar con endpoints privados de trading.
3. **Credenciales en Modo Solo Lectura:** El radar operará sin claves API privadas en Fase 1 (o con claves con permisos estrictos de solo lectura de datos públicos de mercado si fuese necesario para evitar límites de IP).

## 3. Consecuencias

### Positivas:
- **Seguridad financiera absoluta:** Imposibilidad matemática de que el sistema pierda fondos o coloque órdenes indebidas por error de software.
- **Enfoque en calidad de señal:** El esfuerzo de ingeniería se concentra al 100% en la precisión de filtrado y detección de anomalías.

### Negativas / Compromisos:
- La velocidad de entrada depende del tiempo de reacción del operador humano (totalmente aceptable para los timeframes tácticos de 1h/4h del MVP).
