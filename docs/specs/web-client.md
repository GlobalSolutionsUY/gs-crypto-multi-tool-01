# Especificación Funcional: Web Cockpit (Cliente Web)

- **Componente:** Web Cockpit (SPA)
- **Destinatarios:** Germán & Andrés (Mesa de Trading gsolut)
- **Naturaleza:** Interfaz visual en tiempo real para monitoreo de mercado, auditoría de oportunidades y telemetría de radares.
- **Directrices de Diseño:** Alineado con Anti-Slop (Dark mode profesional, tipografía tabular de alto contraste, cero decoraciones superfluas o gradientes vacíos).

---

## 1. Vistas y Componentes Principales

```text
┌────────────────────────────────────────────────────────────────────────┐
│  GSOLUT TRADING COCKPIT              [Daemon: RUNNING | Lat: 42ms] 🔴  │
├────────────────────────────────────────────────────────────────────────┤
│ METRIC STRIP: 50 Scanned | 44 Filtered | 4 WATCH | 2 READY | BTC: FLAT  │
├────────────────────────────────────────────────────────────────────────┤
│ [RADAR TABLE (LIVE)]                                                   │
│ Ticker   | Price    | 24h%  | RVOL  | ATR   | Status  | Score | Action │
│ ---------+----------+-------+-------+-------+---------+-------+------- │
│ ALLO     | 0.2092   | -8.4% | 2.35x | 0.005 | READY 🟢| 88/100| [VER]  │
│ ZEC      | 38.45    | -6.1% | 1.80x | 1.120 | WATCH 🟡| 72/100| [VER]  │
│ SOL      | 142.10   | +1.2% | 0.95x | 2.400 | FILTER⚪| 25/100| [VER]  │
├────────────────────────────────────────────────────────────────────────┤
│ [INSPECTION DRAWER / MODAL: ALLO (READY)]                              │
│ ┌──────────────────────────────────┐ ┌───────────────────────────────┐ │
│ │  CANDLESTICK + ANNOTATED CHART   │ │  LIQUIDITY HEATMAP (ON-DEMAND)│ │
│ │  (Entry: 0.209 | SL: 0.203)      │ │  (High density: 0.221k cluster)│ │
│ └──────────────────────────────────┘ └───────────────────────────────┘ │
│ Diagnóstico del Agente:                                               │
│ - Absorción en soporte 0.208 con mecha de rechazo en 1h.              │
│ - R/R: 1:3.2 hasta TP2 (0.230). Sin resistencia inmediata.             │
│ [Copiar Niveles]  [Abrir en TradingView]  [Marcar Operado]            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Descripción de Secciones

### 2.1 Header & Barra de Telemetría
- Estado del daemon en Hostinger VPS (`ONLINE`, `SYNCING`, `ERROR`).
- Latencia del canal WebSocket / SSE.
- Resumen en tiempo real del ciclo de escaneo: total de activos analizados, cantidad descartada por el filtro negativo y conteo de estados activos (`WATCH` y `READY`).
- Semáforo de régimen de Bitcoin (`BULL_MOMENTUM`, `SIDEWAYS_SAFE`, `PANIC_DUMP`).

### 2.2 Tabla de Mercado en Vivo (Market Scanner Table)
- **Densidad de Información:** Vista tabular compacta con fuentes monoespaciadas para precios y porcentajes.
- **Columnas:**
  - `Activo`: Icono/Ticker y enlace rápido al exchange.
  - `Precio Actual`: Cotización spot normalizada.
  - `Cambio 24h`: Porcentaje coloreado según dirección.
  - `RVOL`: Multiplicador sobre la media de volumen (destacado si $RVOL > 1.5x$).
  - `ATR / Volatilidad`: Rango medio verdadero para estimar recorrido potencial.
  - `Distancia a Soporte`: Proximidad porcentual al nivel clave de reversión.
  - `Estado`: Badge semántico (`DISCOVERY`, `WATCH`, `READY`, `INVALIDATED`).
  - `Score`: Puntuación consolidada del setup (0 a 100).
- **Filtros Rápidos en 1 Clic:**
  - Botón *"Solo Setups Listos (READY)"*.
  - Botón *"Volumen Anómalo (RVOL > 2.0x)"*.
  - Botón *"Top Scorers (> 80)"*.

### 2.3 Panel de Inspección Táctica (Inspection Drawer)
Se abre lateralmente al seleccionar cualquier par de la tabla:
- **Gráfico Interactivo o Anotado:** Muestra las velas recientes con las zonas de entrada sugerida, invalidación (SL) y objetivos (TP1, TP2) claramente dibujados.
- **Visor de Mapa de Calor de Liquidez On-Demand:** Permite solicitar e inspeccionar el mapa de calor de densidad de órdenes y liquidaciones para comprobar si hay barridas recientes o liquidez libre hacia arriba.
- **Registro del Agente (Causal Diagnosis):** Lista detallada de las razones por las cuales el agente aprobó o penalizó el setup.
- **Acciones Tácticas del Operador:**
  - Copiar parámetros de entrada al portapapeles.
  - Abrir gráfico completo en TradingView o terminal de Binance.
  - Botón de feedback: marcar como *"Operado"* o *"Descartado manualmente"*.

---

## 3. Protocolo de Comunicación en Tiempo Real

El cliente web no realiza polling continuo que sature el backend o agote recursos:
- **Canal Primario:** **Server-Sent Events (SSE)** o **WebSocket** unidireccional desde el backend en Hostinger hacia el navegador.
- **Eventos Notificados:**
  - `snapshot_update`: Actualización masiva de precios y RVOL de la tabla cada $N$ segundos.
  - `status_transition`: Notificación inmediata cuando un par cambia de estado (ej. de `WATCH` a `READY`).
  - `invalidation_alert`: Notificación inmediata si un par en seguimiento pierde el soporte.
