# ADR 0004: Frontera Estricta Human-in-the-Loop sin Auto-Ejecución

- **Estado:** Aceptado
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

Automatizar la ejecución de órdenes de compra/venta directamente en cuentas de exchanges conlleva riesgos operacionales extremos: fallos de conexión, anomalías de volatilidad imprevisibles (*flash crashes*), bugs en el código que podrían agotar balances y falta de criterio ante eventos noticiosos imprevistos de carácter macroeconómico o geopolítico.

---

## 2. Decisión

Se define una **Frontera de Separación Estricta** entre la inteligencia analítica y la ejecución de capital:
1. El sistema opera **exclusivamente con credenciales de solo lectura (Read-Only)** en los exchanges; no posee permisos de trading ni retiro de fondos.
2. La salida final del sistema es una **alerta calificada y explicada** (`OpportunitySignal`) entregada a través del Web Cockpit y Telegram.
3. La evaluación final, el dimensionamiento de la posición (risk management de cartera) y el ingreso manual o asistido de la orden en el exchange es potestad única de **Germán y Andrés**.
4. Cualquier futuro módulo de ejecución automática (*Execution Engine*) deberá diseñarse como un servicio periférico independiente, con límites duros de saldo y activación explícita.

---

## 3. Consecuencias

### Positivas
- Cero riesgo de liquidación o pérdida de fondos por fallos lógicos o desconexiones del software.
- Los operadores conservan el control total sobre su capital mientras ahorran horas de monitoreo pasivo frente a las pantallas.
- Máxima simplicidad en la auditoría y cumplimiento de seguridad.

### Negativas
- Posible latencia de reacción humana si los operadores no se encuentran disponibles al momento del disparo de una oportunidad en estado `READY`.
