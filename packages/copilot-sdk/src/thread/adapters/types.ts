/**
 * Thread Storage Adapter Types
 *
 * Interfaces for thread persistence adapters.
 */

import type { Thread, ThreadData } from "../../core/types/thread";

/**
 * Basic thread storage adapter interface
 * Used by ThreadManager for persistence
 */
export interface ThreadStorageAdapter {
  /** Save all threads to storage */
  save: (threads: ThreadData[]) => Promise<void>;
  /** Load all threads from storage */
  load: () => Promise<ThreadData[]>;
  /** Clear all threads from storage */
  clear: () => Promise<void>;

  /**
   * Get the last active thread ID
   * Optional - used for session persistence
   */
  getLastActiveThreadId?: () => Promise<string | null>;

  /**
   * Set the last active thread ID
   * Optional - used for session persistence
   */
  setLastActiveThreadId?: (threadId: string | null) => Promise<void>;
}

/**
 * Pagination options for listing threads
 */
export interface ListThreadsOptions {
  /** Maximum number of threads to return */
  limit?: number;
  /** Number of threads to skip */
  offset?: number;
  /** Sort order (default: updatedAt desc) */
  orderBy?: "createdAt" | "updatedAt";
  /** Sort direction */
  orderDir?: "asc" | "desc";
}

/**
 * Paginated response for thread listing
 */
export interface ListThreadsResult {
  /** Threads for current page */
  threads: Thread[];
  /** Total number of threads */
  total: number;
  /** Whether there are more threads */
  hasMore: boolean;
}

/**
 * Async thread storage adapter with optimized single-thread operations
 *
 * Use this interface when implementing database backends (Supabase, Firebase, etc.)
 * These methods are optional - if not provided, ThreadManager falls back to
 * full save/load operations.
 *
 * @example Supabase adapter
 * ```typescript
 * const supabaseAdapter: AsyncThreadStorageAdapter = {
 *   save: async (threads) => { /* batch upsert *\/ },
 *   load: async () => { /* select all *\/ },
 *   clear: async () => { /* delete all *\/ },
 *
 *   // Optimized operations
 *   getThread: async (id) => {
 *     const { data } = await supabase
 *       .from('threads')
 *       .select('*, messages(*)')
 *       .eq('id', id)
 *       .single();
 *     return data;
 *   },
 *   createThread: async (thread) => {
 *     const { data } = await supabase.from('threads').insert(thread).select().single();
 *     return data;
 *   },
 *   updateThread: async (id, updates) => {
 *     const { data } = await supabase.from('threads').update(updates).eq('id', id).select().single();
 *     return data;
 *   },
 *   deleteThread: async (id) => {
 *     await supabase.from('threads').delete().eq('id', id);
 *   },
 *   listThreads: async ({ limit, offset }) => {
 *     const { data, count } = await supabase
 *       .from('threads')
 *       .select('*', { count: 'exact' })
 *       .order('updatedAt', { ascending: false })
 *       .range(offset, offset + limit - 1);
 *     return { threads: data, total: count, hasMore: (offset + limit) < count };
 *   },
 * };
 * ```
 */
export interface AsyncThreadStorageAdapter extends ThreadStorageAdapter {
  /**
   * Get a single thread by ID
   * If provided, used instead of loading all threads
   */
  getThread?: (id: string) => Promise<ThreadData | null>;

  /**
   * Create a new thread
   * If provided, used instead of saving all threads
   */
  createThread?: (thread: ThreadData) => Promise<ThreadData>;

  /**
   * Update an existing thread
   * If provided, used instead of saving all threads
   */
  updateThread?: (
    id: string,
    updates: Partial<ThreadData>,
  ) => Promise<ThreadData>;

  /**
   * Delete a thread by ID
   * If provided, used instead of saving all threads
   */
  deleteThread?: (id: string) => Promise<void>;

  /**
   * List threads with pagination
   * If provided, used for efficient thread listing
   */
  listThreads?: (options?: ListThreadsOptions) => Promise<ListThreadsResult>;
}
