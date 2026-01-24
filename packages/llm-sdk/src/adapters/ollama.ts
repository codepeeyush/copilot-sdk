import type { LLMConfig, StreamEvent } from "@yourgpt/copilot-sdk/core";
import { generateMessageId } from "@yourgpt/copilot-sdk/core";
import type { LLMAdapter, ChatCompletionRequest } from "./base";
import { formatMessages } from "./base";

/**
 * Ollama adapter configuration
 */
export interface OllamaAdapterConfig {
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Ollama LLM Adapter (Local models)
 *
 * Supports: Llama 3, Mistral, Phi, Gemma, CodeLlama, etc.
 */
export class OllamaAdapter implements LLMAdapter {
  readonly provider = "ollama";
  readonly model: string;

  private baseUrl: string;
  private config: OllamaAdapterConfig;

  constructor(config: OllamaAdapterConfig = {}) {
    this.config = config;
    this.model = config.model || "llama3";
    this.baseUrl = config.baseUrl || "http://localhost:11434";
  }

  async *stream(request: ChatCompletionRequest): AsyncGenerator<StreamEvent> {
    const messages = formatMessages(request.messages, request.systemPrompt);

    const messageId = generateMessageId();

    // Emit message start
    yield { type: "message:start", id: messageId };

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.config?.model || this.model,
          messages,
          stream: true,
          options: {
            temperature: request.config?.temperature ?? this.config.temperature,
            num_predict: request.config?.maxTokens ?? this.config.maxTokens,
          },
        }),
        signal: request.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const chunk = JSON.parse(line);

            if (chunk.message?.content) {
              yield { type: "message:delta", content: chunk.message.content };
            }

            // Ollama indicates completion with done: true
            if (chunk.done) {
              break;
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
          code: "OLLAMA_ERROR",
        };
      }
    }
  }
}

/**
 * Create Ollama adapter
 */
export function createOllamaAdapter(
  config?: OllamaAdapterConfig,
): OllamaAdapter {
  return new OllamaAdapter(config);
}
