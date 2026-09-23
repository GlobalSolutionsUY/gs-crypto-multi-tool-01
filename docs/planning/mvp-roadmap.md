# Roadmap y Plan de Implementación de la Plataforma

- **Proyecto:** `crypto-multi-tool`
- **Organización:** gsolut
- **Stakeholders:** Germán & Andrés

---

## 1. Fases del Proyecto

```text
FASE 1: CORE ENGINE & SPOT RADAR V1 (MVP DE PRODUCCIÓN)
├── 1.1 Ingestor Binance Spot & Modelos Canónicos
├── 1.2 Spot Math Engine (Playbook Reversión ZEC/ALLO)
├── 1.3 Negative Filter & Pipeline de Descarte
├── 1.4 HeatmapEngine (Generador PNG de gráficos y mapas de calor)
└── 1.5 FastMCP Server & SOP del Agente en 5 pasos

FASE 2: INTERFACES DE CONSUMO Y NOTIFICACIÓN
├── 2.1 Telegram Dispatcher (Bot push con imagen adjunta)
├── 2.2 Web Cockpit SPA (Tabla en vivo con SSE)
├── 2.3 Visor interactivo de Mapas de Calor en la Web
└── 2.4 Panel de Auditoría y Logs de Selección Negativa

FASE 3: DEPLOYMENT Y AUTOMATIZACIÓN (HOSTINGER & GITHUB)
├── 3.1 Contenerización con Docker y Docker Compose
├── 3.2 Configuración de Nginx Reverse Proxy y SSL en Hostinger
└── 3.3 GitHub Actions Workflow (Tests automáticos y Deploy SSH)

FASE 4: EXPANSIÓN DE TOOLS (RADARES COMPLEMENTARIOS)
├── 4.1 Tool 2: Liquidity & Futures Radar (Trading Different / Orderflow)
├── 4.2 Tool 3: Listings & Catalyst Radar
└── 4.3 Tool 4: Meme & High-Beta Radar con Filtro Anti-Rug
```

---

## 2. Criterios de Aceptación de la Fase 1 (Spot Radar V1)

1. **Eficiencia en Filtrado Negativo:** De un universo de 30 a 50 pares analizados, el sistema debe descartar de forma limpia y causal al menos el 85% de los pares sin estructura.
2. **Latencia de Escaneo:** El ciclo de ingesta, cálculo matemático y generación de artefactos visuales debe completarse en menos de 20 segundos por corrida.
3. **Calidad de la Alerta:** Toda oportunidad que alcance el estado `READY` debe contener:
   - Niveles numéricos exactos de entrada, invalidación (SL) y objetivos escalonados con ratio $R/R \ge 1:2.0$.
   - Imagen renderizada del gráfico con las zonas delimitadas.
   - Diagnóstico causal explícito de 3 puntos.
4. **Auditabilidad del Agente:** Cada intervención del agente vía MCP debe quedar registrada en el log del sistema para revisión de los operadores.
