# @yourgpt/llm-sdk

Multi-provider LLM SDK with streaming. One API, any provider.

## Installation

```bash
npm install @yourgpt/llm-sdk @anthropic-ai/sdk
```

> For other providers (OpenAI, Google, xAI), see [Providers Documentation](https://copilot-sdk.yourgpt.ai/docs/providers).

## Quick Start

```ts
// app/api/chat/route.ts
import { streamText } from "@yourgpt/llm-sdk";
import { anthropic } from "@yourgpt/llm-sdk/anthropic";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toTextStreamResponse();
}
```

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

## With Copilot SDK

Use `createRuntime` for full Copilot SDK integration with tools support:

```ts
// app/api/chat/route.ts
import { createRuntime } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

const runtime = createRuntime({
  provider: createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
  model: "claude-sonnet-4-20250514",
  systemPrompt: "You are a helpful assistant.",
});

export async function POST(req: Request) {
  return runtime.stream(await req.json()).toResponse();
}
```

## Documentation

Visit **[copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)** for full documentation:

- [All Providers](https://copilot-sdk.yourgpt.ai/docs/providers) - OpenAI, Anthropic, Google, xAI
- [Server Setup](https://copilot-sdk.yourgpt.ai/docs/server) - Runtime, streaming, tools
- [Tools](https://copilot-sdk.yourgpt.ai/docs/tools) - Server-side and client-side tools
- [LLM SDK Reference](https://copilot-sdk.yourgpt.ai/docs/llm-sdk) - streamText, generateText

## License

MIT
