// Contratos Canónicos TypeScript para Web Cockpit (crypto-multi-tool)

export type OpportunityStatus =
  | "DISCOVERY"
  | "WATCH"
  | "READY"
  | "TRIGGERED"
  | "INVALIDATED"
  | "EXPIRED";

export type RiskLevel = "BAJO" | "MEDIO" | "ALTO";

export interface MarketCandle {
  timestamp: number; // Epoch unix en ms (UTC)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  tradesCount?: number;
  isClosed?: boolean;
}

export interface TradeParameters {
  entryZoneMin: number;
  entryZoneMax: number;
  invalidationPrice: number;
  invalidationPct: number;
  tp1Price: number;
  tp1Pct: number;
  tp2Price: number;
  tp2Pct: number;
  riskRewardTp1: number;
  riskRewardTp2: number;
}

export interface MarketSnapshot {
  ticker: string;
  exchange: string;
  currentPrice: number;
  change24hPct: number;
  volume24hQuote: number;
  spreadPct: number;
  rvol1h: number;
  atr1h: number;
  nearestSupport: number;
  distanceToSupportPct: number;
  recentDropPct: number;
}

export interface OpportunitySignal {
  signalId: string;
  ticker: string;
  exchange: string;
  toolOrigin: string;
  status: OpportunityStatus;
  timestampUtc: string;
  score: number;
  marketSnapshot: MarketSnapshot;
  tradeParameters: TradeParameters;
  riskLevel: RiskLevel;
  causalDiagnosis: string[];
  annotatedChartPath?: string;
  heatmapPath?: string;
}
