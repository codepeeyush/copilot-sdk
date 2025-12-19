/**
 * @yourgpt/react
 *
 * React hooks and components for YourGPT Copilot SDK
 */

// Provider
export {
  YourGPTProvider,
  type YourGPTProviderProps,
} from "./provider/YourGPTProvider";

// Context
export {
  YourGPTContext,
  useYourGPTContext,
  type YourGPTContextValue,
  type ChatState,
  type ChatActions,
  type ToolsState,
  type ToolsActions,
} from "./context/YourGPTContext";

export {
  ThreadsContext,
  useThreadsContext,
  type ThreadsContextValue,
} from "./context/ThreadsContext";

// Hooks
export {
  useAIChat,
  useIsPremium,
  useAIAction,
  useAIActions,
  useAIContext,
  useAIContexts,
  useAITools,
  useSuggestions,
  useAgent,
  useThreads,
  generateSuggestionReason,
  type UseAIChatReturn,
  type AIContextItem,
  type UseAIToolsOptions,
  type UseAIToolsReturn,
  type UseSuggestionsOptions,
  type UseSuggestionsReturn,
  type Suggestion,
  type UseAgentOptions,
  type UseAgentReturn,
} from "./hooks";

// Re-export core types for convenience
export type {
  Message,
  Source,
  ActionDefinition,
  ActionParameter,
  YourGPTConfig,
  LLMConfig,
  CloudConfig,
  // Tools types
  ToolsConfig,
  ToolType,
  ToolConsentRequest,
  ToolConsentResponse,
  CapturedContext,
  IntentDetectionResult,
  // Thread types
  Thread,
  ThreadData,
  PersistenceConfig,
  ThreadStorageAdapter,
} from "@yourgpt/core";
