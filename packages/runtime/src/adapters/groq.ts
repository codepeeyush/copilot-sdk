import type { LLMConfig, StreamEvent } from "@yourgpt/core";
import { generateMessageId } from "@yourgpt/core";
import type { LLMAdapter, ChatCompletionRequest } from "./base";
import { formatMessages, formatTools } from "./base";

/**
 * Groq adapter configuration
 */
export interface GroqAdapterConfig extends Partial<LLMConfig> {
  apiKey: string;
  model?: string;
}

/**
 * Groq LLM Adapter (Fast inference)
 *
 * Supports: Llama 3.1, Mixtral, Gemma, etc.
 */
export class GroqAdapter implements LLMAdapter {
  readonly provider = "groq";
  readonly model: string;

  private config: GroqAdapterConfig;

  constructor(config: GroqAdapterConfig) {
    this.config = config;
    this.model = config.model || "llama-3.1-70b-versatile";
  }

  async *stream(request: ChatCompletionRequest): AsyncGenerator<StreamEvent> {
    const messages = formatMessages(request.messages, request.systemPrompt);
    const tools = request.actions?.length
      ? formatTools(request.actions)
      : undefined;

    const messageId = generateMessageId();

    // Emit message start
    yield { type: "message:start", id: messageId };

    try {
      // Groq uses OpenAI-compatible API
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: request.config?.model || this.model,
            messages,
            tools,
            temperature: request.config?.temperature ?? this.config.temperature,
            max_tokens: request.config?.maxTokens ?? this.config.maxTokens,
            stream: true,
          }),
          signal: request.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let currentToolCall: {
        id: string;
        name: string;
        arguments: string;
      } | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const chunk = JSON.parse(data);
            const delta = chunk.choices?.[0]?.delta;

            if (delta?.content) {
              yield { type: "message:delta", content: delta.content };
            }

            // Handle tool calls (Groq supports function calling)
            if (delta?.tool_calls) {
              for (const toolCall of delta.tool_calls) {
                if (toolCall.id) {
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
                  currentToolCall.arguments += toolCall.function.arguments;
                }
              }
            }

            if (chunk.choices?.[0]?.finish_reason && currentToolCall) {
              yield {
                type: "action:args",
                id: currentToolCall.id,
                args: currentToolCall.arguments,
              };
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      yield { type: "message:end" };
      yield { type: "done" };
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        yield { type: "done" };
      } else {
        yield {
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
          code: "GROQ_ERROR",
        };
      }
    }
  }
}

/**
 * Create Groq adapter
 */
export function createGroqAdapter(config: GroqAdapterConfig): GroqAdapter {
  return new GroqAdapter(config);
}
