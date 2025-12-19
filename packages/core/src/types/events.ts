import type { Source } from "./message";

/**
 * Stream event types
 */
export type StreamEventType =
  | "message:start"
  | "message:delta"
  | "message:end"
  | "source:add"
  | "action:start"
  | "action:args"
  | "action:end"
  | "error"
  | "done";

/**
 * Base event interface
 */
interface BaseEvent {
  type: StreamEventType;
}

/**
 * Message started streaming
 */
export interface MessageStartEvent extends BaseEvent {
  type: "message:start";
  /** Message ID */
  id: string;
}

/**
 * Message content delta (incremental update)
 */
export interface MessageDeltaEvent extends BaseEvent {
  type: "message:delta";
  /** Content chunk */
  content: string;
}

/**
 * Message finished streaming
 */
export interface MessageEndEvent extends BaseEvent {
  type: "message:end";
}

/**
 * Knowledge base source added
 */
export interface SourceAddEvent extends BaseEvent {
  type: "source:add";
  /** Source document */
  source: Source;
}

/**
 * Action/tool execution started
 */
export interface ActionStartEvent extends BaseEvent {
  type: "action:start";
  /** Tool call ID */
  id: string;
  /** Action name */
  name: string;
}

/**
 * Action arguments (streaming)
 */
export interface ActionArgsEvent extends BaseEvent {
  type: "action:args";
  /** Tool call ID */
  id: string;
  /** Partial arguments JSON */
  args: string;
}

/**
 * Action execution completed
 */
export interface ActionEndEvent extends BaseEvent {
  type: "action:end";
  /** Tool call ID */
  id: string;
  /** Action name */
  name?: string;
  /** Result of the action */
  result?: unknown;
  /** Error if failed */
  error?: string;
}

/**
 * Error event
 */
export interface ErrorEvent extends BaseEvent {
  type: "error";
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
}

/**
 * Stream completed
 */
export interface DoneEvent extends BaseEvent {
  type: "done";
}

/**
 * Union of all stream events
 */
export type StreamEvent =
  | MessageStartEvent
  | MessageDeltaEvent
  | MessageEndEvent
  | SourceAddEvent
  | ActionStartEvent
  | ActionArgsEvent
  | ActionEndEvent
  | ErrorEvent
  | DoneEvent;

/**
 * Parse a stream event from JSON
 */
export function parseStreamEvent(data: string): StreamEvent | null {
  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    return null;
  }
}

/**
 * Serialize a stream event to JSON
 */
export function serializeStreamEvent(event: StreamEvent): string {
  return JSON.stringify(event);
}

/**
 * Format event for SSE
 */
export function formatSSE(event: StreamEvent): string {
  return `data: ${serializeStreamEvent(event)}\n\n`;
}
