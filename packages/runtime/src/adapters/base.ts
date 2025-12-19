import type {
  Message,
  ActionDefinition,
  StreamEvent,
  LLMConfig,
} from "@yourgpt/core";

/**
 * Chat completion request
 */
export interface ChatCompletionRequest {
  /** Conversation messages */
  messages: Message[];
  /** Available actions/tools */
  actions?: ActionDefinition[];
  /** System prompt */
  systemPrompt?: string;
  /** LLM configuration overrides */
  config?: Partial<LLMConfig>;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

/**
 * Base LLM adapter interface
 */
export interface LLMAdapter {
  /** Provider name */
  readonly provider: string;

  /** Model name */
  readonly model: string;

  /**
   * Stream a chat completion
   */
  stream(request: ChatCompletionRequest): AsyncGenerator<StreamEvent>;

  /**
   * Non-streaming chat completion
   */
  complete?(request: ChatCompletionRequest): Promise<Message>;
}

/**
 * Adapter factory function type
 */
export type AdapterFactory = (config: LLMConfig) => LLMAdapter;

/**
 * Convert messages to provider format
 */
export function formatMessages(
  messages: Message[],
  systemPrompt?: string,
): Array<{ role: string; content: string }> {
  const formatted: Array<{ role: string; content: string }> = [];

  // Add system prompt if provided
  if (systemPrompt) {
    formatted.push({ role: "system", content: systemPrompt });
  }

  // Add conversation messages
  for (const msg of messages) {
    formatted.push({
      role: msg.role,
      content: msg.content,
    });
  }

  return formatted;
}

/**
 * Convert actions to OpenAI tool format
 */
export function formatTools(actions: ActionDefinition[]): Array<{
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: object;
  };
}> {
  return actions.map((action) => ({
    type: "function" as const,
    function: {
      name: action.name,
      description: action.description,
      parameters: {
        type: "object",
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
    },
  }));
}
