/**
 * Google Provider - Modern Pattern
 *
 * Google Gemini models.
 *
 * @example
 * ```ts
 * import { google } from '@yourgpt/llm-sdk/google';
 * import { generateText } from '@yourgpt/llm-sdk';
 *
 * const result = await generateText({
 *   model: google('gemini-2.0-flash'),
 *   prompt: 'Hello!',
 * });
 * ```
 */

import type {
  LanguageModel,
  DoGenerateParams,
  DoGenerateResult,
  StreamChunk,
  ToolCall,
  FinishReason,
  CoreMessage,
} from "../../core/types";

// ============================================
// Model Definitions
// ============================================

interface GoogleModelConfig {
  vision: boolean;
  tools: boolean;
  audio: boolean;
  video: boolean;
  maxTokens: number;
}

const GOOGLE_MODELS: Record<string, GoogleModelConfig> = {
  // Gemini 2.0
  "gemini-2.0-flash": {
    vision: true,
    tools: true,
    audio: true,
    video: true,
    maxTokens: 1048576,
  },
  "gemini-2.0-flash-exp": {
    vision: true,
    tools: true,
    audio: true,
    video: true,
    maxTokens: 1048576,
  },
  "gemini-2.0-flash-thinking-exp": {
    vision: true,
    tools: false,
    audio: false,
    video: false,
    maxTokens: 32767,
  },

  // Gemini 1.5
  "gemini-1.5-pro": {
    vision: true,
    tools: true,
    audio: true,
    video: true,
    maxTokens: 2097152,
  },
  "gemini-1.5-pro-latest": {
    vision: true,
    tools: true,
    audio: true,
    video: true,
    maxTokens: 2097152,
  },
  "gemini-1.5-flash": {
    vision: true,
    tools: true,
    audio: true,
    video: true,
    maxTokens: 1048576,
  },
  "gemini-1.5-flash-latest": {
    vision: true,
    tools: true,
    audio: true,
    video: true,
    maxTokens: 1048576,
  },
  "gemini-1.5-flash-8b": {
    vision: true,
    tools: true,
    audio: false,
    video: false,
    maxTokens: 1048576,
  },
};

// ============================================
// Provider Options
// ============================================

export interface GoogleProviderOptions {
  /** API key (defaults to GOOGLE_API_KEY or GEMINI_API_KEY env var) */
  apiKey?: string;
  /** Safety settings */
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

// ============================================
// Provider Implementation
// ============================================

/**
 * Create a Google Gemini language model
 */
export function google(
  modelId: string,
  options: GoogleProviderOptions = {},
): LanguageModel {
  const apiKey =
    options.apiKey ?? process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

  // Lazy-load Google client
  let client: any = null;
  async function getClient(): Promise<any> {
    if (!client) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      client = new GoogleGenerativeAI(apiKey!);
    }
    return client;
  }

  const modelConfig =
    GOOGLE_MODELS[modelId] ?? GOOGLE_MODELS["gemini-2.0-flash"];

