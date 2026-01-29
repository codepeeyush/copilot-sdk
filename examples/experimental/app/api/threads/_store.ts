/**
 * Shared in-memory thread storage
 *
 * This module provides a shared storage instance for demo purposes.
 * In production, replace with your database (Prisma, Drizzle, MongoDB, etc.)
 */

export interface StoredThread {
  id: string;
  title?: string;
  preview?: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    created_at?: string;
    tool_calls?: unknown[];
    tool_call_id?: string;
  }>;
  sources?: unknown[];
}

// Global in-memory store (resets on server restart)
// In production, this would be a database connection/client
const globalForStore = globalThis as unknown as {
  threadStore: Map<string, StoredThread> | undefined;
};

export const threads =
  globalForStore.threadStore ?? new Map<string, StoredThread>();

if (process.env.NODE_ENV !== "production") {
  globalForStore.threadStore = threads;
}

/**
 * Generate a unique thread ID
 */
export function generateThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Generate a thread title from the first user message
 */
export function generateTitle(
  messages: StoredThread["messages"],
): string | undefined {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage?.content) return undefined;

  return firstUserMessage.content.length > 50
    ? firstUserMessage.content.slice(0, 47) + "..."
    : firstUserMessage.content;
}

/**
 * Generate a preview from the first user message
 */
export function generatePreview(
  messages: StoredThread["messages"],
): string | undefined {
  const firstUserMessage = messages.find((m) => m.role === "user");
  return firstUserMessage?.content?.slice(0, 100);
}
