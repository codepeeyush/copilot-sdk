/**
 * Provider Formatter Types
 *
 * Interface for provider-specific tool call formatting and parsing
 */

import type {
  ToolDefinition,
  UnifiedToolCall,
  UnifiedToolResult,
} from "@yourgpt/copilot-sdk-core";

/**
 * Provider formatter interface
 *
 * Each provider implements this interface to handle:
 * - Tool definition transformation
 * - Tool call parsing from responses
 * - Tool result formatting
 * - Stop reason detection
 */
export interface ProviderFormatter {
  /**
   * Transform unified tool definitions to provider format
   */
  transformTools(tools: ToolDefinition[]): unknown[];

  /**
   * Parse tool calls from provider response
   */
  parseToolCalls(response: unknown): UnifiedToolCall[];

  /**
   * Format tool results for provider
   */
  formatToolResults(results: UnifiedToolResult[]): unknown[];

  /**
   * Check if response indicates tool use is requested
   */
  isToolUseStop(response: unknown): boolean;

  /**
   * Check if response indicates end of turn
   */
  isEndTurnStop(response: unknown): boolean;

  /**
   * Get stop reason string from response
   */
  getStopReason(response: unknown): string;

  /**
   * Extract text content from response
   */
  extractTextContent(response: unknown): string;

  /**
   * Build assistant message with tool calls for conversation history
   */
  buildAssistantToolMessage(
    toolCalls: UnifiedToolCall[],
    textContent?: string,
  ): unknown;

  /**
   * Build user message with tool results for conversation history
   */
  buildToolResultMessage(results: UnifiedToolResult[]): unknown;
}

/**
 * Anthropic tool definition format
 */
export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Anthropic tool_use block from response
 */
export interface AnthropicToolUse {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

/**
 * Anthropic tool_result block
 */
export interface AnthropicToolResult {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

/**
 * OpenAI tool definition format
 */
export interface OpenAITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

/**
 * OpenAI tool call from response
 */
export interface OpenAIToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

/**
 * OpenAI tool result message
 */
export interface OpenAIToolResult {
  role: "tool";
  tool_call_id: string;
  content: string;
}

/**
 * Google Gemini function declaration
 */
export interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Gemini function call from response
 */
export interface GeminiFunctionCall {
  name: string;
  args: Record<string, unknown>;
}

/**
 * Gemini function response
 */
export interface GeminiFunctionResponse {
  name: string;
  response: Record<string, unknown>;
}
