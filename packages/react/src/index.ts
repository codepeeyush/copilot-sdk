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
  type AgentLoopState,
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
  // Tool hooks (Agentic Loop)
  useTool,
  useTools,
  useToolWithSchema,
  useToolsWithSchema,
  useToolExecutor,
  type UseAIChatReturn,
  type AIContextItem,
  type UseAIToolsOptions,
  type UseAIToolsReturn,
  type UseSuggestionsOptions,
  type UseSuggestionsReturn,
  type Suggestion,
  type UseAgentOptions,
  type UseAgentReturn,
  type UseToolConfig,
  type UseToolWithSchemaConfig,
  type UseToolExecutorReturn,
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
  // Tools types (smart context)
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
  // Agentic Loop types
  ToolDefinition,
  ToolResponse,
  ToolContext,
  ToolExecution,
  ToolExecutionStatus,
  UnifiedToolCall,
  AgentLoopConfig,
} from "@yourgpt/core";
