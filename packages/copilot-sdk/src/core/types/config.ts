/**
 * LLM configuration (optional overrides sent to server)
 *
 * Note: The server uses its own configured model.
 * These are optional hints that the server may use.
 */
export interface LLMConfig {
  /** Temperature (0-2) */
  temperature?: number;
  /** Maximum tokens in response */
  maxTokens?: number;
}

/**
 * Cloud configuration (for managed hosting)
 */
export interface CloudConfig {
  /** API key */
  apiKey: string;
  /** Bot ID */
  botId: string;
  /** Custom API endpoint (optional) */
  endpoint?: string;
}

/**
 * Extension configuration
 */
export interface Extension {
  /** Extension name */
  name: string;
  /** Extension configuration */
  config: Record<string, unknown>;
  /** Initialize the extension */
  init?: () => Promise<void>;
}

/**
 * Main SDK configuration
 */
export interface CopilotConfig {
  /** LLM configuration (for self-hosted) */
  config?: LLMConfig;
  /** Cloud configuration (for managed hosting) */
  cloud?: CloudConfig;
  /** Runtime URL for self-hosted backend */
  runtimeUrl?: string;
  /** System prompt */
  systemPrompt?: string;
  /** Extensions (like knowledge base) */
  extensions?: Extension[];
  /** Enable debug logging */
  debug?: boolean;
}
