"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type {
  ToolsConfig,
  ToolType,
  CapturedContext,
  ToolConsentRequest,
  ToolConsentResponse,
  IntentDetectionResult,
  ScreenshotOptions,
  ConsoleLogOptions,
  NetworkRequestOptions,
} from "@yourgpt/copilot-sdk-core";
import {
  // Screenshot
  captureScreenshot,
  isScreenshotSupported,
  // Console
  startConsoleCapture,
  stopConsoleCapture,
  getConsoleLogs,
  clearConsoleLogs,
  isConsoleCaptureActive,
  formatLogsForAI,
  // Network
  startNetworkCapture,
  stopNetworkCapture,
  getNetworkRequests,
  clearNetworkRequests,
  isNetworkCaptureActive,
  formatRequestsForAI,
  // Intent
  detectIntent,
  generateSuggestionReason,
} from "@yourgpt/copilot-sdk-core";

/**
 * useAITools options
 */
export interface UseAIToolsOptions extends ToolsConfig {
  /** Callback when consent is requested */
  onConsentRequest?: (
    request: ToolConsentRequest,
  ) => Promise<ToolConsentResponse>;
  /** Auto-start capturing when enabled */
  autoStart?: boolean;
}

/**
 * useAITools return type
 */
export interface UseAIToolsReturn {
  /** Whether tools are enabled */
  isEnabled: boolean;
  /** Currently active captures */
  activeCaptures: {
    console: boolean;
    network: boolean;
  };
  /** Capture screenshot */
  captureScreenshot: (
    options?: ScreenshotOptions,
  ) => Promise<CapturedContext["screenshot"]>;
  /** Get console logs */
  getConsoleLogs: (
    options?: ConsoleLogOptions,
  ) => CapturedContext["consoleLogs"];
  /** Get network requests */
  getNetworkRequests: (
    options?: NetworkRequestOptions,
  ) => CapturedContext["networkRequests"];
  /** Capture all enabled context */
  captureContext: (tools?: ToolType[]) => Promise<CapturedContext>;
  /** Detect intent from message */
  detectIntent: (message: string) => IntentDetectionResult;
  /** Request consent for tools */
  requestConsent: (
    tools: ToolType[],
    reason?: string,
  ) => Promise<ToolConsentResponse>;
  /** Start capturing */
  startCapturing: () => void;
  /** Stop capturing */
  stopCapturing: () => void;
  /** Clear captured data */
  clearCaptured: () => void;
  /** Format captured context for AI */
  formatForAI: (context: CapturedContext) => string;
  /** Pending consent request (for UI) */
  pendingConsent: ToolConsentRequest | null;
  /** Respond to consent request */
  respondToConsent: (response: ToolConsentResponse) => void;
}

/**
 * Hook for AI Smart Context Tools
 *
 * Provides React integration for screenshot, console, and network capture
 * with consent-based UX and intent detection.
 *
 * @example
 * ```tsx
 * const {
 *   captureScreenshot,
 *   getConsoleLogs,
 *   detectIntent,
 *   pendingConsent,
 *   respondToConsent,
 * } = useAITools({
 *   screenshot: true,
 *   console: true,
 *   network: true,
 *   requireConsent: true,
 * });
 *
 * // Detect if tools are needed based on user message
 * const handleMessage = async (message: string) => {
 *   const intent = detectIntent(message);
 *
 *   if (intent.suggestedTools.length > 0) {
 *     const consent = await requestConsent(
 *       intent.suggestedTools,
 *       generateSuggestionReason(intent)
 *     );
 *
 *     if (consent.approved.length > 0) {
 *       const context = await captureContext(consent.approved);
 *       // Include context with message
 *     }
 *   }
 * };
 * ```
 */
