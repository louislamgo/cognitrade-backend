/**
 * SEC EDGAR provider adapter.
 *
 * This is a STUB — it does not make live network requests.
 * Replace the method bodies with real SEC EDGAR API calls when ready.
 *
 * EDGAR is used for catalyst/news ingestion (earnings filings, 8-K events,
 * prospectus changes). It is NOT used for buy/sell recommendations.
 *
 * Public EDGAR endpoints require no API key.
 */
export interface EdgarFiling {
  accessionNumber: string;
  formType: string;
  filedAt: string;
  description: string | null;
  source: string;
  fetchedAt: string;
}

export class SecEdgarProvider {
  readonly name = 'sec-edgar';

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.SEC_EDGAR_BASE_URL ?? 'https://data.sec.gov';
  }

  /**
   * Fetch recent filings for a company by CIK (Central Index Key).
   *
   * @param cik - SEC Central Index Key, zero-padded to 10 digits (e.g. "0000320193" for Apple)
   * @param limit - Maximum number of filings to return
   * TODO: Replace with real SEC EDGAR submissions endpoint.
   */
  async getRecentFilings(cik: string, limit = 10): Promise<EdgarFiling[]> {
    // STUB — returns empty array
    console.log(`[sec-edgar] getRecentFilings called for CIK ${cik}, limit ${limit} (stub)`);
    return [];
  }

  /**
   * Fetch 8-K catalyst events for a company.
   *
   * @param cik - SEC CIK
   * TODO: Replace with real filtered EDGAR submissions call.
   */
  async getCatalysts(cik: string): Promise<EdgarFiling[]> {
    return this.getRecentFilings(cik);
  }
}
