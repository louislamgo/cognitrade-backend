import { MarketDataProvider, MarketQuote, OHLCVBar } from '../../types';

/**
 * Alpaca Markets provider adapter.
 *
 * This is a STUB — it does not make live network requests.
 * Replace the method bodies with real Alpaca API calls when ready.
 *
 * Safety: No order execution logic is implemented here.
 * Alpaca's paper-trading base URL is used by default.
 */
export class AlpacaProvider implements MarketDataProvider {
  readonly name = 'alpaca';

  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor() {
    this.baseUrl = process.env.ALPACA_BASE_URL ?? 'https://paper-api.alpaca.markets';
    this.apiKey = process.env.ALPACA_API_KEY ?? '';
    this.apiSecret = process.env.ALPACA_API_SECRET ?? '';

    if (!this.apiKey || !this.apiSecret) {
      console.warn('[alpaca] ALPACA_API_KEY or ALPACA_API_SECRET is not set. Provider will return stub data.');
    }
  }

  /**
   * Fetch the latest quote for a symbol.
   * TODO: Replace with real Alpaca Data API v2 call.
   */
  async getQuote(symbol: string): Promise<MarketQuote> {
    // STUB — returns placeholder data
    return {
      symbol: symbol.toUpperCase(),
      price: 0,
      open: null,
      high: null,
      low: null,
      volume: null,
      change: null,
      changePercent: null,
      fetchedAt: new Date().toISOString(),
      source: this.name,
      isDelayed: true,
    };
  }

  /**
   * Fetch OHLCV bars for a symbol.
   * TODO: Replace with real Alpaca Data API v2 bars endpoint.
   */
  async getBars(symbol: string, _timeframe: string, _limit: number): Promise<OHLCVBar[]> {
    // STUB — returns empty array
    console.log(`[alpaca] getBars called for ${symbol} (stub)`);
    return [];
  }
}
