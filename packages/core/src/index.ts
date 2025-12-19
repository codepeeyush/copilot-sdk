/**
 * @yourgpt/core
 *
 * Core types and utilities for YourGPT Copilot SDK
 */

// ============================================
// Smart Context Tools (Unique to YourGPT)
// ============================================
export {
  // Screenshot
  captureScreenshot,
  isScreenshotSupported,
  resizeScreenshot,
  // Console
  startConsoleCapture,
  stopConsoleCapture,
  getConsoleLogs,
  clearConsoleLogs,
  isConsoleCaptureActive,
  getConsoleErrors,
  getConsoleWarnings,
  formatLogsForAI,
  captureCurrentLogs,
  // Network
  startNetworkCapture,
  stopNetworkCapture,
  getNetworkRequests,
  clearNetworkRequests,
  isNetworkCaptureActive,
  getFailedRequests,
  formatRequestsForAI,
  // Intent Detection
  detectIntent,
  hasToolSuggestions,
  getPrimaryTool,
  generateSuggestionReason,
  createCustomDetector,
} from "./tools";

export type {
  // Screenshot types
  ScreenshotOptions,
  ScreenshotResult,
  // Console types
  ConsoleLogType,
  ConsoleLogEntry,
  ConsoleLogOptions,
  ConsoleLogResult,
  // Network types
  HttpMethod,
  NetworkRequestEntry,
  NetworkRequestOptions,
  NetworkRequestResult,
  // Intent types
  ToolType,
  IntentDetectionResult,
  // Config types
  ToolsConfig,
  ToolConsentRequest,
  ToolConsentResponse,
  CapturedContext,
  CustomKeywords,
} from "./tools";

// ============================================
// Core Types
// ============================================

// Types
export type {
  // Message types
  MessageRole,
  Message,
  Source,
  ToolCall,
  ToolResult,
  // Config types
  LLMProvider,
  LLMConfig,
  CloudConfig,
  Extension,
  YourGPTConfig,
  // Action types
  ParameterType,
  ActionParameter,
  ActionDefinition,
  ActionRenderProps,
  // Event types
  StreamEventType,
  StreamEvent,
  MessageStartEvent,
  MessageDeltaEvent,
  MessageEndEvent,
  SourceAddEvent,
  ActionStartEvent,
  ActionArgsEvent,
  ActionEndEvent,
  ErrorEvent,
  DoneEvent,
  // Knowledge Base types
  KnowledgeBaseProvider,
  KnowledgeBaseConfig,
  KnowledgeBaseResult,
  KnowledgeBaseSearchRequest,
  KnowledgeBaseSearchResponse,
  // Thread types
  Thread,
  ThreadData,
  PersistenceConfig,
  ThreadStorageAdapter,
} from "./types";

// Thread title generation
export { generateThreadTitle } from "./types";

// Functions
export {
  createMessage,
  actionToTool,
  parseStreamEvent,
  serializeStreamEvent,
  formatSSE,
  getDefaultModel,
  DEFAULT_MODELS,
} from "./types";

// Utils
export {
  parseSSELine,
  streamSSE,
  createSSEStream,
  generateId,
  generateMessageId,
  generateThreadId,
  generateToolCallId,
} from "./utils";

// System Prompt
export { defaultSystemMessage } from "./system-prompt";
export type { SystemMessageFunction } from "./system-prompt";
