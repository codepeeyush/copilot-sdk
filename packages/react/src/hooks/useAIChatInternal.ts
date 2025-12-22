"use client";

/**
 * Internal chat hook implementation
 *
 * This file contains the full implementation with all features.
 * It should NOT be exported directly to users.
 * Instead, use useAIChat (free) or useAIChatHeadless (premium).
 *
 * @internal
 */

import { useCallback } from "react";
import { useYourGPTContext } from "../context/YourGPTContext";
import { useThreadsContext } from "../context/ThreadsContext";
import type {
  Message,
  Thread,
  ThreadData,
  CapturedContext,
} from "@yourgpt/core";

/**
 * Full internal return type with all features
 * @internal
 */
export interface UseAIChatInternalReturn {
  // === State ===
  /** All messages in the conversation */
  messages: Message[];
  /** Whether a response is being generated */
  isLoading: boolean;
  /** Current error if any */
  error: Error | null;
  /** Sources from knowledge base */
  sources: ReturnType<typeof useYourGPTContext>["chat"]["sources"];
  /** Thread/conversation ID */
  threadId: string;

  // === Actions ===
  /** Send a message */
  sendMessage: (content: string) => Promise<void>;
  /** Send a message with captured context */
  sendMessageWithContext: (
    content: string,
    context: CapturedContext,
  ) => Promise<void>;
  /** Stop generation */
  stopGeneration: () => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Regenerate last response */
  regenerate: (messageId?: string) => Promise<void>;
  /** Set messages directly (PREMIUM) */
  setMessages: (messages: Message[]) => void;
  /** Delete a specific message (PREMIUM) */
  deleteMessage: (messageId: string) => void;
  /** Append a message (PREMIUM) */
  appendMessage: (message: Message) => void;
  /** Update a message (PREMIUM) */
  updateMessage: (messageId: string, content: string) => void;

  // === Threads ===
  /** List of all threads */
  threads: Thread[];
  /** Create a new thread */
  createThread: (title?: string) => string;
  /** Switch to a different thread */
  switchThread: (threadId: string) => void;
  /** Delete a thread */
  deleteThread: (threadId: string) => void;
  /** Get full thread data */
  getThreadData: (threadId: string) => ThreadData | undefined;

  // === Agent Loop (PREMIUM) ===
  /** Tool executions */
  toolExecutions: ReturnType<
    typeof useYourGPTContext
  >["agentLoop"]["toolExecutions"];
  /** Current loop iteration */
  loopIteration: number;
  /** Max loop iterations */
  loopMaxIterations: number;
  /** Whether max iterations was reached */
  loopMaxReached: boolean;
  /** Clear tool executions */
  clearToolExecutions: () => void;

  // === Meta ===
  /** Whether user has premium features */
  isPremium: boolean;
}

/**
 * Internal chat hook with full functionality
 *
 * @internal - Do not export directly
 */
export function useAIChatInternal(): UseAIChatInternalReturn {
  const ctx = useYourGPTContext();
  const threads = useThreadsContext();

  // Delete message implementation
  const deleteMessage = useCallback(
    (messageId: string) => {
      const filtered = ctx.chat.messages.filter((m) => m.id !== messageId);
      ctx.actions.setMessages(filtered);
    },
    [ctx.chat.messages, ctx.actions],
  );

  // Append message implementation
  const appendMessage = useCallback(
    (message: Message) => {
      ctx.actions.setMessages([...ctx.chat.messages, message]);
    },
    [ctx.chat.messages, ctx.actions],
  );

  // Update message implementation
  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      const updated = ctx.chat.messages.map((m) =>
        m.id === messageId ? { ...m, content } : m,
      );
      ctx.actions.setMessages(updated);
    },
    [ctx.chat.messages, ctx.actions],
  );

  return {
    // State
    messages: ctx.chat.messages,
    isLoading: ctx.chat.isLoading,
    error: ctx.chat.error,
    sources: ctx.chat.sources,
    threadId: threads.threadId,

    // Actions
    sendMessage: ctx.actions.sendMessage,
    sendMessageWithContext: ctx.actions.sendMessageWithContext,
    stopGeneration: ctx.actions.stopGeneration,
    clearMessages: ctx.actions.clearMessages,
    regenerate: ctx.actions.regenerate,
    setMessages: ctx.actions.setMessages,
    deleteMessage,
    appendMessage,
    updateMessage,

    // Threads
    threads: threads.threads,
    createThread: threads.createThread,
    switchThread: threads.setThreadId,
    deleteThread: threads.deleteThread,
    getThreadData: threads.getThreadData,

    // Agent Loop
    toolExecutions: ctx.agentLoop.toolExecutions,
    loopIteration: ctx.agentLoop.iteration,
    loopMaxIterations: ctx.agentLoop.maxIterations,
    loopMaxReached: ctx.agentLoop.maxIterationsReached,
    clearToolExecutions: ctx.clearToolExecutions || (() => {}),

    // Meta
    isPremium: ctx.isPremium,
  };
}
