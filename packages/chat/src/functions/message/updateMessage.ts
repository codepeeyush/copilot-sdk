/**
 * Message Update Functions
 *
 * Pure functions for immutably updating messages.
 * Returns new arrays/objects without mutating input.
 */

import type { UIMessage } from "../../types/index";

/**
 * Update message content immutably
 *
 * @param messages - Current messages array
 * @param messageId - ID of message to update
 * @param content - New content
 * @returns New messages array with updated message
 *
 * @example
 * ```typescript
 * const updated = updateMessageContent(messages, 'msg-1', 'New content');
 * // Returns new array, original unchanged
 * ```
 */
export function updateMessageContent(
  messages: UIMessage[],
  messageId: string,
  content: string,
): UIMessage[] {
  return messages.map((m) => (m.id === messageId ? { ...m, content } : m));
}

/**
 * Append to message content immutably
 *
 * @param messages - Current messages array
 * @param messageId - ID of message to update
 * @param delta - Content to append
 * @returns New messages array
 */
export function appendMessageContent(
  messages: UIMessage[],
  messageId: string,
  delta: string,
): UIMessage[] {
  return messages.map((m) =>
    m.id === messageId ? { ...m, content: m.content + delta } : m,
  );
}

/**
 * Update message thinking content
 *
 * @param messages - Current messages array
 * @param messageId - ID of message to update
 * @param thinking - New thinking content
 * @returns New messages array
 */
export function updateMessageThinking(
  messages: UIMessage[],
  messageId: string,
  thinking: string,
): UIMessage[] {
  return messages.map((m) => (m.id === messageId ? { ...m, thinking } : m));
}

/**
 * Append to message thinking
 */
export function appendMessageThinking(
  messages: UIMessage[],
  messageId: string,
  delta: string,
): UIMessage[] {
  return messages.map((m) =>
    m.id === messageId ? { ...m, thinking: (m.thinking ?? "") + delta } : m,
  );
}

/**
 * Update message with streaming state
 *
 * @param messages - Current messages array
 * @param messageId - ID of message to update
 * @param updates - Partial updates to apply
 * @returns New messages array
 */
export function updateMessage(
  messages: UIMessage[],
  messageId: string,
  updates: Partial<UIMessage>,
): UIMessage[] {
  return messages.map((m) => (m.id === messageId ? { ...m, ...updates } : m));
}

/**
 * Remove a message by ID
 *
 * @param messages - Current messages array
 * @param messageId - ID of message to remove
 * @returns New messages array without the message
 */
export function removeMessage(
  messages: UIMessage[],
  messageId: string,
): UIMessage[] {
  return messages.filter((m) => m.id !== messageId);
}

/**
 * Find message by ID
 *
 * @param messages - Messages array
 * @param messageId - ID to find
 * @returns Message or undefined
 */
export function findMessage(
  messages: UIMessage[],
  messageId: string,
): UIMessage | undefined {
  return messages.find((m) => m.id === messageId);
}

/**
 * Get the last message
 *
 * @param messages - Messages array
 * @returns Last message or undefined
 */
export function getLastMessage(messages: UIMessage[]): UIMessage | undefined {
  return messages[messages.length - 1];
}

/**
 * Get the last assistant message
 *
 * @param messages - Messages array
 * @returns Last assistant message or undefined
 */
export function getLastAssistantMessage(
  messages: UIMessage[],
): UIMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      return messages[i];
    }
  }
  return undefined;
}

/**
 * Check if messages have pending tool calls
 *
 * @param messages - Messages array
 * @returns True if last assistant message has tool calls
 */
export function hasPendingToolCalls(messages: UIMessage[]): boolean {
  const lastAssistant = getLastAssistantMessage(messages);
  return (lastAssistant?.toolCalls?.length ?? 0) > 0;
}
