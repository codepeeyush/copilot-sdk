/**
 * @yourgpt/llm-sdk
 *
 * LLM SDK for YourGPT - Multi-provider LLM integration
 *
 * Modern usage:
 * ```ts
 * import { generateText, streamText, tool } from '@yourgpt/llm-sdk';
 * import { openai } from '@yourgpt/llm-sdk/openai';
 *
 * const result = await generateText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Hello!',
 * });
 * ```
 */

// ============================================
// NEW: Core Functions (Modern API)
// ============================================

export { generateText } from "./core/generate-text";
export { streamText } from "./core/stream-text";
export {
  tool,
  formatToolsForOpenAI,
  formatToolsForAnthropic,
  formatToolsForGoogle,
} from "./core/tool";

// Core Types
export type {
  // Language Model
  LanguageModel,
  ModelCapabilities,
  DoGenerateParams,
  DoGenerateResult,

  // Messages
  CoreMessage,
  SystemMessage,
  UserMessage,
  AssistantMessage,
  ToolMessage,
  UserContentPart,
  TextPart,
  ImagePart,
  FilePart,

  // Tools
  Tool,
  ToolContext,
  ToolCall,
  ToolResult,

  // Generation
  GenerateTextParams,
  GenerateTextResult,
  GenerateStep,
  StreamTextParams,
  StreamTextResult,
  StreamPart,

  // Streaming
  StreamChunk,
  TextDeltaChunk,
  ToolCallChunk,
  ToolResultChunk,
  FinishChunk,
  ErrorChunk,

  // Common
  TokenUsage,
  FinishReason,
  ResponseOptions,
} from "./core/types";

export { DEFAULT_CAPABILITIES } from "./core/types";

// ============================================
// NEW: Provider Re-exports (for convenience)
// Users should import from subpaths for tree-shaking
// ============================================

export { openai } from "./providers/openai/provider";
export { anthropic } from "./providers/anthropic/provider";
export { xai } from "./providers/xai/provider";
export { google } from "./providers/google/provider";

// ============================================
// LEGACY: Server (still works, but prefer core functions)
// ============================================

// Server
export {
  Runtime,
  createRuntime,
  type RuntimeConfig,
  type ChatRequest,
  type ActionRequest,
  type RequestContext,
} from "./server";

// Framework integrations
export {
  createHonoApp,
  createNextHandler,
  createExpressMiddleware,
  createNodeHandler,
} from "./server";

// Streaming utilities
export {
  createSSEHeaders,
  formatSSEData,
  createEventStream,
  createSSEResponse,
} from "./server";

// Agent loop
export {
  runAgentLoop,
  DEFAULT_MAX_ITERATIONS,
  type AgentLoopOptions,
} from "./server";

// Adapters
export type {
  LLMAdapter,
  ChatCompletionRequest,
  AdapterFactory,
} from "./adapters";

export {
  // OpenAI
  OpenAIAdapter,
  createOpenAIAdapter,
  type OpenAIAdapterConfig,
  // Anthropic
  AnthropicAdapter,
  createAnthropicAdapter,
  type AnthropicAdapterConfig,
  // Ollama
  OllamaAdapter,
  createOllamaAdapter,
  type OllamaAdapterConfig,
  // Google Gemini
  GoogleAdapter,
  createGoogleAdapter,
  type GoogleAdapterConfig,
  // xAI Grok
  XAIAdapter,
  createXAIAdapter,
  type XAIAdapterConfig,
  // Azure OpenAI
  AzureAdapter,
  createAzureAdapter,
  type AzureAdapterConfig,
} from "./adapters";

// Provider formatters (for agentic loop)
export {
  getFormatter,
  isProviderSupported,
  getSupportedProviders,
  anthropicFormatter,
  openaiFormatter,
  geminiFormatter,
} from "./providers";

export type {
  ProviderFormatter,
  AnthropicTool,
  AnthropicToolUse,
  AnthropicToolResult,
  OpenAITool,
  OpenAIToolCall,
  OpenAIToolResult,
  GeminiFunctionDeclaration,
  GeminiFunctionCall,
  GeminiFunctionResponse,
} from "./providers";

// Provider factories (multi-provider architecture)
export {
  createOpenAI,
  createAnthropic,
  createGoogle,
  createOllama,
  createXAI,
  createAzure,
  // Provider registry
  registerProvider,
  getProvider,
  hasProvider,
  listProviders,
  getAvailableProviders,
  getModelCapabilities,
} from "./providers";

export type {
  AIProvider,
  ProviderCapabilities,
  BaseProviderConfig,
  OpenAIProviderConfig,
  AnthropicProviderConfig,
  GoogleProviderConfig,
  XAIProviderConfig,
  AzureProviderConfig,
  OllamaProviderConfig,
} from "./providers";

// Re-export core types
export type {
  Message,
  ActionDefinition,
  StreamEvent,
  LLMConfig,
  LLMProvider,
  // Tool types (AIProvider is exported from ./providers above)
  ToolDefinition,
  ToolLocation,
  ToolResponse,
  UnifiedToolCall,
  UnifiedToolResult,
  ToolExecution,
  AgentLoopConfig,
} from "@yourgpt/copilot-sdk/core";
