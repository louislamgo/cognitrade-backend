import { TickerBriefRequest, TickerBriefResponse, MarketDataProvider } from '../../types';
import { generateCompletion } from '../ai/openai';
import { AlpacaProvider } from '../../providers/alpaca';
import { cacheGet, cacheSet } from '../../lib/cache';

const BRIEF_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const DISCLAIMER = [
  'This brief is for decision support only and does not constitute personalised financial advice.',
  'Market data may be delayed. Always verify with your broker before acting on any information.',
  'Past performance is not indicative of future results.',
];

/**
 * Ticker Intelligence Brief orchestration service.
 *
 * Orchestrates:
 *  1. Market quote retrieval from a provider adapter
 *  2. AI-generated summary via OpenAI
 *  3. Response assembly with source, freshness, and disclaimers
 *
 * Caching: results are cached per symbol for BRIEF_CACHE_TTL_MS to avoid
 * redundant OpenAI calls and provider rate-limit pressure.
 *
 * Safety: The AI prompt and system rules prevent buy/sell recommendations.
 */
export async function generateTickerBrief(
  request: TickerBriefRequest,
  provider: MarketDataProvider = new AlpacaProvider(),
): Promise<TickerBriefResponse> {
  const symbol = request.symbol.toUpperCase();
  const cacheKey = `brief:${symbol}`;

  const cached = cacheGet<TickerBriefResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  // 1. Fetch quote
  const quote = await provider.getQuote(symbol);

  // 2. Build AI prompt
  const quoteInfo = quote.price
    ? `Current price: $${quote.price.toFixed(2)}, change: ${quote.changePercent?.toFixed(2) ?? 'N/A'}%`
    : 'Price data is currently unavailable or stale.';

  const dataNote = quote.isDelayed
    ? 'Note: the price data provided may be delayed by 15 minutes or more.'
    : 'Price data is real-time.';

  const userPrompt =
    `Provide a brief market intelligence summary for ${symbol}.\n` +
    `${quoteInfo}\n` +
    `${dataNote}\n` +
    (request.context ? `Additional context: ${request.context}\n` : '') +
    `Keep the summary under 150 words. Focus on observable market structure, not speculation.`;

  // 3. Generate AI summary
  const aiResult = await generateCompletion({ userPrompt });

  // 4. Assemble response
  const response: TickerBriefResponse = {
    symbol,
    generatedAt: new Date().toISOString(),
    dataSource: quote.source,
    isDataDelayed: quote.isDelayed,
    summary: aiResult.content,
    technicalSnapshot: {
      currentPrice: quote.price || null,
      priceChangePercent: quote.changePercent,
      note: quote.isDelayed ? 'Data may be delayed ≥15 min.' : 'Real-time data.',
    },
    disclaimers: DISCLAIMER,
  };

  cacheSet(cacheKey, response, BRIEF_CACHE_TTL_MS);

  return response;
}
