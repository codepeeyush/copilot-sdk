import type { LLMConfig, StreamEvent } from "@yourgpt/core";
import { generateMessageId } from "@yourgpt/core";
import type { LLMAdapter, ChatCompletionRequest } from "./base";
import { formatMessages } from "./base";

/**
 * Anthropic adapter configuration
 */
export interface AnthropicAdapterConfig extends Partial<LLMConfig> {
  apiKey: string;
  model?: string;
}

/**
 * Anthropic LLM Adapter
 *
 * Supports: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku, etc.
 */
export class AnthropicAdapter implements LLMAdapter {
  readonly provider = "anthropic";
  readonly model: string;

  private client: any; // Anthropic client (lazy loaded)
  private config: AnthropicAdapterConfig;

  constructor(config: AnthropicAdapterConfig) {
    this.config = config;
    this.model = config.model || "claude-3-5-sonnet-latest";
  }

  private async getClient() {
    if (!this.client) {
      // Dynamic import to make @anthropic-ai/sdk optional
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      this.client = new Anthropic({
        apiKey: this.config.apiKey,
      });
    }
    return this.client;
  }

  async *stream(request: ChatCompletionRequest): AsyncGenerator<StreamEvent> {
    const client = await this.getClient();

    // Anthropic uses a different message format
    const allMessages = formatMessages(request.messages, undefined);

    // Extract system message
    const systemMessage = request.systemPrompt || "";

    // Filter out system messages and format for Anthropic
    const messages = allMessages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    // Convert actions to Anthropic tool format
    const tools = request.actions?.map((action) => ({
      name: action.name,
      description: action.description,
      input_schema: {
        type: "object" as const,
        properties: action.parameters
          ? Object.fromEntries(
              Object.entries(action.parameters).map(([key, param]) => [
                key,
                {
                  type: param.type,
                  description: param.description,
                  enum: param.enum,
                },
              ]),
            )
          : {},
        required: action.parameters
          ? Object.entries(action.parameters)
              .filter(([, param]) => param.required)
              .map(([key]) => key)
          : [],
      },
    }));

    const messageId = generateMessageId();

    // Emit message start
    yield { type: "message:start", id: messageId };

    try {
      const stream = await client.messages.stream({
        model: request.config?.model || this.model,
        max_tokens: request.config?.maxTokens || this.config.maxTokens || 4096,
        system: systemMessage,
        messages,
        tools: tools?.length ? tools : undefined,
      });

      let currentToolUse: {
        id: string;
        name: string;
        input: string;
      } | null = null;

      for await (const event of stream) {
        // Check for abort
        if (request.signal?.aborted) {
          break;
        }

        switch (event.type) {
          case "content_block_start":
            if (event.content_block.type === "tool_use") {
              currentToolUse = {
                id: event.content_block.id,
                name: event.content_block.name,
                input: "",
              };
              yield {
                type: "action:start",
                id: currentToolUse.id,
                name: currentToolUse.name,
              };
            }
            break;

          case "content_block_delta":
            if (event.delta.type === "text_delta") {
              yield { type: "message:delta", content: event.delta.text };
            } else if (
              event.delta.type === "input_json_delta" &&
              currentToolUse
            ) {
              currentToolUse.input += event.delta.partial_json;
            }
            break;

          case "content_block_stop":
            if (currentToolUse) {
              yield {
                type: "action:args",
                id: currentToolUse.id,
                args: currentToolUse.input,
              };
              currentToolUse = null;
            }
            break;

          case "message_stop":
            break;
        }
      }

      // Emit message end
      yield { type: "message:end" };
      yield { type: "done" };
    } catch (error) {
      yield {
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        code: "ANTHROPIC_ERROR",
      };
    }
  }
}

/**
 * Create Anthropic adapter
 */
export function createAnthropicAdapter(
  config: AnthropicAdapterConfig,
): AnthropicAdapter {
  return new AnthropicAdapter(config);
}
