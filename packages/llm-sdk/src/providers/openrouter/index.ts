/**
 * OpenRouter Provider
 *
 * OpenRouter is a unified API gateway that provides access to 500+ AI models
 * from 60+ providers (OpenAI, Anthropic, Google, Meta, Mistral, etc.)
 * through a single endpoint.
 *
 * Features:
 * - Single API key for all models
 * - Automatic fallbacks and routing
 * - Cost optimization
 * - Provider preferences
 * - OpenAI-compatible API
 *
 * @see https://openrouter.ai/docs
 */

// NEW: Modern pattern - openrouter() function
export {
  openrouter,
  createOpenRouter as createOpenRouterModel,
} from "./provider";
export type { OpenRouterProviderOptions } from "./provider";

import { createOpenAIAdapter } from "../../adapters/openai";
import {
  createCallableProvider,
  type AIProvider,
  type ProviderCapabilities,
} from "../types";

// ============================================
// Model Definitions
// ============================================

interface ModelCapabilities {
  vision: boolean;
  tools: boolean;
  jsonMode: boolean;
  maxTokens: number;
}

/**
 * Popular OpenRouter models with known capabilities.
 * OpenRouter supports 500+ models - use any valid model ID.
 */
const OPENROUTER_MODELS: Record<string, ModelCapabilities> = {
  // OpenAI
  "openai/gpt-4o": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 128000,
  },
  "openai/gpt-4o-mini": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 128000,
  },
  "openai/gpt-4-turbo": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 128000,
  },
  "openai/o1": {
    vision: true,
    tools: false,
    jsonMode: false,
    maxTokens: 128000,
  },

  // Anthropic
  "anthropic/claude-3.5-sonnet": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 200000,
  },
  "anthropic/claude-3.5-sonnet-20241022": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 200000,
  },
  "anthropic/claude-3-opus": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 200000,
  },
  "anthropic/claude-3-haiku": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 200000,
  },

  // Google
  "google/gemini-pro-1.5": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 1000000,
  },
  "google/gemini-flash-1.5": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 1000000,
  },

  // Meta Llama
  "meta-llama/llama-3.1-405b-instruct": {
    vision: false,
    tools: true,
    jsonMode: true,
    maxTokens: 131072,
  },
  "meta-llama/llama-3.1-70b-instruct": {
    vision: false,
    tools: true,
    jsonMode: true,
    maxTokens: 131072,
  },

  // Mistral
  "mistralai/mistral-large": {
    vision: false,
    tools: true,
    jsonMode: true,
    maxTokens: 128000,
  },
  "mistralai/mixtral-8x7b-instruct": {
    vision: false,
    tools: true,
    jsonMode: true,
    maxTokens: 32768,
  },

  // DeepSeek
  "deepseek/deepseek-chat": {
    vision: false,
    tools: true,
    jsonMode: true,
    maxTokens: 64000,
  },

  // OpenRouter Auto (magic model - picks best for your prompt)
  "openrouter/auto": {
    vision: true,
    tools: true,
    jsonMode: true,
    maxTokens: 128000,
  },
};

// Default for unknown models
const DEFAULT_CAPABILITIES: ModelCapabilities = {
  vision: true,
  tools: true,
  jsonMode: true,
  maxTokens: 128000,
};

// ============================================
// Provider Config
// ============================================

export interface OpenRouterProviderConfig {
  /** API key (defaults to OPENROUTER_API_KEY env var) */
  apiKey?: string;
  /** Base URL for API */
  baseUrl?: string;
  /** Your site URL for OpenRouter rankings */
  siteUrl?: string;
  /** Your app name for OpenRouter rankings */
  appName?: string;
}

// ============================================
// Provider Implementation
// ============================================

/**
 * Create an OpenRouter provider (callable, Vercel AI SDK style)
 *
 * @example
 * ```typescript
 * const or = createOpenRouter({ apiKey: '...' });
 *
 * // Callable - Vercel AI SDK style
 * const model = or('anthropic/claude-3.5-sonnet');
 *
 * // Also supports method call (backward compatible)
 * const model2 = or.languageModel('openai/gpt-4o');
 *
 * // Check capabilities
 * const caps = or.getCapabilities('anthropic/claude-3.5-sonnet');
 * ```
 */
export function createOpenRouter(
  config: OpenRouterProviderConfig = {},
): AIProvider {
  const apiKey = config.apiKey ?? process.env.OPENROUTER_API_KEY ?? "";
  const baseUrl = config.baseUrl ?? "https://openrouter.ai/api/v1";

  // Create the callable function - uses OpenAI adapter since OpenRouter is OpenAI-compatible
  const providerFn = (modelId: string) => {
    return createOpenAIAdapter({
      apiKey,
      model: modelId,
      baseUrl,
    });
  };

  // Get capabilities helper
  const getCapabilities = (modelId: string): ProviderCapabilities => {
    const model = OPENROUTER_MODELS[modelId] ?? DEFAULT_CAPABILITIES;

    return {
      supportsVision: model.vision,
      supportsTools: model.tools,
      supportsThinking: false,
      supportsStreaming: true,
      supportsPDF: false,
      supportsAudio: false,
      supportsVideo: false,
      maxTokens: model.maxTokens,
      supportedImageTypes: model.vision
        ? ["image/png", "image/jpeg", "image/gif", "image/webp"]
        : [],
      supportsJsonMode: model.jsonMode,
      supportsSystemMessages: true,
    };
  };

  return createCallableProvider(providerFn, {
    name: "openrouter",
    supportedModels: Object.keys(OPENROUTER_MODELS),
    getCapabilities,
  });
}

// Alias for consistency
export const createOpenRouterProvider = createOpenRouter;
