# Guía de Infraestructura y Despliegue en Hostinger VPS

- **Plataforma:** Hostinger VPS (Ubuntu 22.04 / 24.04 LTS)
- **Gestor de Contenedores:** Docker & Docker Compose
- **Web Server & Reverse Proxy:** Nginx con SSL Let's Encrypt
- **Destinatarios:** Germán & Andrés (gsolut)

---

## 1. Arquitectura de Despliegue en el VPS

El servidor en Hostinger aloja la solución completa contenerizada para ejecución 24/7 ininterrumpida:

```text
Hostinger VPS (Ubuntu Linux)
├── [Nginx Reverse Proxy] (Puertos 80/443 SSL Let's Encrypt)
│   ├── /api/*           ──> Backend FastAPI Container (Puerto 8000)
│   │                         ├── Engine Daemon (Market Scanner Loop)
│   │                         ├── FastMCP Server (/mcp)
│   │                         └── Visual Rendering Service
│   └── /* (Estáticos)   ──> Nginx Web Cockpit SPA Container (Puerto 80)
└── Volúmenes Persistentes (Local Storage)
    ├── /var/crypto-tool/logs/       (Auditoría JSONL)
    └── /var/crypto-tool/artifacts/  (PNGs de gráficos y heatmaps)
```

---

## 2. Configuración de `docker-compose.yml`

```yaml
version: "3.8"

services:
  backend:
    image: ghcr.io/gsolut/crypto-multi-tool-backend:latest
    container_name: cmt-backend
    restart: always
    environment:
      - ENVIRONMENT=production
      - BINANCE_API_KEY=${BINANCE_API_KEY}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
      - MCP_SERVER_PORT=8001
    volumes:
      - /var/crypto-tool/logs:/app/logs
      - /var/crypto-tool/artifacts:/app/artifacts
    ports:
      - "127.0.0.1:8000:8000"
      - "127.0.0.1:8001:8001"

  web-cockpit:
    image: ghcr.io/gsolut/crypto-multi-tool-web:latest
    container_name: cmt-web
    restart: always
    ports:
      - "127.0.0.1:3000:80"
    depends_on:
      - backend
```

---

## 3. Seguridad y Endurecimiento del Servidor

1. **Firewall UFW:**
   - Habilitar únicamente SSH (puerto personalizado recomendado), HTTP (80) y HTTPS (443).
   - Bloquear acceso externo directo a los puertos internos (8000, 8001, 3000).
2. **Fail2ban:**
   - Activo para mitigar ataques de fuerza bruta en SSH.
3. **Credenciales:**
   - Las claves de API de exchanges deben configurarse con **permisos exclusivos de lectura** (sin permisos de trading, retiros o transferencias).
