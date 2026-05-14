import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import healthRouter from './routes/health';
import briefsRouter from './routes/briefs';
import { defaultRateLimiter } from './lib/rate-limit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(defaultRateLimiter);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/api/briefs', briefsRouter);

// ── Error handling (must come last) ────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────────────────
if (require.main === module) {
  const port = parseInt(process.env.PORT ?? '3000', 10);
  app.listen(port, () => {
    console.log(`[server] CogniTrade backend listening on port ${port}`);
    console.log(`[server] NODE_ENV=${process.env.NODE_ENV ?? 'development'}`);
  });
}

export default app;
