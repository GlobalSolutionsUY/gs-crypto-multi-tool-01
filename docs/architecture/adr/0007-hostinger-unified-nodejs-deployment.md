# ADR 0007: Despliegue Unificado Frontend + Backend en Único Website Node.js en Hostinger

- **Estado:** Aceptado (Reemplaza y adapta ADR 0003 al plan de hosting actual)
- **Fecha:** 2026-09-23
- **Decisores:** Germán & Andrés

---

## 1. Contexto y Problema

El plan de hosting actual en Hostinger está optimizado para entornos de ejecución gestionados de **Node.js** y **sitios web estáticos**, sin soporte nativo para demonios persistentes en Python (FastAPI/Uvicorn) ni orquestación de Docker con acceso root a nivel VPS.

Adicionalmente, el plan impone la siguiente directiva técnica de ejecución:
- Si el backend utiliza Python o se requieren procesos completamente separados, se necesitan múltiples websites independientes.
- Sin embargo, en un entorno Node.js, **no es necesario mantener dos websites independientes** ni gestionar múltiples procesos desacoplados si:
  1. El frontend se compila a activos estáticos (`dist` o `build`).
  2. El backend Node.js sirve esos archivos estáticos y además expone la API REST / SSE.
  3. Todo el sistema se inicia y orquesta con un único comando ejecutor (por ejemplo `npm start`).

---

## 2. Decisión

Se adopta una **Arquitectura de Despliegue Unificado en un Único Website Node.js**:

1. **Portabilidad Fullstack a Node.js / TypeScript:**
   - El backend se implementa en **Node.js (TypeScript)**, unificando todo el repositorio bajo el runtime de Node 20+ y el gestor de paquetes `pnpm`.
   - Se elimina la necesidad de Python en el entorno de producción de Hostinger.

2. **Compilación y Servido Estático Centralizado:**
   - El frontend SPA ([web/](file:///e:/projects/gsolut/mvp-crypto-multi-tool/web)) se compila mediante Vite generando el bundle estático en `dist/`.
   - El servidor backend de Node.js actúa como servidor de API y como servidor de archivos estáticos para la SPA compilada.

3. **Estrategia de Enrutamiento en el Servidor Único:**
   - **Rutas de API:** Prefijadas bajo `/api/*` y endpoints de salud como `/health`, procesadas directamente por los handlers del backend.
   - **Rutas de Activos Estáticos:** Servidos directamente desde `dist/` (`/assets/*`, `favicon.ico`, etc.) con headers de caché optimizados.
   - **Fallback SPA (Wildcard `*`):** Cualquier solicitud que no coincida con un archivo estático ni con un endpoint `/api/*` devuelve el `index.html` compilado, garantizando el funcionamiento transparente del enrutamiento del lado del cliente sin errores 404.

4. **Entrypoint Único (`server.js` / `npm start`):**
   - El despliegue en Hostinger se orquesta con un único comando de inicio (`npm start`), ejecutando el servidor principal (`server.js` o `dist/backend/server.js`) configurado en el panel de aplicaciones Node.js de Hostinger.

```text
mvp-crypto-multi-tool/
├── web/          # Frontend SPA (TypeScript + Vite)
├── backend/      # Backend API y Motor de Radar (TypeScript)
├── dist/         # Frontend compilado listo para producción
├── package.json  # Orquestador raíz (scripts de build y start)
└── server.js     # Entrypoint único para el runtime de Hostinger
```

---

## 3. Consecuencias

### Positivas
- **100% Compatible con el Plan de Hostinger:** Opera dentro de los límites y capacidades del plan de hosting contratado sin requerir costosas migraciones a infraestructura VPS no contemplada.
- **Eliminación Total de Problemas de CORS:** Al servirse el frontend y la API desde el mismo origen (`https://dominio.com` y `https://dominio.com/api`), se eliminan restricciones de Cross-Origin Resource Sharing y overhead de pre-flight requests (`OPTIONS`).
- **Unificación de Stack (Ponytail):** Un único lenguaje (TypeScript), un solo ecosistema de dependencias (`pnpm`), y un solo pipeline de CI/CD en GitHub Actions.
- **Monoproceso de Alta Eficiencia:** Un solo proceso Node.js supervisado por el gestor de aplicaciones de Hostinger (Passenger / Node Runner).

### Negativas / Compensaciones
- La compilación del frontend (`web`) debe realizarse previamente o durante el paso de build antes de empaquetar la aplicación para Hostinger.
- Requiere asegurar que el middleware de estáticos del backend maneje adecuadamente los encabezados de compresión y caché.
