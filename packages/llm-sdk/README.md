# @yourgpt/llm-sdk

Multi-provider LLM SDK with streaming. One API, any provider.

## Installation

```bash
npm install @yourgpt/llm-sdk openai
```

For Anthropic, install `@anthropic-ai/sdk` instead:

```bash
npm install @yourgpt/llm-sdk @anthropic-ai/sdk
```

## Quick Start

```ts
import { streamText } from "@yourgpt/llm-sdk";
import { openai } from "@yourgpt/llm-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
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
await streamText({ model: openai("gpt-4o"), messages });

// Anthropic
await streamText({ model: anthropic("claude-sonnet-4-20250514"), messages });

// Google Gemini (uses OpenAI-compatible API)
await streamText({ model: google("gemini-2.0-flash"), messages });

// xAI Grok (uses OpenAI-compatible API)
await streamText({ model: xai("grok-3-fast-beta"), messages });
```

## Server-Side Tools

```ts
import { streamText, tool } from "@yourgpt/llm-sdk";
import { openai } from "@yourgpt/llm-sdk/openai";
import { z } from "zod";

const result = await streamText({
  model: openai("gpt-4o"),
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

## Express Integration

Use the `createRuntime()` API with the new `stream()` method for Express:

```ts
import express from "express";
import { createRuntime } from "@yourgpt/llm-sdk";
import { createOpenAI } from "@yourgpt/llm-sdk/openai";

const app = express();
app.use(express.json());

const runtime = createRuntime({
  provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  model: "gpt-4o",
});

// One-liner streaming endpoint
app.post("/api/chat", async (req, res) => {
  await runtime.stream(req.body).pipeToResponse(res);
});

app.listen(3001);
```

### Available Response Methods

| Method                     | Framework     | Description                 |
| -------------------------- | ------------- | --------------------------- |
| `.toResponse()`            | Next.js, Deno | Returns Web Response        |
| `.pipeToResponse(res)`     | Express, Node | Pipes SSE to ServerResponse |
| `.pipeTextToResponse(res)` | Express, Node | Pipes text only             |
| `.collect()`               | Any           | Collects full response      |

## Supported Providers

| Provider      | Import                       | SDK Required        |
| ------------- | ---------------------------- | ------------------- |
| OpenAI        | `@yourgpt/llm-sdk/openai`    | `openai`            |
| Anthropic     | `@yourgpt/llm-sdk/anthropic` | `@anthropic-ai/sdk` |
| Google Gemini | `@yourgpt/llm-sdk/google`    | `openai`            |
| xAI (Grok)    | `@yourgpt/llm-sdk/xai`       | `openai`            |
| Ollama        | `@yourgpt/llm-sdk/ollama`    | `openai`            |
| Azure OpenAI  | `@yourgpt/llm-sdk/azure`     | `openai`            |

> **Note:** OpenAI, Google, xAI, Ollama, and Azure all use the `openai` SDK because they have OpenAI-compatible APIs. Only Anthropic requires its native SDK for full feature support.

## Documentation

Visit [copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)

## License

MIT
