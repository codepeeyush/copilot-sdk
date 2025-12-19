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
} from "@yourgpt/core";

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
 * Tools state interface
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
  /** Tools state */
  tools: ToolsState;
  /** Chat actions */
  actions: ChatActions;
  /** Tools actions */
  toolsActions: ToolsActions;
  /** Registered actions/tools */
  registeredActions: ActionDefinition[];
  /** Register an action */
  registerAction: (action: ActionDefinition) => void;
  /** Unregister an action */
  unregisterAction: (name: string) => void;
  /** Add context for AI (returns context ID) */
  addContext: (context: string) => string;
  /** Remove context by ID */
  removeContext: (id: string) => void;
  /** Get all contexts */
  contexts: Map<string, string>;
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
