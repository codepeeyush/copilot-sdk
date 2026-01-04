# @yourgpt/llm-sdk

Multi-provider LLM SDK with streaming. One API, any provider.

## Installation

```bash
npm install @yourgpt/llm-sdk
```

## Quick Start

```ts
import { streamText } from "@yourgpt/llm-sdk";
import { openai } from "@yourgpt/llm-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-5"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toTextStreamResponse();
}
```

## Multi-Provider Support

```ts
import { openai } from "@yourgpt/llm-sdk/openai";
import { anthropic } from "@yourgpt/llm-sdk/anthropic";
import { google } from "@yourgpt/llm-sdk/google";
import { xai } from "@yourgpt/llm-sdk/xai";

// OpenAI
await streamText({ model: openai("gpt-5"), messages });

// Anthropic
await streamText({ model: anthropic("claude-sonnet-4-20250514"), messages });

// Google
await streamText({ model: google("gemini-2.0-flash"), messages });

// xAI
await streamText({ model: xai("grok-3"), messages });
```

## Server-Side Tools

```ts
import { streamText, tool } from "@yourgpt/llm-sdk";
import { openai } from "@yourgpt/llm-sdk/openai";
import { z } from "zod";

const result = await streamText({
  model: openai("gpt-5"),
  messages,
  tools: {
    getWeather: tool({
      description: "Get current weather for a city",
      parameters: z.object({
        city: z.string().describe("City name"),
      }),
      execute: async ({ city }) => {
        return { temperature: 72, condition: "sunny" };
      },
    }),
  },
  maxSteps: 5,
});

return result.toDataStreamResponse();
```

## Supported Providers

| Provider      | Import                       |
| ------------- | ---------------------------- |
| OpenAI        | `@yourgpt/llm-sdk/openai`    |
| Anthropic     | `@yourgpt/llm-sdk/anthropic` |
| Google Gemini | `@yourgpt/llm-sdk/google`    |
| xAI (Grok)    | `@yourgpt/llm-sdk/xai`       |
| Ollama        | `@yourgpt/llm-sdk/ollama`    |
| Azure OpenAI  | `@yourgpt/llm-sdk/azure`     |

## Documentation

Visit [copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)

## License

MIT
