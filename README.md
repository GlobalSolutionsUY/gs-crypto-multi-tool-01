# Crypto Multi-Tool (Radar & Copilot)

[![CI Pipeline](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01/actions/workflows/ci.yml/badge.svg)](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01/actions/workflows/ci.yml)
[![Repository](https://img.shields.io/badge/GitHub-gs--crypto--multi--tool--01-blue.svg)](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)
[![Deployment](https://img.shields.io/badge/Deployment-Hostinger%20VPS-orange.svg)](docs/deployment/hostinger-vps.md)
[![Philosophy](https://img.shields.io/badge/Philosophy-Ponytail%20%7C%20Anti--Slop-success.svg)](.agents/)

Sistema cuantitativo determinista para la detección temprana de anomalías de mercado, filtrado riguroso de riesgo y despacho estructurado de oportunidades de trading táctico (Spot Radar) y asistencia agéntica multimodal.

---

## 1. Arquitectura del Sistema

El sistema implementa una arquitectura desacoplada en 5 capas especializadas:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. INGESTA DE MERCADO (Binance Spot REST Read-Only)         │
│    - Filtro de 30-50 pares USDT más líquidos                │
│    - Control estricto de rate limits y pesos (1m)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MOTOR MATEMÁTICO & FILTRO DE RIESGO                      │
│    - Spot Math: RVOL (SMA 20), ATR (14), Dip & Bounce       │
│    - Risk Filter: Selección negativa (>85% descarte limpio)  │
│    - Renderizado visual on-demand (velas anotadas y heatmap)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. PROTOCOLO AGÉNTICO FASTMCP                               │
│    - Servidor FastMCP exponiendo tools estandarizadas       │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│ 4. DESPACHO PUSH MÓVIL  │           │ 5. WEB COCKPIT (SPA)    │
│    - Telegram Bot       │           │    - Vite + TypeScript  │
│    - Operadores Ger &   │           │    - Lightweight Charts │
│      Freya              │           │    - Streaming SSE      │
└─────────────────────────┘           └─────────────────────────┘
```

---

## 2. Estructura del Repositorio

```text
gs-crypto-multi-tool-01/
├── .agents/                 # Directivas, reglas y skills para agentes (Ponytail, Anti-Slop, Workflow)
├── .github/
│   └── workflows/
│       └── ci.yml           # Pipeline automatizado de linting y testing (Ruff, Pytest, Vite)
├── backend/                 # Core Engine & API en Python 3.11+
│   ├── app/
│   │   ├── core/            # Configuración tipada (Pydantic Settings) y logging estructurado
│   │   ├── models/          # Modelos de datos canónicos (Pydantic v2)
│   │   ├── adapters/        # Conectores de exchanges (Binance Spot Read-Only)
│   │   ├── engines/         # Motores matemáticos deterministas y aduana de riesgo
│   │   ├── rendering/       # Generador de gráficos anotados y mapas de calor (PNG)
│   │   ├── mcp/             # Servidor FastMCP para agentes
│   │   ├── dispatchers/     # Notificadores a Telegram y formateadores CLI
│   │   └── main.py          # Daemon de escaneo continuo y API FastAPI
│   ├── tests/               # Suite de tests unitarios (Pytest)
│   ├── Dockerfile           # Imagen de producción en Python 3.11-slim
│   ├── requirements.txt     # Dependencias de producción
│   └── requirements-dev.txt # Dependencias de testing y linters
├── web/                     # Web Cockpit SPA en tiempo real
│   ├── src/                 # Tipos TypeScript, componentes y estilos
│   ├── Dockerfile           # Multi-stage build (Node 20 Alpine -> Nginx Alpine)
│   ├── nginx.conf           # Configuración Nginx para servir estáticos SPA
│   ├── package.json         # Tooling con pnpm
│   ├── tsconfig.json        # Configuración estricta de TypeScript
│   └── vite.config.ts       # Bundler Vite y proxy de desarrollo
├── docs/                    # Documentación técnica consolidada
│   ├── product/             # Visión, requerimientos y playbooks operativos
│   ├── architecture/        # Tech stack, contratos canónicos y ADRs
│   ├── specs/               # Especificaciones funcionales por módulo
│   ├── deployment/          # Guías de Hostinger VPS y CI/CD
│   └── planning/            # Roadmaps y plan de sprint MVP
├── scripts/                 # Scripts operacionales dedicados multiplataforma (.sh / .ps1)
│   ├── build.ps1 / .sh      # Compilación de frontend e imágenes Docker
│   ├── clean.ps1 / .sh      # Limpieza de cachés, dist y temporales
│   ├── dev.ps1 / .sh        # Inicio del entorno de desarrollo local
│   ├── docker-dev.ps1 / .sh # Orquestación Docker Compose desarrollo
│   ├── docker-prod.ps1 / .sh# Orquestación Docker Compose producción
│   ├── docker-down.ps1 / .sh# Detención de contenedores
│   ├── help.ps1 / .sh       # Referencia de comandos
│   ├── lint.ps1 / .sh       # Linter Ruff y TypeScript typecheck
│   └── test.ps1 / .sh       # Suite Pytest y validación de build
├── Makefile                 # Runner multiplataforma (enruta a .ps1 en Windows o .sh en Linux)
├── make.ps1                 # Entry point PowerShell para Windows
├── make.cmd                 # Entry point CMD para Windows
├── docker-compose.yml       # Orquestación de producción en Hostinger VPS
├── docker-compose.dev.yml   # Orquestación de desarrollo local con live-reload
├── .env.example             # Plantilla de configuración de entorno
└── .gitignore               # Reglas de exclusión de Git
```

---

## 3. Gestor de Comandos Centralizado (`make` / `scripts/`)

El repositorio incluye un sistema de comandos unificado **100% multiplataforma** que opera de forma idéntica en **Windows** (PowerShell/CMD) y **Linux** (Bash):

```bash
# Ver ayuda y todos los targets disponibles
make help        # o: .\make.ps1 help

# Iniciar entorno de desarrollo local (Docker Compose con live-reload)
make dev         # o: .\make.ps1 dev

# Ejecutar linters (Ruff + TypeScript typecheck)
make lint        # o: .\make.ps1 lint

# Ejecutar suite de tests (Pytest + Build frontend)
make test        # o: .\make.ps1 test

# Compilar artefactos de producción (SPA + Docker images)
make build       # o: .\make.ps1 build

# Levantar entorno Docker en segundo plano (daemon)
make docker-dev  # o: .\make.ps1 docker-dev

# Detener todos los contenedores Docker
make docker-down # o: .\make.ps1 docker-down

# Limpiar cachés (__pycache__, .pytest_cache, dist)
make clean       # o: .\make.ps1 clean
```

---

## 4. Inicio Rápido (Quickstart)

### Requisitos Previos
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose **o**
- Python 3.11+ y Node.js 20+ con `pnpm`

### Configuración de Variables de Entorno
Copia la plantilla y ajusta los valores necesarios:
```bash
cp .env.example .env
```
*(Nota: Para desarrollo local inicial, la API de Binance Spot funciona en modo público sin requerir API keys).*

### Opción A: Ejecución con Docker Compose (Recomendada)
Para levantar el entorno completo de desarrollo con recarga en vivo:
```bash
make dev
# o directamente: docker compose -f docker-compose.dev.yml up --build
```
- **Web Cockpit:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Core & Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Healthcheck:** [http://localhost:8000/health](http://localhost:8000/health)
- **FastMCP Server:** [http://localhost:8001](http://localhost:8001)

### Opción B: Ejecución Local Nativa

#### Backend (Python)
```bash
cd backend
python -m venv .venv
# Activar entorno (Windows: .venv\Scripts\activate | Linux/macOS: source .venv/bin/activate)
pip install -r requirements-dev.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (Web Cockpit)
```bash
cd web
pnpm install
pnpm run dev
```

---

## 5. Calidad de Código y Testing

```bash
# Validar linter y tipos en todo el proyecto
make lint

# Ejecutar suite de pruebas y validar compilación
make test
```

---

## 5. Documentación de Referencia

- [Índice Maestro de Documentación](docs/README.md)
- [Tech Stack y Layout de Repositorio](docs/architecture/tech-stack-and-layout.md)
- [Contratos Canónicos de Datos](docs/architecture/data-contracts.md)
- [Despliegue en Hostinger VPS](docs/deployment/hostinger-vps.md)
- [Pipeline de CI/CD](docs/deployment/ci-cd-pipeline.md)
- [Playbooks Operativos de Trading](docs/product/trading-playbooks.md)
- [Roadmap del Proyecto](docs/planning/roadmap.md)
