/**
 * @yourgpt/copilot-sdk-knowledge
 *
 * Knowledge base extension for YourGPT Copilot SDK
 *
 * Connects your app to YourGPT's knowledge base for RAG capabilities.
 */

// Client
export {
  YourGPTKnowledgeBase,
  createKnowledgeBaseClient,
  type KnowledgeBaseConfig,
  type SearchOptions,
  type ChatWithKBOptions,
  type SearchResult,
} from "./client/yourgpt-api";

// Hook
export {
  useKnowledgeBase,
  type UseKnowledgeBaseOptions,
  type UseKnowledgeBaseReturn,
} from "./hooks/useKnowledgeBase";

// Extension
export {
  KnowledgeBaseExtension,
  hasKnowledgeBaseExtension,
  getKnowledgeBaseConfig,
  type KnowledgeBaseExtensionConfig,
} from "./extension";

// Components
export {
  SourcesPanel,
  type SourcesPanelProps,
} from "./components/SourcesPanel";

// Re-export Source type for convenience
export type { Source } from "@yourgpt/copilot-sdk-core";
