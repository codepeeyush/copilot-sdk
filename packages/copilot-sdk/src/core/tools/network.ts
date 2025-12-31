/**
 * Network Request Capture Tool
 *
 * Intercepts fetch and XHR requests to capture network activity.
 * Framework-agnostic implementation.
 */

import type {
  HttpMethod,
  NetworkRequestEntry,
  NetworkRequestOptions,
  NetworkRequestResult,
} from "./types";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Store for captured requests
let capturedRequests: NetworkRequestEntry[] = [];
let isCapturing = false;
let captureOptions: Required<NetworkRequestOptions>;

// Original fetch and XHR
const originalFetch = isBrowser ? window.fetch.bind(window) : null;
const originalXHROpen = isBrowser ? XMLHttpRequest.prototype.open : null;
const originalXHRSend = isBrowser ? XMLHttpRequest.prototype.send : null;

/**
 * Default capture options
 */
const DEFAULT_OPTIONS: Required<NetworkRequestOptions> = {
  limit: 50,
  failedOnly: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  includeUrls: [],
  excludeUrls: [],
  captureRequestBody: true,
  captureResponseBody: true,
  maxBodySize: 10000, // 10KB
};

/**
 * Sanitize headers to remove sensitive information
 */
function sanitizeHeaders(
  headers: Headers | Record<string, string> | null,
): Record<string, string> {
  const sensitiveHeaders = [
    "authorization",
    "cookie",
    "set-cookie",
    "x-api-key",
    "api-key",
    "x-auth-token",
  ];

  const result: Record<string, string> = {};

  if (!headers) {
    return result;
  }

  const entries =
    headers instanceof Headers
      ? Array.from(headers.entries())
      : Object.entries(headers);

  for (const [key, value] of entries) {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Truncate body if it exceeds max size
 */
function truncateBody(body: unknown, maxSize: number): unknown {
  if (body === null || body === undefined) {
    return body;
  }

  try {
    const str = typeof body === "string" ? body : JSON.stringify(body);
    if (str.length > maxSize) {
      return `${str.slice(0, maxSize)}... [truncated, total: ${str.length} chars]`;
    }
    return body;
  } catch {
    return "[Unable to serialize body]";
  }
}

/**
 * Check if URL matches any pattern
 */
function matchesPatterns(url: string, patterns: RegExp[]): boolean {
  if (patterns.length === 0) return false;
  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Check if request should be captured
 */
function shouldCapture(
  url: string,
  method: HttpMethod,
  failed: boolean,
): boolean {
  // Check failed only
  if (captureOptions.failedOnly && !failed) {
    return false;
  }

  // Check method
  if (!captureOptions.methods.includes(method)) {
    return false;
  }

  // Check exclude patterns
  if (matchesPatterns(url, captureOptions.excludeUrls)) {
    return false;
  }

  // Check include patterns (if specified, URL must match)
  if (
    captureOptions.includeUrls.length > 0 &&
    !matchesPatterns(url, captureOptions.includeUrls)
  ) {
    return false;
  }

  return true;
}

/**
 * Add a captured request
 */
function addCapturedRequest(entry: NetworkRequestEntry): void {
  capturedRequests.push(entry);

  // Enforce limit
  while (capturedRequests.length > captureOptions.limit) {
    capturedRequests.shift();
  }
}

/**
 * Create intercepted fetch function
 */
function createFetchInterceptor() {
  return async function interceptedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const startTime = Date.now();
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const method = (init?.method?.toUpperCase() || "GET") as HttpMethod;

    let requestBody: unknown;
    if (captureOptions.captureRequestBody && init?.body) {
      try {
        if (typeof init.body === "string") {
          requestBody = JSON.parse(init.body);
        } else {
          requestBody = init.body;
        }
      } catch {
        requestBody = init.body;
      }
    }

    try {
      const response = await originalFetch!(input, init);
      const duration = Date.now() - startTime;
      const failed = !response.ok;

      if (shouldCapture(url, method, failed)) {
        let responseBody: unknown;

        // Clone response to read body without consuming it
        if (captureOptions.captureResponseBody && failed) {
          try {
            const clone = response.clone();
            const text = await clone.text();
            try {
              responseBody = JSON.parse(text);
            } catch {
              responseBody = text;
            }
          } catch {
            responseBody = "[Unable to read response body]";
          }
        }

        const entry: NetworkRequestEntry = {
          url,
          method,
          status: response.status,
          statusText: response.statusText,
          failed,
          requestHeaders: sanitizeHeaders(
            init?.headers as Record<string, string> | null,
          ),
          responseHeaders: sanitizeHeaders(response.headers),
          requestBody: truncateBody(requestBody, captureOptions.maxBodySize),
          responseBody: truncateBody(responseBody, captureOptions.maxBodySize),
          duration,
          timestamp: startTime,
        };

        addCapturedRequest(entry);
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (shouldCapture(url, method, true)) {
        const entry: NetworkRequestEntry = {
          url,
          method,
          status: 0,
          statusText: "Network Error",
          failed: true,
          requestBody: truncateBody(requestBody, captureOptions.maxBodySize),
          duration,
          timestamp: startTime,
          error: error instanceof Error ? error.message : String(error),
        };

        addCapturedRequest(entry);
      }

      throw error;
    }
  };
}

/**
 * Start capturing network requests
 *
 * @param options - Capture options
 *
 * @example
 * ```typescript
 * // Start capturing failed requests only (default)
 * startNetworkCapture();
 *
 * // Capture all requests
 * startNetworkCapture({ failedOnly: false });
 *
 * // Capture only specific API
 * startNetworkCapture({
 *   includeUrls: [/api\.example\.com/],
 *   failedOnly: false
 * });
 * ```
 */
export function startNetworkCapture(options: NetworkRequestOptions = {}): void {
  if (!isBrowser) {
    console.warn("Network capture is only available in browser environment");
    return;
  }

  if (isCapturing) {
    console.warn("Network capture already active");
    return;
  }

  captureOptions = { ...DEFAULT_OPTIONS, ...options };
  isCapturing = true;

  // Override fetch
  window.fetch = createFetchInterceptor();

  // Override XHR
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ) {
    (this as XMLHttpRequest & { _captureData: unknown })._captureData = {
      method: method.toUpperCase() as HttpMethod,
      url: url.toString(),
      startTime: 0,
    };

    return originalXHROpen!.call(
      this,
      method,
      url,
      async as boolean,
      username,
      password,
    );
  };

  XMLHttpRequest.prototype.send = function (
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    const xhr = this as XMLHttpRequest & {
      _captureData: {
        method: HttpMethod;
        url: string;
        startTime: number;
        requestBody?: unknown;
      };
    };

    if (xhr._captureData) {
      xhr._captureData.startTime = Date.now();

      if (captureOptions.captureRequestBody && body) {
        try {
          if (typeof body === "string") {
            xhr._captureData.requestBody = JSON.parse(body);
          } else {
            xhr._captureData.requestBody = body;
          }
        } catch {
          xhr._captureData.requestBody = body;
        }
      }

      // Listen for completion
      const originalOnReadyStateChange = xhr.onreadystatechange;
      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const duration = Date.now() - xhr._captureData.startTime;
          const failed = xhr.status === 0 || xhr.status >= 400;

          if (
            shouldCapture(xhr._captureData.url, xhr._captureData.method, failed)
          ) {
            let responseBody: unknown;

            if (captureOptions.captureResponseBody && failed) {
              try {
                responseBody =
                  xhr.responseType === "" || xhr.responseType === "text"
                    ? JSON.parse(xhr.responseText)
                    : xhr.response;
              } catch {
                responseBody = xhr.responseText || xhr.response;
              }
            }

            const entry: NetworkRequestEntry = {
              url: xhr._captureData.url,
              method: xhr._captureData.method,
              status: xhr.status,
              statusText: xhr.statusText,
              failed,
              requestBody: truncateBody(
                xhr._captureData.requestBody,
                captureOptions.maxBodySize,
              ),
              responseBody: truncateBody(
                responseBody,
                captureOptions.maxBodySize,
              ),
              duration,
              timestamp: xhr._captureData.startTime,
            };

            addCapturedRequest(entry);
          }
        }

        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.call(xhr, event);
        }
      };
    }

    return originalXHRSend!.call(this, body);
  };
}

