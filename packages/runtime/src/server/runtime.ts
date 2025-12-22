import type {
  Message,
  ActionDefinition,
  StreamEvent,
  KnowledgeBaseConfig,
  ToolDefinition,
  AIProvider,
  ToolCallInfo,
  AssistantToolMessage,
} from "@yourgpt/core";
import { createMessage } from "@yourgpt/core";
import type { LLMAdapter, ChatCompletionRequest } from "../adapters";
import {
  createOpenAIAdapter,
  createAnthropicAdapter,
  createGroqAdapter,
  createOllamaAdapter,
} from "../adapters";
import type { RuntimeConfig, ChatRequest } from "./types";
import { createSSEResponse } from "./streaming";

/**
 * YourGPT Copilot Runtime
 *
 * Handles chat requests and manages LLM interactions.
 */
export class Runtime {
  private adapter: LLMAdapter;
  private config: RuntimeConfig;
  private actions: Map<string, ActionDefinition> = new Map();
  private tools: Map<string, ToolDefinition> = new Map();
  private knowledgeBase: KnowledgeBaseConfig | null = null;

  constructor(config: RuntimeConfig) {
    this.config = config;

    // Create adapter based on provider
    if (config.adapter) {
      this.adapter = config.adapter;
    } else {
      this.adapter = this.createAdapter(config);
    }

    // Register actions (legacy)
    if (config.actions) {
      for (const action of config.actions) {
        this.actions.set(action.name, action);
      }
    }

    // Register tools (new)
    if (config.tools) {
      for (const tool of config.tools) {
        this.tools.set(tool.name, tool);
      }
    }

    // Setup knowledge base if configured
    if (config.knowledgeBase) {
      this.knowledgeBase = config.knowledgeBase;
      this.registerKnowledgeBaseAction();
    }
  }

  /**
   * Register the search_knowledge action when knowledge base is enabled
   * This is a placeholder that will be implemented later
   */
  private registerKnowledgeBaseAction(): void {
    if (!this.knowledgeBase) return;

    const kb = this.knowledgeBase;

    this.actions.set("search_knowledge", {
      name: "search_knowledge",
      description: `Search the knowledge base "${kb.name || kb.id}" for relevant information. Use this when you need to find specific information from the documentation or knowledge base.`,
      parameters: {
        query: {
          type: "string",
          description: "The search query to find relevant information",
          required: true,
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 5)",
          required: false,
        },
      },
      handler: async (params) => {
        const query = params.query as string;
        const limit = (params.limit as number) || kb.topK || 5;

        // PLACEHOLDER: This is where the actual vector search will be implemented
        // For now, return a message indicating where the KB search will happen
        console.log(
          `[YourGPT Knowledge Base] Searching "${kb.id}" for: "${query}" (limit: ${limit})`,
        );

        return {
          status: "placeholder",
          message: `🔍 Finding in Knowledge Base "${kb.name || kb.id}" (ID: ${kb.id})`,
          query,
          provider: kb.provider,
          index: kb.index || "default",
          namespace: kb.namespace,
          limit,
          // This will be replaced with actual results when implemented
          results: [
            {
              content: `[PLACEHOLDER] Knowledge Base search for "${query}" will return results here.`,
              score: 1.0,
              metadata: {
                source: "placeholder",
                note: "Full vector search implementation coming soon",
              },
            },
          ],
          _implementation_note:
            "This is a placeholder. Connect your vector DB (Pinecone, Qdrant, etc.) to enable real search.",
        };
      },
    });

