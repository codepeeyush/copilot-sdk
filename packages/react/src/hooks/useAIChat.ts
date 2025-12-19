"use client";

import { useYourGPTContext } from "../context/YourGPTContext";
import { useThreadsContext } from "../context/ThreadsContext";
import type { Thread, ThreadData } from "@yourgpt/core";

/**
 * useAIChat hook return type
 */
export interface UseAIChatReturn {
  /** All messages in the conversation */
  messages: ReturnType<typeof useYourGPTContext>["chat"]["messages"];
  /** Whether a response is being generated */
  isLoading: boolean;
  /** Current error if any */
  error: Error | null;
  /** Sources from knowledge base */
  sources: ReturnType<typeof useYourGPTContext>["chat"]["sources"];
  /** Send a message */
  sendMessage: (content: string) => Promise<void>;
  /** Stop generation */
  stop: () => void;
  /** Stop generation (alias) */
  stopGeneration: () => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Regenerate last response */
  regenerate: (messageId?: string) => Promise<void>;
  /** Set messages directly */
  setMessages: ReturnType<typeof useYourGPTContext>["actions"]["setMessages"];
  /** Thread/conversation ID */
  threadId: string;
  /** Whether user has premium features (YourGPT API key) */
  isPremium: boolean;
  /** List of all threads */
  threads: Thread[];
  /** Create a new thread */
  createThread: (title?: string) => string;
  /** Switch to a different thread */
  switchThread: (threadId: string) => void;
  /** Get full thread data */
  getThreadData: (threadId: string) => ThreadData | undefined;
}

/**
 * Hook for AI chat functionality
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading } = useAIChat();
 *
 * return (
 *   <div>
 *     {messages.map(m => <div key={m.id}>{m.content}</div>)}
 *     <button onClick={() => sendMessage('Hello!')}>Send</button>
 *   </div>
 * );
 * ```
 */
export function useAIChat(): UseAIChatReturn {
  const { chat, actions, isPremium } = useYourGPTContext();
  const threads = useThreadsContext();

  return {
    messages: chat.messages,
    isLoading: chat.isLoading,
    error: chat.error,
    sources: chat.sources,
    threadId: threads.threadId,
    sendMessage: actions.sendMessage,
    stop: actions.stopGeneration,
    stopGeneration: actions.stopGeneration,
    clearMessages: actions.clearMessages,
    regenerate: actions.regenerate,
    setMessages: actions.setMessages,
    isPremium,
    threads: threads.threads,
    createThread: threads.createThread,
    switchThread: threads.setThreadId,
    getThreadData: threads.getThreadData,
  };
}

/**
 * Hook to check if premium features are enabled
 *
 * @example
 * ```tsx
 * const isPremium = useIsPremium();
 * // Use to conditionally hide "Powered by YourGPT"
 * ```
 */
export function useIsPremium(): boolean {
  const { isPremium } = useYourGPTContext();
  return isPremium;
}
