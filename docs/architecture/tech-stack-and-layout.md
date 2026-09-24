# Definición de Arquitectura, Tech Stack y Layout del Repositorio

- **Documento:** Especificación de Tecnologías y Estructura del Código
- **Organización:** [GlobalSolutionsUY](https://github.com/GlobalSolutionsUY)
- **Repositorio:** [gs-crypto-multi-tool-01](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)
- **Infraestructura:** Hostinger VPS (Ubuntu Linux, Docker Compose)
- **Restricción de Infraestructura:** 100% On-Premise VPS / Sin dependencias de AWS
- **Estado:** Formalizado y Aprobado para Fase 1 (MVP)
- **Última Actualización:** 2026-09-23

---

## 1. Justificación y Selección del Stack Tecnológico

El diseño tecnológico implementa de forma estricta los principios de **Ponytail** (solución más simple que funciona, YAGNI, cero sobre-ingeniería) y **Anti-Slop** (cero dependencias infladas, rendimiento determinista y código conciso).

### 1.1 Backend & Motor Cuantitativo (Core Engine)

| Componente | Tecnología | Justificación y Rol Operativo |
| :--- | :--- | :--- |
| **Lenguaje Base** | **Python 3.11+** | Ecosistema óptimo para análisis de datos, modelos tipados y compatibilidad nativa con SDKs de agentes e IA. |
| **Web Framework & SSE** | **FastAPI + Uvicorn** | Servidor ASGI asíncrono de alto rendimiento. Expone endpoints REST ligeros y streaming unidireccional de mercado mediante Server-Sent Events (`SSE`) sin el overhead de WebSockets bidireccionales. |
| **Modelos de Dominio** | **Pydantic v2** | Tipado estricto en tiempo de ejecución, serialización ultrarrápida (núcleo en Rust) y validación de esquemas de datos canónicos ([data-contracts.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/data-contracts.md)). |
| **Cliente HTTP de Mercado** | **httpx (AsyncClient)** | Cliente HTTP asíncrono para ingesta de Binance Spot REST en modo estricto de solo lectura (*read-only*), con reintentos y control fino de rate limiting (`x-mbx-used-weight-1m`). |
| **Cálculo de Series** | **NumPy / Polars** | Cálculos vectorizados en memoria para RVOL (media 20 periodos), ATR (14 periodos), contracciones porcentuales y detección de mechas de absorción en milisegundos. |
| **Renderizado Visual** | **Matplotlib (Agg headless) + Pillow** | Generación de imágenes PNG en el servidor (gráficos de velas con zonas anotadas y mapas de calor de liquidez on-demand) para consumo multimodal del agente y despacho a Telegram. |
| **Protocolo Agéntico** | **FastMCP (mcp Python SDK)** | Expone las tools estandarizadas del sistema (`get_spot_radar_candidates`, `get_annotated_chart`, etc.) directamente al agente (Claude / Gemini / Antigravity) sin adaptadores propietarios. |
| **Despacho Push Móvil** | **python-telegram-bot** (o `httpx`) | Envío instantáneo de alertas estructuradas y foto adjunta al chat privado de los operadores (**Ger & Freya**). |

---

### 1.2 Frontend (Web Cockpit)

| Componente | Tecnología | Justificación y Rol Operativo |
| :--- | :--- | :--- |
| **Tooling & Bundler** | **Vite + TypeScript** | Build instantáneo en desarrollo, tipado estricto compartido con los esquemas de backend y bundle final mínimo de producción. |
| **Librería de Gráficos** | **Lightweight Charts (TradingView)** | Librería de gráficos financieros de alto rendimiento renderizada en Canvas HTML5. Cero dependencias pesadas, carga instantánea y fluidez a 60 FPS. |
| **Estilos & Diseño** | **Vanilla CSS Moderno** | Sin Tailwind. Variables CSS nativas, temas oscuro curado para trading, glassmorphism sutil y componentes semánticos desacoplados de frameworks de utilidades. |
| **Consumo en Tiempo Real** | **Native `EventSource` (SSE)** | Conexión continua y resiliente con reconexión automática provista por el navegador para actualizar la tabla de mercado y estado de señales en vivo. |

---

### 1.3 Infraestructura y Despliegue en Hostinger (Website Unificado Node.js)

> [!IMPORTANT]
> **Restricción de Despliegue: Único Website Node.js en Hostinger (Sin AWS ni Python en Producción)**  
> - El plan contratado en Hostinger soporta aplicaciones **Node.js** pero no demonios persistentes en Python (como FastAPI/Uvicorn).
> - Se aplica la directiva de despliegue unificado: el frontend se compila a archivos estáticos (`dist`), el backend Node.js sirve esos archivos estáticos y también expone la API (`/api/*`), y todo se inicia con un solo comando (`npm start` vía `server.js`).
> - Véase especificación completa en [docs/deployment/hostinger-nodejs-unified.md](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/deployment/hostinger-nodejs-unified.md) y [ADR 0007](file:///e:/projects/gsolut/mvp-crypto-multi-tool/docs/architecture/adr/0007-hostinger-unified-nodejs-deployment.md).

```text
Hostinger Website (Node.js Application Manager)
├── server.js (Entrypoint único - comando: npm start)
│   ├── /api/*          ──> Endpoints de API REST y SSE (Backend)
│   ├── /health         ──> Chequeo de salud del servicio
│   ├── /assets/*       ──> Activos estáticos cacheados desde dist/
│   └── /* (Wildcard)   ──> Servido de dist/index.html (Fallback SPA)
└── Persistencia Local en Disco
    ├── logs/alerts.jsonl       (Auditoría y registro JSONL de alertas)
    └── artifacts/              (Imágenes de gráficos y mapas de calor)
```

1. **Hostinger VPS:**
   - Sistema Operativo: Ubuntu Linux 22.04 o 24.04 LTS.
   - Costo predecible y bajo, alta disponibilidad 24/7.
2. **Docker & Docker Compose:**
   - Multi-contenedor encapsulado (`cmt-backend`, `cmt-web`, `cmt-nginx`).
   - Facilidad de actualización y paridad exacta entre entorno local y producción.
3. **Persistencia Local:**
   - Archivo histórico estructurado en `logs/alerts.jsonl`.
   - Caché local de imágenes en `/app/artifacts/` mapeado al host.
4. **CI/CD Automatizado vía GitHub Actions (Free Tier):**
   - Validación de tipos y linter (`Ruff`, `tsc`).
   - Tests unitarios con `pytest`.
   - Construcción de imágenes Docker multi-etapa.
   - Despliegue automatizado al VPS vía SSH seguro (`appleboy/ssh-action` o comando SSH nativo).

---

## 2. Layout Completo del Repositorio

El árbol de directorios del proyecto se organiza bajo una estructura modular clara:

```text
gs-crypto-multi-tool-01/
├── .agents/                                # Reglas y skills para agentes de codificación
│   ├── rules/
│   │   ├── antislop.md                     # Reglas de diseño y calidad estética
│   │   ├── ponytail.md                     # Directiva YAGNI y simplicidad de código
│   │   └── workflow.md                     # Reglas de gestión de issues, epics y ramas en GitHub
│   └── skills/                             # Skills instaladas (ponytail, antislop, etc.)
├── .github/
│   └── workflows/
│       └── deploy.yml                      # Workflow CI/CD de GitHub Actions
├── docs/                                   # Documentación técnica y de producto consolidada
│   ├── README.md                           # Índice maestro de documentación
│   ├── product/                            # Visión, requerimientos y playbooks de trading
│   │   ├── vision-and-scope.md
│   │   └── trading-playbooks.md
│   ├── architecture/                       # Diseño de sistemas, contratos y ADRs
│   │   ├── system-architecture.md
│   │   ├── data-contracts.md
│   │   ├── heatmap-engine.md
│   │   ├── tech-stack-and-layout.md        # Este documento
│   │   └── adr/                            # Decisiones de arquitectura (ADR 0001 a 0006)
│   ├── specs/                              # Especificaciones funcionales por módulo
│   │   ├── data-ingestion.md
│   │   ├── spot-radar.md
│   │   ├── risk-filter.md
│   │   ├── notification-dispatch.md
│   │   ├── web-client.md
│   │   └── agent-mcp-sop.md
│   ├── deployment/                         # Guías operativas de VPS y CI/CD
│   │   ├── hostinger-vps.md
│   │   └── ci-cd-pipeline.md
│   ├── planning/                           # Planificación temporal y roadmaps
│   │   └── roadmap.md
│   └── draft/                              # Borradores históricos (phase_01)
├── backend/                                # Código fuente del Core Engine (Python)
│   ├── app/
│   │   ├── core/                           # Configuración, loggers y control de rate limits
│   │   │   ├── config.py                   # Pydantic Settings (.env)
│   │   │   └── logger.py                   # Configuración de logging estructurado
│   │   ├── models/                         # Modelos canónicos Pydantic
│   │   │   ├── candle.py
│   │   │   ├── snapshot.py
│   │   │   └── signal.py
│   │   ├── adapters/                       # Adaptadores de exchanges (I/O)
│   │   │   ├── base.py                     # Interfaz abstracta ExchangeAdapter
│   │   │   └── binance.py                  # Conector Binance REST (read-only)
│   │   ├── engines/                        # Lógica cuantitativa determinista
│   │   │   ├── spot_math.py                # RVOL, ATR, S/R y contracción
│   │   │   └── risk_filter.py              # Filtros duros y matriz de scoring
│   │   ├── rendering/                      # Generador visual de artefactos
│   │   │   ├── chart_renderer.py           # Gráfico de velas anotado (PNG)
│   │   │   └── heatmap_service.py          # Renderizado de mapa de calor de liquidez
│   │   ├── mcp/                            # Servidor FastMCP
│   │   │   └── server.py                   # Registro de tools agénticas
│   │   ├── dispatchers/                    # Canales de salida
│   │   │   ├── telegram_bot.py             # Notificaciones push asíncronas con foto
│   │   │   └── cli_table.py                # Salida formateada a terminal
│   │   └── main.py                         # Daemon de escaneo continuo y API FastAPI
│   ├── tests/                              # Suite de pruebas unitarias
│   │   ├── test_binance_adapter.py
│   │   ├── test_spot_math.py
│   │   └── test_risk_filter.py
│   ├── Dockerfile
│   └── requirements.txt
├── web/                                    # Código fuente del Web Cockpit (SPA)
│   ├── src/
│   │   ├── components/                     # Componentes visuales (Tabla, HeatmapView, SignalCard)
│   │   ├── services/                       # Conectores SSE y API REST
│   │   ├── styles/                         # CSS nativo con variables dark mode
│   │   ├── types/                          # Interfaces TypeScript canónicas
│   │   └── main.ts                         # Punto de entrada de la SPA
│   ├── public/                             # Assets estáticos
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf                          # Configuración Nginx para servir estáticos SPA
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml                      # Orquestación de producción en Hostinger VPS
├── docker-compose.dev.yml                  # Orquestación de desarrollo local
├── .gitignore
├── AGENTS.md                               # Manifiesto de agentes y reglas activas
└── README.md                               # Presentación del repositorio
```
