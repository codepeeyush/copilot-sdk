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
  YourGPTContext,
  initialChatState,
  initialToolsState,
  type ChatState,
  type ToolsState,
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

  // Registered actions
  const actionsRef = useRef<Map<string, ActionDefinition>>(new Map());
  const [actionsVersion, setActionsVersion] = React.useState(0);

  // Abort controller for stopping generation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Consent resolver for async flow
  const consentResolverRef = useRef<((approved: ToolType[]) => void) | null>(
    null,
  );

  // Remembered consent for session
  const rememberedConsentRef = useRef<Set<ToolType>>(new Set());

  // Context management for useAIContext
  const contextsRef = useRef<Map<string, string>>(new Map());
  const [contextsVersion, setContextsVersion] = React.useState(0);

  // Add context (returns context ID)
  const addContext = useCallback((context: string): string => {
    const id = `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    contextsRef.current.set(id, context);
    setContextsVersion((v) => v + 1);
    return id;
  }, []);

  // Remove context by ID
  const removeContext = useCallback((id: string): void => {
    contextsRef.current.delete(id);
    setContextsVersion((v) => v + 1);
  }, []);

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
        const endpoint = getEndpoint();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (cloud?.apiKey) {
          headers["Authorization"] = `Bearer ${cloud.apiKey}`;
        } else if (config?.apiKey) {
          headers["X-API-Key"] = config.apiKey;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: [...chatState.messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments,
            })),
            threadId: chatState.threadId,
            botId: cloud?.botId,
            config: config,
            systemPrompt,
            actions: Array.from(actionsRef.current.values()).map((a) => ({
              name: a.name,
              description: a.description,
              parameters: a.parameters,
            })),
          }),
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
    ],
  );

  // Send message (with automatic intent detection)
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

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
        const endpoint = getEndpoint();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (cloud?.apiKey) {
          headers["Authorization"] = `Bearer ${cloud.apiKey}`;
        } else if (config?.apiKey) {
          headers["X-API-Key"] = config.apiKey;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: [...chatState.messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            threadId: chatState.threadId,
            botId: cloud?.botId,
            config: config,
            systemPrompt,
            actions: Array.from(actionsRef.current.values()).map((a) => ({
              name: a.name,
              description: a.description,
              parameters: a.parameters,
            })),
          }),
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
    ],
  );

  // Handle stream events
  const handleStreamEvent = useCallback(
    (event: StreamEvent, messageId: string) => {
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
          break;

        case "action:end":
          if (event.name) {
            const action = actionsRef.current.get(event.name);
            if (action?.handler && event.result) {
              // Action was handled by runtime
            }
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
    [threadsState.activeThreadId],
  );

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
      addContext,
      removeContext,
      contexts: contextsRef.current,
      isPremium,
    }),
    [
      fullConfig,
      toolsConfig,
      chatState,
      toolsState,
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
      addContext,
      removeContext,
      contextsVersion,
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
