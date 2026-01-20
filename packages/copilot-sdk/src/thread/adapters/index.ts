/**
 * Thread Storage Adapters
 */

// Types
export type {
  ThreadStorageAdapter,
  AsyncThreadStorageAdapter,
  ListThreadsOptions,
  ListThreadsResult,
} from "./types";

// localStorage adapter (default)
export {
  createLocalStorageAdapter,
  localStorageAdapter,
  type LocalStorageAdapterConfig,
} from "./localStorageAdapter";

// Server adapter (for server persistence)
export { createServerAdapter, type ServerAdapterConfig } from "./serverAdapter";

// Memory adapter (for testing)
export { createMemoryAdapter, noopAdapter } from "./memoryAdapter";
