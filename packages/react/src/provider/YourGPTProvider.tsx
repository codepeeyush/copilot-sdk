"use client";

/**
 * YourGPTProvider - React context provider for YourGPT Copilot SDK
 *
 * This provider uses ChatWithTools for coordinated chat + tool execution.
 * All internal wiring is handled by the chat package (framework-agnostic).
 */

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useSyncExternalStore,
  useState,
} from "react";

import type {
  Message,
  YourGPTConfig,
  ToolsConfig,
  ToolDefinition,
  ActionDefinition,
  MessageAttachment,
  PermissionLevel,
} from "@yourgpt/copilot-sdk-core";

import type { UIMessage, ToolExecution } from "@yourgpt/copilot-sdk-chat";

import {
  ReactChatWithTools,
  type ReactChatWithToolsConfig,
} from "../core/ReactChatWithTools";

// ============================================
// Types
// ============================================

export interface YourGPTProviderProps {
  children: React.ReactNode;
  runtimeUrl: string;
  config?: YourGPTConfig["config"];
  cloud?: YourGPTConfig["cloud"];
  systemPrompt?: string;
  /** @deprecated Use useTools() hook instead */
  tools?: ToolsConfig;
  threadId?: string;
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  onError?: (error: Error) => void;
  /** Enable/disable streaming (default: true) */
  streaming?: boolean;
  debug?: boolean;
}

export interface YourGPTContextValue {
  // Chat state
  messages: UIMessage[];
  status: "ready" | "submitted" | "streaming" | "error";
  error: Error | null;
  isLoading: boolean;

  // Chat actions
  sendMessage: (
    content: string,
    attachments?: MessageAttachment[],
  ) => Promise<void>;
  stop: () => void;
  clearMessages: () => void;
  regenerate: (messageId?: string) => Promise<void>;

  // Tool execution
  registerTool: (tool: ToolDefinition) => void;
  unregisterTool: (name: string) => void;
  registeredTools: ToolDefinition[];
  toolExecutions: ToolExecution[];
  pendingApprovals: ToolExecution[];
  approveToolExecution: (id: string, permissionLevel?: PermissionLevel) => void;
  rejectToolExecution: (
    id: string,
    reason?: string,
    permissionLevel?: PermissionLevel,
  ) => void;

  // Actions
  registerAction: (action: ActionDefinition) => void;
  unregisterAction: (name: string) => void;
  registeredActions: ActionDefinition[];

  // Config
  threadId?: string;
  runtimeUrl: string;
  toolsConfig?: ToolsConfig;
}

// ============================================
// Context
// ============================================

const YourGPTContext = createContext<YourGPTContextValue | null>(null);

export function useYourGPT(): YourGPTContextValue {
  const context = useContext(YourGPTContext);
  if (!context) {
    throw new Error("useYourGPT must be used within YourGPTProvider");
  }
  return context;
}

// ============================================
// Provider Component
// ============================================

