"use client";

import {
  useAIChatInternal,
  type UseAIChatInternalReturn,
} from "./useAIChatInternal";
import { useYourGPTContext } from "../context/YourGPTContext";

/**
 * Free tier useAIChat return type
 *
 * This is intentionally limited. For full headless access,
 * use useAIChatHeadless() with a YourGPT API key.
 *
 * Available in free tier:
 * - Basic control actions (stop, clear, regenerate)
 * - Thread management
 * - Loading/error state
 *
 * Hidden features (available in premium):
 * - messages, sendMessage (use CopilotChat component instead)
 * - setMessages, deleteMessage, appendMessage, updateMessage
 * - toolExecutions, loopIteration, loopMaxIterations
 * - sendMessageWithContext
 *
 * For chat UI, use the CopilotChat component which handles messages internally.
 */
export type UseAIChatReturn = Omit<
  UseAIChatInternalReturn,
  // === Hidden in free tier (Premium only) ===
  | "messages" // Premium: use CopilotChat component instead
  | "sendMessage" // Premium: use CopilotChat component instead
  | "setMessages" // Premium: direct state manipulation
  | "deleteMessage" // Premium: message manipulation
  | "appendMessage" // Premium: message manipulation
  | "updateMessage" // Premium: message manipulation
  | "sendMessageWithContext" // Premium: context attachment
  | "toolExecutions" // Premium: agent loop visibility
  | "loopIteration" // Premium: agent loop state
  | "loopMaxIterations" // Premium: agent loop config
  | "loopMaxReached" // Premium: agent loop state
  | "clearToolExecutions" // Premium: agent loop control
>;

/**
 * AI Chat hook (Free Tier)
 *
 * Provides control functionality for use with YourGPT UI components.
 * Messages and sendMessage are handled internally by CopilotChat component.
 *
 * For full headless access with direct message control, use `useAIChatHeadless()`
 * with a YourGPT API key.
 *
 * @example
 * ```tsx
 * // Use with CopilotChat component (recommended)
 * import { CopilotChat } from '@yourgpt/ui';
 *
 * function App() {
 *   return (
 *     <YourGPTProvider runtimeUrl="/api/chat">
 *       <CopilotChat title="AI Assistant" />
 *     </YourGPTProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Thread management
 * const { threads, createThread, switchThread } = useAIChat();
 *
 * return (
 *   <ThreadList
 *     threads={threads}
 *     onNewThread={() => createThread()}
 *     onSelectThread={switchThread}
 *   />
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Control actions
 * const { stopGeneration, clearMessages, isLoading } = useAIChat();
 *
 * return (
 *   <>
 *     <CopilotChat />
 *     <button onClick={stopGeneration} disabled={!isLoading}>Stop</button>
 *     <button onClick={clearMessages}>Clear</button>
 *   </>
 * );
 * ```
 */
export function useAIChat(): UseAIChatReturn {
  const internal = useAIChatInternal();

  // Return limited API (free tier)
  // messages and sendMessage are NOT exposed - use CopilotChat component
  return {
    // State (no messages - use CopilotChat component)
    isLoading: internal.isLoading,
    error: internal.error,
    sources: internal.sources,
    threadId: internal.threadId,

    // Control actions (no sendMessage - use CopilotChat component)
    stopGeneration: internal.stopGeneration,
    clearMessages: internal.clearMessages,
    regenerate: internal.regenerate,

    // Thread management
    threads: internal.threads,
    createThread: internal.createThread,
    switchThread: internal.switchThread,
    deleteThread: internal.deleteThread,
    getThreadData: internal.getThreadData,

    // Meta
    isPremium: internal.isPremium,
  };
}

/**
 * Hook to check if premium features are enabled
 *
 * Premium features include:
 * - Full headless mode (useAIChatHeadless)
 * - Direct message array access
 * - Hide "Powered by YourGPT" attribution
 * - Advanced agent loop visibility
 *
 * @example
 * ```tsx
 * const isPremium = useIsPremium();
 *
 * return (
 *   <Chat showPoweredBy={!isPremium} />
 * );
 * ```
 */
export function useIsPremium(): boolean {
  const { isPremium } = useYourGPTContext();
  return isPremium;
}
