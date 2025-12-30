/**
 * SSE Parsing Functions
 *
 * Pure functions for parsing Server-Sent Events.
 * No side effects, easy to test.
 */

import type { StreamChunk } from "../../interfaces";

/**
 * Parse a single SSE line into an event
 *
 * @param line - Raw SSE line (e.g., "data: {...}")
 * @returns Parsed stream chunk or null if not a data line
 *
 * @example
 * ```typescript
 * const chunk = parseSSELine('data: {"type":"message:delta","content":"Hi"}');
 * // { type: 'message:delta', content: 'Hi' }
 *
 * const empty = parseSSELine('');
 * // null
 *
 * const comment = parseSSELine(': heartbeat');
 * // null
 * ```
 */
export function parseSSELine(line: string): StreamChunk | null {
  // Skip empty lines
  if (!line || line.trim() === "") {
    return null;
  }

  // Skip comments (lines starting with :)
  if (line.startsWith(":")) {
    return null;
  }

  // Parse data lines
  if (line.startsWith("data: ")) {
    const data = line.slice(6); // Remove "data: " prefix

    // Handle [DONE] marker
    if (data === "[DONE]") {
      return { type: "done" };
    }

    try {
      return JSON.parse(data) as StreamChunk;
    } catch {
      // Invalid JSON, skip
      return null;
    }
  }

  // Skip other SSE fields (event:, id:, retry:)
  return null;
}

/**
 * Parse multiple SSE lines (batch processing)
 *
 * @param text - Raw SSE text with multiple lines
 * @returns Array of parsed chunks (excludes nulls)
 *
 * @example
 * ```typescript
 * const chunks = parseSSEText(`
 * data: {"type":"message:start","id":"1"}
 *
 * data: {"type":"message:delta","content":"Hello"}
 *
 * data: {"type":"message:end"}
 * `);
 * // [
 * //   { type: 'message:start', id: '1' },
 * //   { type: 'message:delta', content: 'Hello' },
 * //   { type: 'message:end' }
 * // ]
 * ```
 */
export function parseSSEText(text: string): StreamChunk[] {
  return text
    .split("\n")
    .map(parseSSELine)
    .filter((chunk): chunk is StreamChunk => chunk !== null);
}

/**
 * Check if a chunk indicates the stream is done
 */
export function isStreamDone(chunk: StreamChunk): boolean {
  return chunk.type === "done" || chunk.type === "error";
}

/**
 * Check if a chunk indicates tool calls need execution
 */
export function requiresToolExecution(chunk: StreamChunk): boolean {
  if (chunk.type === "done" && chunk.requiresAction) {
    return true;
  }
  if (chunk.type === "tool_calls") {
    return true;
  }
  return false;
}
