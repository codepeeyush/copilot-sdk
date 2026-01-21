/**
 * Server Thread Storage Adapter
 *
 * Fetches threads from a user-provided API endpoint.
 * Implements AsyncThreadStorageAdapter for optimized single-thread operations.
 */

import type { Thread, ThreadData } from "../../core/types/thread";
import type { ToolCall } from "../../core/types/message";
import type {
  AsyncThreadStorageAdapter,
  ListThreadsOptions,
  ListThreadsResult,
} from "./types";

/**
 * Configuration for server adapter
 */
export interface ServerAdapterConfig {
  /**
   * Endpoint URL for thread API
   * @example "/api/threads"
   */
  endpoint: string;

  /**
   * Additional headers to include in requests (e.g., auth tokens)
   */
  headers?: Record<string, string>;

  /**
   * Custom fetch function (useful for testing or adding interceptors)
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
}

/**
 * API response types (expected from user's server)
 */
interface ThreadAPIResponse {
  id: string;
  title?: string;
  preview?: string;
  messageCount?: number;
  createdAt: string;
  updatedAt: string;
  messages?: Array<{
    id: string;
    role: string;
    content: string;
    created_at?: string;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
    metadata?: Record<string, unknown>;
  }>;
  sources?: unknown[];
}

interface ListThreadsAPIResponse {
  threads: ThreadAPIResponse[];
  total: number;
  hasMore?: boolean;
}

/**
 * Parse a thread from API response to ThreadData
 */
function parseThread(data: ThreadAPIResponse): ThreadData {
  return {
    id: data.id,
    title: data.title,
    preview: data.preview,
    messageCount: data.messageCount,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    messages: (data.messages ?? []).map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system" | "tool",
      content: m.content,
      created_at: m.created_at ? new Date(m.created_at) : new Date(),
      tool_calls: m.tool_calls,
      tool_call_id: m.tool_call_id,
      metadata: m.metadata,
    })),
    sources: (data.sources ?? []) as ThreadData["sources"],
  };
}

/**
 * Serialize a thread for API request
 */
function serializeThread(thread: Partial<ThreadData>): Record<string, unknown> {
  const serialized: Record<string, unknown> = {};

  if (thread.id !== undefined) serialized.id = thread.id;
  if (thread.title !== undefined) serialized.title = thread.title;
  if (thread.preview !== undefined) serialized.preview = thread.preview;
  if (thread.messageCount !== undefined)
    serialized.messageCount = thread.messageCount;
  if (thread.createdAt !== undefined)
    serialized.createdAt = thread.createdAt.toISOString();
  if (thread.updatedAt !== undefined)
    serialized.updatedAt = thread.updatedAt.toISOString();
  if (thread.messages !== undefined) {
    serialized.messages = thread.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      created_at:
        m.created_at instanceof Date
          ? m.created_at.toISOString()
          : m.created_at,
      tool_calls: m.tool_calls,
      tool_call_id: m.tool_call_id,
      metadata: m.metadata,
    }));
  }
  if (thread.sources !== undefined) serialized.sources = thread.sources;

  return serialized;
}

/**
 * Create a server-based thread storage adapter
 *
 * @example
 * ```typescript
 * const adapter = createServerAdapter({
 *   threadsUrl: "/api/threads",
 *   headers: {
 *     Authorization: `Bearer ${token}`,
 *   },
 * });
 *
 * const { threads } = useThreadManager({ adapter });
 * ```
 */
export function createServerAdapter(
  config: ServerAdapterConfig,
): AsyncThreadStorageAdapter {
  const { endpoint, headers = {} } = config;
  const fetchFn = config.fetch ?? globalThis.fetch;

  const buildUrl = (path: string = "", params?: Record<string, string>) => {
    const url = new URL(
      path ? `${endpoint}/${path}` : endpoint,
      globalThis.location?.origin ?? "http://localhost",
    );
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    return url.toString();
  };

  const request = async <T>(
    method: string,
    path: string = "",
    body?: unknown,
    params?: Record<string, string>,
  ): Promise<T> => {
    const url = buildUrl(path, params);
    const response = await fetchFn(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Server adapter request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  };

  return {
    // ============================================
    // Basic Operations (required by ThreadStorageAdapter)
    // ============================================

    /**
     * Load all threads from server
     * Note: For large datasets, prefer using listThreads with pagination
     */
    load: async (): Promise<ThreadData[]> => {
      const response = await request<
        ThreadAPIResponse[] | ListThreadsAPIResponse
      >("GET");

      // Handle both array and paginated response
      const threads = Array.isArray(response) ? response : response.threads;
      return threads.map(parseThread);
    },

    /**
     * Save all threads to server (batch upsert)
     * Note: This is a fallback - prefer using individual CRUD operations
     */
    save: async (threads: ThreadData[]): Promise<void> => {
      await request("PUT", "", {
        threads: threads.map(serializeThread),
      });
    },

    /**
     * Clear all threads
     */
    clear: async (): Promise<void> => {
      await request("DELETE", "");
    },

    // ============================================
    // Optimized Single-Thread Operations
    // ============================================

    /**
     * Get a single thread by ID with messages
     */
    getThread: async (id: string): Promise<ThreadData | null> => {
      try {
        const response = await request<ThreadAPIResponse>("GET", id);
        return parseThread(response);
      } catch (error) {
        // Return null for 404s
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },

    /**
     * Create a new thread
     */
    createThread: async (thread: ThreadData): Promise<ThreadData> => {
      const response = await request<ThreadAPIResponse>(
        "POST",
        "",
        serializeThread(thread),
      );
      return parseThread(response);
    },

    /**
     * Update an existing thread
     */
    updateThread: async (
      id: string,
      updates: Partial<ThreadData>,
    ): Promise<ThreadData> => {
      const response = await request<ThreadAPIResponse>(
        "PATCH",
        id,
        serializeThread(updates),
      );
      return parseThread(response);
    },

    /**
     * Delete a thread by ID
     */
    deleteThread: async (id: string): Promise<void> => {
      await request("DELETE", id);
    },

    /**
     * List threads with pagination
     */
    listThreads: async (
      options?: ListThreadsOptions,
    ): Promise<ListThreadsResult> => {
      const params: Record<string, string> = {};
      if (options?.limit) params.limit = String(options.limit);
      if (options?.offset) params.offset = String(options.offset);
      if (options?.orderBy) params.orderBy = options.orderBy;
      if (options?.orderDir) params.orderDir = options.orderDir;

      const response = await request<ListThreadsAPIResponse>(
        "GET",
        "",
        undefined,
        params,
      );

      return {
        threads: response.threads.map((t) => ({
          id: t.id,
          title: t.title,
          preview: t.preview,
          messageCount: t.messageCount,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        })),
        total: response.total,
        hasMore: response.hasMore ?? false,
      };
    },

    // ============================================
    // Session Persistence
    // ============================================

    /**
     * Get the last active thread ID from localStorage
     */
    getLastActiveThreadId: async (): Promise<string | null> => {
      if (typeof window === "undefined") return null;
      try {
        return localStorage.getItem("yourgpt-last-thread-id");
      } catch {
        return null;
      }
    },

    /**
     * Store the last active thread ID in localStorage
     */
    setLastActiveThreadId: async (threadId: string | null): Promise<void> => {
      if (typeof window === "undefined") return;
      try {
        if (threadId) {
          localStorage.setItem("yourgpt-last-thread-id", threadId);
        } else {
          localStorage.removeItem("yourgpt-last-thread-id");
        }
      } catch {
        // Ignore localStorage errors
      }
    },
  };
}
