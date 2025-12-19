import type {
  Message,
  ActionDefinition,
  StreamEvent,
  KnowledgeBaseConfig,
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
  private knowledgeBase: KnowledgeBaseConfig | null = null;

  constructor(config: RuntimeConfig) {
    this.config = config;

    // Create adapter based on provider
    if (config.adapter) {
      this.adapter = config.adapter;
    } else {
      this.adapter = this.createAdapter(config);
    }

    // Register actions
    if (config.actions) {
      for (const action of config.actions) {
        this.actions.set(action.name, action);
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

      // Process chat and return SSE response
      const generator = this.processChat(body, signal);
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
}

/**
 * Create runtime instance
 */
export function createRuntime(config: RuntimeConfig): Runtime {
  return new Runtime(config);
}
