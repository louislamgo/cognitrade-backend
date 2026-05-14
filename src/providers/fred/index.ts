/**
 * FRED (Federal Reserve Economic Data) provider adapter.
 *
 * This is a STUB — it does not make live network requests.
 * Replace the method bodies with real FRED API calls when ready.
 *
 * FRED data is used as macro-economic context for briefs (e.g., interest rates,
 * CPI, unemployment). It is NOT used for buy/sell recommendations.
 */
export interface FredObservation {
  date: string;
  value: number | null;
  source: string;
  fetchedAt: string;
}

export class FredProvider {
  readonly name = 'fred';

  private readonly baseUrl = 'https://api.stlouisfed.org/fred';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.FRED_API_KEY ?? '';

    if (!this.apiKey) {
      console.warn('[fred] FRED_API_KEY is not set. Provider will return stub data.');
    }
  }

  /**
   * Fetch the most recent observation for a FRED series.
   *
   * @param seriesId - FRED series ID (e.g. "FEDFUNDS", "CPIAUCSL")
   * TODO: Replace with real FRED API call.
   */
  async getLatestObservation(seriesId: string): Promise<FredObservation> {
    // STUB — returns placeholder data
    console.log(`[fred] getLatestObservation called for ${seriesId} (stub)`);
    return {
      date: new Date().toISOString().slice(0, 10),
      value: null,
      source: this.name,
      fetchedAt: new Date().toISOString(),
    };
  }
}