  return {
    provider: "google",
    modelId,

    capabilities: {
      supportsVision: modelConfig.vision,
      supportsTools: modelConfig.tools,
      supportsStreaming: true,
      supportsJsonMode: true,
      supportsThinking: modelId.includes("thinking"),
      supportsPDF: true,
      maxTokens: modelConfig.maxTokens,
      supportedImageTypes: modelConfig.vision
        ? ["image/png", "image/jpeg", "image/gif", "image/webp"]
        : [],
    },

    async doGenerate(params: DoGenerateParams): Promise<DoGenerateResult> {
      const client = await getClient();
      const model = client.getGenerativeModel({
        model: modelId,
        safetySettings: options.safetySettings,
      });

      const { systemInstruction, contents } = formatMessagesForGemini(
        params.messages,
      );

      const chat = model.startChat({
        history: contents.slice(0, -1),
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction }] }
          : undefined,
        tools: params.tools
          ? [{ functionDeclarations: formatToolsForGemini(params.tools) }]
          : undefined,
        generationConfig: {
          temperature: params.temperature,
          maxOutputTokens: params.maxTokens,
        },
      });

      const lastMessage = contents[contents.length - 1];
      const result = await chat.sendMessage(lastMessage.parts);
      const response = result.response;

      let text = "";
      const toolCalls: ToolCall[] = [];
      let toolCallIndex = 0;

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if ("text" in part && part.text) {
            text += part.text;
          }
          if ("functionCall" in part && part.functionCall) {
            toolCalls.push({
              id: `call_${toolCallIndex++}`,
              name: part.functionCall.name,
              args: part.functionCall.args || {},
            });
          }
        }
      }

      return {
        text,
        toolCalls,
        finishReason: mapFinishReason(candidate?.finishReason),
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
        },
        rawResponse: response,
      };
    },

    async *doStream(params: DoGenerateParams): AsyncGenerator<StreamChunk> {
      const client = await getClient();
      const model = client.getGenerativeModel({
        model: modelId,
        safetySettings: options.safetySettings,
      });

      const { systemInstruction, contents } = formatMessagesForGemini(
        params.messages,
      );

      const chat = model.startChat({
        history: contents.slice(0, -1),
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction }] }
          : undefined,
        tools: params.tools
          ? [{ functionDeclarations: formatToolsForGemini(params.tools) }]
          : undefined,
        generationConfig: {
          temperature: params.temperature,
          maxOutputTokens: params.maxTokens,
        },
      });

      const lastMessage = contents[contents.length - 1];
      const result = await chat.sendMessageStream(lastMessage.parts);

      let toolCallIndex = 0;
      let promptTokens = 0;
      let completionTokens = 0;

      try {
        for await (const chunk of result.stream) {
          if (params.signal?.aborted) {
            yield { type: "error", error: new Error("Aborted") };
            return;
          }

          const candidate = chunk.candidates?.[0];
          if (!candidate?.content?.parts) continue;

          for (const part of candidate.content.parts) {
            if ("text" in part && part.text) {
              yield { type: "text-delta", text: part.text };
            }
            if ("functionCall" in part && part.functionCall) {
              yield {
                type: "tool-call",
                toolCall: {
                  id: `call_${toolCallIndex++}`,
                  name: part.functionCall.name,
                  args: part.functionCall.args || {},
                },
              };
            }
          }

          if (chunk.usageMetadata) {
            promptTokens = chunk.usageMetadata.promptTokenCount ?? 0;
            completionTokens = chunk.usageMetadata.candidatesTokenCount ?? 0;
          }

          if (candidate.finishReason) {
            yield {
              type: "finish",
              finishReason: mapFinishReason(candidate.finishReason),
              usage: {
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
              },
            };
          }
        }
      } catch (error) {
        yield {
          type: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    },
  };
}

// ============================================
// Helper Functions
// ============================================

function mapFinishReason(reason: string | undefined): FinishReason {
  switch (reason) {
    case "STOP":
      return "stop";
    case "MAX_TOKENS":
      return "length";
    case "SAFETY":
      return "content-filter";
    default:
      return "unknown";
  }
}

function formatMessagesForGemini(messages: CoreMessage[]): {
  systemInstruction: string;
  contents: Array<{ role: "user" | "model"; parts: any[] }>;
} {
  let systemInstruction = "";
  const contents: Array<{ role: "user" | "model"; parts: any[] }> = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction += (systemInstruction ? "\n" : "") + msg.content;
      continue;
    }

    const parts: any[] = [];

    if (msg.role === "user") {
      if (typeof msg.content === "string") {
        parts.push({ text: msg.content });
      } else {
        for (const part of msg.content) {
          if (part.type === "text") {
            parts.push({ text: part.text });
          } else if (part.type === "image") {
            const imageData =
              typeof part.image === "string"
                ? part.image
                : Buffer.from(part.image).toString("base64");

            const base64 = imageData.startsWith("data:")
              ? imageData.split(",")[1]
              : imageData;

            parts.push({
              inlineData: {
                mimeType: part.mimeType ?? "image/png",
                data: base64,
              },
            });
          }
        }
      }
      contents.push({ role: "user", parts });
    } else if (msg.role === "assistant") {
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      if (msg.toolCalls?.length) {
        for (const tc of msg.toolCalls) {
          parts.push({
            functionCall: {
              name: tc.name,
              args: tc.args,
            },
          });
        }
      }
      if (parts.length > 0) {
        contents.push({ role: "model", parts });
      }
    } else if (msg.role === "tool") {
      // Tool results go as user message with functionResponse
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: "tool", // Gemini doesn't track by ID
              response: JSON.parse(msg.content || "{}"),
            },
          },
        ],
      });
    }
  }

  // Ensure starts with user
  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "" }] });
  }

  // Merge consecutive same-role messages
  const merged: typeof contents = [];
  for (const content of contents) {
    const last = merged[merged.length - 1];
    if (last && last.role === content.role) {
      last.parts.push(...content.parts);
    } else {
      merged.push({ ...content, parts: [...content.parts] });
    }
  }

  return { systemInstruction, contents: merged };
}

function formatToolsForGemini(tools: unknown[]): any[] {
  // Tools are already in OpenAI format from formatToolsForOpenAI
  return (tools as any[]).map((t) => ({
    name: t.function.name,
    description: t.function.description,
    parameters: t.function.parameters,
  }));
}

export { google as createGoogle };
