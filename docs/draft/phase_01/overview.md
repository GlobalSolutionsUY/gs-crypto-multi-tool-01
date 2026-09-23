### 1. Idea central

Queremos construir un **agente de trading modular y multiplataforma** que funcione inicialmente como **copiloto/radar**, NO como bot que opere dinero automáticamente.

Su trabajo sería:

**buscar mercado → detectar oportunidades → filtrar basura/riesgo → analizar → rankear → alertar → Ger/Freya toman la decisión.**

La filosofía es importante:

> **El agente no tiene que encontrar una operación porque sí. Tiene que poder decir “ahora no hay una oportunidad suficientemente buena”.**

Y arquitectónicamente:

> **Binance debe ser el primer conector, no el dueño del sistema.**

Es decir, separar **fuentes de datos / motor de análisis / alertas / ejecución**, para poder conectar después Bitunix, Bitget, Trading Different, fuentes on-chain, etc.

---

## 2. Los módulos que queremos a futuro

**① Spot Opportunity Radar — prioridad alta**

Escanear criptos líquidas buscando movimientos tácticos de aproximadamente **+3% a +10% en pocos días**, no simplemente monedas que estén subiendo.

Variables posibles:

precio + volumen + aceleración de volumen + estructura + volatilidad + soportes/resistencias + momentum + distancia a zonas relevantes.

Aquí entra nuestro playbook tipo **ZEC/ALLO**:

**caída fuerte → estructura mayor intacta → agotamiento/rechazo → primeras señales de recuperación → posible entrada Spot temprana.**

La gracia es encontrarla **antes de que el rebote ya haya hecho +5%**, no perseguirla después.

---

**② Liquidity / Futures Radar**

Buscar zonas de liquidez y posibles:

**clusters → barridas → rechazo/aceptación → estructura → volumen.**

No interpretar una zona de liquidaciones como “el precio va obligatoriamente ahí”.

Idealmente en el futuro integrar datos tipo Trading Different/API y combinarlos con estructura de mercado.

Salida posible:

**BTC — liquidez superior 78.2K — precio aproximándose — todavía sin confirmación — WAIT.**

---

**③ Meme Radar**

Buscar memecoins con movimiento temprano, pero aplicar filtros agresivos:

liquidez, volumen, aceleración, holders, concentración de wallets, smart wallets, contratos sospechosos, honeypot/rug indicators, etc.

La función no sería “buscar la meme que va a explotar”, sino:

**detectar movimiento temprano + eliminar gran parte de la basura peligrosa.**

---

**④ New Listings / Early Projects**

Monitorizar:

Binance announcements, Launchpool/Alpha/listings, nuevos tokens, DEX activity y catalizadores.

Después puntuar/filtrar según liquidez, tokenomics, volumen, wallets, unlocks, concentración, narrativa/catalizador, etc.

No comprar automáticamente un listing.

---

**⑤ On-chain / Whale Radar**

Más adelante:

whale movements, entradas/salidas de exchanges, wallets relevantes, clusters, DEX liquidity/volume y actividad anormal de red.

Ejemplo:

**“SOL: fuerte salida neta de exchanges + incremento de volumen + estructura favorable.”**

Eso sería una pieza de evidencia, no una orden de compra.

---

**⑥ Risk Filter — fundamental**

Todos los módulos deberían terminar pasando por un filtro común.

El agente debería poder clasificar algo como:

**Oportunidad alta / media / baja**
**Riesgo alto / medio / bajo**

y explicar **por qué**.

Más adelante podríamos sofisticar el scoring, pero evitar una “IA mágica” que entregue un número sin explicación.

---

## 3. Cómo debería verse una alerta

Nada de párrafos eternos.

Ejemplo:

> **ALLO — SPOT RADAR**
>
> Precio: 0.209
> Setup: rebote táctico
> Zona entrada: 0.208–0.210
> Objetivo: +5% ≈ 0.2195
> Invalidación: pérdida de estructura
> Volumen: aumentando
> Riesgo: Medio
> Estado: **WATCH**
>
> Motivo: caída fuerte + defensa de soporte + recuperación de estructura + volumen mejorando.

