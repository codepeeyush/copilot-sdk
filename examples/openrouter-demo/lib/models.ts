/**
 * OpenRouter Model Definitions
 *
 * Models verified from OpenRouter API (January 2026)
 * @see https://openrouter.ai/models
 */

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
}

export interface ModelGroup {
  provider: string;
  models: ModelOption[];
}

// All models grouped by provider - IDs from OpenRouter API
export const MODEL_GROUPS: ModelGroup[] = [
  {
    provider: "OpenRouter",
    models: [
      {
        id: "openrouter/auto",
        name: "Auto",
        provider: "OpenRouter",
        contextWindow: 128000,
      },
    ],
  },
  {
    provider: "Anthropic",
    models: [
      {
        id: "anthropic/claude-opus-4",
        name: "Claude Opus 4",
        provider: "Anthropic",
        contextWindow: 200000,
      },
      {
        id: "anthropic/claude-sonnet-4",
        name: "Claude Sonnet 4",
        provider: "Anthropic",
        contextWindow: 200000,
      },
      {
        id: "anthropic/claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
        provider: "Anthropic",
        contextWindow: 200000,
      },
    ],
  },
  {
    provider: "OpenAI",
    models: [
      {
        id: "openai/gpt-4.1",
        name: "GPT-4.1",
        provider: "OpenAI",
        contextWindow: 1047576,
      },
      {
        id: "openai/gpt-4.1-mini",
        name: "GPT-4.1 Mini",
        provider: "OpenAI",
        contextWindow: 1047576,
      },
      {
        id: "openai/gpt-4.1-nano",
        name: "GPT-4.1 Nano",
        provider: "OpenAI",
        contextWindow: 1047576,
      },
      {
        id: "openai/o3",
        name: "o3",
        provider: "OpenAI",
        contextWindow: 200000,
      },
      {
        id: "openai/o4-mini",
        name: "o4-mini",
        provider: "OpenAI",
        contextWindow: 200000,
      },
    ],
  },
  {
    provider: "Google",
    models: [
      {
        id: "google/gemini-2.5-pro-preview",
        name: "Gemini 2.5 Pro",
        provider: "Google",
        contextWindow: 1048576,
      },
      {
        id: "google/gemini-2.5-flash-preview",
        name: "Gemini 2.5 Flash",
        provider: "Google",
        contextWindow: 1048576,
      },
      {
        id: "google/gemini-2.0-flash-001",
        name: "Gemini 2.0 Flash",
        provider: "Google",
        contextWindow: 1048576,
      },
    ],
  },
  {
    provider: "Meta",
    models: [
      {
        id: "meta-llama/llama-4-maverick",
        name: "Llama 4 Maverick",
        provider: "Meta",
        contextWindow: 1048576,
      },
      {
        id: "meta-llama/llama-4-scout",
        name: "Llama 4 Scout",
        provider: "Meta",
        contextWindow: 512000,
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B",
        provider: "Meta",
        contextWindow: 131072,
      },
    ],
  },
  {
    provider: "DeepSeek",
    models: [
      {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        provider: "DeepSeek",
        contextWindow: 163840,
      },
      {
        id: "deepseek/deepseek-chat-v3-0324",
        name: "DeepSeek V3",
        provider: "DeepSeek",
        contextWindow: 163840,
      },
    ],
  },
  {
    provider: "Mistral",
    models: [
      {
        id: "mistralai/mistral-large-2411",
        name: "Mistral Large",
        provider: "Mistral",
        contextWindow: 131072,
      },
      {
        id: "mistralai/codestral-2501",
        name: "Codestral",
        provider: "Mistral",
        contextWindow: 262144,
      },
    ],
  },
  {
    provider: "xAI",
    models: [
      {
        id: "x-ai/grok-3-beta",
        name: "Grok 3",
        provider: "xAI",
        contextWindow: 131072,
      },
      {
        id: "x-ai/grok-3-mini-beta",
        name: "Grok 3 Mini",
        provider: "xAI",
        contextWindow: 131072,
      },
    ],
  },
];

// Flatten all models
export const ALL_MODELS: ModelOption[] = MODEL_GROUPS.flatMap((g) => g.models);

// Get model by ID
export function getModelById(id: string): ModelOption | undefined {
  return ALL_MODELS.find((m) => m.id === id);
}

// Get OpenRouter model page URL
export function getModelUrl(id: string): string {
  return `https://openrouter.ai/models/${id}`;
}

// Default model
export const DEFAULT_MODEL = "anthropic/claude-sonnet-4";
