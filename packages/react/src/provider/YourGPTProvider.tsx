"use client";

import React, {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type {
  YourGPTConfig,
  Message,
  ActionDefinition,
  StreamEvent,
  ToolsConfig,
  ToolType,
  ToolConsentRequest,
  CapturedContext,
  Source,
  Thread,
  ThreadData,
  PersistenceConfig,
  ToolDefinition,
  ToolExecution,
  ToolResponse,
  ToolCallInfo,
  AssistantToolMessage,
} from "@yourgpt/core";
import { generateThreadTitle } from "@yourgpt/core";
import {
  generateMessageId,
  generateThreadId,
  streamSSE,
  // Tools
  detectIntent,
  generateSuggestionReason,
  captureScreenshot,
  startConsoleCapture,
  stopConsoleCapture,
  getConsoleLogs,
  startNetworkCapture,
  stopNetworkCapture,
  getNetworkRequests,
  formatLogsForAI,
  formatRequestsForAI,
} from "@yourgpt/core";
import {
  addNode,
  removeNode,
  printTree,
  type ContextTreeNode,
} from "../utils/context-tree";
import {
  YourGPTContext,
  initialChatState,
  initialToolsState,
  initialAgentLoopState,
  type ChatState,
  type ToolsState,
  type AgentLoopState,
  type YourGPTContextValue,
} from "../context/YourGPTContext";
import {
  ThreadsContext,
  type ThreadsContextValue,
} from "../context/ThreadsContext";
import { localStoragePersistence, noopPersistence } from "../utils/persistence";

/**
 * Provider props
 */
export interface YourGPTProviderProps {
  /** SDK configuration */
  config?: YourGPTConfig["config"];
  /** Cloud configuration (alternative to config) */
  cloud?: YourGPTConfig["cloud"];
  /** Runtime URL for self-hosted backend */
  runtimeUrl?: string;
  /** System prompt */
  systemPrompt?: string;
  /** Extensions */
  extensions?: YourGPTConfig["extensions"];
  /** Tools configuration for Smart Context Awareness */
  tools?: ToolsConfig;
  /** Initial messages */
  initialMessages?: Message[];
  /** Callback when messages change */
  onMessagesChange?: (messages: Message[]) => void;
  /**
   * YourGPT API key for premium features
   * - Unlocks full headless mode
   * - Allows hiding "Powered by YourGPT" attribution
   * Get your key at https://yourgpt.ai
   */
  yourgptApiKey?: string;
  /**
   * Explicit thread ID to use
   * If provided, the provider will use this thread ID
   */
  threadId?: string;
  /**
   * Callback when thread changes
   */
  onThreadChange?: (threadId: string) => void;
  /**
   * Persistence configuration for threads
   * Default: disabled
   */
  persistence?: PersistenceConfig;
  /** Children */
  children: ReactNode;
}

/**
 * Chat state reducer actions
 */
type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; content: string } }
  | { type: "SET_THREAD_ID"; payload: string }
  | { type: "ADD_SOURCE"; payload: { messageId: string; source: unknown } }
  | { type: "CLEAR" };

/**
 * Tools state reducer actions
 */
type ToolsAction =
  | { type: "SET_ENABLED"; payload: boolean }
  | { type: "SET_PENDING_CONSENT"; payload: ToolConsentRequest | null }
  | { type: "SET_LAST_CONTEXT"; payload: CapturedContext | null }
  | { type: "SET_CAPTURING"; payload: boolean };

/**
 * Chat state reducer
 */
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: msg.content + action.payload.content }
            : msg,
        ),
      };
    case "SET_THREAD_ID":
      return { ...state, threadId: action.payload };
    case "ADD_SOURCE":
      return {
        ...state,
        sources: [...state.sources, action.payload.source as Source],
        messages: state.messages.map((msg) =>
          msg.id === action.payload.messageId
            ? {
                ...msg,
                sources: [
                  ...(msg.sources || []),
                  action.payload.source as Source,
                ],
              }
            : msg,
        ),
      };
    case "CLEAR":
      return { ...initialChatState, threadId: generateThreadId() };
    default:
      return state;
  }
}

/**
 * Tools state reducer
 */
function toolsReducer(state: ToolsState, action: ToolsAction): ToolsState {
  switch (action.type) {
    case "SET_ENABLED":
      return { ...state, isEnabled: action.payload };
    case "SET_PENDING_CONSENT":
      return { ...state, pendingConsent: action.payload };
    case "SET_LAST_CONTEXT":
      return { ...state, lastContext: action.payload };
    case "SET_CAPTURING":
      return { ...state, isCapturing: action.payload };
    default:
      return state;
  }
}

/**
 * Agent loop state reducer actions
 */
type AgentLoopAction =
  | { type: "ADD_EXECUTION"; payload: ToolExecution }
  | {
      type: "UPDATE_EXECUTION";
      payload: { id: string; update: Partial<ToolExecution> };
    }
  | {
      type: "SET_ITERATION";
      payload: { iteration: number; maxIterations: number };
    }
  | { type: "SET_MAX_ITERATIONS_REACHED"; payload: boolean }
  | { type: "CLEAR_EXECUTIONS" };

/**
 * Agent loop state reducer
 */
function agentLoopReducer(
  state: AgentLoopState,
  action: AgentLoopAction,
): AgentLoopState {
  switch (action.type) {
    case "ADD_EXECUTION":
      return {
        ...state,
        toolExecutions: [...state.toolExecutions, action.payload],
      };
    case "UPDATE_EXECUTION":
      return {
        ...state,
        toolExecutions: state.toolExecutions.map((exec) =>
          exec.id === action.payload.id
            ? { ...exec, ...action.payload.update }
            : exec,
        ),
      };
    case "SET_ITERATION":
      return {
        ...state,
        iteration: action.payload.iteration,
        maxIterations: action.payload.maxIterations,
      };
    case "SET_MAX_ITERATIONS_REACHED":
      return {
        ...state,
        maxIterationsReached: action.payload,
      };
    case "CLEAR_EXECUTIONS":
      return {
        ...state,
        toolExecutions: [],
        iteration: 0,
        maxIterationsReached: false,
      };
    default:
      return state;
  }
}