Estados sencillos:

**WATCH → READY → INVALIDATED**

Y siempre **timestamp + fuente de datos**.

---

# 🥩 4. MVP PARA LAS 3 HORAS DEL EVENTO

Acá está lo importante para Andrés.

**NO intentar construir todo lo anterior.**

En tres horas yo haría una versión pequeña pero funcional del **Spot Opportunity Radar**, porque es inmediatamente útil para nuestra operativa y demuestra perfectamente el concepto del agente.

### Flujo MVP

**Binance API (solo lectura)**
↓
Seleccionar universo líquido, por ejemplo top 30–50 pares USDT
↓
Obtener OHLCV / volumen
↓
Calcular indicadores/estructura básicos
↓
Detectar candidatos
↓
Risk Filter
↓
Ranking
↓
Generar alerta
↓
Telegram o dashboard sencillo.

Una lógica inicial podría buscar:

**caída reciente significativa + soporte/rechazo + recuperación de corto plazo + aumento relativo de volumen + suficiente volatilidad para un movimiento +3/+5%.**

No necesitamos IA sofisticada en V1. Un **motor determinístico bien construido** es muchísimo más útil que meter un LLM por decoración.

El LLM, si hay tiempo, puede tomar los datos estructurados y convertirlos en una explicación humana corta.

---

## 5. Arquitectura que me gustaría que Andrés preserve

Algo conceptualmente así:

```text
              DATA SOURCES
                   │
        ┌──────────┼──────────┐
        │          │          │
     Binance    On-chain   Liquidity
        │
        ▼
     NORMALIZER
        │
        ▼
   MARKET DATABASE
        │
        ▼
  ┌─────────────────────┐
  │   ANALYSIS ENGINE   │
  ├─────────────────────┤
  │ Spot Radar          │
  │ Meme Radar          │
  │ Listings Radar      │
  │ Liquidity Radar     │
  │ On-chain Radar      │
  └─────────────────────┘
        │
        ▼
     RISK FILTER
        │
        ▼
 OPPORTUNITY SCORING
        │
        ▼
 COPILOT / EXPLANATION
        │
        ▼
 Telegram / Dashboard
        │
        ▼
      GER + FREYA
```

Y **Execution Engine separado**.

Eso es clave.

Si algún día queremos que pueda operar:

```text
Approved opportunity
        ↓
Execution Engine
        ↓
Binance / Bitunix / Bitget
```

Pero **NO forma parte del MVP**.

---

# 6. Qué NO construir en el evento

No perder las tres horas intentando hacer:

un bot autónomo, predicción de precios con IA, HFT, machine learning entrenado desde cero, integración simultánea con cinco exchanges, análisis on-chain completo, mapas de liquidaciones propios o ejecución con dinero real.

Eso nos puede dejar con **20 cosas a medias y ninguna funcionando** 😂.

Preferiría salir del evento con esto:

> **“Nuestro agente escaneó 50 criptomonedas, descartó 43, encontró 7 candidatas, clasificó 2 como interesantes y explicó por qué.”**

Eso ya sería una **V0 real de nuestro copiloto**.

---

## 🎯 Objetivo final

Lo que Ger y yo venimos buscando no es un bot que diga:

**“COMPRA ZEC.”**

Queremos algo mucho más útil:

**“Encontré estas 3 anomalías entre cientos de activos. Esta cumple nuestro playbook Spot; esta otra tiene liquidez interesante para Futures; esta meme tiene volumen pero falla el filtro de riesgo. Mirá estas dos primero.”**

Entonces nosotros hacemos la lectura final de **estructura + volumen + liquidez + contexto + riesgo**.

Ese es el producto.

**El agente encuentra la aguja. Nosotros decidimos si vale la pena pincharse con ella.** 😂🧝🏻‍♀️🦾📊

Y Andrés: para las tres horas, yo empezaría por **Binance read-only → scanner OHLCV → scoring → Spot Radar → salida Telegram/dashboard**. Todo lo demás debería quedar diseñado como módulos enchufables, no implementado todavía.