/**
 * Stop capturing network requests
 */
export function stopNetworkCapture(): void {
  if (!isBrowser || !isCapturing) {
    return;
  }

  isCapturing = false;

  // Restore original fetch
  window.fetch = originalFetch!;

  // Restore original XHR
  XMLHttpRequest.prototype.open = originalXHROpen!;
  XMLHttpRequest.prototype.send = originalXHRSend!;
}

/**
 * Get captured network requests
 *
 * @param options - Filter options
 * @returns Captured requests
 *
 * @example
 * ```typescript
 * // Get all captured requests
 * const { requests } = getNetworkRequests();
 *
 * // Get only failed POST requests
 * const { requests } = getNetworkRequests({
 *   methods: ['POST'],
 *   failedOnly: true
 * });
 * ```
 */
export function getNetworkRequests(
  options: NetworkRequestOptions = {},
): NetworkRequestResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let requests = [...capturedRequests];

  // Filter by failed only
  if (opts.failedOnly) {
    requests = requests.filter((r) => r.failed);
  }

  // Filter by method
  if (opts.methods.length < DEFAULT_OPTIONS.methods.length) {
    requests = requests.filter((r) => opts.methods.includes(r.method));
  }

  // Filter by URL patterns
  if (opts.includeUrls.length > 0) {
    requests = requests.filter((r) => matchesPatterns(r.url, opts.includeUrls));
  }

  if (opts.excludeUrls.length > 0) {
    requests = requests.filter(
      (r) => !matchesPatterns(r.url, opts.excludeUrls),
    );
  }

  // Apply limit
  const totalCaptured = requests.length;
  requests = requests.slice(-opts.limit);

  return {
    requests,
    totalCaptured,
  };
}

