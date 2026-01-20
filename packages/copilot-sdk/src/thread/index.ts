/**
 * Thread Management Module
 *
 * Framework-agnostic thread management with pluggable storage adapters.
 */

// ThreadManager
export {
  ThreadManager,
  createThreadManager,
  type ThreadManagerConfig,
  type ThreadManagerCallbacks,
  type CreateThreadOptions,
  type UpdateThreadOptions,
} from "./ThreadManager";

// Interfaces
export {
  type ThreadManagerState,
  type LoadStatus,
  SimpleThreadManagerState,
} from "./interfaces";

// Adapters
export {
  // Types
  type ThreadStorageAdapter,
  type AsyncThreadStorageAdapter,
  type ListThreadsOptions,
  type ListThreadsResult,
  // localStorage
  createLocalStorageAdapter,
  localStorageAdapter,
  type LocalStorageAdapterConfig,
  // Server
  createServerAdapter,
  type ServerAdapterConfig,
  // Memory
  createMemoryAdapter,
  noopAdapter,
} from "./adapters";
