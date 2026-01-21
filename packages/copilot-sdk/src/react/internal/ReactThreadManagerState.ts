/**
 * ReactThreadManagerState - React-specific implementation of ThreadManagerState
 *
 * This class implements the ThreadManagerState interface with callback-based
 * reactivity for use with React's useSyncExternalStore.
 *
 * Pattern follows ReactChatState for consistency.
 */

import type { Thread, ThreadData } from "../../core/types/thread";
import type {
  ThreadManagerState,
  LoadStatus,
} from "../../thread/interfaces/ThreadManagerState";

/**
 * ReactThreadManagerState implements ThreadManagerState with callback-based reactivity
 *
 * @example
 * ```tsx
 * const state = new ReactThreadManagerState();
 *
 * // Subscribe to changes (for useSyncExternalStore)
 * const unsubscribe = state.subscribe(() => {
 *   console.log('State changed');
 * });
 *
 * // Get snapshot (for useSyncExternalStore)
 * const threads = state.threads;
 * ```
 */
export class ReactThreadManagerState implements ThreadManagerState {
  private _threads: Thread[] = [];
  private _currentThreadId: string | null = null;
  private _currentThread: ThreadData | null = null;
  private _loadStatus: LoadStatus = "idle";
  private _error: Error | undefined = undefined;

  // Callbacks for React subscriptions (useSyncExternalStore)
  private subscribers = new Set<() => void>();

  constructor(initialThreads?: Thread[]) {
    if (initialThreads) {
      this._threads = initialThreads;
    }
  }

  // ============================================
  // Getters
  // ============================================

  get threads(): Thread[] {
    return this._threads;
  }

  get currentThreadId(): string | null {
    return this._currentThreadId;
  }

  get currentThread(): ThreadData | null {
    return this._currentThread;
  }

  get loadStatus(): LoadStatus {
    return this._loadStatus;
  }

  get error(): Error | undefined {
    return this._error;
  }

  // ============================================
  // Setters (trigger reactivity)
  // ============================================

  set threads(value: Thread[]) {
    this._threads = value;
    this.notify();
  }

  // ============================================
  // Mutations
  // ============================================

  setThreads(threads: Thread[]): void {
    this._threads = threads;
    this.notify();
  }

  setCurrentThread(thread: ThreadData | null): void {
    this._currentThread = thread;
    this._currentThreadId = thread?.id ?? null;
    this.notify();
  }

  setCurrentThreadId(id: string | null): void {
    this._currentThreadId = id;
    this.notify();
  }

  addThread(thread: Thread): void {
    // Add to beginning (most recent first)
    this._threads = [thread, ...this._threads];
    this.notify();
  }

  updateThread(id: string, updates: Partial<Thread>): void {
    this._threads = this._threads.map((t) =>
      t.id === id ? { ...t, ...updates } : t,
    );
    // Re-sort by updatedAt if it was updated
    if (updates.updatedAt) {
      this._threads = [...this._threads].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      );
    }
    // Also update current thread if it's the same
    if (this._currentThread?.id === id) {
      this._currentThread = { ...this._currentThread, ...updates };
    }
    this.notify();
  }

  removeThread(id: string): void {
    this._threads = this._threads.filter((t) => t.id !== id);
    // Clear current thread if it was deleted
    if (this._currentThreadId === id) {
      this._currentThreadId = null;
      this._currentThread = null;
    }
    this.notify();
  }

  setLoadStatus(status: LoadStatus): void {
    this._loadStatus = status;
    this.notify();
  }

  setError(error: Error | undefined): void {
    this._error = error;
    this.notify();
  }

  // ============================================
  // Subscription (for useSyncExternalStore)
  // ============================================

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   *
   * @example
   * ```tsx
   * const threads = useSyncExternalStore(
   *   state.subscribe,
   *   () => state.threads
   * );
   * ```
   */
  subscribe = (callback: () => void): (() => void) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  // ============================================
  // Snapshots (for useSyncExternalStore)
  // ============================================

  getThreadsSnapshot(): Thread[] {
    return this._threads;
  }

  getCurrentThreadSnapshot(): ThreadData | null {
    return this._currentThread;
  }

  getLoadStatusSnapshot(): LoadStatus {
    return this._loadStatus;
  }

  getErrorSnapshot(): Error | undefined {
    return this._error;
  }

  // ============================================
  // Private Methods
  // ============================================

  private notify(): void {
    this.subscribers.forEach((cb) => cb());
  }

  /**
   * Cleanup subscriptions
   */
  dispose(): void {
    this.subscribers.clear();
  }
}

/**
 * Create a ReactThreadManagerState instance
 */
export function createReactThreadManagerState(
  initialThreads?: Thread[],
): ReactThreadManagerState {
  return new ReactThreadManagerState(initialThreads);
}
