/**
 * Tool types for App Context Awareness
 */

// ============================================
// Screenshot Tool Types
// ============================================

export interface ScreenshotOptions {
  /** Target element to capture (defaults to document.body) */
  element?: HTMLElement;
  /** Image quality (0.1-1.0, default 0.8) */
  quality?: number;
  /** Image format */
  format?: "png" | "jpeg" | "webp";
  /** Max width to scale down to */
  maxWidth?: number;
  /** Max height to scale down to */
  maxHeight?: number;
  /** Whether to include cursor */
  includeCursor?: boolean;
}

export interface ScreenshotResult {
  /** Base64-encoded image data */
  data: string;
  /** Image format */
  format: "png" | "jpeg" | "webp";
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /** Timestamp of capture */
  timestamp: number;
}

// ============================================
// Console Tool Types
// ============================================

export type ConsoleLogType = "log" | "info" | "warn" | "error" | "debug";

export interface ConsoleLogEntry {
  /** Type of console method */
  type: ConsoleLogType;
  /** Log message(s) */
  message: string;
  /** Additional arguments passed to console */
  args?: unknown[];
  /** Stack trace (for errors) */
  stack?: string;
  /** Timestamp */
  timestamp: number;
}

export interface ConsoleLogOptions {
  /** Types of logs to capture */
  types?: ConsoleLogType[];
  /** Maximum number of logs to store */
  limit?: number;
  /** Filter function */
  filter?: (entry: ConsoleLogEntry) => boolean;
}

export interface ConsoleLogResult {
  /** Captured log entries */
  logs: ConsoleLogEntry[];
  /** Total logs captured (before limit) */
  totalCaptured: number;
}

// ============================================
// Network Tool Types
// ============================================

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface NetworkRequestEntry {
  /** Request URL */
  url: string;
  /** HTTP method */
  method: HttpMethod;
  /** Response status code */
  status: number;
  /** Status text */
  statusText: string;
  /** Whether request failed (non-2xx or error) */
  failed: boolean;
  /** Request headers (sanitized) */
  requestHeaders?: Record<string, string>;
  /** Response headers (sanitized) */
  responseHeaders?: Record<string, string>;
  /** Request body (if captured) */
  requestBody?: unknown;
  /** Response body (if captured and failed) */
  responseBody?: unknown;
  /** Request duration in ms */
  duration: number;
  /** Timestamp of request start */
  timestamp: number;
  /** Error message if request failed */
  error?: string;
}

export interface NetworkRequestOptions {
  /** Maximum number of requests to store */
  limit?: number;
  /** Only capture failed requests (default: true) */
  failedOnly?: boolean;
  /** HTTP methods to capture */
  methods?: HttpMethod[];
  /** URL patterns to include (regex) */
  includeUrls?: RegExp[];
  /** URL patterns to exclude (regex) */
  excludeUrls?: RegExp[];
  /** Whether to capture request body */
  captureRequestBody?: boolean;
  /** Whether to capture response body */
  captureResponseBody?: boolean;
  /** Max body size to capture (bytes) */
  maxBodySize?: number;
}

export interface NetworkRequestResult {
  /** Captured network requests */
  requests: NetworkRequestEntry[];
  /** Total requests captured (before limit) */
  totalCaptured: number;
}

// ============================================
// Intent Detection Types
// ============================================

export type ToolType = "screenshot" | "console" | "network";

export interface IntentDetectionResult {
  /** Detected tools that might be helpful */
  suggestedTools: ToolType[];
  /** Confidence score (0-1) for each tool */
  confidence: Record<ToolType, number>;
  /** Keywords that triggered detection */
  matchedKeywords: Record<ToolType, string[]>;
}

// ============================================
// Tool Configuration Types
// ============================================

export interface ToolsConfig {
  /** Enable screenshot capture */
  screenshot?: boolean;
  /** Enable console log capture */
  console?: boolean;
  /** Enable network request capture */
  network?: boolean;
  /** Always require user consent before capturing (default: true) */
  requireConsent?: boolean;
  /** Screenshot-specific options */
  screenshotOptions?: ScreenshotOptions;
  /** Console-specific options */
  consoleOptions?: ConsoleLogOptions;
  /** Network-specific options */
  networkOptions?: NetworkRequestOptions;
}

export interface ToolConsentRequest {
  /** Tools being requested */
  tools: ToolType[];
  /** Reason for request (from intent detection) */
  reason: string;
  /** Keywords that triggered this request */
  keywords: string[];
}

export interface ToolConsentResponse {
  /** Tools user approved */
  approved: ToolType[];
  /** Tools user denied */
  denied: ToolType[];
  /** Remember preference for session */
  remember?: boolean;
}

// ============================================
// Captured Context Types
// ============================================

export interface CapturedContext {
  /** Screenshot data (if captured) */
  screenshot?: ScreenshotResult;
  /** Console logs (if captured) */
  consoleLogs?: ConsoleLogResult;
  /** Network requests (if captured) */
  networkRequests?: NetworkRequestResult;
  /** Timestamp of capture */
  timestamp: number;
}
