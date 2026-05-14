# AGENTS.md

## Cursor Cloud specific instructions

### Service overview

CogniTrade Backend is a single Express.js API (TypeScript). See `README.md` for full tech stack and API docs.

### Available scripts

All scripts are in `package.json`: `npm run dev`, `npm test`, `npm run lint`, `npm run lint:fix`, `npm run typecheck`, `npm run build`.

### Running without API keys

All external providers (OpenAI, Alpaca, Tradier, FRED, SEC EDGAR) and Supabase gracefully degrade to stub/placeholder responses when their API keys are absent. The `.env` file must have `OPENAI_API_KEY=` (empty) rather than a placeholder value like `sk-your-openai-api-key`; otherwise tests will hit the real OpenAI API and fail with 401.

### Dev server

`npm run dev` starts the Express server on port 3000 with hot-reload (`ts-node-dev`). Key endpoints: `GET /health`, `GET /api/briefs/:symbol`.

### Testing gotchas

- The `.env` file is loaded by `dotenv` at import time. If `OPENAI_API_KEY` contains any truthy string (even a placeholder), the OpenAI client is instantiated and tests will make real HTTP calls. Set it to empty for stub mode.
- Jest is configured with `--forceExit` due to open handles from the Express server in tests.
- Tests reference a `tsconfig.test.json` (separate from the main `tsconfig.json`).
