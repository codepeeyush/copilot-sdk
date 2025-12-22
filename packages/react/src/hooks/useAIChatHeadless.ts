"use client";

import { useMemo } from "react";
import {
  useAIChatInternal,
  type UseAIChatInternalReturn,
} from "./useAIChatInternal";
import { useYourGPTContext } from "../context/YourGPTContext";

/**
 * Error codes for YourGPT SDK
 */
export enum YourGPTErrorCode {
  MISSING_API_KEY = "MISSING_API_KEY",
  INVALID_API_KEY = "INVALID_API_KEY",
  PREMIUM_FEATURE_REQUIRED = "PREMIUM_FEATURE_REQUIRED",
}

/**
 * YourGPT Error class
 */
export class YourGPTError extends Error {
  code: YourGPTErrorCode;
  severity: "error" | "warning";

  constructor(options: {
    code: YourGPTErrorCode;
    message: string;
    severity?: "error" | "warning";
  }) {
    super(options.message);
    this.name = "YourGPTError";
    this.code = options.code;
    this.severity = options.severity || "error";
  }
}

/**
 * Full headless return type (Premium)
 *
 * Provides complete access to chat state and actions.
 * Requires YourGPT API key.
 */
export type UseAIChatHeadlessReturn = UseAIChatInternalReturn;

/**
 * Non-functional fallback for when API key is missing
 */
function createNonFunctionalReturn(): UseAIChatHeadlessReturn {
  const noop = () => {};
  const noopAsync = async () => {};
  const noopString = () => "";

  return {
    // State (empty/default)
    messages: [],
    isLoading: false,
    error: new YourGPTError({
      code: YourGPTErrorCode.MISSING_API_KEY,
      message:
        "useAIChatHeadless requires a YourGPT API key. " +
        "Pass yourgptApiKey to YourGPTProvider or use useAIChat() for free tier.",
      severity: "warning",
    }),
    sources: [],
    threadId: "",

    // Actions (no-ops)
    sendMessage: noopAsync,
    sendMessageWithContext: noopAsync,
    stopGeneration: noop,
    clearMessages: noop,
    regenerate: noopAsync,
    setMessages: noop,
    deleteMessage: noop,
    appendMessage: noop,
    updateMessage: noop,

    // Threads (no-ops)
    threads: [],
    createThread: noopString,
    switchThread: noop,
    deleteThread: noop,
    getThreadData: () => undefined,

    // Agent Loop (empty)
    toolExecutions: [],
    loopIteration: 0,
    loopMaxIterations: 0,
    loopMaxReached: false,
    clearToolExecutions: noop,

    // Meta
    isPremium: false,
  };
}

/**
 * AI Chat Headless Hook (Premium)
 *
 * Provides full headless access to chat state and actions.
 * **Requires YourGPT API key** passed to YourGPTProvider.
 *
 * This hook exposes:
 * - Direct `messages` array access
 * - `setMessages`, `deleteMessage`, `appendMessage`, `updateMessage`
 * - Agent loop state (`toolExecutions`, `loopIteration`, etc.)
 * - Full thread management
 *
 * If no API key is provided, returns a non-functional fallback
 * with an error state (graceful degradation).
 *
 * @example
 * ```tsx
 * // Provider setup (with API key)
 * <YourGPTProvider
 *   yourgptApiKey="ygpt_..." // Required for headless
 *   runtimeUrl="/api/chat"
 * >
 *   <App />
 * </YourGPTProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Full headless usage
 * const {
 *   messages,
 *   setMessages,
 *   sendMessage,
 *   toolExecutions,
 *   loopIteration,
 * } = useAIChatHeadless();
 *
 * // Direct state manipulation
 * const handleClearHistory = () => setMessages([]);
 *
 * // Custom message rendering
 * return (
 *   <div>
 *     {messages.map(m => (
 *       <CustomMessage
 *         key={m.id}
 *         message={m}
 *         onDelete={() => deleteMessage(m.id)}
 *       />
 *     ))}
 *
 *     {toolExecutions.map(exec => (
 *       <ToolExecution key={exec.id} execution={exec} />
 *     ))}
 *
 *     <span>Loop: {loopIteration}/20</span>
 *   </div>
 * );
 * ```
 */
export function useAIChatHeadless(): UseAIChatHeadlessReturn {
  const { isPremium } = useYourGPTContext();
  const internal = useAIChatInternal();

  // Memoize the return to avoid unnecessary re-renders
  const result = useMemo(() => {
    // Gate: Require premium (API key)
    if (!isPremium) {
      // Log warning in development (safe for both browser and Node)
      if (typeof window !== "undefined" || typeof console !== "undefined") {
        console.warn(
          "[YourGPT] useAIChatHeadless requires a YourGPT API key. " +
            "Pass yourgptApiKey to YourGPTProvider. " +
            "Returning non-functional fallback.",
        );
      }
      return createNonFunctionalReturn();
    }

    // Premium user: return full API
    return internal;
  }, [isPremium, internal]);

  return result;
}

/**
 * Alias for useAIChatHeadless (CopilotKit-style naming)
 *
 * The `_c` suffix indicates this is a "cloud" / premium feature.
 */
export const useAIChatHeadless_c = useAIChatHeadless;
