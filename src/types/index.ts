/**
 * Shared TypeScript types for CogniTrade backend.
 *
 * Safety notice: CogniTrade provides decision support only, not personalised
 * financial advice. No output should be construed as a buy/sell recommendation.
 */

// ---------------------------------------------------------------------------
// Market data
// ---------------------------------------------------------------------------

export interface MarketQuote {
  symbol: string;
  price: number;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  change: number | null;
  changePercent: number | null;
  /** ISO-8601 timestamp of when this data was fetched from the source */
  fetchedAt: string;
  /** Source provider name, e.g. "alpaca", "tradier" */
  source: string;
  /** True when the price is delayed (typically ≥ 15 min) */
  isDelayed: boolean;
}

export interface OHLCVBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ---------------------------------------------------------------------------
// Provider adapter
// ---------------------------------------------------------------------------

export interface MarketDataProvider {
  name: string;
  getQuote(symbol: string): Promise<MarketQuote>;
  getBars(symbol: string, timeframe: string, limit: number): Promise<OHLCVBar[]>;
}

// ---------------------------------------------------------------------------
// Ticker Intelligence Brief
// ---------------------------------------------------------------------------

export interface TickerBriefRequest {
  symbol: string;
  /** Optional extra context to pass to the AI */
  context?: string;
}

export interface TickerBriefResponse {
  symbol: string;
  generatedAt: string;
  dataSource: string;
  isDataDelayed: boolean;
  /**
   * AI-generated summary. Always treated as decision support only —
   * never a personalised buy/sell/guaranteed recommendation.
   */
  summary: string;
  technicalSnapshot: TechnicalSnapshot;
  disclaimers: string[];
}

export interface TechnicalSnapshot {
  currentPrice: number | null;
  priceChangePercent: number | null;
  note: string;
}

// ---------------------------------------------------------------------------
// Error shapes
// ---------------------------------------------------------------------------

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export interface HealthResponse {
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
  uptime: number;
}
