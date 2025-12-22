/**
 * Tool-related types for the agentic loop
 */

import type { ActionRenderProps } from "./actions";

// ============================================
// Provider Types
// ============================================

/**
 * Supported AI providers for tool calling
 */
export type AIProvider =
  | "anthropic"
  | "openai"
  | "xai"
  | "grok"
  | "gemini"
  | "groq"
  | "ollama";

/**
 * Where the tool executes
 */
export type ToolLocation = "server" | "client";

// ============================================
// Tool Definition Types
// ============================================

/**
 * JSON Schema property definition
 */
export interface JSONSchemaProperty {
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "integer"
    | "null";
  description?: string;
  enum?: (string | number | boolean)[];
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  default?: unknown;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

/**
 * JSON Schema for tool input
 */
export interface ToolInputSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * Tool execution context
 */
export interface ToolContext {
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  /** Thread ID if using threads */
  threadId?: string;
  /** Custom context data */
  data?: Record<string, unknown>;
}

/**
 * Tool response format
 */
export interface ToolResponse<T = unknown> {
  /** Whether the tool succeeded */
  success: boolean;
  /** Human-readable message */
  message?: string;
  /** Error message if failed */
  error?: string;
  /** Result data */
  data?: T;
}

/**
 * Props passed to tool render function
 */
export interface ToolRenderProps<TParams = Record<string, unknown>> {
  /** Current execution status */
  status: "pending" | "executing" | "completed" | "error";
  /** Arguments passed to the tool */
  args: TParams;
  /** Result if completed */
  result?: ToolResponse;
  /** Error if failed */
  error?: string;
}

/**
 * Tool definition with JSON Schema
 */
export interface ToolDefinition<TParams = Record<string, unknown>> {
  /** Unique tool name */
  name: string;
  /** Tool description for LLM */
  description: string;
  /** Where the tool executes (server or client) */
  location: ToolLocation;
  /** JSON Schema for input parameters */
  inputSchema: ToolInputSchema;
  /** Handler function (optional for client tools registered on server) */
  handler?: (
    params: TParams,
    context?: ToolContext,
  ) => Promise<ToolResponse> | ToolResponse;
  /** Optional render function for UI */
  render?: (props: ToolRenderProps<TParams>) => unknown;
  /** Whether the tool is available (for conditional registration) */
  available?: boolean;
}

// ============================================
// Unified Tool Call Types (Provider-Agnostic)
// ============================================

/**
 * Unified tool call format (internal representation)
 */
export interface UnifiedToolCall {
  /** Unique tool call ID */
  id: string;
  /** Tool name */
  name: string;
  /** Tool input arguments */
  input: Record<string, unknown>;
}

/**
 * Unified tool result format
 */
export interface UnifiedToolResult {
  /** Tool call ID this result is for */
  toolCallId: string;
  /** Serialized result content (JSON string) */
  content: string;
  /** Whether the tool succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

// ============================================
// Tool Execution Types
// ============================================

/**
 * Tool execution status
 */
export type ToolExecutionStatus =
  | "pending"
  | "executing"
  | "completed"
  | "error";

/**
 * Tool execution record (for UI tracking)
 */
export interface ToolExecution {
  /** Tool call ID */
  id: string;
  /** Tool name */
  name: string;
  /** Tool arguments */
  args: Record<string, unknown>;
  /** Execution status */
  status: ToolExecutionStatus;
  /** Result if completed */
  result?: ToolResponse;
  /** Error message if failed */
  error?: string;
  /** Timestamp when execution started */
  timestamp: number;
  /** Duration in ms (set when completed) */
  duration?: number;
}

// ============================================
// Agent Loop Types
// ============================================

/**
 * Agentic loop configuration
 */
export interface AgentLoopConfig {
  /** Maximum iterations before stopping (default: 20) */
  maxIterations?: number;
  /** Enable debug logging */
  debug?: boolean;
  /** Whether to enable the agentic loop (default: true) */
  enabled?: boolean;
}

/**
 * Agent loop state (for tracking)
 */
export interface AgentLoopState {
  /** Current iteration number */
  iteration: number;
  /** Maximum iterations allowed */
  maxIterations: number;
  /** Whether the loop is currently running */
  running: boolean;
  /** Whether max iterations was reached */
  maxIterationsReached: boolean;
  /** Whether the loop was aborted */
  aborted: boolean;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Convert ToolDefinition to OpenAI tool format
 */
export function toolToOpenAIFormat(tool: ToolDefinition): object {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  };
}

/**
 * Convert ToolDefinition to Anthropic tool format
 */
export function toolToAnthropicFormat(tool: ToolDefinition): object {
  return {
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  };
}

/**
 * Create a tool result response
 */
export function createToolResult(
  toolCallId: string,
  response: ToolResponse,
): UnifiedToolResult {
  return {
    toolCallId,
    content: JSON.stringify(response),
    success: response.success,
    error: response.error,
  };
}

/**
 * Create a successful tool response
 */
export function success<T = unknown>(
  data?: T,
  message?: string,
): ToolResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Create a failed tool response
 */
export function failure(error: string): ToolResponse {
  return {
    success: false,
    error,
  };
}
