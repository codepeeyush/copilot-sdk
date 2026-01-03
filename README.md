<div align="center">

# Copilot SDK

### Build AI Copilots That Actually Understand Your App

The open-source SDK for building **context-aware AI assistants** that see what your users see.

[![npm version](https://img.shields.io/npm/v/@yourgpt/copilot-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@yourgpt/copilot-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@yourgpt/copilot-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@yourgpt/copilot-sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

[Documentation](https://copilot-sdk.yourgpt.ai) · [Examples](https://copilot-sdk.yourgpt.ai/docs/examples)

<br />

<img src="./apps/docs/public/images/copilot-sdk-demo-1-sm.gif" alt="Copilot SDK Demo" width="700" />

</div>

<br />

## Why Copilot SDK?

Most AI assistants are blind to your application. They can't see the user's screen, understand their context, or take meaningful actions. **Copilot SDK changes that.**

- **App Context Awareness** — Capture screenshots, console logs, network requests, and DOM state automatically
- **Minutes to Integrate** — Drop-in React components with sensible defaults
- **Production-Ready UI** — Beautiful, accessible chat components out of the box
- **Multi-Provider LLM** — OpenAI, Anthropic, Google, and more with a unified API
- **Fully Customizable** — Headless primitives when you need full control
- **Open Source** — MIT licensed, no vendor lock-in

<br />

## Quick Start

### Install

```bash
npm install @yourgpt/copilot-sdk
```

### Frontend (React)

```tsx
import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import "@yourgpt/copilot-sdk/ui/styles.css";

function App() {
  return (
    <CopilotProvider
      runtimeUrl="/api/copilot"
      tools={{ screenshot: true, console: true, network: true }}
    >
      <YourApp />
      <CopilotChat />
    </CopilotProvider>
  );
}
```

### Backend (Next.js)

```ts
// app/api/copilot/route.ts
import { createRuntime, createOpenAI } from "@yourgpt/llm-sdk";

const runtime = createRuntime({
  provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  model: "gpt-4o",
});

export const POST = (req: Request) => runtime.handleRequest(req);
```

<br />

## Packages

| Package                      | Description                      |
| ---------------------------- | -------------------------------- |
| `@yourgpt/copilot-sdk/core`  | Core utilities and capture tools |
| `@yourgpt/copilot-sdk/react` | React hooks and provider         |
| `@yourgpt/copilot-sdk/ui`    | Pre-built chat components        |
| `@yourgpt/llm-sdk`           | Multi-provider LLM integration   |

<br />

## Documentation

Visit **[copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)** for full documentation.

- [Getting Started](https://copilot-sdk.yourgpt.ai/docs)
- [Why Copilot SDK](https://copilot-sdk.yourgpt.ai/docs/why-copilot-sdk)
- [Examples](https://copilot-sdk.yourgpt.ai/docs/examples)
- [API Reference](https://copilot-sdk.yourgpt.ai/docs/api-reference)

<br />

## Contributing

Have ideas? Let's build together.

[@0fficialRohit](https://x.com/0fficialRohit) · [@rege_dev](https://x.com/rege_dev)

<br />

## License

[MIT](./LICENSE) — use it however you want.