/**
 * Clear captured network requests
 */
export function clearNetworkRequests(): void {
  capturedRequests = [];
}

/**
 * Check if network capture is active
 */
export function isNetworkCaptureActive(): boolean {
  return isCapturing;
}

/**
 * Get failed requests only (convenience function)
 */
export function getFailedRequests(limit = 20): NetworkRequestEntry[] {
  return getNetworkRequests({ failedOnly: true, limit }).requests;
}

/**
 * Format network requests for AI context
 *
 * @param requests - Request entries to format
 * @returns Formatted string for AI consumption
 */
export function formatRequestsForAI(requests: NetworkRequestEntry[]): string {
  if (requests.length === 0) {
    return "No network requests captured.";
  }

  const formatted = requests.map((req, index) => {
    const time = new Date(req.timestamp).toISOString();
    const statusIcon = req.failed ? "❌" : "✅";

    let text = `[${index + 1}] ${statusIcon} ${req.method} ${req.url}\n`;
    text += `    Status: ${req.status} ${req.statusText}\n`;
    text += `    Duration: ${req.duration}ms\n`;
    text += `    Time: ${time}`;

    if (req.error) {
      text += `\n    Error: ${req.error}`;
    }

    if (req.responseBody && req.failed) {
      const bodyStr =
        typeof req.responseBody === "string"
          ? req.responseBody
          : JSON.stringify(req.responseBody, null, 2);
      text += `\n    Response Body:\n      ${bodyStr.split("\n").join("\n      ")}`;
    }

    return text;
  });

  return `Network Requests (${requests.length} entries):\n\n${formatted.join("\n\n")}`;
}

// Auto-cleanup on page unload
if (isBrowser) {
  window.addEventListener("beforeunload", () => {
    stopNetworkCapture();
  });
}
