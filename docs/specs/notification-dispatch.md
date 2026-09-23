# Especificación Técnica: Capa de Notificación y Despacho de Señales

- **Módulo:** Notification & Dispatch Layer
- **Fase:** Fase 1 (MVP)
- **Estado:** Especificado y Aprobado
- **Última Actualización:** 2026-09-23

---

## 1. Misión y Responsabilidad

Garantizar que las alertas emitidas por el sistema lleguen de manera estructurada, inmediata y visualmente accionable a los operadores (**Ger & Freya**). 

Canales soportados en la Fase 1:
1. **Canal Telegram (Prioridad Operativa):** Notificación push con diagnóstico estructurado y gráfico renderizado anotado adjunto.
2. **Terminal / CLI Console (Desarrollo y Auditoría):** Formato visual enriquecido con tablas de resumen.
3. **Auditoría Persistente (JSONL File):** Registro append-only en `logs/alerts.jsonl` para análisis post-trade.

---

## 2. Formato Estandarizado del Mensaje de Alerta

Para que una alerta sea legible y procesable en menos de 5 segundos, adopta la siguiente plantilla canónica:

```text
🚨 [TICKER] — [ESTADO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Precio Actual:     $18.42 USDT
Setup:             Spot Dip & Bounce (ZEC/ALLO)
Rango Entrada:     $18.15 - $18.50
Stop Loss (Inval): $17.65 (-4.18%)
Objetivo 1 (TP1):  $19.35 (+5.05%) | R:R 1:1.2
Objetivo 2 (TP2):  $20.25 (+9.93%) | R:R 1:2.4
RVOL (1h):         1.85x (Absorción confirmada)
Riesgo / Score:    MEDIO / 84 pts
Exchange:          BINANCE SPOT
Timestamp (UTC):   2026-09-23 14:30:00

Diagnóstico Cuantitativo:
• Contracción previa del -8.4% con estructura mayor de 4h intacta.
• Mecha de absorción del 42% en soporte estático clave ($18.10).
• RVOL 1.85x con cierre de vela en el tercio superior del rango.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 3. Despacho Vía Telegram Bot

### 3.1 Credenciales y Variables de Entorno
- `TELEGRAM_BOT_TOKEN`: Token provisto por `@BotFather`.
- `TELEGRAM_CHAT_ID`: ID del canal privado o grupo donde operan Ger y Freya.

### 3.2 Flujo de Envío con Imagen
Cuando el estado de una señal pasa a `READY`:
1. El despachador consulta el gráfico anotado generado por el [Visual Rendering Engine](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/heatmap-engine.md).
2. Se ejecuta una petición HTTP POST contra el endpoint `sendPhoto` de Telegram:
   - `photo`: Stream del archivo PNG local (`/app/artifacts/{signal_id}.png`).
   - `caption`: Texto estructurado en formato Markdown v2 o HTML.
   - `parse_mode`: `HTML`.

---

## 4. Despacho por Terminal / Consola CLI

Durante la ejecución continua del daemon, la consola muestra una tabla sintética en tiempo real:

```text
┌──────────┬────────┬─────────┬────────┬────────┬───────┬───────┬─────────────┐
│ Par      │ Precio │ 24h Vol │ Drop%  │ RVOL   │ Score │ R:R   │ Estado      │
├──────────┼────────┼─────────┼────────┼────────┼───────┼───────┼─────────────┤
│ ZECUSDT  │ $32.40 │ $45.2M  │ -7.2%  │ 1.62x  │ 88    │ 1:2.3 │ READY 🚨    │
│ ALLOUSDT │ $0.485 │ $18.1M  │ -11.4% │ 1.45x  │ 74    │ 1:2.0 │ READY 🚨    │
│ SUIUSDT  │ $1.820 │ $95.0M  │ -3.1%  │ 0.95x  │ 42    │ ---   │ DISCARD ❌  │
│ NEARUSDT │ $4.550 │ $62.3M  │ -6.0%  │ 1.10x  │ 58    │ 1:1.5 │ WATCH 👁️    │
└──────────┴────────┴─────────┴────────┴────────┴───────┴───────┴─────────────┘
```

---

## 5. Registro Histórico de Auditoría (`logs/alerts.jsonl`)

Cada señal despachada o descartada se serializa en una línea JSON independiente con timestamp UTC, preservando trazabilidad completa para optimizar los umbrales del sistema en el futuro.
