"use client";

import { useThreadsContext } from "../context/ThreadsContext";

/**
 * Hook for managing chat threads
 *
 * @example
 * ```tsx
 * function ThreadList() {
 *   const { threads, createThread, switchThread, deleteThread } = useThreads();
 *
 *   return (
 *     <div>
 *       <button onClick={() => createThread()}>New Chat</button>
 *       {threads.map(thread => (
 *         <div key={thread.id} onClick={() => switchThread(thread.id)}>
 *           {thread.title || 'Untitled'}
 *           <button onClick={() => deleteThread(thread.id)}>Delete</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useThreads() {
  const context = useThreadsContext();

  return {
    /** Current active thread ID */
    threadId: context.threadId,

    /** List of all threads (sorted by most recent) */
    threads: context.threads,

    /** Create a new thread and switch to it */
    createThread: context.createThread,

    /** Switch to a different thread */
    switchThread: context.setThreadId,

    /** Delete a thread */
    deleteThread: context.deleteThread,

    /** Clear a thread's messages (keep the thread) */
    clearThread: context.clearThread,

    /** Update a thread's title */
    updateThreadTitle: context.updateThreadTitle,

    /** Get full thread data including messages */
    getThreadData: context.getThreadData,

    /** Whether persistence is enabled */
    persistenceEnabled: context.persistenceEnabled,
  };
}
