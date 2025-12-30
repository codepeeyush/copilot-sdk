/**
 * Message Creation Functions
 *
 * Pure factory functions for creating messages.
 */

import type { MessageAttachment, ToolCall } from "@yourgpt/copilot-sdk-core";
import type { UIMessage, StreamingMessageState } from "../../types/index";

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create a user message
 *
 * @param content - Message content
 * @param attachments - Optional attachments
 * @returns New user message
 */
export function createUserMessage(
  content: string,
  attachments?: MessageAttachment[],
): UIMessage {
  return {
    id: generateMessageId(),
    role: "user",
    content,
    attachments,
    createdAt: new Date(),
  };
}

/**
 * Create an assistant message
 *
 * @param content - Message content
 * @param options - Optional properties
 * @returns New assistant message
 */
export function createAssistantMessage(
  content: string,
  options?: {
    id?: string;
    thinking?: string;
    toolCalls?: ToolCall[];
    metadata?: Record<string, unknown>;
  },
): UIMessage {
  return {
    id: options?.id ?? generateMessageId(),
    role: "assistant",
    content,
    thinking: options?.thinking,
    toolCalls: options?.toolCalls,
    createdAt: new Date(),
    metadata: options?.metadata,
  };
}

/**
 * Create a tool result message
 *
 * @param toolCallId - ID of the tool call
 * @param result - Tool execution result
 * @returns New tool message
 */
export function createToolMessage(
  toolCallId: string,
  result: unknown,
): UIMessage {
  return {
    id: generateMessageId(),
    role: "tool",
    content: typeof result === "string" ? result : JSON.stringify(result),
    toolCallId,
    createdAt: new Date(),
  };
}

/**
 * Create a system message
 *
 * @param content - Message content
 * @returns New system message
 */
export function createSystemMessage(content: string): UIMessage {
  return {
    id: generateMessageId(),
    role: "system",
    content,
    createdAt: new Date(),
  };
}

/**
 * Convert streaming state to UIMessage
 *
 * @param state - Current streaming state
 * @returns UIMessage representation
 */
export function streamStateToMessage(state: StreamingMessageState): UIMessage {
  // Convert simplified tool calls to ToolCall format
  const toolCalls: ToolCall[] | undefined =
    state.toolCalls.length > 0
      ? state.toolCalls.map((tc) => ({
          id: tc.id,
          type: "function" as const,
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.args),
          },
        }))
      : undefined;

  return {
    id: state.messageId,
    role: "assistant",
    content: state.content,
    thinking: state.thinking || undefined,
    toolCalls,
    createdAt: new Date(),
  };
}

/**
 * Create an empty assistant message (for streaming)
 *
 * @param id - Optional message ID
 * @returns Empty assistant message
 */
export function createEmptyAssistantMessage(id?: string): UIMessage {
  return {
    id: id ?? generateMessageId(),
    role: "assistant",
    content: "",
    createdAt: new Date(),
  };
}
