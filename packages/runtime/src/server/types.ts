import type {
  LLMConfig,
  ActionDefinition,
  KnowledgeBaseConfig,
  ToolDefinition,
  AgentLoopConfig,
} from "@yourgpt/core";
import type { LLMAdapter } from "../adapters";

/**
 * Runtime configuration with LLM config
 */
export interface RuntimeConfigWithLLM {
  /** LLM configuration */
  llm: LLMConfig & { apiKey: string };
  /** Custom LLM adapter (overrides llm config) */
  adapter?: LLMAdapter;
  /** System prompt */
  systemPrompt?: string;
  /** Available actions (legacy) */
  actions?: ActionDefinition[];
  /** Available tools (new - supports location: server/client) */
  tools?: ToolDefinition[];
  /** Agent loop configuration */
  agentLoop?: AgentLoopConfig;
  /** Knowledge base configuration (enables search_knowledge tool) */
  knowledgeBase?: KnowledgeBaseConfig;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Runtime configuration with adapter
 */
export interface RuntimeConfigWithAdapter {
  /** Custom LLM adapter */
  adapter: LLMAdapter;
  /** LLM configuration (optional when adapter provided) */
  llm?: LLMConfig & { apiKey: string };
  /** System prompt */
  systemPrompt?: string;
  /** Available actions (legacy) */
  actions?: ActionDefinition[];
  /** Available tools (new - supports location: server/client) */
  tools?: ToolDefinition[];
  /** Agent loop configuration */
  agentLoop?: AgentLoopConfig;
  /** Knowledge base configuration (enables search_knowledge tool) */
  knowledgeBase?: KnowledgeBaseConfig;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Runtime configuration - either provide llm config or adapter
 */
export type RuntimeConfig = RuntimeConfigWithLLM | RuntimeConfigWithAdapter;

/**
 * Chat request body
 */
export interface ChatRequest {
  /** Conversation messages */
  messages: Array<{
    role: string;
    content: string;
  }>;
  /** Thread/conversation ID */
  threadId?: string;
  /** Bot ID (for cloud) */
  botId?: string;
  /** LLM config overrides */
  config?: Partial<LLMConfig>;
  /** System prompt override */
  systemPrompt?: string;
  /** Actions from client (legacy) */
  actions?: Array<{
    name: string;
    description: string;
    parameters?: Record<string, unknown>;
  }>;
  /** Tools from client (location is always "client" for tools from request) */
  tools?: Array<{
    name: string;
    description: string;
    inputSchema: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  }>;
  /** Enable agentic loop mode */
  useAgentLoop?: boolean;
}

/**
 * Action execution request
 */
export interface ActionRequest {
  /** Action name */
  name: string;
  /** Action arguments */
  args: Record<string, unknown>;
}

/**
 * Request context
 */
export interface RequestContext {
  /** Request headers */
  headers: Record<string, string>;
  /** Parsed request body */
  body: ChatRequest;
}
