import { MarketDataProvider, MarketQuote, OHLCVBar } from '../../types';

/**
 * Tradier provider adapter.
 *
 * This is a STUB — it does not make live network requests.
 * Replace the method bodies with real Tradier API calls when ready.
 *
 * Safety: No order execution logic is implemented here.
 * Tradier's sandbox base URL is used by default.
 */
export class TradierProvider implements MarketDataProvider {
  readonly name = 'tradier';

  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.TRADIER_BASE_URL ?? 'https://sandbox.tradier.com/v1';
    this.apiKey = process.env.TRADIER_API_KEY ?? '';

    if (!this.apiKey) {
      console.warn('[tradier] TRADIER_API_KEY is not set. Provider will return stub data.');
    }
  }

  /**
   * Fetch the latest quote for a symbol.
   * TODO: Replace with real Tradier /markets/quotes call.
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
   * TODO: Replace with real Tradier /markets/history call.
   */
  async getBars(symbol: string, _timeframe: string, _limit: number): Promise<OHLCVBar[]> {
    // STUB — returns empty array
    console.log(`[tradier] getBars called for ${symbol} (stub)`);
    return [];
  }
}
