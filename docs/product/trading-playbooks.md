# Playbooks y Estrategias Operativas de Trading

- **Organización:** [GlobalSolutionsUY](https://github.com/GlobalSolutionsUY)
- **Repositorio:** [gs-crypto-multi-tool-01](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)
- **Stakeholders / Operadores:** Ger & Freya
- **Estado:** Formalizado y Aprobado para V1
- **Última Actualización:** 2026-09-23

---

## 1. Introducción y Propósito

Este documento describe la mecánica cuantitativa y discrecional de los patrones de trading evaluados por el motor de análisis. Define formalmente qué constituye un setup válido, sus condiciones de entrada, objetivos, criterios de invalidación y el ciclo de vida de cada señal.

---

## 2. Playbook Principal: Spot Dip & Bounce (Táctico — Setup ZEC/ALLO)

Este es el patrón central implementado en la Fase 1 (MVP). Modela el comportamiento típico de activos líquidos que sufren ventas forzadas o tomas de ganancia transitorias (ej. setups históricos observados en **ZEC**, **ALLO**, etc.).

```text
       ESTRUCTURA VISUAL DEL PLAYBOOK (VELAS 1h / 4h)
       ───────────────────────────────────────────────
Precio
  ▲
  │     [Impulso previo / Estructura alcista mayor]
  │        ▲
  │       / \      (Fase 1: Caída o Corrección Fuerte)
  │      /   \
  │           \    -4% a -15% en ventana móvil (ej. 24h-48h)
  │            ▼
  │            ─────── [Fase 2: Soporte / Rechazo de Mínimos]
  │            │     ▲ (Mecha inferior / Exhaustion)
  │            │    /
  │            └───/── [Fase 3: RVOL > 1.25 + Recuperación Temprana]
  │               └───> [ALERTA DISPATCH: Estado READY / WATCH]
  │                     Objetivo 1: +3.5% a +5% ──┐
  │                     Objetivo 2: +8% a +10%  ──┤
  │                     Stop / Inval: < Mínimo  ──┴─────────────► Tiempo
```

### 2.1 Condiciones Secuenciales del Setup

1. **Fase 1: Contracción Pronunciada con Liquidez:**
   - La serie temporal (1h/4h) registra una caída relativa acumulada significativa (entre $-4\%$ y $-15\%$) dentro de una ventana de lookback predeterminada ($N=24$ a $48$ periodos).
   - Si la caída supera el $-25\%$ en menos de 24 horas, el filtro de riesgo la clasifica como evento anómalo de capitulación/noticia destructiva y la penaliza.
   - El volumen diario en el par USDT debe superar el umbral mínimo de corte ($> \$10,000,000$ USD).

2. **Fase 2: Testeo y Rechazo de Soporte (Exhaustion):**
   - El precio alcanza un nivel de soporte clave (mínimo de rango previo o media móvil de control) a menos de un $\pm 1.5\%$.
   - Se evidencia rechazo de precios inferiores mediante mechas de absorción ($\ge 35\%$ del rango total de la vela) o desaceleración en el tamaño del cuerpo de las velas bajistas.

3. **Fase 3: Giro de Impulso y Confirmación de Volumen:**
   - **Volumen Relativo (RVOL):** El volumen en la vela de giro o estabilización supera su promedio móvil ($RVOL_{1h} \ge 1.25$, idealmente $\ge 1.4$).
   - **Cierre de la vela:** Cierre en la mitad superior de su rango total.
   - **Distancia al Objetivo vs. Riesgo:** Relación Beneficio/Riesgo ($R/R$) teórica $\ge 1.8$ (óptimo $\ge 2.0$).

### 2.2 Parámetros Numéricos del Setup Spot

| Variable | Parámetro por Defecto | Justificación |
| :--- | :--- | :--- |
| **Timeframe Principal** | `1h` (confirmado con `4h`) | Suficiente agilidad táctica sin el ruido de 5m/15m. |
| **Contracción Previa** | $-4.0\%$ a $-15.0\%$ | Caída suficiente para agotar vendedores sin romper la estructura macro. |
| **Umbral RVOL** | $\ge 1.25$ | Garantiza absorción institucional temprana en el rebote. |
| **Objetivo 1 (TP1)** | $+3.5\%$ a $+5.0\%$ | Toma de ganancias parcial y reducción de riesgo a break-even. |
| **Objetivo 2 (TP2)** | $+8.0\%$ a $+10.0\%$ | Proyección hacia resistencia intermedia. |
| **Nivel de Invalidación (SL)** | Cierre $1h < \text{Mínimo de la mecha} - 0.3\%$ | Buffer del 0.3% para amortiguar cacerías de stops superficiales. |
| **Ratio R:R Mínimo** | $\ge 1.8$ hacia TP1 | Si es menor a 1.8, el setup se descarta automáticamente. |

---

## 3. Playbook Secundario: Liquidity Sweep & Reclaim (Futures Radar — Fase 2)

Monitorea la acumulación de liquidez en los extremos del mercado de derivados y la absorción de órdenes de liquidación.

```text
1. Identificación de Cluster ──> 2. Barrida Agresiva ──> 3. Reclaim Inmediato ──> 4. Alerta Condicional
(Pool de stop orders)           (Wick fuera del rango)   (Cierre dentro de rango)  (Long/Short con R:R óptimo)
```

- **Premisa:** Una zona de liquidaciones no es un imán pasivo. Si el precio la atraviesa con aceleración y cierra dentro del rango, se interpreta como trampa de liquidez (*false breakout*).
- **Salida esperada:** Determinación de estado condicional para evitar anticiparse sin confirmación:
  > `BTCUSDT — LIQUIDITY RADAR`  
  > `Zona: 78,200 USDT | Estado: APROXIMACIÓN (Sin absorción confirmada) -> WAIT`

---

## 4. Playbook de Protección: Meme Early Mover Filter (Fase 2)

Su objetivo no es pronosticar qué meme token se multiplicará por 100, sino **detectar volumen naciente y eliminar el 95% de estafas**:

- **Filtros Mandatorios de Exclusión:**
  - Concentración en top 10 wallets $> 25\%$ (excluyendo contratos de pools).
  - Liquidez de pool sin bloquear o sin quema verificada $\rightarrow$ **Descarte automático**.
  - Código con capacidad de modificar comisión de venta (*honeypot*) o emitir tokens sin tope $\rightarrow$ **Descarte automático**.
- **Disparador:** Incremento repentino de transacciones únicas ($+300\%$ en 30 min) con liquidez mínima en pool $> \$100,000$ USD.

---

## 5. Ciclo de Vida Formal de los Estados de Alerta

Todas las estrategias deben adherirse estrictamente a la máquina de estados:

```mermaid
stateDiagram-v2
    [*] --> SCANNING : Ingesta de velas
    SCANNING --> WATCH : Cumple contracción y soporte
    WATCH --> READY : Cumple confirmación RVOL + Giro
    WATCH --> INVALIDATED : Quiebre de soporte / Expiración
    READY --> EXECUTED : Operador toma acción externa
    READY --> INVALIDATED : Pérdida de estructura antes de entrar
    INVALIDATED --> [*]
```

- **`WATCH` (Monitoreo):** El activo cumplió con la caída previa y el testeo de soporte, pero aún no tiene volumen o confirmación de giro. El operador debe mantenerlo en la mira.
- **`READY` (Accionable):** Se confirmaron todas las variables del playbook (soporte + RVOL + ratio R:R). Parámetros de entrada, objetivo e invalidación completamente definidos.
- **`INVALIDATED` (Cancelado):** El precio perforó el nivel de invalidación o transcurrieron $N$ periodos sin que el rebote se materialice.