    if (this.config.debug) {
      console.log(
        `[YourGPT Runtime] Knowledge Base "${kb.id}" registered with search_knowledge action`,
      );
    }
  }

  /**
   * Create LLM adapter based on config
   */
  private createAdapter(config: RuntimeConfig): LLMAdapter {
    if (!("llm" in config) || !config.llm) {
      throw new Error(
        "LLM configuration is required when adapter is not provided",
      );
    }
    const { llm } = config;

    switch (llm.provider) {
      case "openai":
        return createOpenAIAdapter({
          apiKey: llm.apiKey,
          model: llm.model,
          baseUrl: llm.baseUrl,
          temperature: llm.temperature,
          maxTokens: llm.maxTokens,
        });

      case "anthropic":
        return createAnthropicAdapter({
          apiKey: llm.apiKey,
          model: llm.model,
          temperature: llm.temperature,
          maxTokens: llm.maxTokens,
        });

      case "groq":
        return createGroqAdapter({
          apiKey: llm.apiKey,
          model: llm.model,
          temperature: llm.temperature,
          maxTokens: llm.maxTokens,
        });

      case "ollama":
        return createOllamaAdapter({
          model: llm.model,
          baseUrl: llm.baseUrl,
          temperature: llm.temperature,
          maxTokens: llm.maxTokens,
        });

      default:
        // Default to OpenAI-compatible
        return createOpenAIAdapter({
          apiKey: llm.apiKey,
          model: llm.model,
          baseUrl: llm.baseUrl,
          temperature: llm.temperature,
          maxTokens: llm.maxTokens,
        });
    }
  }

  /**
   * Process a chat request and return streaming response
   */
  async *processChat(
    request: ChatRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<StreamEvent> {
    // Convert request messages to Message type
    const messages: Message[] = request.messages.map((m, i) =>
      createMessage({
        id: `msg_${i}`,
        role: m.role as Message["role"],
        content: m.content,
      }),
    );

    // Merge actions from config and request
    const allActions = [...this.actions.values()];
    if (request.actions) {
      for (const action of request.actions) {
        if (!this.actions.has(action.name)) {
          allActions.push({
            name: action.name,
            description: action.description,
            parameters: action.parameters as ActionDefinition["parameters"],
            handler: async () => {
              // Client-side action - will be handled by frontend
              return { handled: false };
            },
          });
        }
      }
    }

    // Create completion request
    const completionRequest: ChatCompletionRequest = {
      messages,
      actions: allActions.length > 0 ? allActions : undefined,
      systemPrompt: request.systemPrompt || this.config.systemPrompt,
      config: request.config,
      signal,
    };

    // Stream response from adapter
    const stream = this.adapter.stream(completionRequest);

    // Process events and handle tool calls
    for await (const event of stream) {
      // Handle action execution
      if (event.type === "action:args") {
        const action = this.actions.get(event.id);
        if (action) {
          try {
            const args = JSON.parse(event.args);
            const result = await action.handler(args);
            yield {
              type: "action:end",
              id: event.id,
              result,
            };
          } catch (error) {
            yield {
              type: "action:end",
              id: event.id,
              error: error instanceof Error ? error.message : "Action failed",
            };
          }
        } else {
          // Forward to client for handling
          yield event;
        }
      } else {
        yield event;
      }
    }
  }

  /**
   * Handle HTTP request (for use with any framework)
   */
  async handleRequest(request: Request): Promise<Response> {
    try {
      const body = (await request.json()) as ChatRequest;

      if (this.config.debug) {
        console.log(
          "[YourGPT Runtime] Request:",
          JSON.stringify(body, null, 2),
        );
      }

      // Create abort controller from request signal
      const signal = request.signal;

      // Use agent loop if tools are present or explicitly enabled
      const hasTools =
        (body.tools && body.tools.length > 0) || this.tools.size > 0;
      const useAgentLoop = hasTools || this.config.agentLoop?.enabled;

      // Process chat and return SSE response
      const generator = useAgentLoop
        ? this.processChatWithLoop(body, signal)
        : this.processChat(body, signal);
      return createSSEResponse(generator);
    } catch (error) {
      console.error("[YourGPT Runtime] Error:", error);

      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  /**
   * Get registered actions
   */
  getActions(): ActionDefinition[] {
    return [...this.actions.values()];
  }

  /**
   * Register a new action
   */
  registerAction(action: ActionDefinition): void {
    this.actions.set(action.name, action);
  }

  /**
   * Unregister an action
   */
  unregisterAction(name: string): void {
    this.actions.delete(name);
  }

  /**
   * Register a new tool
   */
  registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Unregister a tool
   */
  unregisterTool(name: string): void {
    this.tools.delete(name);
  }

  /**
   * Get registered tools
   */
  getTools(): ToolDefinition[] {
    return [...this.tools.values()];
  }

  /**
   * Get the AI provider from config
   */
  private getProvider(): AIProvider {
    if ("llm" in this.config && this.config.llm) {
      return this.config.llm.provider as AIProvider;
    }
    // Default to openai if using custom adapter
    return "openai";
  }

  /**
   * Process a chat request with tool support (Vercel AI SDK pattern)
   *
   * This method:
   * 1. Streams response from adapter
   * 2. Detects tool calls from streaming events
   * 3. If tool calls detected, yields tool_calls event and returns
   * 4. Client executes tools and sends new request with results
   * 5. NO server-side looping - client controls the loop
   */
  async *processChatWithLoop(
    request: ChatRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<StreamEvent> {
    const debug = this.config.debug || this.config.agentLoop?.debug;

    // Collect all tools (server + client from request)
    const allTools: ToolDefinition[] = [...this.tools.values()];

    // Add client tools from request
    if (request.tools) {
      for (const tool of request.tools) {
        allTools.push({
          name: tool.name,
          description: tool.description,
          location: "client",
          inputSchema: tool.inputSchema as ToolDefinition["inputSchema"],
        });
      }
    }

    if (debug) {
      console.log(
        `[YourGPT Runtime] Processing chat with ${allTools.length} tools`,
      );
    }

    // Accumulate data from stream
    let accumulatedText = "";
    const toolCalls: ToolCallInfo[] = [];
    let currentToolCall: { id: string; name: string; args: string } | null =
      null;

    // Create completion request
    // Use rawMessages if provided (when client sends tool results in messages)
    const completionRequest: ChatCompletionRequest = {
      messages: [], // Not used when rawMessages is provided
      rawMessages: request.messages as Array<Record<string, unknown>>,
      actions: this.convertToolsToActions(allTools),
      systemPrompt: request.systemPrompt || this.config.systemPrompt,
      config: request.config,
      signal,
    };

    // Stream from adapter
    const stream = this.adapter.stream(completionRequest);

    // Process stream events
    for await (const event of stream) {
      switch (event.type) {
        case "message:start":
        case "message:end":
          yield event; // Forward to client
          break;

        case "message:delta":
          accumulatedText += event.content;
          yield event; // Forward text to client
          break;

        case "action:start":
          currentToolCall = { id: event.id, name: event.name, args: "" };
          if (debug) {
            console.log(`[YourGPT Runtime] Tool call started: ${event.name}`);
          }
          yield event; // Forward to client
          break;

        case "action:args":
          if (currentToolCall) {
            try {
              const parsedArgs = JSON.parse(event.args || "{}");
              if (debug) {
                console.log(
                  `[YourGPT Runtime] Tool args for ${currentToolCall.name}:`,
                  parsedArgs,
                );
              }
              toolCalls.push({
                id: currentToolCall.id,
                name: currentToolCall.name,
                args: parsedArgs,
              });
            } catch (e) {
              console.error(
                "[YourGPT Runtime] Failed to parse tool args:",
                event.args,
                e,
              );
              toolCalls.push({
                id: currentToolCall.id,
                name: currentToolCall.name,
                args: {},
              });
            }
            currentToolCall = null;
          }
          yield event; // Forward to client
          break;

        case "error":
          yield event;
          return; // Exit on error

        case "done":
          // Don't yield done yet - we need to check for tool calls first
          break;

        default:
          yield event;
      }
    }

    // Check if we got tool calls
    if (toolCalls.length > 0) {
      if (debug) {
        console.log(
          `[YourGPT Runtime] Detected ${toolCalls.length} tool calls:`,
          toolCalls.map((t) => t.name),
        );
      }

      // Build assistant message with tool_calls for client to include in next request
      const assistantMessage: AssistantToolMessage = {
        role: "assistant",
        content: accumulatedText || null,
        tool_calls: toolCalls.map((tc) => ({
          id: tc.id,
          type: "function" as const,
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.args),
          },
        })),
      };

      // Yield tool_calls event (Vercel AI SDK pattern)
      yield {
        type: "tool_calls",
        toolCalls,
        assistantMessage,
      } as StreamEvent;

      // Signal that client needs to execute tools and send results
      yield { type: "done", requiresAction: true } as StreamEvent;
      return;
    }

    // No tool calls - we're done
    if (debug) {
      console.log(`[YourGPT Runtime] No tool calls, stream complete`);
    }
    yield { type: "done" } as StreamEvent;
  }

  /**
   * Convert tools to legacy action format (for adapter compatibility)
   */
  private convertToolsToActions(tools: ToolDefinition[]): ActionDefinition[] {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: this.convertInputSchemaToParameters(tool.inputSchema),
      handler: tool.handler || (async () => ({ handled: false })),
    }));
  }

  /**
   * Convert JSON Schema to legacy parameters format
   */
  private convertInputSchemaToParameters(
    schema: ToolDefinition["inputSchema"],
  ): Record<
    string,
    {
      type: "string" | "number" | "boolean" | "object" | "array";
      description?: string;
      required?: boolean;
      enum?: string[];
    }
  > {
    const parameters: Record<
      string,
      {
        type: "string" | "number" | "boolean" | "object" | "array";
        description?: string;
        required?: boolean;
        enum?: string[];
      }
    > = {};

    for (const [name, prop] of Object.entries(schema.properties)) {
      // Use type assertion to handle JSONSchemaProperty
      const p = prop as unknown as {
        type?: string;
        description?: string;
        enum?: string[];
      };

      // Map JSON Schema type to ParameterType
      type ParamType = "string" | "number" | "boolean" | "object" | "array";
      const typeMap: Record<string, ParamType> = {
        string: "string",
        number: "number",
        integer: "number",
        boolean: "boolean",
        object: "object",
        array: "array",
      };

      parameters[name] = {
        type: typeMap[p.type || "string"] || "string",
        description: p.description,
        required: schema.required?.includes(name),
        enum: p.enum,
      };
    }

    return parameters;
  }
}

/**
 * Create runtime instance
 */
export function createRuntime(config: RuntimeConfig): Runtime {
  return new Runtime(config);
}
