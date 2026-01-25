// Runtime
export { Runtime, createRuntime } from "./runtime";
export type {
  RuntimeConfig,
  ChatRequest,
  ActionRequest,
  RequestContext,
  HandleRequestOptions,
  HandleRequestResult,
} from "./types";

// StreamResult (Industry Standard Pattern)
export {
  StreamResult,
  createStreamResult,
  type StreamResultOptions,
  type CollectedResult,
} from "./stream-result";

// Streaming utilities
export {
  createSSEHeaders,
  createTextStreamHeaders,
  formatSSEData,
  createEventStream,
  createSSEResponse,
  createTextStreamResponse,
  pipeSSEToResponse,
  pipeTextToResponse,
} from "./streaming";

// Framework integrations
export {
  createHonoApp,
  createNextHandler,
  createExpressMiddleware,
  createExpressHandler,
  createNodeHandler,
} from "./integrations";

// Agent loop
export {
  runAgentLoop,
  DEFAULT_MAX_ITERATIONS,
  type AgentLoopOptions,
} from "./agent-loop";
