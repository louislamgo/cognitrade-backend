import { Request, Response, NextFunction } from 'express';
import { generateTickerBrief } from '../services/briefs/tickerBriefService';
import { AppError } from '../middleware/errorHandler';

const SYMBOL_REGEX = /^[A-Z]{1,5}$/;

/**
 * GET /api/briefs/:symbol
 *
 * Generates (or returns a cached) Ticker Intelligence Brief.
 *
 * Safety: The underlying service enforces that AI output is decision support
 * only — no buy/sell recommendations are generated.
 */
export async function getTickerBrief(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const symbol = (req.params.symbol ?? '').toUpperCase();

    if (!SYMBOL_REGEX.test(symbol)) {
      throw new AppError(400, 'INVALID_SYMBOL', `"${symbol}" is not a valid ticker symbol.`);
    }

    const context = typeof req.query.context === 'string' ? req.query.context : undefined;

    const brief = await generateTickerBrief({ symbol, context });

    res.status(200).json(brief);
  } catch (err) {
    next(err);
  }
}
