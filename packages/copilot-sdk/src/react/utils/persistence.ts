import type { ThreadData, ThreadStorageAdapter } from "../../core";

const STORAGE_KEY = "yourgpt-threads";

/**
 * Default localStorage persistence adapter
 */
export const localStoragePersistence: ThreadStorageAdapter = {
  save: async (threads: ThreadData[]) => {
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify(
        threads.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
          messages: t.messages.map((m) => ({
            ...m,
            created_at:
              m.created_at instanceof Date
                ? m.created_at.toISOString()
                : m.created_at,
          })),
        })),
      );
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
      console.warn("Failed to save threads to localStorage:", e);
    }
  },

  load: async (): Promise<ThreadData[]> => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        messages: t.messages.map((m: any) => ({
          ...m,
          created_at: new Date(m.created_at),
        })),
      }));
    } catch (e) {
      console.warn("Failed to load threads from localStorage:", e);
      return [];
    }
  },

  clear: async () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear threads from localStorage:", e);
    }
  },
};

/**
 * No-op persistence adapter (for when persistence is disabled)
 */
export const noopPersistence: ThreadStorageAdapter = {
  save: async () => {},
  load: async () => [],
  clear: async () => {},
};
