/**
 * Smart Context Tools
 *
 * Framework-agnostic tools for capturing app context:
 * - Screenshot capture
 * - Console log interception
 * - Network request capture
 * - Intent detection
 */

// Types
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
} from "./types";

// Screenshot
export {
  captureScreenshot,
  isScreenshotSupported,
  resizeScreenshot,
} from "./screenshot";

// Console
export {
  startConsoleCapture,
  stopConsoleCapture,
  getConsoleLogs,
  clearConsoleLogs,
  isConsoleCaptureActive,
  getConsoleErrors,
  getConsoleWarnings,
  formatLogsForAI,
  captureCurrentLogs,
} from "./console";

// Network
export {
  startNetworkCapture,
  stopNetworkCapture,
  getNetworkRequests,
  clearNetworkRequests,
  isNetworkCaptureActive,
  getFailedRequests,
  formatRequestsForAI,
} from "./network";

// Intent Detection
export {
  detectIntent,
  hasToolSuggestions,
  getPrimaryTool,
  generateSuggestionReason,
  createCustomDetector,
} from "./intentDetector";

export type { CustomKeywords } from "./intentDetector";
