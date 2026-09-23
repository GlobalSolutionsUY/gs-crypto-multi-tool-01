# Motor de Visualización y Mapas de Calor: HeatmapEngine

- **Componente:** Visual Rendering Engine & Heatmap Service
- **Rol:** Generación bajo demanda de artefactos visuales para el Agente (inspección multimodal) y el Web Cockpit (interfaz humana de Germán y Andrés).
- **Tecnología:** Python Headless (`matplotlib` / `datashader` / `Pillow`).

---

## 1. Justificación y Propósito Arquitectónico

Los modelos de lenguaje con visión (LLMs multimodales) procesan imágenes de forma holística: identifican en microsegundos patrones de acumulación, mechas de absorción y densidad de liquidez, pero fallan cuando se les pide medir distancias o calcular números exactos sobre un gráfico crudo.

Por su parte, los operadores humanos (Germán y Andrés) necesitan confirmar visualmente el contexto antes de ejecutar una operación.

El **HeatmapEngine** resuelve ambos problemas generando dos artefactos complementarios:
1. **Gráfico Táctico Anotado (`annotated_chart.png`):** Velas de acción del precio con las zonas de entrada sugerida, invalidación (SL) y objetivos marcados mediante áreas semitransparentes delimitadas.
2. **Mapa de Calor de Liquidez On-Demand (`liquidity_heatmap.png`):** Visualización térmica de la profundidad del libro de órdenes y clusters de órdenes pasivas alrededor del precio actual.

---

## 2. Pipeline de Generación Visual

```text
┌─────────────────────────────────────────────────────────────┐
│                 FUENTES DE DATOS LOCALES                    │
│   - Series OHLCV (Market Store)                             │
│   - Libro de órdenes L2/L3 o feeds de liquidaciones         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 MOTOR DE MATRICES TÉRMICAS                  │
│   - Discretización de precios en franjas (bins)             │
│   - Normalización de volumen por percentiles logarítmicos   │
│   - Mapeo de paleta de colores térmica (Navy -> Gold/Fire)  │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               GENERADOR HEADLESS (RENDER ENGINE)            │
│   - Renderizado en buffer de memoria (BytesIO)              │
│   - Guardado como imagen comprimida (PNG optimizado/WebP)   │
│   - Extracción paralela de clusters densos a JSON           │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [ URL / Archivo para Web ]           [ Base64 / Tool MCP ]
   Servido vía FastAPI para             Entregado al Agente en
   inspección en el Web Cockpit         el Paso 2 del SOP
```

---

## 3. Especificación del Mapa de Calor de Liquidez

### 3.1 Parámetros de la Matriz de Densidad
- **Rango Vertical ($Y$):** Precio delimitado entre $-5\%$ y $+10\%$ respecto al precio spot actual.
- **Rango Horizontal ($X$):** Ventana de tiempo reciente (últimas 24h a 4h discretizadas en intervalos de 5m o 15m).
- **Densidad de Color ($Z$):** Intensidad de volumen pasivo acumulado en órdenes limitadas:
  - Zonas frías (azul oscuro / violeta): Vacíos de liquidez (zonas donde el precio se desliza rápidamente).
  - Zonas calientes (amarillo / naranja / rojo intenso): Muros de compra/venta y zonas de concentración de stops/liquidaciones.

### 3.2 Interpretación por el Agente:
- **Barrida de Liquidez (*Liquidity Sweep*):** Si el precio perforó una zona amarilla densa y rebotó de inmediato dejando una mecha, el agente valida absorción pasiva.
- **Camino Despejado (*Clean Traffic*):** Si entre el precio de entrada y el objetivo (TP1) no hay franjas amarillas densas, el agente confirma que el camino al objetivo está libre de resistencia institucional.
