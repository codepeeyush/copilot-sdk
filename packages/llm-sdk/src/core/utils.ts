/**
 * Utility functions for llm-sdk
 */

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a message ID
 */
export function generateMessageId(): string {
  return generateId("msg");
}

/**
 * Generate a conversation/thread ID
 */
export function generateThreadId(): string {
  return generateId("thread");
}

/**
 * Generate a tool call ID
 */
export function generateToolCallId(): string {
  return generateId("call");
}
