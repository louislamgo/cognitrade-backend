import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10) || 60_000;
const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100', 10) || 100;

/**
 * Default rate-limiter middleware for all routes.
 *
 * Configured via:
 *   RATE_LIMIT_WINDOW_MS   — rolling window in milliseconds (default 60 000)
 *   RATE_LIMIT_MAX_REQUESTS — max requests per window (default 100)
 */
export const defaultRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please slow down and try again later.',
  },
});

/**
 * A stricter rate-limiter for AI-heavy endpoints (ticker briefs, etc.)
 * to prevent runaway OpenAI cost.
 */
export const briefRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Brief generation rate limit reached. Please wait before generating another brief.',
  },
});
