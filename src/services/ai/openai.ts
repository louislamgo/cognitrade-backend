import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[openai] OPENAI_API_KEY is not set. AI features will be unavailable.');
    return null;
  }
  if (!_openai) {
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';

/**
 * System prompt enforcing CogniTrade safety rules:
 * - Decision support only, not personalised financial advice.
 * - No guaranteed returns, buy/sell, or risk-free language.
 * - Indicate uncertainty when data is stale or missing.
 */
const SYSTEM_PROMPT = `You are CogniTrade's market intelligence assistant.
You provide concise, factual market context and analytical decision support.

STRICT RULES — violating any of these is not permitted:
1. Do NOT give personalised financial advice or make specific buy/sell recommendations.
2. Do NOT use language implying guaranteed returns, risk-free outcomes, or certain profits.
3. Clearly indicate when underlying data may be delayed, incomplete, or stale.
4. Every response must include a brief disclaimer that this is decision support only.
5. When relevant data is missing, explicitly acknowledge the gap rather than speculating.
`;

export interface AiCompletionOptions {
  userPrompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AiCompletionResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Sends a prompt to OpenAI and returns the completion.
 *
 * Falls back to a stub response when the API key is absent (useful for
 * local development without OpenAI credentials).
 */
export async function generateCompletion(options: AiCompletionOptions): Promise<AiCompletionResult> {
  const { userPrompt, model = DEFAULT_MODEL, maxTokens = 800, temperature = 0.3 } = options;

  const client = getOpenAIClient();

  if (!client) {
    // Stub response for dev without OpenAI key
    return {
      content:
        '[STUB] OpenAI is not configured. This is a placeholder response. ' +
        'Disclaimer: This is decision support only — not personalised financial advice.',
      model: 'stub',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }

  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    temperature,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });

  const choice = response.choices[0];
  const content = choice?.message?.content ?? '';

  return {
    content,
    model: response.model,
    usage: {
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
    },
  };
}