/**
 * Threads state
 */
interface ThreadsState {
  threads: Map<string, ThreadData>;
  activeThreadId: string;
}

/**
 * Threads reducer actions
 */
type ThreadsAction =
  | {
      type: "INIT_THREADS";
      payload: { threads: ThreadData[]; activeThreadId: string };
    }
  | { type: "CREATE_THREAD"; payload: { id: string; title?: string } }
  | { type: "SWITCH_THREAD"; payload: { id: string } }
  | { type: "DELETE_THREAD"; payload: { id: string } }
  | { type: "CLEAR_THREAD"; payload: { id: string } }
  | { type: "UPDATE_THREAD_TITLE"; payload: { id: string; title: string } }
  | {
      type: "ADD_MESSAGE_TO_THREAD";
      payload: { threadId: string; message: Message };
    }
  | {
      type: "UPDATE_MESSAGE_IN_THREAD";
      payload: { threadId: string; messageId: string; content: string };
    }
  | {
      type: "ADD_SOURCE_TO_THREAD";
      payload: { threadId: string; messageId: string; source: Source };
    };

/**
 * Initial threads state
 */
function createInitialThreadsState(initialThreadId: string): ThreadsState {
  const now = new Date();
  const initialThread: ThreadData = {
    id: initialThreadId,
    messages: [],
    sources: [],
    createdAt: now,
    updatedAt: now,
  };
  const threads = new Map<string, ThreadData>();
  threads.set(initialThreadId, initialThread);
  return {
    threads,
    activeThreadId: initialThreadId,
  };
}

/**
 * Threads state reducer
 */
function threadsReducer(
  state: ThreadsState,
  action: ThreadsAction,
): ThreadsState {
  switch (action.type) {
    case "INIT_THREADS": {
      const threads = new Map<string, ThreadData>();
      action.payload.threads.forEach((t) => threads.set(t.id, t));
      return {
        threads,
        activeThreadId: action.payload.activeThreadId,
      };
    }

    case "CREATE_THREAD": {
      const now = new Date();
      const newThread: ThreadData = {
        id: action.payload.id,
        title: action.payload.title,
        messages: [],
        sources: [],
        createdAt: now,
        updatedAt: now,
      };
      const threads = new Map(state.threads);
      threads.set(action.payload.id, newThread);
      return {
        threads,
        activeThreadId: action.payload.id,
      };
    }

    case "SWITCH_THREAD": {
      if (!state.threads.has(action.payload.id)) {
        return state;
      }
      return {
        ...state,
        activeThreadId: action.payload.id,
      };
    }

    case "DELETE_THREAD": {
      const threads = new Map(state.threads);
      threads.delete(action.payload.id);

      // If deleting active thread, switch to first available or create new
      let activeThreadId = state.activeThreadId;
      if (activeThreadId === action.payload.id) {
        const remaining = Array.from(threads.keys());
        if (remaining.length > 0) {
          activeThreadId = remaining[0];
        } else {
          // Create a new thread if all deleted
          const newId = generateThreadId();
          const now = new Date();
          threads.set(newId, {
            id: newId,
            messages: [],
            sources: [],
            createdAt: now,
            updatedAt: now,
          });
          activeThreadId = newId;
        }
      }
      return { threads, activeThreadId };
    }

    case "CLEAR_THREAD": {
      const threads = new Map(state.threads);
      const thread = threads.get(action.payload.id);
      if (thread) {
        threads.set(action.payload.id, {
          ...thread,
          messages: [],
          sources: [],
          updatedAt: new Date(),
        });
      }
      return { ...state, threads };
    }

    case "UPDATE_THREAD_TITLE": {
      const threads = new Map(state.threads);
      const thread = threads.get(action.payload.id);
      if (thread) {
        threads.set(action.payload.id, {
          ...thread,
          title: action.payload.title,
          updatedAt: new Date(),
        });
      }
      return { ...state, threads };
    }

    case "ADD_MESSAGE_TO_THREAD": {
      const threads = new Map(state.threads);
      const thread = threads.get(action.payload.threadId);
      if (thread) {
        const updatedThread = {
          ...thread,
          messages: [...thread.messages, action.payload.message],
          updatedAt: new Date(),
        };
        // Auto-generate title from first user message
        if (
          !updatedThread.title &&
          action.payload.message.role === "user" &&
          thread.messages.length === 0
        ) {
          updatedThread.title = generateThreadTitle(
            action.payload.message.content,
          );
        }
        threads.set(action.payload.threadId, updatedThread);
      }
      return { ...state, threads };
    }

    case "UPDATE_MESSAGE_IN_THREAD": {
      const threads = new Map(state.threads);
      const thread = threads.get(action.payload.threadId);
      if (thread) {
        threads.set(action.payload.threadId, {
          ...thread,
          messages: thread.messages.map((msg) =>
            msg.id === action.payload.messageId
              ? { ...msg, content: msg.content + action.payload.content }
              : msg,
          ),
          updatedAt: new Date(),
        });
      }
      return { ...state, threads };
    }

    case "ADD_SOURCE_TO_THREAD": {
      const threads = new Map(state.threads);
      const thread = threads.get(action.payload.threadId);
      if (thread) {
        threads.set(action.payload.threadId, {
          ...thread,
          sources: [...thread.sources, action.payload.source],
          messages: thread.messages.map((msg) =>
            msg.id === action.payload.messageId
              ? {
                  ...msg,
                  sources: [...(msg.sources || []), action.payload.source],
                }
              : msg,
          ),
          updatedAt: new Date(),
        });
      }
      return { ...state, threads };
    }

    default:
      return state;
  }
}

