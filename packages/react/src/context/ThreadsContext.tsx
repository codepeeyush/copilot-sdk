"use client";

import { createContext, useContext } from "react";
import type { Thread, ThreadData } from "@yourgpt/core";

/**
 * Threads context value interface
 */
export interface ThreadsContextValue {
  /** Current active thread ID */
  threadId: string;
  /** Set active thread ID (switch to a thread) */
  setThreadId: (id: string) => void;

  /** List of all threads (metadata only) */
  threads: Thread[];
  /** Get full thread data including messages */
  getThreadData: (threadId: string) => ThreadData | undefined;

  /** Create a new thread */
  createThread: (title?: string) => string;
  /** Delete a thread */
  deleteThread: (threadId: string) => void;
  /** Clear a thread's messages (keep the thread) */
  clearThread: (threadId: string) => void;
  /** Update thread title */
  updateThreadTitle: (threadId: string, title: string) => void;

  /** Whether persistence is enabled */
  persistenceEnabled: boolean;
}

/**
 * Default context value (throws if used outside provider)
 */
const defaultContextValue: ThreadsContextValue = {
  threadId: "",
  setThreadId: () => {
    throw new Error("useThreads must be used within YourGPTProvider");
  },
  threads: [],
  getThreadData: () => {
    throw new Error("useThreads must be used within YourGPTProvider");
  },
  createThread: () => {
    throw new Error("useThreads must be used within YourGPTProvider");
  },
  deleteThread: () => {
    throw new Error("useThreads must be used within YourGPTProvider");
  },
  clearThread: () => {
    throw new Error("useThreads must be used within YourGPTProvider");
  },
  updateThreadTitle: () => {
    throw new Error("useThreads must be used within YourGPTProvider");
  },
  persistenceEnabled: false,
};

/**
 * Threads context
 */
export const ThreadsContext =
  createContext<ThreadsContextValue>(defaultContextValue);

/**
 * Hook to access threads context
 * Must be used within YourGPTProvider
 */
export function useThreadsContext(): ThreadsContextValue {
  const context = useContext(ThreadsContext);
  if (context === defaultContextValue) {
    throw new Error("useThreadsContext must be used within YourGPTProvider");
  }
  return context;
}
