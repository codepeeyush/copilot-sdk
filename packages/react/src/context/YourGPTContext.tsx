"use client";

import { createContext, useContext } from "react";
import type {
  YourGPTConfig,
  Message,
  ActionDefinition,
  Source,
  ToolsConfig,
  ToolType,
  ToolConsentRequest,
  CapturedContext,
  ToolDefinition,
  ToolExecution,
  ToolResponse,
} from "@yourgpt/core";
import type { ContextTreeNode } from "../utils/context-tree";

/**
 * Chat state interface
 */
export interface ChatState {
  /** All messages in the conversation */
  messages: Message[];
  /** Whether a response is being generated */
  isLoading: boolean;
  /** Current error if any */
  error: Error | null;
  /** Thread/conversation ID */
  threadId: string | null;
  /** Sources from knowledge base */
  sources: Source[];
}

/**
 * Tools state interface (Smart Context tools)
 */
export interface ToolsState {
  /** Whether tools are enabled */
  isEnabled: boolean;
  /** Pending consent request */
  pendingConsent: ToolConsentRequest | null;
  /** Last captured context */
  lastContext: CapturedContext | null;
  /** Currently capturing */
  isCapturing: boolean;
}

/**
 * Agent loop state interface (Agentic tools)
 */
export interface AgentLoopState {
  /** Current tool executions */
  toolExecutions: ToolExecution[];
  /** Current loop iteration */
  iteration: number;
  /** Maximum iterations */
  maxIterations: number;
  /** Whether max iterations was reached */
  maxIterationsReached: boolean;
}

/**
 * Chat actions interface
 */
export interface ChatActions {
  /** Send a message */
  sendMessage: (content: string) => Promise<void>;
  /** Send a message with context */
  sendMessageWithContext: (
    content: string,
    context: CapturedContext,
  ) => Promise<void>;
  /** Stop generation */
  stopGeneration: () => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Regenerate last response */
  regenerate: (messageId?: string) => Promise<void>;
  /** Set messages directly */
  setMessages: (messages: Message[]) => void;
}

/**
 * Tools actions interface
 */
export interface ToolsActions {
  /** Request consent for tools */
  requestConsent: (tools: ToolType[], reason?: string) => void;
  /** Respond to consent request */
  respondToConsent: (approved: ToolType[], remember?: boolean) => void;
  /** Capture context */
  captureContext: (tools: ToolType[]) => Promise<CapturedContext>;
  /** Clear pending consent */
  clearConsent: () => void;
}

/**
 * YourGPT context value
 */
export interface YourGPTContextValue {
  /** SDK configuration */
  config: YourGPTConfig;
  /** Tools configuration */
  toolsConfig: ToolsConfig | null;
  /** Chat state */
  chat: ChatState;
  /** Tools state (Smart Context) */
  tools: ToolsState;
  /** Agent loop state (Agentic tools) */
  agentLoop: AgentLoopState;
  /** Chat actions */
  actions: ChatActions;
  /** Tools actions */
  toolsActions: ToolsActions;
  /** Registered actions/tools (legacy) */
  registeredActions: ActionDefinition[];
  /** Register an action (legacy) */
  registerAction: (action: ActionDefinition) => void;
  /** Unregister an action (legacy) */
  unregisterAction: (name: string) => void;
  /** Registered tools (Agentic) */
  registeredTools: ToolDefinition[];
  /** Register a tool */
  registerTool: (tool: ToolDefinition) => void;
  /** Unregister a tool */
  unregisterTool: (name: string) => void;
  /** Add a tool execution record */
  addToolExecution?: (execution: ToolExecution) => void;
  /** Update a tool execution record */
  updateToolExecution?: (id: string, update: Partial<ToolExecution>) => void;
  /** Clear all tool executions */
  clearToolExecutions?: () => void;
  /** Add context for AI (returns context ID) */
  addContext: (context: string, parentId?: string) => string;
  /** Remove context by ID */
  removeContext: (id: string) => void;
  /** Get all contexts as tree */
  contextTree: ContextTreeNode[];
  /** Whether user has YourGPT API key (premium) */
  isPremium: boolean;
}

/**
 * Initial chat state
 */
export const initialChatState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  threadId: null,
  sources: [],
};

/**
 * Initial tools state
 */
export const initialToolsState: ToolsState = {
  isEnabled: false,
  pendingConsent: null,
  lastContext: null,
  isCapturing: false,
};

/**
 * Initial agent loop state
 */
export const initialAgentLoopState: AgentLoopState = {
  toolExecutions: [],
  iteration: 0,
  maxIterations: 20,
  maxIterationsReached: false,
};

/**
 * YourGPT Context
 */
export const YourGPTContext = createContext<YourGPTContextValue | null>(null);

/**
 * Hook to access YourGPT context
 */
export function useYourGPTContext(): YourGPTContextValue {
  const context = useContext(YourGPTContext);

  if (!context) {
    throw new Error("useYourGPTContext must be used within a YourGPTProvider");
  }

  return context;
}
