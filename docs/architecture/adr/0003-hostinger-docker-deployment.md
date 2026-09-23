# ADR 0003: Despliegue en Hostinger VPS con Docker y GitHub Actions

- **Estado:** Aceptado
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

El radar debe operar 24/7 sin depender de que las computadoras personales de los operadores estén encendidas. Además, el flujo de desarrollo debe permitir iterar el código en GitHub y desplegarlo en producción con cero fricción y de forma automatizada, minimizando los costos operativos de infraestructura.

---

## 2. Decisión

Se adopta como infraestructura productiva un **VPS en Hostinger (Linux Ubuntu LTS)**, orquestado mediante **Docker Compose**, y un pipeline de CI/CD sustentado en **GitHub Actions**:
1. **Contenerización:** El backend (daemon de escaneo + API FastAPI + MCP Server) y el frontend (Nginx sirviendo la SPA de Web Cockpit) se ejecutan como servicios aislados en contenedores Docker.
2. **Automatización:** Cada `git push` a la rama `main` dispara un workflow en GitHub Actions que ejecuta pruebas unitarias y sincroniza el despliegue hacia Hostinger vía SSH seguro.
3. **Persistencia Ligera:** Los logs de descarte y el histórico reciente se guardan en volúmenes montados localmente en el VPS (archivos JSONL / DuckDB).

---

## 3. Consecuencias

### Positivas
- Alta disponibilidad: El sistema vigila el mercado ininterrumpidamente.
- Costos fijos predecibles y muy bajos utilizando el VPS contratado en Hostinger.
- Reproducibilidad del entorno tanto en local como en producción mediante Docker.

### Negativas
- Requiere mantenimiento básico de seguridad del servidor Linux (firewall UFW, fail2ban, certificados SSL con Let's Encrypt).
