import { Router } from 'express';
import { getTickerBrief } from '../controllers/briefsController';
import { briefRateLimiter } from '../lib/rate-limit';

const router = Router();

/**
 * GET /api/briefs/:symbol
 *
 * Generate a Ticker Intelligence Brief for the given symbol.
 * Apply a tighter rate limit to protect OpenAI call budgets.
 *
 * Query params:
 *   context (optional) — additional text context passed to the AI
 */
router.get('/:symbol', briefRateLimiter, getTickerBrief);

export default router;
