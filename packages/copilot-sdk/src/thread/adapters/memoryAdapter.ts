/**
 * In-Memory Thread Storage Adapter
 *
 * Non-persistent adapter useful for testing or ephemeral sessions.
 */

import type { ThreadData } from "../../core/types/thread";
import type { ThreadStorageAdapter } from "./types";

/**
 * Create an in-memory adapter for thread storage
 *
 * This adapter stores threads in memory only - data is lost on page refresh.
 * Useful for:
 * - Testing
 * - Server-side rendering (where localStorage is unavailable)
 * - Ephemeral sessions where persistence isn't needed
 *
 * @example
 * ```typescript
 * const adapter = createMemoryAdapter();
 * const threadManager = new ThreadManager({ adapter });
 * ```
 *
 * @example Pre-populate with threads
 * ```typescript
 * const adapter = createMemoryAdapter([
 *   { id: "1", title: "Test", messages: [], sources: [], createdAt: new Date(), updatedAt: new Date() }
 * ]);
 * ```
 */
export function createMemoryAdapter(
  initialThreads?: ThreadData[],
): ThreadStorageAdapter {
  let threads: ThreadData[] = initialThreads ? [...initialThreads] : [];

  return {
    save: async (newThreads: ThreadData[]): Promise<void> => {
      // Deep clone to prevent mutation
      threads = JSON.parse(JSON.stringify(newThreads));
      // Restore Date objects
      threads = threads.map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        messages: t.messages.map((m) => ({
          ...m,
          created_at: new Date(m.created_at),
        })),
      }));
    },

    load: async (): Promise<ThreadData[]> => {
      // Return a copy to prevent external mutation
      return threads.map((t) => ({
        ...t,
        messages: [...t.messages],
        sources: [...t.sources],
      }));
    },

    clear: async (): Promise<void> => {
      threads = [];
    },
  };
}

/**
 * No-op adapter that never saves or loads
 * Useful when you want to completely disable persistence
 */
export const noopAdapter: ThreadStorageAdapter = {
  save: async () => {},
  load: async () => [],
  clear: async () => {},
};
