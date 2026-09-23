# ADR 0005: Web Cockpit en Tiempo Real y Gráficos Livianos

- **Estado:** Aceptado
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

El equipo necesita visualizar la totalidad del mercado escaneado (Top 50 pares), las métricas intermedias calculadas (RVOL, ATR, distancias a soporte) y los mapas de calor de liquidez en una única pantalla de alta densidad de información, evitando tener que consultar múltiples mensajes de chat o terminales de texto.

---

## 2. Decisión

Se decide construir el **Web Cockpit** como una aplicación de página única (**SPA**) ultraliviana:
1. **Frontend Core:** Vite + TypeScript + Vanilla CSS / Componentes Reactivos ligeros, optimizados para rendering continuo y sin sobrecarga de frameworks pesados.
2. **Gráficos Financieros:** Integración de `@tradingview/lightweight-charts` para la visualización interactiva de velas, soportes y zonas de entrada/SL.
3. **Canal en Tiempo Real:** **Server-Sent Events (SSE)** o **WebSocket** directo desde el backend FastAPI para actualizar la tabla de pares sin necesidad de recargar la página.
4. **Despliegue Estático:** Los assets compilados se sirven de forma ultra-eficiente mediante Nginx en el mismo VPS de Hostinger.

---

## 3. Consecuencias

### Positivas
- Carga instantánea y consumo despreciable de recursos en el navegador del operador.
- Máxima densidad visual para monitoreo profesional de trading.
- Facilidad de inspección en profundidad para cualquier activo con un solo clic.

### Negativas
- Se añade la necesidad de mantener y compilar el proyecto frontend dentro del pipeline de CI/CD de GitHub Actions.
