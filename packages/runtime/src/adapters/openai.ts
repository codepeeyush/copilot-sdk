import type { LLMConfig, StreamEvent } from "@yourgpt/core";
import { generateMessageId, generateToolCallId } from "@yourgpt/core";
import type { LLMAdapter, ChatCompletionRequest } from "./base";
import { formatMessages, formatTools } from "./base";

/**
 * OpenAI adapter configuration
 */
export interface OpenAIAdapterConfig extends Partial<LLMConfig> {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

/**
 * OpenAI LLM Adapter
 *
 * Supports: GPT-4, GPT-4o, GPT-3.5-turbo, etc.
 */
export class OpenAIAdapter implements LLMAdapter {
  readonly provider = "openai";
  readonly model: string;

  private client: any; // OpenAI client (lazy loaded)
  private config: OpenAIAdapterConfig;

  constructor(config: OpenAIAdapterConfig) {
    this.config = config;
    this.model = config.model || "gpt-4o";
  }

  private async getClient() {
    if (!this.client) {
      // Dynamic import to make openai optional
      const { default: OpenAI } = await import("openai");
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseUrl,
      });
    }
    return this.client;
  }

  async *stream(request: ChatCompletionRequest): AsyncGenerator<StreamEvent> {
    const client = await this.getClient();

    const messages = formatMessages(request.messages, request.systemPrompt);
    const tools = request.actions?.length
      ? formatTools(request.actions)
      : undefined;

    const messageId = generateMessageId();

    // Emit message start
    yield { type: "message:start", id: messageId };

    try {
      const stream = await client.chat.completions.create({
        model: request.config?.model || this.model,
        messages,
        tools,
        temperature: request.config?.temperature ?? this.config.temperature,
        max_tokens: request.config?.maxTokens ?? this.config.maxTokens,
        stream: true,
      });

      let currentToolCall: {
        id: string;
        name: string;
        arguments: string;
      } | null = null;

      for await (const chunk of stream) {
        // Check for abort
        if (request.signal?.aborted) {
          break;
        }

        const delta = chunk.choices[0]?.delta;

        // Handle content
        if (delta?.content) {
          yield { type: "message:delta", content: delta.content };
        }

        // Handle tool calls
        if (delta?.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            // New tool call
            if (toolCall.id) {
              // End previous tool call if any
              if (currentToolCall) {
                yield {
                  type: "action:args",
                  id: currentToolCall.id,
                  args: currentToolCall.arguments,
                };
              }

              currentToolCall = {
                id: toolCall.id,
                name: toolCall.function?.name || "",
                arguments: toolCall.function?.arguments || "",
              };

              yield {
                type: "action:start",
                id: currentToolCall.id,
                name: currentToolCall.name,
              };
            } else if (currentToolCall && toolCall.function?.arguments) {
              // Append to current tool call arguments
              currentToolCall.arguments += toolCall.function.arguments;
            }
          }
        }

        // Check for finish
        if (chunk.choices[0]?.finish_reason) {
          // Complete any pending tool call
          if (currentToolCall) {
            yield {
              type: "action:args",
              id: currentToolCall.id,
              args: currentToolCall.arguments,
            };
          }
        }
      }

      // Emit message end
      yield { type: "message:end" };
      yield { type: "done" };
    } catch (error) {
      yield {
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        code: "OPENAI_ERROR",
      };
    }
  }
}

/**
 * Create OpenAI adapter
 */
export function createOpenAIAdapter(
  config: OpenAIAdapterConfig,
): OpenAIAdapter {
  return new OpenAIAdapter(config);
}
