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

  /**
   * Convert OpenAI-style messages to Anthropic format
   *
   * OpenAI format:
   * - { role: "assistant", content: "...", tool_calls: [...] }
   * - { role: "tool", tool_call_id: "...", content: "..." }
   *
   * Anthropic format:
   * - { role: "assistant", content: [{ type: "text", text: "..." }, { type: "tool_use", id: "...", name: "...", input: {...} }] }
   * - { role: "user", content: [{ type: "tool_result", tool_use_id: "...", content: "..." }] }
   */
  private convertToAnthropicMessages(
    rawMessages: Array<Record<string, unknown>>,
  ): Array<Record<string, unknown>> {
    const messages: Array<Record<string, unknown>> = [];
    const pendingToolResults: Array<{ tool_use_id: string; content: string }> =
      [];

    for (const msg of rawMessages) {
      // Skip system messages (handled separately)
      if (msg.role === "system") continue;

      if (msg.role === "assistant") {
        // Convert assistant message with potential tool_calls
        const content: Array<Record<string, unknown>> = [];

        // Add text content if present
        if (
          msg.content &&
          typeof msg.content === "string" &&
          msg.content.trim()
        ) {
          content.push({ type: "text", text: msg.content });
        }

        // Convert tool_calls to tool_use blocks
        const toolCalls = msg.tool_calls as
          | Array<{
              id: string;
              type: string;
              function: { name: string; arguments: string };
            }>
          | undefined;

        if (toolCalls && toolCalls.length > 0) {
          for (const tc of toolCalls) {
            let input = {};
            try {
              input = JSON.parse(tc.function.arguments);
            } catch {
              // Keep empty object if parse fails
            }
            content.push({
              type: "tool_use",
              id: tc.id,
              name: tc.function.name,
              input,
            });
          }
        }

        // Only add if there's content
        if (content.length > 0) {
          messages.push({ role: "assistant", content });
        }
      } else if (msg.role === "tool") {
        // Collect tool results to be bundled into a user message
        pendingToolResults.push({
          tool_use_id: msg.tool_call_id as string,
          content:
            typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content),
        });
      } else if (msg.role === "user") {
        // First, flush any pending tool results as a user message
        if (pendingToolResults.length > 0) {
          messages.push({
            role: "user",
            content: pendingToolResults.map((tr) => ({
              type: "tool_result",
              tool_use_id: tr.tool_use_id,
              content: tr.content,
            })),
          });
          pendingToolResults.length = 0;
        }

        // Add user message
        messages.push({
          role: "user",
          content:
            typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content),
        });
      }
    }

    // Flush any remaining tool results
    if (pendingToolResults.length > 0) {
      messages.push({
        role: "user",
        content: pendingToolResults.map((tr) => ({
          type: "tool_result",
          tool_use_id: tr.tool_use_id,
          content: tr.content,
        })),
      });
    }

    return messages;
  }

  async *stream(request: ChatCompletionRequest): AsyncGenerator<StreamEvent> {
    const client = await this.getClient();

    // Extract system message
    const systemMessage = request.systemPrompt || "";

    // Use raw messages if provided (for agent loop with tool calls)
    let messages: Array<Record<string, unknown>>;
    if (request.rawMessages && request.rawMessages.length > 0) {
      // Convert OpenAI-style messages to Anthropic format
      messages = this.convertToAnthropicMessages(request.rawMessages);
    } else {
      // Format from Message[]
      const allMessages = formatMessages(request.messages, undefined);
      messages = allMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }));
    }

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
