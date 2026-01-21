/**
 * ReactThreadManager - React adapter for ThreadManager
 *
 * Extends ThreadManager with React-specific state management.
 */

import {
  ThreadManager,
  type ThreadManagerConfig,
  type ThreadManagerCallbacks,
} from "../../thread/ThreadManager";
import { ReactThreadManagerState } from "./ReactThreadManagerState";
import type { Thread } from "../../core/types/thread";

/**
 * Configuration for ReactThreadManager
 */
export interface ReactThreadManagerConfig extends Omit<
  ThreadManagerConfig,
  "state"
> {
  // State is always ReactThreadManagerState for React
}

/**
 * ReactThreadManager - React adapter for ThreadManager
 *
 * Uses ReactThreadManagerState for React's useSyncExternalStore compatibility.
 *
 * @example
 * ```tsx
 * const manager = createReactThreadManager();
 *
 * // In a component using useSyncExternalStore
 * const threads = useSyncExternalStore(
 *   manager.subscribe,
 *   manager.getThreadsSnapshot
 * );
 * ```
 */
export class ReactThreadManager extends ThreadManager {
  // Override state with React-specific type
  declare protected state: ReactThreadManagerState;

  constructor(
    config: ReactThreadManagerConfig = {},
    callbacks: ThreadManagerCallbacks = {},
  ) {
    // Create React state and pass to parent
    const reactState = new ReactThreadManagerState();
    super({ ...config, state: reactState }, callbacks);
  }

  // ============================================
  // Subscription Methods (for useSyncExternalStore)
  // ============================================

  /**
   * Subscribe to state changes
   * Use with useSyncExternalStore
   */
  subscribe = (callback: () => void): (() => void) => {
    return this.state.subscribe(callback);
  };

  // ============================================
  // Snapshot Getters (for useSyncExternalStore)
  // ============================================

  /**
   * Get threads snapshot
   */
  getThreadsSnapshot = (): typeof this.threads => {
    return this.state.getThreadsSnapshot();
  };

  /**
   * Get current thread snapshot
   */
  getCurrentThreadSnapshot = (): typeof this.currentThread => {
    return this.state.getCurrentThreadSnapshot();
  };

  /**
   * Get current thread ID snapshot
   */
  getCurrentThreadIdSnapshot = (): string | null => {
    return this.state.currentThreadId;
  };

  /**
   * Get load status snapshot
   */
  getLoadStatusSnapshot = (): typeof this.loadStatus => {
    return this.state.getLoadStatusSnapshot();
  };

  /**
   * Get error snapshot
   */
  getErrorSnapshot = (): typeof this.error => {
    return this.state.getErrorSnapshot();
  };

  /**
   * Get isLoading snapshot
   */
  getIsLoadingSnapshot = (): boolean => {
    return this.state.getLoadStatusSnapshot() === "loading";
  };

  // ============================================
  // Server Snapshots (for SSR - stable cached values)
  // ============================================

  // Cached values for server snapshots (must be stable references)
  private static readonly EMPTY_THREADS: Thread[] = [];
  private static readonly IDLE_STATUS = "idle" as const;

  /**
   * Get threads snapshot for server (always empty for hydration consistency)
   */
  getThreadsServerSnapshot = (): Thread[] => {
    return ReactThreadManager.EMPTY_THREADS;
  };

  /**
   * Get current thread snapshot for server (always null)
   */
  getCurrentThreadServerSnapshot = (): typeof this.currentThread => {
    return null;
  };

  /**
   * Get current thread ID snapshot for server (always null)
   */
  getCurrentThreadIdServerSnapshot = (): string | null => {
    return null;
  };

  /**
   * Get load status snapshot for server (always "idle")
   */
  getLoadStatusServerSnapshot = (): typeof this.loadStatus => {
    return ReactThreadManager.IDLE_STATUS;
  };

  /**
   * Get error snapshot for server (always undefined)
   */
  getErrorServerSnapshot = (): typeof this.error => {
    return undefined;
  };

  /**
   * Get isLoading snapshot for server (always false)
   */
  getIsLoadingServerSnapshot = (): boolean => {
    return false;
  };

  // ============================================
  // Cleanup
  // ============================================

  /**
   * Dispose of the manager
   */
  async dispose(): Promise<void> {
    this.state.dispose();
    await super.dispose();
  }
}

/**
 * Create a ReactThreadManager instance
 */
export function createReactThreadManager(
  config?: ReactThreadManagerConfig,
  callbacks?: ThreadManagerCallbacks,
): ReactThreadManager {
  return new ReactThreadManager(config, callbacks);
}