export function useAITools(options: UseAIToolsOptions = {}): UseAIToolsReturn {
  const {
    screenshot = false,
    console: consoleCapture = false,
    network = false,
    requireConsent = true,
    screenshotOptions,
    consoleOptions,
    networkOptions,
    onConsentRequest,
    autoStart = true,
  } = options;

  // State
  const [isEnabled] = useState(screenshot || consoleCapture || network);
  const [activeCaptures, setActiveCaptures] = useState({
    console: false,
    network: false,
  });
  const [pendingConsent, setPendingConsent] =
    useState<ToolConsentRequest | null>(null);

  // Refs for consent resolution
  const consentResolverRef = useRef<
    ((response: ToolConsentResponse) => void) | null
  >(null);

  // Remembered consent preferences
  const rememberedConsentRef = useRef<Set<ToolType>>(new Set());

  // Start capturing on mount if autoStart
  useEffect(() => {
    if (!autoStart || !isEnabled) return;

    if (consoleCapture && !isConsoleCaptureActive()) {
      startConsoleCapture(consoleOptions);
      setActiveCaptures((prev) => ({ ...prev, console: true }));
    }

    if (network && !isNetworkCaptureActive()) {
      startNetworkCapture(networkOptions);
      setActiveCaptures((prev) => ({ ...prev, network: true }));
    }

    return () => {
      stopConsoleCapture();
      stopNetworkCapture();
    };
  }, [
    autoStart,
    isEnabled,
    consoleCapture,
    network,
    consoleOptions,
    networkOptions,
  ]);

  // Capture screenshot
  const captureScreenshotFn = useCallback(
    async (opts?: ScreenshotOptions) => {
      if (!screenshot) {
        throw new Error("Screenshot capture is not enabled");
      }

      if (!isScreenshotSupported()) {
        throw new Error(
          "Screenshot capture is not supported in this environment",
        );
      }

      return captureScreenshot({ ...screenshotOptions, ...opts });
    },
    [screenshot, screenshotOptions],
  );

  // Get console logs
  const getConsoleLogsFn = useCallback(
    (opts?: ConsoleLogOptions) => {
      if (!consoleCapture) {
        return { logs: [], totalCaptured: 0 };
      }

      return getConsoleLogs({ ...consoleOptions, ...opts });
    },
    [consoleCapture, consoleOptions],
  );

  // Get network requests
  const getNetworkRequestsFn = useCallback(
    (opts?: NetworkRequestOptions) => {
      if (!network) {
        return { requests: [], totalCaptured: 0 };
      }

      return getNetworkRequests({ ...networkOptions, ...opts });
    },
    [network, networkOptions],
  );

  // Request consent
  const requestConsent = useCallback(
    async (tools: ToolType[], reason = ""): Promise<ToolConsentResponse> => {
      const enabledTools = tools.filter((tool) => {
        if (tool === "screenshot") return screenshot;
        if (tool === "console") return consoleCapture;
        if (tool === "network") return network;
        return false;
      });

      if (enabledTools.length === 0) {
        return { approved: [], denied: [] };
      }

      if (!requireConsent) {
        return { approved: enabledTools, denied: [] };
      }

      const needsConsent = enabledTools.filter(
        (tool) => !rememberedConsentRef.current.has(tool),
      );

      if (needsConsent.length === 0) {
        return { approved: enabledTools, denied: [] };
      }

      const request: ToolConsentRequest = {
        tools: needsConsent,
        reason,
        keywords: [],
      };

      if (onConsentRequest) {
        const response = await onConsentRequest(request);
        if (response.remember) {
          response.approved.forEach((tool) =>
            rememberedConsentRef.current.add(tool),
          );
        }
        return response;
      }

      return new Promise((resolve) => {
        setPendingConsent(request);
        consentResolverRef.current = (response) => {
          if (response.remember) {
            response.approved.forEach((tool) =>
              rememberedConsentRef.current.add(tool),
            );
          }
          resolve(response);
        };
      });
    },
    [screenshot, consoleCapture, network, requireConsent, onConsentRequest],
  );

  // Respond to consent
  const respondToConsent = useCallback((response: ToolConsentResponse) => {
    if (consentResolverRef.current) {
      consentResolverRef.current(response);
      consentResolverRef.current = null;
    }
    setPendingConsent(null);
  }, []);

  // Capture context
  const captureContext = useCallback(
    async (tools?: ToolType[]): Promise<CapturedContext> => {
      const toolsToCapture =
        tools || (["screenshot", "console", "network"] as ToolType[]);
      const context: CapturedContext = {
        timestamp: Date.now(),
      };

      const captures: Promise<void>[] = [];

      if (toolsToCapture.includes("screenshot") && screenshot) {
        captures.push(
          captureScreenshotFn()
            .then((result) => {
              context.screenshot = result;
            })
            .catch(() => {}),
        );
      }

      if (toolsToCapture.includes("console") && consoleCapture) {
        context.consoleLogs = getConsoleLogsFn();
      }

      if (toolsToCapture.includes("network") && network) {
        context.networkRequests = getNetworkRequestsFn();
      }

      await Promise.all(captures);
      return context;
    },
    [
      screenshot,
      consoleCapture,
      network,
      captureScreenshotFn,
      getConsoleLogsFn,
      getNetworkRequestsFn,
    ],
  );

  // Start capturing
  const startCapturing = useCallback(() => {
    if (consoleCapture && !isConsoleCaptureActive()) {
      startConsoleCapture(consoleOptions);
      setActiveCaptures((prev) => ({ ...prev, console: true }));
    }

    if (network && !isNetworkCaptureActive()) {
      startNetworkCapture(networkOptions);
      setActiveCaptures((prev) => ({ ...prev, network: true }));
    }
  }, [consoleCapture, network, consoleOptions, networkOptions]);

  // Stop capturing
  const stopCapturing = useCallback(() => {
    stopConsoleCapture();
    stopNetworkCapture();
    setActiveCaptures({ console: false, network: false });
  }, []);

  // Clear captured data
  const clearCaptured = useCallback(() => {
    clearConsoleLogs();
    clearNetworkRequests();
  }, []);

  // Format captured context for AI
  const formatForAI = useCallback((context: CapturedContext): string => {
    const parts: string[] = [];

    if (context.screenshot) {
      parts.push(
        `Screenshot captured (${context.screenshot.width}x${context.screenshot.height}, ${context.screenshot.format})`,
      );
    }

    if (context.consoleLogs && context.consoleLogs.logs.length > 0) {
      parts.push(formatLogsForAI(context.consoleLogs.logs));
    }

    if (
      context.networkRequests &&
      context.networkRequests.requests.length > 0
    ) {
      parts.push(formatRequestsForAI(context.networkRequests.requests));
    }

    return parts.length > 0
      ? parts.join("\n\n---\n\n")
      : "No context captured.";
  }, []);

  // Detect intent wrapper
  const detectIntentFn = useCallback(
    (message: string): IntentDetectionResult => {
      const result = detectIntent(message);

      result.suggestedTools = result.suggestedTools.filter((tool) => {
        if (tool === "screenshot") return screenshot;
        if (tool === "console") return consoleCapture;
        if (tool === "network") return network;
        return false;
      });

      return result;
    },
    [screenshot, consoleCapture, network],
  );

  return useMemo(
    () => ({
      isEnabled,
      activeCaptures,
      captureScreenshot: captureScreenshotFn,
      getConsoleLogs: getConsoleLogsFn,
      getNetworkRequests: getNetworkRequestsFn,
      captureContext,
      detectIntent: detectIntentFn,
      requestConsent,
      startCapturing,
      stopCapturing,
      clearCaptured,
      formatForAI,
      pendingConsent,
      respondToConsent,
    }),
    [
      isEnabled,
      activeCaptures,
      captureScreenshotFn,
      getConsoleLogsFn,
      getNetworkRequestsFn,
      captureContext,
      detectIntentFn,
      requestConsent,
      startCapturing,
      stopCapturing,
      clearCaptured,
      formatForAI,
      pendingConsent,
      respondToConsent,
    ],
  );
}

// Re-export for convenience
export { generateSuggestionReason };
