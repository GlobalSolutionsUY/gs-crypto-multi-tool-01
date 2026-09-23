# Contratos de Datos y Modelos Canónicos: crypto-multi-tool

- **Documento:** Especificación de Interfaces y Esquemas de Datos
- **Módulos:** Ingestión, Motor Matemático, MCP Server y Web Client

---

## 1. Modelos de Dominio de Mercado

### 1.1 Modelo `Candle` (Vela OHLCV Canónica)
```python
from pydantic import BaseModel, Field
from datetime import datetime

class Candle(BaseModel):
    timestamp: datetime = Field(..., description="Timestamp UTC de apertura de la vela")
    open: float = Field(..., gt=0, description="Precio de apertura")
    high: float = Field(..., gt=0, description="Precio maximo alcanzado")
    low: float = Field(..., gt=0, description="Precio minimo alcanzado")
    close: float = Field(..., gt=0, description="Precio de cierre")
    volume: float = Field(..., ge=0, description="Volumen base transaccionado")
    quote_volume: float = Field(..., ge=0, description="Volumen en moneda cotizada (USDT)")
    trades_count: int = Field(default=0, ge=0, description="Numero de transacciones en la vela")
    is_closed: bool = Field(default=True, description="Indica si la vela esta consolidada o en formacion")
```

### 1.2 Modelo `MarketSnapshot` (Foto de Mercado por Par)
```python
from typing import List, Optional

class MarketSnapshot(BaseModel):
    ticker: str = Field(..., example="ALLOUSDT")
    exchange: str = Field(default="BINANCE")
    current_price: float = Field(..., gt=0)
    change_24h_pct: float
    volume_24h_quote: float = Field(..., description="Volumen diario en USDT")
    spread_pct: float = Field(..., description="Spread bid/ask porcentual")
    rvol_1h: float = Field(..., description="Relative Volume respecto a media 20 periodos")
    atr_1h: float = Field(..., description="Average True Range")
    nearest_support: float = Field(..., gt=0)
    distance_to_support_pct: float
    recent_drop_pct: float = Field(..., description="Contraccion porcentual desde maximo reciente")
    recent_candles: List[Candle] = Field(default_factory=list)
```

---

## 2. Modelos de Oportunidad y Alerta

### 2.1 Modelo `OpportunitySignal` (Ficha Táctica Completa)
```python
from enum import Enum

class OpportunityStatus(str, Enum):
    DISCOVERY = "DISCOVERY"
    WATCH = "WATCH"
    READY = "READY"
    TRIGGERED = "TRIGGERED"
    INVALIDATED = "INVALIDATED"
    EXPIRED = "EXPIRED"

class RiskLevel(str, Enum):
    BAJO = "BAJO"
    MEDIO = "MEDIO"
    ALTO = "ALTO"

class TradeParameters(BaseModel):
    entry_zone_min: float
    entry_zone_max: float
    invalidation_price: float
    invalidation_pct: float
    tp1_price: float
    tp1_pct: float
    tp2_price: float
    tp2_pct: float
    risk_reward_tp1: float
    risk_reward_tp2: float

class OpportunitySignal(BaseModel):
    signal_id: str
    ticker: str
    exchange: str
    tool_origin: str = "SPOT_OPPORTUNITY_RADAR"
    status: OpportunityStatus
    timestamp_utc: datetime
    score: int = Field(..., ge=0, le=100)
    market_snapshot: MarketSnapshot
    trade_parameters: TradeParameters
    risk_level: RiskLevel
    causal_diagnosis: List[str]
    annotated_chart_path: Optional[str] = None
    heatmap_path: Optional[str] = None
```

---

## 3. Modelo de Mapas de Calor de Liquidez

### 3.1 Modelo `LiquidityCluster` y `HeatmapPayload`
```python
class LiquidityCluster(BaseModel):
    price_level: float
    accumulated_volume: float
    distance_from_price_pct: float
    side: str = Field(..., regex="^(BID|ASK)$")

class HeatmapPayload(BaseModel):
    ticker: str
    timestamp_utc: datetime
    price_current: float
    clusters: List[LiquidityCluster]
    image_png_url: str
```