export function YourGPTProvider({
  children,
  runtimeUrl,
  config,
  cloud,
  systemPrompt,
  tools: toolsConfig,
  threadId,
  initialMessages,
  onMessagesChange,
  onError,
  streaming,
  debug = false,
}: YourGPTProviderProps) {
  // Debug logger
  const debugLog = useCallback(
    (...args: unknown[]) => {
      if (debug) console.log("[YourGPT]", ...args);
    },
    [debug],
  );

  // Warn about deprecated tools config
  useEffect(() => {
    if (
      toolsConfig &&
      (toolsConfig.screenshot || toolsConfig.console || toolsConfig.network)
    ) {
      console.warn(
        "[YourGPT] The `tools` prop is deprecated. Use the `useTools` hook instead.",
      );
    }
  }, [toolsConfig]);

  // ============================================
  // Tool Executions State (for React reactivity)
  // ============================================
  const [toolExecutions, setToolExecutions] = useState<ToolExecution[]>([]);

  // ============================================
  // ChatWithTools Instance
  // ============================================

  const chatRef = useRef<ReactChatWithTools | null>(null);

  // Initialize chat on first render
  if (chatRef.current === null) {
    // Convert initial messages to UIMessage format
    const uiInitialMessages: UIMessage[] | undefined = initialMessages?.map(
      (m) => ({
        id: m.id,
        role: m.role,
        content: m.content ?? "",
        createdAt: m.created_at ?? new Date(),
        attachments: m.metadata?.attachments as MessageAttachment[] | undefined,
        toolCalls: m.tool_calls,
        toolCallId: m.tool_call_id,
      }),
    );

    chatRef.current = new ReactChatWithTools(
      {
        runtimeUrl,
        llm: config,
        systemPrompt,
        threadId,
        initialMessages: uiInitialMessages,
        streaming,
        debug,
      },
      {
        onToolExecutionsChange: (executions) => {
          debugLog("Tool executions changed:", executions.length);
          setToolExecutions(executions);
        },
        onApprovalRequired: (execution) => {
          debugLog("Tool approval required:", execution.name);
        },
        onError: (error) => {
          if (error) onError?.(error);
        },
      },
    );
  }

  // Subscribe to chat state with useSyncExternalStore
  const messages = useSyncExternalStore(
    chatRef.current.subscribe,
    () => chatRef.current!.messages,
    () => chatRef.current!.messages,
  );

  const status = useSyncExternalStore(
    chatRef.current.subscribe,
    () => chatRef.current!.status,
    () => "ready" as const,
  );

  const errorFromChat = useSyncExternalStore(
    chatRef.current.subscribe,
    () => chatRef.current!.error,
    () => undefined,
  );
  const error = errorFromChat ?? null;

  const isLoading = status === "streaming" || status === "submitted";

  // ============================================
  // Actions
  // ============================================

  const registerTool = useCallback((tool: ToolDefinition) => {
    chatRef.current?.registerTool(tool);
  }, []);

  const unregisterTool = useCallback((name: string) => {
    chatRef.current?.unregisterTool(name);
  }, []);

  const approveToolExecution = useCallback(
    (id: string, permissionLevel?: PermissionLevel) => {
      chatRef.current?.approveToolExecution(id, permissionLevel);
    },
    [],
  );

  const rejectToolExecution = useCallback(
    (id: string, reason?: string, permissionLevel?: PermissionLevel) => {
      chatRef.current?.rejectToolExecution(id, reason, permissionLevel);
    },
    [],
  );

  const registeredTools = chatRef.current?.tools ?? [];
  const pendingApprovals = toolExecutions.filter(
    (e) => e.approvalStatus === "required",
  );

  // ============================================
  // Actions Registration (for UI actions like buttons)
  // ============================================

  const actionsRef = useRef<Map<string, ActionDefinition>>(new Map());
  const [actionsVersion, setActionsVersion] = useState(0);

  const registerAction = useCallback((action: ActionDefinition) => {
    actionsRef.current.set(action.name, action);
    setActionsVersion((v) => v + 1);
  }, []);

  const unregisterAction = useCallback((name: string) => {
    actionsRef.current.delete(name);
    setActionsVersion((v) => v + 1);
  }, []);

  const registeredActions = useMemo(
    () => Array.from(actionsRef.current.values()),
    [actionsVersion],
  );

  // ============================================
  // Chat Actions
  // ============================================

  const sendMessage = useCallback(
    async (content: string, attachments?: MessageAttachment[]) => {
      debugLog("Sending message:", content);
      await chatRef.current?.sendMessage(content, attachments);
    },
    [debugLog],
  );

  const stop = useCallback(() => {
    chatRef.current?.stop();
  }, []);

  const clearMessages = useCallback(() => {
    chatRef.current?.clearMessages();
  }, []);

  const regenerate = useCallback(async (messageId?: string) => {
    await chatRef.current?.regenerate(messageId);
  }, []);

  // ============================================
  // Callbacks
  // ============================================

  // Notify external callbacks
  useEffect(() => {
    if (onMessagesChange && messages.length > 0) {
      const coreMessages: Message[] = messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        created_at: m.createdAt,
        tool_calls: m.toolCalls,
        tool_call_id: m.toolCallId,
        metadata: {
          attachments: m.attachments,
          thinking: m.thinking,
        },
      }));
      onMessagesChange(coreMessages);
    }
  }, [messages, onMessagesChange]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Cleanup
  useEffect(() => {
    return () => {
      chatRef.current?.dispose();
    };
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const contextValue = useMemo<YourGPTContextValue>(
    () => ({
      // Chat state
      messages,
      status,
      error,
      isLoading,

      // Chat actions
      sendMessage,
      stop,
      clearMessages,
      regenerate,

      // Tool execution
      registerTool,
      unregisterTool,
      registeredTools,
      toolExecutions,
      pendingApprovals,
      approveToolExecution,
      rejectToolExecution,

      // Actions
      registerAction,
      unregisterAction,
      registeredActions,

      // Config
      threadId,
      runtimeUrl,
      toolsConfig,
    }),
    [
      messages,
      status,
      error,
      isLoading,
      sendMessage,
      stop,
      clearMessages,
      regenerate,
      registerTool,
      unregisterTool,
      registeredTools,
      toolExecutions,
      pendingApprovals,
      approveToolExecution,
      rejectToolExecution,
      registerAction,
      unregisterAction,
      registeredActions,
      threadId,
      runtimeUrl,
      toolsConfig,
    ],
  );

  return (
    <YourGPTContext.Provider value={contextValue}>
      {children}
    </YourGPTContext.Provider>
  );
}
