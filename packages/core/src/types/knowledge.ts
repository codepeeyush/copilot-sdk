/**
 * Knowledge Base Types
 *
 * Configuration and types for Knowledge Base (RAG) integration.
 * Currently a placeholder - full implementation coming soon.
 */

/**
 * Supported vector database providers
 */
export type KnowledgeBaseProvider =
  | "pinecone"
  | "qdrant"
  | "chroma"
  | "supabase"
  | "weaviate"
  | "custom";

/**
 * Knowledge Base configuration
 */
export interface KnowledgeBaseConfig {
  /** Unique identifier for this knowledge base */
  id: string;

  /** Display name */
  name?: string;

  /** Vector database provider */
  provider: KnowledgeBaseProvider;

  /** API key for the vector database */
  apiKey?: string;

  /** Index/collection name */
  index?: string;

  /** Namespace within the index */
  namespace?: string;

  /** Custom endpoint URL (for self-hosted or custom providers) */
  endpoint?: string;

  /** Number of results to return (default: 5) */
  topK?: number;

  /** Minimum similarity score threshold (0-1) */
  scoreThreshold?: number;

  /** Whether to include source metadata in results */
  includeMetadata?: boolean;
}

/**
 * Knowledge Base search result
 */
export interface KnowledgeBaseResult {
  /** Result content/text */
  content: string;

  /** Similarity score (0-1) */
  score: number;

  /** Source metadata */
  metadata?: {
    /** Source document/URL */
    source?: string;
    /** Document title */
    title?: string;
    /** Page number (for PDFs) */
    page?: number;
    /** Chunk index */
    chunk?: number;
    /** Any additional metadata */
    [key: string]: unknown;
  };
}

/**
 * Knowledge Base search request
 */
export interface KnowledgeBaseSearchRequest {
  /** Search query */
  query: string;

  /** Knowledge base ID to search */
  knowledgeBaseId: string;

  /** Number of results (overrides config) */
  limit?: number;

  /** Filter by metadata */
  filter?: Record<string, unknown>;
}

/**
 * Knowledge Base search response
 */
export interface KnowledgeBaseSearchResponse {
  /** Search results */
  results: KnowledgeBaseResult[];

  /** Knowledge base ID */
  knowledgeBaseId: string;

  /** Query that was searched */
  query: string;

  /** Search duration in ms */
  durationMs?: number;
}