/**
 * YourGPT Provider Component
 */
export function YourGPTProvider({
  config,
  cloud,
  runtimeUrl,
  systemPrompt,
  extensions,
  tools: toolsConfig,
  initialMessages = [],
  onMessagesChange,
  yourgptApiKey,
  threadId: explicitThreadId,
  onThreadChange,
  persistence,
  children,
}: YourGPTProviderProps) {
  // Check if user has premium features
  // TODO: [Cloud Integration] Validate API key against YourGPT cloud
  // to get enabled features, plan details, and usage limits.
  // Current: Simple prefix check (client-side only)
  // Future: Server validation with feature flags response
  const isPremium = Boolean(yourgptApiKey?.startsWith("ygpt_"));

  // Generate initial thread ID
  const initialThreadId = useMemo(
    () => explicitThreadId || generateThreadId(),
    [],
  );

  // Threads state
  const [threadsState, threadsDispatch] = useReducer(
    threadsReducer,
    createInitialThreadsState(initialThreadId),
  );

  // Get persistence adapter
  const persistenceAdapter = useMemo(() => {
    if (!persistence?.enabled) return noopPersistence;
    if (persistence.storage === "custom" && persistence.customStorage) {
      return persistence.customStorage;
    }
    return localStoragePersistence;
  }, [persistence]);

  // Load threads from persistence on mount
  const [isLoadingPersistence, setIsLoadingPersistence] = React.useState(
    persistence?.enabled || false,
  );
  useEffect(() => {
    if (!persistence?.enabled) return;

    persistenceAdapter.load().then((loadedThreads) => {
      if (loadedThreads.length > 0) {
        // Find most recently updated thread or use explicit threadId
        const activeId =
          explicitThreadId ||
          loadedThreads.sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
          )[0].id;

        threadsDispatch({
          type: "INIT_THREADS",
          payload: { threads: loadedThreads, activeThreadId: activeId },
        });
      }
      setIsLoadingPersistence(false);
    });
  }, []);

  // Save threads to persistence when they change
  useEffect(() => {
    if (!persistence?.enabled || isLoadingPersistence) return;

    const threadsArray = Array.from(threadsState.threads.values());
    persistenceAdapter.save(threadsArray);
  }, [
    threadsState.threads,
    persistence?.enabled,
    isLoadingPersistence,
    persistenceAdapter,
  ]);

  // Notify on thread change
  useEffect(() => {
    onThreadChange?.(threadsState.activeThreadId);
  }, [threadsState.activeThreadId, onThreadChange]);

  // Get current thread data
  const currentThread = threadsState.threads.get(threadsState.activeThreadId);
  const currentMessages = currentThread?.messages || [];
  const currentSources = currentThread?.sources || [];

  // Chat state (derived from current thread)
  const [chatState, chatDispatch] = useReducer(chatReducer, {
    ...initialChatState,
    messages: initialMessages.length > 0 ? initialMessages : currentMessages,
    threadId: threadsState.activeThreadId,
  });

  // Sync chatState with current thread (for legacy compatibility)
  useEffect(() => {
    if (currentThread) {
      chatDispatch({ type: "SET_MESSAGES", payload: currentThread.messages });
      chatDispatch({
        type: "SET_THREAD_ID",
        payload: threadsState.activeThreadId,
      });
    }
  }, [threadsState.activeThreadId, currentThread?.messages.length]);

  // Tools state
  const [toolsState, toolsDispatch] = useReducer(toolsReducer, {
    ...initialToolsState,
    isEnabled: Boolean(
      toolsConfig?.screenshot || toolsConfig?.console || toolsConfig?.network,
    ),
  });

  // Agent loop state (for agentic tool executions)
  const [agentLoopState, agentLoopDispatch] = useReducer(
    agentLoopReducer,
    initialAgentLoopState,
  );

  // Registered tools (agentic loop)
  const registeredToolsRef = useRef<Map<string, ToolDefinition>>(new Map());
  const [registeredToolsVersion, setRegisteredToolsVersion] = React.useState(0);

  // Registered actions
  const actionsRef = useRef<Map<string, ActionDefinition>>(new Map());
  const [actionsVersion, setActionsVersion] = React.useState(0);

  // Abort controller for stopping generation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Client-side tool loop state (Vercel AI SDK pattern)
  const pendingToolCallsRef = useRef<ToolCallInfo[]>([]);
  const pendingAssistantMessageRef = useRef<AssistantToolMessage | null>(null);
  const currentAssistantMessageIdRef = useRef<string | null>(null);

  // Ref to store handleStreamEvent for use in executeToolsAndContinue
  const handleStreamEventRef = useRef<
    ((event: StreamEvent, messageId: string) => Promise<void>) | null
  >(null);

  // Ref to track added execution IDs (to prevent duplicates during async state updates)
  const addedExecutionIdsRef = useRef<Set<string>>(new Set());

  // Consent resolver for async flow
  const consentResolverRef = useRef<((approved: ToolType[]) => void) | null>(
    null,
  );

  // Remembered consent for session
  const rememberedConsentRef = useRef<Set<ToolType>>(new Set());

  // Context management for useAIContext (tree-based for hierarchical contexts)
  const [contextTree, setContextTree] = React.useState<ContextTreeNode[]>([]);

  // Add context (returns context ID) - supports optional parentId for nesting
  const addContext = useCallback(
    (context: string, parentId?: string): string => {
      const id = `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setContextTree((prev) =>
        addNode(prev, { id, value: context, children: [] }, parentId),
      );
      return id;
    },
    [],
  );

  // Remove context by ID
  const removeContext = useCallback((id: string): void => {
    setContextTree((prev) => removeNode(prev, id));
  }, []);

  // Default system prompt when none is provided
  const DEFAULT_SYSTEM_PROMPT =
    "You are a helpful AI copilot. Use the available tools to assist users. Be concise and helpful.";

  // Build system prompt with contexts
  const buildSystemPromptWithContexts = useCallback((): string => {
    const basePrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;
    const contextString = printTree(contextTree);

    if (!contextString) {
      return basePrompt;
    }

    // Wrap context in code block for better AI understanding
    return `${basePrompt}\n\nThe user has provided you with the following context:\n\`\`\`\n${contextString}\n\`\`\``;
  }, [systemPrompt, contextTree]);

  // Start console/network capture on mount if enabled
  useEffect(() => {
    if (toolsConfig?.console) {
      startConsoleCapture(toolsConfig.consoleOptions);
    }
    if (toolsConfig?.network) {
      startNetworkCapture(toolsConfig.networkOptions);
    }

    return () => {
      stopConsoleCapture();
      stopNetworkCapture();
    };
  }, [
    toolsConfig?.console,
    toolsConfig?.network,
    toolsConfig?.consoleOptions,
    toolsConfig?.networkOptions,
  ]);

  // Build full config
  const fullConfig = useMemo<YourGPTConfig>(
    () => ({
      config,
      cloud,
      runtimeUrl,
      systemPrompt,
      extensions,
    }),
    [config, cloud, runtimeUrl, systemPrompt, extensions],
  );

  // Get API endpoint
  const getEndpoint = useCallback(() => {
    if (cloud) {
      return cloud.endpoint || "https://api.yourgpt.ai/v1/chat";
    }
    return runtimeUrl || "/api/chat";
  }, [cloud, runtimeUrl]);

  // Build request headers (consolidates duplicate header building)
  const buildRequestHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (cloud?.apiKey) {
      headers["Authorization"] = `Bearer ${cloud.apiKey}`;
    } else if (config?.apiKey) {
      headers["X-API-Key"] = config.apiKey;
    }
    return headers;
  }, [cloud?.apiKey, config?.apiKey]);

  // Build request body (consolidates duplicate body building)
  const buildRequestBody = useCallback(
    (
      messages: Message[],
      options?: { includeAttachments?: boolean },
    ): Record<string, unknown> => {
      return {
        messages: messages.map((m) => {
          const msg: Record<string, unknown> = {
            role: m.role,
            content: m.content,
          };
          if (options?.includeAttachments && m.attachments) {
            msg.attachments = m.attachments;
          }
          // Preserve tool_calls and tool_call_id for tool results
          const extendedMsg = m as unknown as Record<string, unknown>;
          if (extendedMsg.tool_calls) msg.tool_calls = extendedMsg.tool_calls;
          if (extendedMsg.tool_call_id)
            msg.tool_call_id = extendedMsg.tool_call_id;
          return msg;
        }),
        threadId: chatState.threadId,
        botId: cloud?.botId,
        config: config,
        systemPrompt: buildSystemPromptWithContexts(),
        actions: Array.from(actionsRef.current.values()).map((a) => ({
          name: a.name,
          description: a.description,
          parameters: a.parameters,
        })),
        tools: Array.from(registeredToolsRef.current.values())
          .filter((t) => t.available !== false)
          .map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
      };
    },
    [chatState.threadId, cloud?.botId, config, buildSystemPromptWithContexts],
  );

  // Capture context based on approved tools
  const captureContext = useCallback(
    async (approvedTools: ToolType[]): Promise<CapturedContext> => {
      toolsDispatch({ type: "SET_CAPTURING", payload: true });

      const context: CapturedContext = {
        timestamp: Date.now(),
      };

      try {
        // Capture screenshot
        if (approvedTools.includes("screenshot") && toolsConfig?.screenshot) {
          try {
            context.screenshot = await captureScreenshot(
              toolsConfig.screenshotOptions,
            );
          } catch (e) {
            console.warn("Failed to capture screenshot:", e);
          }
        }

        // Get console logs
        if (approvedTools.includes("console") && toolsConfig?.console) {
          context.consoleLogs = getConsoleLogs(toolsConfig.consoleOptions);
        }

        // Get network requests
        if (approvedTools.includes("network") && toolsConfig?.network) {
          context.networkRequests = getNetworkRequests(
            toolsConfig.networkOptions,
          );
        }
      } finally {
        toolsDispatch({ type: "SET_CAPTURING", payload: false });
      }

      toolsDispatch({ type: "SET_LAST_CONTEXT", payload: context });
      return context;
    },
    [toolsConfig],
  );

  // Request consent for tools
  const requestConsent = useCallback(
    (suggestedTools: ToolType[], reason = ""): Promise<ToolType[]> => {
      // Filter to only enabled tools
      const enabledTools = suggestedTools.filter((tool) => {
        if (tool === "screenshot") return toolsConfig?.screenshot;
        if (tool === "console") return toolsConfig?.console;
        if (tool === "network") return toolsConfig?.network;
        return false;
      });

      if (enabledTools.length === 0) {
        return Promise.resolve([]);
      }

      // Check if consent is required
      if (toolsConfig?.requireConsent === false) {
        return Promise.resolve(enabledTools);
      }

      // Check remembered consent
      const needsConsent = enabledTools.filter(
        (tool) => !rememberedConsentRef.current.has(tool),
      );

      if (needsConsent.length === 0) {
        return Promise.resolve(enabledTools);
      }

      // Create consent request
      const request: ToolConsentRequest = {
        tools: needsConsent,
        reason,
        keywords: [],
      };

      toolsDispatch({ type: "SET_PENDING_CONSENT", payload: request });

      return new Promise((resolve) => {
        consentResolverRef.current = resolve;
      });
    },
    [toolsConfig],
  );

  // Respond to consent request
  const respondToConsent = useCallback(
    (approved: ToolType[], remember = false) => {
      if (remember) {
        approved.forEach((tool) => rememberedConsentRef.current.add(tool));
      }

      toolsDispatch({ type: "SET_PENDING_CONSENT", payload: null });

      if (consentResolverRef.current) {
        consentResolverRef.current(approved);
        consentResolverRef.current = null;
      }
    },
    [],
  );

  // Clear pending consent
  const clearConsent = useCallback(() => {
    toolsDispatch({ type: "SET_PENDING_CONSENT", payload: null });
    if (consentResolverRef.current) {
      consentResolverRef.current([]);
      consentResolverRef.current = null;
    }
  }, []);

  // Format context for AI
  const formatContextForAI = useCallback((context: CapturedContext): string => {
    const parts: string[] = [];

    if (context.screenshot) {
      parts.push(
        `[Screenshot captured: ${context.screenshot.width}x${context.screenshot.height}]`,
      );
    }

    if (context.consoleLogs && context.consoleLogs.logs.length > 0) {
      parts.push(formatLogsForAI(context.consoleLogs.logs));
    }

    if (
      context.networkRequests &&
      context.networkRequests.requests.length > 0
    ) {
      parts.push(formatRequestsForAI(context.networkRequests.requests));
    }

    return parts.join("\n\n");
  }, []);

  // Send message with context
  const sendMessageWithContext = useCallback(
    async (content: string, context: CapturedContext) => {
      if (!content.trim()) return;

      // Build message with context
      let enrichedContent = content.trim();
      const contextStr = formatContextForAI(context);

      if (contextStr) {
        enrichedContent = `${content.trim()}\n\n---\n\n**Captured App Context:**\n${contextStr}`;
      }

      // Create user message
      const userMessage: Message = {
        id: generateMessageId(),
        role: "user",
        content: enrichedContent,
        createdAt: new Date(),
        // Store context metadata
        metadata: {
          hasContext: true,
          contextTools: [
            context.screenshot && "screenshot",
            context.consoleLogs && "console",
            context.networkRequests && "network",
          ].filter(Boolean) as string[],
        },
      };

      // Include screenshot as attachment if present
      if (context.screenshot) {
        userMessage.attachments = [
          {
            type: "image",
            data: context.screenshot.data,
            mimeType: `image/${context.screenshot.format}`,
          },
        ];
      }

      chatDispatch({ type: "ADD_MESSAGE", payload: userMessage });
      threadsDispatch({
        type: "ADD_MESSAGE_TO_THREAD",
        payload: {
          threadId: threadsState.activeThreadId,
          message: userMessage,
        },
      });
      chatDispatch({ type: "SET_LOADING", payload: true });
      chatDispatch({ type: "SET_ERROR", payload: null });

      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      chatDispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
      threadsDispatch({
        type: "ADD_MESSAGE_TO_THREAD",
        payload: {
          threadId: threadsState.activeThreadId,
          message: assistantMessage,
        },
      });

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(getEndpoint(), {
          method: "POST",
          headers: buildRequestHeaders(),
          body: JSON.stringify(
            buildRequestBody([...chatState.messages, userMessage], {
              includeAttachments: true,
            }),
          ),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        for await (const event of streamSSE(response)) {
          handleStreamEvent(event, assistantMessage.id);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          chatDispatch({
            type: "SET_ERROR",
            payload:
              error instanceof Error ? error : new Error("Unknown error"),
          });
        }
      } finally {
        chatDispatch({ type: "SET_LOADING", payload: false });
        abortControllerRef.current = null;
      }
    },
    [
      chatState.messages,
      chatState.threadId,
      cloud,
      config,
      getEndpoint,
      systemPrompt,
      formatContextForAI,
      buildRequestBody,
      buildRequestHeaders,
    ],
  );

  // Send message (with automatic intent detection)
  /**
   * Execute pending tool calls and continue the conversation (Vercel AI SDK pattern)
   * This creates a client-side loop that executes tools and sends follow-up requests
   */
  const executeToolsAndContinue = useCallback(
    async (previousMessages: Message[], assistantMessageId: string) => {
      const toolCalls = pendingToolCallsRef.current;
      const assistantMessage = pendingAssistantMessageRef.current;

      if (toolCalls.length === 0) return;

      // Execute all pending tool calls
      const toolResults: Array<{ id: string; result: ToolResponse }> = [];

      for (const tc of toolCalls) {
        // Update status to executing
        agentLoopDispatch({
          type: "UPDATE_EXECUTION",
          payload: {
            id: tc.id,
            update: { status: "executing" },
          },
        });

        const tool = registeredToolsRef.current.get(tc.name);
        let result: ToolResponse;

        if (tool?.handler) {
          try {
            result = await tool.handler(tc.args);
            agentLoopDispatch({
              type: "UPDATE_EXECUTION",
              payload: {
                id: tc.id,
                update: { status: "completed", result },
              },
            });
          } catch (error) {
            result = {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Tool execution failed",
            };
            agentLoopDispatch({
              type: "UPDATE_EXECUTION",
              payload: {
                id: tc.id,
                update: { status: "error", error: result.error },
              },
            });
          }
        } else {
          result = {
            success: false,
            error: `Tool "${tc.name}" not found on client`,
          };
          agentLoopDispatch({
            type: "UPDATE_EXECUTION",
            payload: {
              id: tc.id,
              update: { status: "error", error: result.error },
            },
          });
        }

        toolResults.push({ id: tc.id, result });
      }

      // Clear pending tool calls (will be repopulated if server sends more)
      pendingToolCallsRef.current = [];
      pendingAssistantMessageRef.current = null;

      // Build messages with tool results for next request
      // Include: previous messages (excluding the streaming assistant message) + assistant message with tool_calls + tool result messages
      // We exclude the last assistant message from previousMessages because it was added during streaming
      // and doesn't have tool_calls. The proper assistant message (with tool_calls) comes from the server.
      const messagesWithResults: Array<Record<string, unknown>> = [
        ...previousMessages
          .filter((m, i) => {
            // Exclude the last message if it's an assistant message (it will be replaced by assistantMessage with tool_calls)
            if (i === previousMessages.length - 1 && m.role === "assistant") {
              return false;
            }
            return true;
          })
          .map((m) => {
            // Preserve the full message structure including tool_calls and tool_call_id
            const msg: Record<string, unknown> = {
              role: m.role,
              content: m.content,
            };
            // Preserve tool_calls if present (for assistant messages)
            const extendedMsg = m as unknown as Record<string, unknown>;
            if (extendedMsg.tool_calls) {
              msg.tool_calls = extendedMsg.tool_calls;
            }
            // Preserve tool_call_id if present (for tool messages)
            if (extendedMsg.tool_call_id) {
              msg.tool_call_id = extendedMsg.tool_call_id;
            }
            return msg;
          }),
      ];

      // Add assistant message with tool_calls (from server)
      if (assistantMessage) {
        messagesWithResults.push(
          assistantMessage as unknown as Record<string, unknown>,
        );
      }

      // Add tool result messages (OpenAI format)
      for (const { id, result } of toolResults) {
        messagesWithResults.push({
          role: "tool",
          tool_call_id: id,
          content: JSON.stringify(result),
        });
      }

      // Send follow-up request to server
      try {
        const response = await fetch(getEndpoint(), {
          method: "POST",
          headers: buildRequestHeaders(),
          body: JSON.stringify({
            messages: messagesWithResults,
            threadId: chatState.threadId,
            botId: cloud?.botId,
            config: config,
            systemPrompt: buildSystemPromptWithContexts(),
            actions: Array.from(actionsRef.current.values()).map((a) => ({
              name: a.name,
              description: a.description,
              parameters: a.parameters,
            })),
            tools: Array.from(registeredToolsRef.current.values())
              .filter((t) => t.available !== false)
              .map((t) => ({
                name: t.name,
                description: t.description,
                inputSchema: t.inputSchema,
              })),
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Process the response stream using the ref
        const streamHandler = handleStreamEventRef.current;
        if (streamHandler) {
          for await (const event of streamSSE(response)) {
            await streamHandler(event, assistantMessageId);
          }
        }

        // If more tool calls were detected, continue the loop
        // We need to preserve the full message structure including tool_calls
        if (pendingToolCallsRef.current.length > 0) {
          // Build updated messages preserving the full structure
          // messagesWithResults already has the proper format with tool_calls
          const updatedMessages: Message[] = messagesWithResults.map((m) => {
            const msg: Message = {
              id: generateMessageId(),
              role: m.role as Message["role"],
              content:
                typeof m.content === "string"
                  ? m.content
                  : m.content === null
                    ? ""
                    : JSON.stringify(m.content),
              createdAt: new Date(),
            };
            // Preserve tool_calls if present
            if (m.tool_calls) {
              (msg as unknown as Record<string, unknown>).tool_calls =
                m.tool_calls;
            }
            // Preserve tool_call_id if present (for tool messages)
            if (m.tool_call_id) {
              (msg as unknown as Record<string, unknown>).tool_call_id =
                m.tool_call_id;
            }
            return msg;
          });
          await executeToolsAndContinue(updatedMessages, assistantMessageId);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          throw error;
        }
      }
    },
    [chatState.threadId, cloud, config, getEndpoint, systemPrompt],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Clear previous tool executions and tracking ref
      agentLoopDispatch({ type: "CLEAR_EXECUTIONS" });
      addedExecutionIdsRef.current.clear();

      // Check if tools are enabled and detect intent
      if (toolsState.isEnabled && toolsConfig) {
        const intent = detectIntent(content);

        // Filter to enabled tools
        const suggestedTools = intent.suggestedTools.filter((tool) => {
          if (tool === "screenshot") return toolsConfig.screenshot;
          if (tool === "console") return toolsConfig.console;
          if (tool === "network") return toolsConfig.network;
          return false;
        });

        if (suggestedTools.length > 0) {
          const reason = generateSuggestionReason(intent);
          const approved = await requestConsent(suggestedTools, reason);

          if (approved.length > 0) {
            const context = await captureContext(approved);
            return sendMessageWithContext(content, context);
          }
        }
      }

      // Regular send without context
      const userMessage: Message = {
        id: generateMessageId(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      chatDispatch({ type: "ADD_MESSAGE", payload: userMessage });
      threadsDispatch({
        type: "ADD_MESSAGE_TO_THREAD",
        payload: {
          threadId: threadsState.activeThreadId,
          message: userMessage,
        },
      });
      chatDispatch({ type: "SET_LOADING", payload: true });
      chatDispatch({ type: "SET_ERROR", payload: null });

      const assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      chatDispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
      threadsDispatch({
        type: "ADD_MESSAGE_TO_THREAD",
        payload: {
          threadId: threadsState.activeThreadId,
          message: assistantMessage,
        },
      });
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(getEndpoint(), {
          method: "POST",
          headers: buildRequestHeaders(),
          body: JSON.stringify(
            buildRequestBody([...chatState.messages, userMessage]),
          ),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Store current assistant message ID for tool execution
        currentAssistantMessageIdRef.current = assistantMessage.id;

        for await (const event of streamSSE(response)) {
          handleStreamEvent(event, assistantMessage.id);
        }

        // After stream ends, check if we need to execute tools (Vercel AI SDK pattern)
        if (pendingToolCallsRef.current.length > 0) {
          await executeToolsAndContinue(
            [...chatState.messages, userMessage],
            assistantMessage.id,
          );
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          chatDispatch({
            type: "SET_ERROR",
            payload:
              error instanceof Error ? error : new Error("Unknown error"),
          });
        }
      } finally {
        chatDispatch({ type: "SET_LOADING", payload: false });
        abortControllerRef.current = null;
        // Clear pending state
        pendingToolCallsRef.current = [];
        pendingAssistantMessageRef.current = null;
        currentAssistantMessageIdRef.current = null;
      }
    },
    [
      toolsState.isEnabled,
      toolsConfig,
      requestConsent,
      captureContext,
      sendMessageWithContext,
      chatState.messages,
      chatState.threadId,
      cloud,
      config,
      getEndpoint,
      systemPrompt,
      buildRequestBody,
      buildRequestHeaders,
    ],
  );

  // Handle stream events
  const handleStreamEvent = useCallback(
    async (event: StreamEvent, messageId: string) => {
      switch (event.type) {
        case "message:delta":
          chatDispatch({
            type: "UPDATE_MESSAGE",
            payload: { id: messageId, content: event.content },
          });
          threadsDispatch({
            type: "UPDATE_MESSAGE_IN_THREAD",
            payload: {
              threadId: threadsState.activeThreadId,
              messageId,
              content: event.content,
            },
          });
          break;

        case "source:add":
          chatDispatch({
            type: "ADD_SOURCE",
            payload: { messageId, source: event.source },
          });
          threadsDispatch({
            type: "ADD_SOURCE_TO_THREAD",
            payload: {
              threadId: threadsState.activeThreadId,
              messageId,
              source: event.source as Source,
            },
          });
          break;

        case "action:start":
          // Track tool execution start (only if not already added)
          if (!addedExecutionIdsRef.current.has(event.id)) {
            addedExecutionIdsRef.current.add(event.id);
            agentLoopDispatch({
              type: "ADD_EXECUTION",
              payload: {
                id: event.id,
                name: event.name,
                args: {},
                status: "pending",
                timestamp: Date.now(),
              },
            });
          }
          break;

        case "action:args":
          // Update tool execution with args
          try {
            const args = JSON.parse(event.args);
            agentLoopDispatch({
              type: "UPDATE_EXECUTION",
              payload: {
                id: event.id,
                update: { args, status: "executing" },
              },
            });
          } catch {
            // Ignore parse errors
          }
          break;

        case "action:end":
          // Tool execution completed
          agentLoopDispatch({
            type: "UPDATE_EXECUTION",
            payload: {
              id: event.id,
              update: {
                status: event.error ? "error" : "completed",
                result: event.result as ToolResponse | undefined,
                error: event.error,
                duration:
                  Date.now() -
                  (agentLoopState.toolExecutions.find((e) => e.id === event.id)
                    ?.timestamp || Date.now()),
              },
            },
          });
          break;

        case "tool_calls":
          // New: Vercel AI SDK pattern - server sends tool calls for client to execute
          // Store the tool calls and assistant message for processing on "done" event
          pendingToolCallsRef.current = event.toolCalls;
          pendingAssistantMessageRef.current = event.assistantMessage;

          // Update existing executions with parsed args or add if not present
          // Use ref to check since React state might not have updated yet
          for (const tc of event.toolCalls) {
            if (addedExecutionIdsRef.current.has(tc.id)) {
              // Already added by action:start, just update with parsed args
              agentLoopDispatch({
                type: "UPDATE_EXECUTION",
                payload: {
                  id: tc.id,
                  update: { args: tc.args },
                },
              });
            } else {
              // Not yet added (edge case), add it now
              addedExecutionIdsRef.current.add(tc.id);
              agentLoopDispatch({
                type: "ADD_EXECUTION",
                payload: {
                  id: tc.id,
                  name: tc.name,
                  args: tc.args,
                  status: "pending",
                  timestamp: Date.now(),
                },
              });
            }
          }
          break;

        case "loop:iteration":
          // Update loop iteration state
          agentLoopDispatch({
            type: "SET_ITERATION",
            payload: {
              iteration: event.iteration,
              maxIterations: event.maxIterations,
            },
          });
          break;

        case "loop:complete":
          // Loop completed
          if (event.maxIterationsReached) {
            agentLoopDispatch({
              type: "SET_MAX_ITERATIONS_REACHED",
              payload: true,
            });
          }
          break;

        case "error":
          chatDispatch({
            type: "SET_ERROR",
            payload: new Error(event.message),
          });
          break;
      }
    },
    [
      threadsState.activeThreadId,
      chatState.threadId,
      getEndpoint,
      agentLoopState.toolExecutions,
    ],
  );

  // Store handleStreamEvent in ref for use in executeToolsAndContinue
  useEffect(() => {
    handleStreamEventRef.current = handleStreamEvent;
  }, [handleStreamEvent]);

  // Stop generation
  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // Clear messages (clears current thread)
  const clearMessages = useCallback(() => {
    chatDispatch({ type: "CLEAR" });
    threadsDispatch({
      type: "CLEAR_THREAD",
      payload: { id: threadsState.activeThreadId },
    });
  }, [threadsState.activeThreadId]);

  // Regenerate
  const regenerate = useCallback(
    async (messageId?: string) => {
      const messages = chatState.messages;
      let targetIndex = messages.length - 1;

      if (messageId) {
        targetIndex = messages.findIndex((m) => m.id === messageId);
      }

      let lastUserIndex = targetIndex;
      while (lastUserIndex >= 0 && messages[lastUserIndex].role !== "user") {
        lastUserIndex--;
      }

      if (lastUserIndex < 0) return;

      const newMessages = messages.slice(0, lastUserIndex);
      chatDispatch({ type: "SET_MESSAGES", payload: newMessages });

      const lastUserMessage = messages[lastUserIndex];
      await sendMessage(lastUserMessage.content);
    },
    [chatState.messages, sendMessage],
  );

  // Set messages
  const setMessages = useCallback((messages: Message[]) => {
    chatDispatch({ type: "SET_MESSAGES", payload: messages });
  }, []);

  // Register action
  const registerAction = useCallback((action: ActionDefinition) => {
    actionsRef.current.set(action.name, action);
    setActionsVersion((v) => v + 1);
  }, []);

  // Unregister action
  const unregisterAction = useCallback((name: string) => {
    actionsRef.current.delete(name);
    setActionsVersion((v) => v + 1);
  }, []);

  // ============================================
  // Tool Registration Functions (Agentic Loop)
  // ============================================

  // Register a tool
  const registerTool = useCallback((tool: ToolDefinition) => {
    registeredToolsRef.current.set(tool.name, tool);
    setRegisteredToolsVersion((v) => v + 1);
  }, []);

  // Unregister a tool
  const unregisterTool = useCallback((name: string) => {
    registeredToolsRef.current.delete(name);
    setRegisteredToolsVersion((v) => v + 1);
  }, []);

  // Add a tool execution record
  const addToolExecution = useCallback((execution: ToolExecution) => {
    agentLoopDispatch({ type: "ADD_EXECUTION", payload: execution });
  }, []);

  // Update a tool execution record
  const updateToolExecution = useCallback(
    (id: string, update: Partial<ToolExecution>) => {
      agentLoopDispatch({ type: "UPDATE_EXECUTION", payload: { id, update } });
    },
    [],
  );

  // Clear all tool executions
  const clearToolExecutions = useCallback(() => {
    agentLoopDispatch({ type: "CLEAR_EXECUTIONS" });
    addedExecutionIdsRef.current.clear();
  }, []);

  // ============================================
  // Thread Management Functions
  // ============================================

  // Create a new thread
  const createThread = useCallback((title?: string): string => {
    const id = generateThreadId();
    threadsDispatch({ type: "CREATE_THREAD", payload: { id, title } });
    return id;
  }, []);

  // Switch to a different thread
  const switchThread = useCallback(
    (id: string) => {
      if (explicitThreadId) {
        throw new Error(
          "Cannot call switchThread() when threadId is provided via props.",
        );
      }
      threadsDispatch({ type: "SWITCH_THREAD", payload: { id } });
    },
    [explicitThreadId],
  );

  // Delete a thread
  const deleteThread = useCallback((id: string) => {
    threadsDispatch({ type: "DELETE_THREAD", payload: { id } });
  }, []);

  // Clear a thread's messages
  const clearThread = useCallback((id: string) => {
    threadsDispatch({ type: "CLEAR_THREAD", payload: { id } });
  }, []);

  // Update thread title
  const updateThreadTitle = useCallback((id: string, title: string) => {
    threadsDispatch({ type: "UPDATE_THREAD_TITLE", payload: { id, title } });
  }, []);

  // Set thread ID (for external control)
  const setThreadId = useCallback(
    (id: string) => {
      if (explicitThreadId) {
        throw new Error(
          "Cannot call setThreadId() when threadId is provided via props.",
        );
      }
      // If thread doesn't exist, create it
      if (!threadsState.threads.has(id)) {
        threadsDispatch({ type: "CREATE_THREAD", payload: { id } });
      } else {
        threadsDispatch({ type: "SWITCH_THREAD", payload: { id } });
      }
    },
    [explicitThreadId, threadsState.threads],
  );

  // Get thread data by ID
  const getThreadData = useCallback(
    (id: string) => {
      return threadsState.threads.get(id);
    },
    [threadsState.threads],
  );

  // Get list of threads (metadata only)
  const threadsList = useMemo((): Thread[] => {
    return Array.from(threadsState.threads.values())
      .map(({ id, title, createdAt, updatedAt }) => ({
        id,
        title,
        createdAt,
        updatedAt,
      }))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [threadsState.threads]);

  // Threads context value
  const threadsContextValue = useMemo<ThreadsContextValue>(
    () => ({
      threadId: threadsState.activeThreadId,
      setThreadId,
      threads: threadsList,
      getThreadData,
      createThread,
      deleteThread,
      clearThread,
      updateThreadTitle,
      persistenceEnabled: persistence?.enabled || false,
    }),
    [
      threadsState.activeThreadId,
      setThreadId,
      threadsList,
      getThreadData,
      createThread,
      deleteThread,
      clearThread,
      updateThreadTitle,
      persistence?.enabled,
    ],
  );

  // Context value
  const contextValue = useMemo<YourGPTContextValue>(
    () => ({
      config: fullConfig,
      toolsConfig: toolsConfig || null,
      chat: chatState,
      tools: toolsState,
      agentLoop: agentLoopState,
      actions: {
        sendMessage,
        sendMessageWithContext,
        stopGeneration,
        clearMessages,
        regenerate,
        setMessages,
      },
      toolsActions: {
        requestConsent: (tools, reason) => {
          requestConsent(tools, reason);
        },
        respondToConsent,
        captureContext,
        clearConsent,
      },
      registeredActions: Array.from(actionsRef.current.values()),
      registerAction,
      unregisterAction,
      // Agentic loop tool registration
      registeredTools: Array.from(registeredToolsRef.current.values()),
      registerTool,
      unregisterTool,
      addToolExecution,
      updateToolExecution,
      clearToolExecutions,
      addContext,
      removeContext,
      contextTree,
      isPremium,
    }),
    [
      fullConfig,
      toolsConfig,
      chatState,
      toolsState,
      agentLoopState,
      sendMessage,
      sendMessageWithContext,
      stopGeneration,
      clearMessages,
      regenerate,
      setMessages,
      requestConsent,
      respondToConsent,
      captureContext,
      clearConsent,
      registerAction,
      unregisterAction,
      actionsVersion,
      registerTool,
      unregisterTool,
      registeredToolsVersion,
      addToolExecution,
      updateToolExecution,
      clearToolExecutions,
      addContext,
      removeContext,
      contextTree,
      isPremium,
    ],
  );

  // Notify on messages change
  useEffect(() => {
    onMessagesChange?.(chatState.messages);
  }, [chatState.messages, onMessagesChange]);

  return (
    <ThreadsContext.Provider value={threadsContextValue}>
      <YourGPTContext.Provider value={contextValue}>
        {children}
      </YourGPTContext.Provider>
    </ThreadsContext.Provider>
  );
}
