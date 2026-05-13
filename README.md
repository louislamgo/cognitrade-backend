# cognitrade-backend

Backend services for CogniTrade — an AI-powered trading intelligence platform.

Handles market data normalization, Ticker Intelligence Brief generation, watchlist refresh, catalyst/news ingestion, technical structure calculations, LEAPS/income suitability context, journal workflows, caching, and rate-limit protection.

> **Safety notice**: CogniTrade provides **decision support only**, not personalised financial advice. No output from this service should be construed as a buy/sell recommendation or guarantee of returns.

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Database | Supabase (Postgres) |
| AI | OpenAI API |
| Market data | Alpaca, Tradier (adapter architecture) |
| Macro data | FRED |
| Filings | SEC EDGAR |
| Deployment | Vercel / standalone Node.js |

---

## Project structure

```
src/
├── server.ts                  # Express app entry point
├── types/                     # Shared TypeScript interfaces
├── routes/                    # Express route definitions
├── controllers/               # Request handlers
├── middleware/                 # Error handling, auth guards
├── services/
│   ├── ai/                    # OpenAI service wrapper
│   └── briefs/                # Ticker brief orchestration
├── providers/
│   ├── alpaca/                # Alpaca market data adapter
│   ├── tradier/               # Tradier market data adapter
│   ├── fred/                  # FRED macro data adapter
│   └── sec-edgar/             # SEC EDGAR filings adapter
└── lib/
    ├── supabase/              # Supabase client singleton
    ├── cache/                 # In-memory TTL cache
    └── rate-limit/            # Express rate-limit middleware
tests/                         # Jest test suites
```

---

## Local setup

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### 1. Clone the repo

```bash
git clone https://github.com/louislamgo/cognitrade-backend.git
cd cognitrade-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials. See `.env.example` for all available variables. The service will start without real API keys — stub data is returned instead.

### 4. Start the development server

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default (override with `PORT=`).

### 5. Verify the health endpoint

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1.23
}
```

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled build |
| `npm test` | Run Jest test suite |
| `npm run lint` | Lint source files |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run typecheck` | Type-check without emitting |

---

## API endpoints

### `GET /health`

Returns service liveness information.

### `GET /api/briefs/:symbol`

Generates a Ticker Intelligence Brief for the given ticker symbol.

**Path params**

| Param | Description |
|---|---|
| `symbol` | Uppercase ticker symbol (e.g. `AAPL`, `MSFT`) |

**Query params**

| Param | Description |
|---|---|
| `context` _(optional)_ | Additional text context passed to the AI |

**Example**

```bash
curl "http://localhost:3000/api/briefs/AAPL?context=earnings+season"
```

**Response shape**

```json
{
  "symbol": "AAPL",
  "generatedAt": "2024-01-01T00:00:00.000Z",
  "dataSource": "alpaca",
  "isDataDelayed": true,
  "summary": "...",
  "technicalSnapshot": {
    "currentPrice": null,
    "priceChangePercent": null,
    "note": "Data may be delayed ≥15 min."
  },
  "disclaimers": [
    "This brief is for decision support only and does not constitute personalised financial advice.",
    "Market data may be delayed. Always verify with your broker before acting on any information.",
    "Past performance is not indicative of future results."
  ]
}
```

---

## Provider adapter architecture

Each market data source implements the `MarketDataProvider` interface (`src/types/index.ts`). To add a new provider:

1. Create `src/providers/<name>/index.ts` implementing `MarketDataProvider`.
2. Inject the provider where needed (services default to `AlpacaProvider`).

Current providers (all stubs — ready for real API integration):

| Provider | Purpose |
|---|---|
| Alpaca | Real-time / delayed equity quotes and OHLCV bars |
| Tradier | Options chains and equity quotes |
| FRED | Macro-economic time series (rates, CPI, etc.) |
| SEC EDGAR | Company filings and catalyst events |

---

## Safety & compliance notes

- The OpenAI system prompt explicitly forbids buy/sell recommendations and guaranteed-return language.
- All market data responses include `source`, `fetchedAt` (freshness timestamp), and `isDelayed` fields.
- AI outputs acknowledge data gaps when inputs are stale or missing.
- **No order execution logic exists in this codebase.**

---

## Deployment

The service is structured to run as:

- **Vercel serverless**: export `app` from `src/server.ts` (already done — no handler wrapping needed for Vercel's Express adapter).
- **Standalone Node.js**: `npm run build && npm start`.

See `.env.example` for all required environment variables before deploying.
