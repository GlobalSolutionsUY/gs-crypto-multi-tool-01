# Especificación Técnica y Funcional: Crypto Radar & Copilot (MVP)

**Documento:** Especificación de Requerimientos y Arquitectura de Sistema  
**Estado:** Borrador (Draft)  
**Versión:** 0.1.0  
**Alcance:** Fase 1 / MVP (Proof of Concept)  

---

## 1. Resumen Ejecutivo y Visión del Sistema

El proyecto **Crypto Radar & Copilot** es una plataforma modular y desacoplada de inteligencia de mercado y asistencia para trading discrecional cuantitativo. Su objetivo primordial es actuar como un **radar y copiloto analítico** ("Human-in-the-loop"), eliminando el ruido de mercado y asistiendo a los operadores en la toma de decisiones.

### 1.1 Principios Fundamentales de Diseño
1. **Copiloto, no Ejecutor Autónomo:** El sistema detecta, filtra, califica y notifica. La toma de decisión operativa reside estrictamente en el usuario (operador humano). La ejecución automática de órdenes queda expresamente fuera del alcance de esta fase.
2. **Filosofía de Selección Negativa (Filtro Riguroso):** El agente no tiene como mandato forzar operaciones. Debe poseer la capacidad de reportar estados nulos cuando las condiciones de mercado no satisfagan los umbrales mínimos de oportunidad/riesgo.
3. **Desacoplamiento de Proveedores de Datos:** El subsistema de ingesta trata a los exchanges (ej. Binance) como conectores de entrada periféricos, nunca como el núcleo del sistema, facilitando la futura integración de múltiples exchanges (Bitget, Bitunix) y fuentes alternativas (on-chain, métricas de liquidación).

---

## 2. Requerimientos Funcionales del Ecosistema (Visión Global)

A continuación se definen los módulos funcionales previstos en el diseño integral de la plataforma:

### RF-01: Spot Opportunity Radar (Prioridad Alta)
- **Objetivo:** Identificar movimientos tácticos de corto/medio plazo (+3% a +10%) en pares de alta liquidez.
- **Variables de entrada:** Precio, volumen relativo, aceleración de volumen, quiebres y confluencias estructurales, volatilidad (ATR/desviación), niveles clave de soporte/resistencia, distancia porcentual a zonas críticas.
- **Patrón de Referencia (Playbook):** Contracción/caída pronunciada con estructura mayor preservada $\rightarrow$ Agotamiento de ventas/rechazo de mínimos $\rightarrow$ Confirmación temprana de divergencia o recuperación de volumen $\rightarrow$ Señal preventiva antes de la consolidación del rebote.

### RF-02: Liquidity & Futures Radar
- **Objetivo:** Monitoreo de zonas de acumulación de liquidez y niveles probables de liquidación forzada en derivados.
- **Lógica analítica:** Identificación de clusters de liquidez $\rightarrow$ Barridas de stops/liquidaciones $\rightarrow$ Evaluación de aceptación vs. rechazo de precios $\rightarrow$ Transición de volumen intradiario.
- **Salida esperada:** Determinación de estado condicional (ej. `BTC - Zona de liquidez superior en 78.2k - Aproximación sin confirmación - WAIT`).

### RF-03: Meme Radar (Early Mover Filter)
- **Objetivo:** Escaneo temprano de activos de alta volatilidad con aplicación de filtros heurísticos de protección de capital.
- **Filtros de control:** Detección de concentración de tokens en wallets primarias, liquidez bloqueada/quemada, verificación de contratos maliciosos (honeypot/rug pull), aceleración anormal de transacciones tempranas.

### RF-04: New Listings & Catalizadores
- **Objetivo:** Procesamiento de eventos discretos (anuncios oficiales de listados, launchpools, tokens emergentes en DEX).
- **Proceso de análisis:** Puntuación multidimensional basada en tokenomics, cronograma de desbloqueos (unlocks), volumen inicial y tracción social/narrativa, evitando compras mecánicas inmediatas al listado.

### RF-05: On-chain & Whale Radar
- **Objetivo:** Incorporación de telemetría de red y flujos entre billeteras clave y exchanges centralizados (CEX net flow, acumulación de clusters de ballenas).
- **Rol en el sistema:** Evidencia complementaria ponderada en la matriz de scoring, no detonante aislado de alertas.

### RF-06: Motor Centralizado de Evaluación de Riesgo (Risk Filter)
- **Objetivo:** Validación estandarizada transversal para todos los módulos de radar.
- **Matriz de Salida:**
  - Nivel de Oportunidad: `ALTA` | `MEDIA` | `BAJA`
  - Nivel de Exposición al Riesgo: `ALTO` | `MEDIO` | `BAJO`
- **Trazabilidad:** Cada clasificación debe generar un informe causal explicativo determinístico (rechazando clasificaciones de "caja negra").

---

## 3. Especificación del Formato de Alertas y Señales

Las salidas del motor hacia los canales de notificación (Telegram, Webhook o Dashboard) deben adherirse a una estructura sintética, estandarizada y normalizada:

```text
[TICKER] — [MODULO_ORIGEN]
-----------------------------------------
Precio Actual:     <Decimal>
Setup / Estrategia:<Identificador de patrón>
Rango de Entrada:  <Min> – <Max>
Objetivo Técnico:  <+X.X%> ≈ <Precio Objetivo>
Invalidación (SL): <Nivel de precio o condición de estructura>
Volumen Relativo:  <Aumentando | Estable | Divergente>
Nivel de Riesgo:   <Bajo | Medio | Alto>
Estado del Setup:  <WATCH | READY | INVALIDATED>
Timestamp (UTC):   <YYYY-MM-DD HH:mm:ss>
Fuente de Datos:   <Identificador del Exchange / Broker>

Diagnóstico:
- <Condición 1: Comportamiento del precio>
- <Condición 2: Sustento de volumen y soporte>
- <Condición 3: Justificación del ratio riesgo/beneficio>
```

