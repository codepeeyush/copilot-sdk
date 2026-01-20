/**
 * ThreadManagerState Interface
 *
 * Contract for framework-specific state implementations.
 * Following the same pattern as ChatState for framework agnosticism.
 */

import type { Thread, ThreadData } from "../../core/types/thread";

/**
 * Load status for async operations
 */
export type LoadStatus = "idle" | "loading" | "loaded" | "error";

/**
 * ThreadManagerState interface - Framework adapters implement this
 *
 * This is the key abstraction that enables framework-agnostic code.
 * The ThreadManager class uses this interface, and each framework
 * provides its own implementation.
 *
 * @example React implementation
 * ```typescript
 * class ReactThreadManagerState implements ThreadManagerState {
 *   #threads: Thread[] = [];
 *   #callbacks = new Set<() => void>();
 *
 *   get threads() { return this.#threads; }
 *   set threads(t) {
 *     this.#threads = t;
 *     this.#callbacks.forEach(cb => cb()); // Trigger re-render
 *   }
 *
 *   subscribe(cb: () => void) {
 *     this.#callbacks.add(cb);
 *     return () => this.#callbacks.delete(cb);
 *   }
 * }
 * ```
 */
export interface ThreadManagerState {
  // ============================================
  // State Properties
  // ============================================

  /** All threads (metadata only) */
  threads: Thread[];

  /** Currently selected thread ID */
  currentThreadId: string | null;

  /** Currently loaded thread data (with messages) */
  currentThread: ThreadData | null;

  /** Current loading status */
  loadStatus: LoadStatus;

  /** Current error if any */
  error: Error | undefined;

  // ============================================
  // State Mutations (trigger reactivity)
  // ============================================

  /**
   * Set all threads
   */
  setThreads(threads: Thread[]): void;

  /**
   * Set the current thread
   */
  setCurrentThread(thread: ThreadData | null): void;

  /**
   * Set the current thread ID
   */
  setCurrentThreadId(id: string | null): void;

  /**
   * Add a new thread to the list
   */
  addThread(thread: Thread): void;

  /**
   * Update a thread's metadata
   */
  updateThread(id: string, updates: Partial<Thread>): void;

  /**
   * Remove a thread from the list
   */
  removeThread(id: string): void;

  /**
   * Set loading status
   */
  setLoadStatus(status: LoadStatus): void;

  /**
   * Set error
   */
  setError(error: Error | undefined): void;

  // ============================================
  // Subscription (for React's useSyncExternalStore)
  // ============================================

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   *
   * This is used by React's useSyncExternalStore.
   * Vue/Svelte may not need this (they use refs/stores).
   */
  subscribe?(callback: () => void): () => void;

  // ============================================
  // Snapshots (for React concurrent mode)
  // ============================================

  /**
   * Get immutable snapshot of threads
   */
  getThreadsSnapshot?(): Thread[];

  /**
   * Get current thread snapshot
   */
  getCurrentThreadSnapshot?(): ThreadData | null;

  /**
   * Get load status snapshot
   */
  getLoadStatusSnapshot?(): LoadStatus;

  /**
   * Get error snapshot
   */
  getErrorSnapshot?(): Error | undefined;
}

/**
 * Default in-memory state implementation (for testing/vanilla JS)
 */
export class SimpleThreadManagerState implements ThreadManagerState {
  private _threads: Thread[] = [];
  private _currentThreadId: string | null = null;
  private _currentThread: ThreadData | null = null;
  private _loadStatus: LoadStatus = "idle";
  private _error: Error | undefined = undefined;
  private callbacks = new Set<() => void>();

  // Getters
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

  // Setters with notification
  set threads(value: Thread[]) {
    this._threads = value;
    this.notify();
  }

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
    this._threads = [thread, ...this._threads];
    this.notify();
  }

  updateThread(id: string, updates: Partial<Thread>): void {
    this._threads = this._threads.map((t) =>
      t.id === id ? { ...t, ...updates } : t,
    );
    if (this._currentThread?.id === id) {
      this._currentThread = { ...this._currentThread, ...updates };
    }
    this.notify();
  }

  removeThread(id: string): void {
    this._threads = this._threads.filter((t) => t.id !== id);
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

  // Subscription
  subscribe(callback: () => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  // Snapshots
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

  private notify(): void {
    this.callbacks.forEach((cb) => cb());
  }
}
