/**
 * @yourgpt/runtime
 *
 * Backend runtime server for YourGPT Copilot SDK
 */

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
  // Groq
  GroqAdapter,
  createGroqAdapter,
  type GroqAdapterConfig,
  // Ollama
  OllamaAdapter,
  createOllamaAdapter,
  type OllamaAdapterConfig,
} from "./adapters";

// Re-export core types
export type {
  Message,
  ActionDefinition,
  StreamEvent,
  LLMConfig,
  LLMProvider,
} from "@yourgpt/core";