---

## 4. Alcance Técnico del MVP (Fase 1 - Proof of Concept)

Para la implementación inicial orientada a validación rápida (timeframe estimado: 3 horas de desarrollo), se acota estrictamente el alcance funcional para garantizar confiabilidad y robustez operativa.

### 4.1 Enfoque: Implementación Vertical de Spot Radar
- **Universo de Activos:** Top 30 a 50 pares en Binance Spot contra USDT ordenados por volumen diario.
- **Mecanismo de Ingesta:** API pública REST de Binance (modo estricto de solo lectura, sin necesidad de credenciales firmadas para datos de mercado).
- **Métricas a Procesar:** Series temporales OHLCV (velas 1h / 4h), medias móviles clave, volumen relativo (RVOL) y cálculo de volatilidad promedio (ATR).
- **Lógica de Detección:**
  1. Contracción porcentual reciente significativa en ventana móvil predeterminada.
  2. Testeo y rechazo de zonas de soporte dinámico/estático.
  3. Recuperación de impulso de corto plazo con confirmación de volumen creciente ($RVOL > 1.2$).
- **Capa de Notificación:** Generación de payload estructurado exportable vía terminal, archivo de log estructurado (JSONL), y canal de Telegram / Webhook liviano.
- **Explicabilidad:** Motor heurístico de reglas determinísticas (el uso de modelos de lenguaje queda supeditado exclusivamente a la síntesis en lenguaje natural del diagnóstico estructurado).

### 4.2 Restricciones y Elementos Fuera de Alcance (Out of Scope para Fase 1)
- **Prohibición de Ejecución:** Sin envío de órdenes ni interacción con endpoints de trading/privados.
- **Sin Dependencia de Machine Learning Complejo:** Sin entrenamiento de modelos predictivos de caja negra ni redes neuronales.
- **Sin Arbitraje ni Métricas Complejas Multi-Exchange:** Exclusión temporal de cálculo de libros de órdenes L2/L3 en tiempo real o escaneo on-chain intensivo.

---

## 5. Arquitectura del Sistema

El sistema implementa una arquitectura desacoplada orientada a tuberías de procesamiento (Pipeline Architecture):

```text
┌─────────────────────────────────────────────────────────────┐
│                    FUENTES DE DATOS                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │  Binance Spot   │  │ Futures / Liq.*  │  │ On-Chain*  │  │
│  │   (Fase 1)      │  │    (Fase 2)      │  │  (Fase 2)  │  │
│  └────────┬────────┘  └────────┬─────────┘  └─────┬──────┘  │
└───────────┼────────────────────┼──────────────────┼─────────┘
            ▼                    ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│               CAPA DE INGESTA Y NORMALIZACIÓN               │
│  - Estandarización de OHLCV, Orderflow y Metadatos          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            MOTOR DE ANÁLISIS TÉCNICO Y PATRONES             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │ Spot Opportunity Radar│       │ Otros Radars*         │  │
│  │ (Filtros de momentum) │       │ (Liquidez, Memes, etc)│  │
│  └───────────┬───────────┘       └───────────────────────┘  │
└──────────────┼──────────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FILTRO DE RIESGO Y RANKING                  │
│  - Descarte de activos anómalos o de bajo volumen           │
│  - Asignación de Score y Priorización de Oportunidades      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                CAPA DE DISPATCH Y EXPLICACIÓN               │
│  - Generador de Alertas Estructuradas                       │
│  - Formateador / Resumen Copilot                            │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONSUMIDORES FINALES                     │
│               [ Telegram Bot / CLI Dashboard ]              │
│                              │                              │
│                              ▼                              │
│               Decisión Humana (Operadores)                  │
└─────────────────────────────────────────────────────────────┘

(*) Módulos planificados para iteraciones posteriores.
```

### 5.1 Desacoplamiento Futuro de Ejecución (Fase Posterior)
En fases subsiguientes, el sistema admitirá la conexión de un componente secundario denominado **Execution Engine**, el cual operará únicamente bajo confirmación explícita del usuario:

```text
[Alerta Aprobada por Operador] ──> [Execution Engine] ──> [APIs de CEX / DEX]
```

---

## 6. Criterios de Aceptación del MVP

1. **Eficiencia en Filtrado:** De un universo de 30 a 50 pares analizados, el sistema debe ser capaz de discriminar la gran mayoría de activos que no cumplen condiciones, entregando únicamente las anomalías de alta probabilidad que superen los umbrales de riesgo.
2. **Generación Determinística de Estados:** Cada activo evaluado debe situarse inequívocamente en uno de los estados del ciclo de vida (`WATCH`, `READY`, `INVALIDATED`).
3. **Resiliencia y Baja Latencia de Análisis:** El ciclo completo de recolección de datos, cálculo de indicadores y emisión de alertas debe ejecutarse en menos de 30 segundos por corrida de escaneo.
4. **Integridad Arquitectónica:** El código fuente del motor de análisis no debe contener dependencias acopladas directamente al cliente de Binance; toda interacción con datos debe pasar por la capa de abstracción del proveedor.
