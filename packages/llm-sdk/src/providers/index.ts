/**
 * Providers
 *
 * Multi-provider architecture for Copilot SDK.
 * Each provider wraps existing adapters with capabilities metadata.
 *
 * IMPORTANT: For tree-shaking, import providers from subpaths:
 * ```typescript
 * import { createAnthropic } from '@yourgpt/llm-sdk/anthropic';
 * import { createOpenAI } from '@yourgpt/llm-sdk/openai';
 * import { createGoogle } from '@yourgpt/llm-sdk/google';
 * ```
 *
 * @example
 * ```typescript
 * import { createRuntime } from '@yourgpt/llm-sdk';
 * import { createAnthropic } from '@yourgpt/llm-sdk/anthropic';
 *
 * const runtime = createRuntime({
 *   provider: createAnthropic({ apiKey: '...' }),
 *   model: 'claude-3-5-sonnet-20241022',
 * });
 * ```
 */

// ============================================
// Types
// ============================================

export type {
  // Core types
  AIProvider,
  ProviderCapabilities,
  EmbeddingModel,
  ModelInfo,
  // Base config
  BaseProviderConfig,
  // Provider-specific configs
  OpenAIProviderConfig,
  AnthropicProviderConfig,
  GoogleProviderConfig,
  XAIProviderConfig,
  AzureProviderConfig,
  OllamaProviderConfig,
  // Google-specific
  GoogleSafetySetting,
  GoogleGroundingConfig,
  // Formatter types
  ProviderFormatter,
  // OpenAI tool types
  OpenAITool,
  OpenAIToolCall,
  OpenAIToolResult,
  // Anthropic tool types
  AnthropicTool,
  AnthropicToolUse,
  AnthropicToolResult,
  // Gemini tool types
  GeminiFunctionDeclaration,
  GeminiFunctionCall,
  GeminiFunctionResponse,
} from "./types";

export { DEFAULT_CAPABILITIES } from "./types";

// ============================================
// Registry (for dynamic provider management)
// ============================================

export {
  registerProvider,
  getProvider,
  hasProvider,
  listProviders,
  unregisterProvider,
  clearProviders,
  getAvailableProviders,
  getModelCapabilities,
} from "./registry";

// ============================================
// Provider Formatters (for agentic loop)
// These are lightweight and don't pull in adapters
// ============================================

export { openaiFormatter } from "./openai";
export { anthropicFormatter } from "./anthropic";
export { geminiFormatter } from "./gemini";

// Formatter registry helpers
export {
  getFormatter,
  isProviderSupported,
  getSupportedProviders,
} from "./formatter-registry";

// ============================================
// NOTE: Provider factories are NOT exported from here!
// Import them from subpaths for tree-shaking:
//
//   import { createOpenAI } from '@yourgpt/llm-sdk/openai';
//   import { createAnthropic } from '@yourgpt/llm-sdk/anthropic';
//   import { createGoogle } from '@yourgpt/llm-sdk/google';
//   import { createXAI } from '@yourgpt/llm-sdk/xai';
//   import { createOllama } from '@yourgpt/llm-sdk/ollama';
//   import { createAzure } from '@yourgpt/llm-sdk/azure';
//
// ============================================
