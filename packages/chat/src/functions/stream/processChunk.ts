/**
 * Stream Chunk Processing Functions
 *
 * Pure functions for processing stream chunks.
 * Returns new state without mutating input.
 */

import type { StreamChunk } from "../../interfaces";
import type { StreamingMessageState } from "../../types/index";

/**
 * Process a stream chunk and return updated state
 *
 * This is a pure function - it takes state and chunk,
 * returns new state without mutating the input.
 *
 * @param chunk - Stream chunk to process
 * @param state - Current streaming state
 * @returns New streaming state
 *
 * @example
 * ```typescript
 * let state = createStreamState('msg-1');
 *
 * state = processStreamChunk(
 *   { type: 'message:delta', content: 'Hello' },
 *   state
 * );
 * // state.content === 'Hello'
 *
 * state = processStreamChunk(
 *   { type: 'message:delta', content: ' World' },
 *   state
 * );
 * // state.content === 'Hello World'
 * ```
 */
export function processStreamChunk(
  chunk: StreamChunk,
  state: StreamingMessageState,
): StreamingMessageState {
  switch (chunk.type) {
    case "message:start":
      return {
        ...state,
        messageId: chunk.id,
      };

    case "message:delta":
      return {
        ...state,
        content: state.content + chunk.content,
      };

    case "message:end":
      return {
        ...state,
        finishReason: "stop",
      };

    case "thinking:delta":
      return {
        ...state,
        thinking: state.thinking + chunk.content,
      };

    case "tool_calls":
      return {
        ...state,
        toolCalls: parseToolCalls(chunk.toolCalls),
        requiresAction: true,
      };

    case "done":
      return {
        ...state,
        requiresAction: chunk.requiresAction ?? false,
        finishReason: "stop",
      };

    case "error":
      return {
        ...state,
        finishReason: "error",
      };

    default:
      // Unknown chunk type, return unchanged
      return state;
  }
}

/**
 * Parse raw tool calls into typed format
 */
function parseToolCalls(
  rawToolCalls: unknown[],
): Array<{ id: string; name: string; args: Record<string, unknown> }> {
  return rawToolCalls.map((tc) => {
    const toolCall = tc as {
      id: string;
      function?: { name: string; arguments: string };
      name?: string;
      args?: Record<string, unknown>;
    };

    // Handle both OpenAI format and simplified format
    if (toolCall.function) {
      return {
        id: toolCall.id,
        name: toolCall.function.name,
        args: JSON.parse(toolCall.function.arguments),
      };
    }

    return {
      id: toolCall.id,
      name: toolCall.name ?? "",
      args: toolCall.args ?? {},
    };
  });
}

/**
 * Create initial streaming state
 *
 * @param messageId - ID for the message being built
 * @returns Initial streaming state
 */
export function createStreamState(messageId: string): StreamingMessageState {
  return {
    messageId,
    content: "",
    thinking: "",
    toolCalls: [],
    requiresAction: false,
    finishReason: undefined,
  };
}

/**
 * Check if streaming is complete
 */
export function isStreamComplete(state: StreamingMessageState): boolean {
  return state.finishReason !== undefined;
}

/**
 * Check if stream has content
 */
export function hasContent(state: StreamingMessageState): boolean {
  return state.content.length > 0 || state.thinking.length > 0;
}
