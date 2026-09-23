# Pipeline de CI/CD con GitHub Actions

- **Control de Versiones:** GitHub
- **Runners:** GitHub Actions (Free Tier)
- **Destino:** Hostinger VPS (Despliegue automatizado por SSH)

---

## 1. Flujo de Trabajo (Workflow Overview)

El pipeline de CI/CD garantiza que solo código validado y probado llegue al VPS en producción:

```text
[git push main]
       │
       ▼
┌──────────────────────────────────────────────┐
│ GitHub Actions Job 1: LINT & TEST            │
│ - Python: Ruff / MyPy type checking          │
│ - Pytest: Tests unitarios del Spot Math Engine│
│ - Web: Build y verificación de tipos (Vite)  │
└──────────────────────┬───────────────────────┘
                       │ (Solo si pasa con éxito)
                       ▼
┌──────────────────────────────────────────────┐
│ GitHub Actions Job 2: BUILD & PUSH DOCKER    │
│ - Construye imagen Backend (FastAPI + MCP)   │
│ - Construye imagen Web Cockpit (SPA)         │
│ - Publica en GitHub Packages (GHCR)          │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ GitHub Actions Job 3: DEPLOY TO HOSTINGER    │
│ - Conexión vía SSH seguro al VPS             │
│ - docker compose pull && docker compose up -d│
│ - Notificación de deploy exitoso a Telegram  │
└──────────────────────────────────────────────┘
```

---

## 2. Definición del Workflow (`.github/workflows/deploy.yml`)

```yaml
name: CI/CD Pipeline - Crypto Multi-Tool

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest ruff mypy
      - name: Run Linters & Tests
        run: |
          ruff check .
          pytest tests/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: SSH Deploy to Hostinger VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          script: |
            cd /opt/crypto-multi-tool
            git pull origin main
            docker compose pull
            docker compose up -d --remove-orphans
```
