# Ollama Demo - Local LLM Provider

> Run AI copilots locally with Ollama - no API keys, no cloud, full privacy.

## Features Showcased

- **Basic Chat Completion** - Streaming responses from local models
- **Tool/Function Calling** - Use tools with models like Llama 3.1, Mistral
- **Vision Support** - Image understanding with LLaVA
- **Ollama-Specific Options** - Fine-tune with num_ctx, mirostat, repeat_penalty, etc.
- **Express Server** - Full server example with streaming endpoints

## Quick Start

### Prerequisites

- [Ollama](https://ollama.ai) installed
- Node.js 18+
- **pnpm** (required for workspace setup)

### 1. Start Ollama

```bash
# Install Ollama (if not installed)
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama server
ollama serve

# Pull models (in another terminal)
# For quick testing (small models):
ollama pull qwen2.5:1.5b  # ~986MB - smallest with tool support
ollama pull qwen2:0.5b    # ~352MB - basic chat only (no tools)

# For full testing:
ollama pull llama3.1      # ~4.7GB - best for chat & tools
ollama pull llava         # ~4.7GB - for vision (optional)
```

### 2. Run the Demo

```bash
# From monorepo root
cd copilot-sdk

# Install dependencies
pnpm install

# Run the demo
cd examples/ollama-demo
pnpm install
pnpm start
```

## Available Scripts

| Script         | Description                          |
| -------------- | ------------------------------------ |
| `pnpm start`   | Run all demos (chat, tools, options) |
| `pnpm chat`    | Basic chat completion demo           |
| `pnpm tools`   | Tool/function calling demo           |
| `pnpm vision`  | Vision demo with LLaVA               |
| `pnpm options` | Ollama-specific options demo         |
| `pnpm server`  | Start Express server                 |

## Examples

### Basic Chat

```typescript
import { createOllama } from "@yourgpt/llm-sdk/ollama";

const ollama = createOllama();
const model = ollama("llama3.1");

for await (const event of model.stream({
  messages: [{ id: "1", role: "user", content: "Hello!" }],
})) {
  if (event.type === "message:delta") {
    process.stdout.write(event.content);
  }
}
```

### Tool Calling

```typescript
const model = ollama("llama3.1");

for await (const event of model.stream({
  messages: [
    { id: "1", role: "user", content: "What's the weather in Paris?" },
  ],
  actions: [
    {
      name: "get_weather",
      description: "Get weather for a location",
      parameters: {
        location: { type: "string", required: true },
      },
      handler: async (params) => {
        return { temp: 18, condition: "sunny" };
      },
    },
  ],
})) {
  if (event.type === "action:start") {
    console.log(`Tool called: ${event.name}`);
  }
  if (event.type === "action:args") {
    console.log(`Arguments: ${event.args}`);
  }
}
```

### Vision with LLaVA

```typescript
const model = ollama("llava");

for await (const event of model.stream({
  messages: [
    {
      id: "1",
      role: "user",
      content: "What's in this image?",
      metadata: {
        attachments: [
          {
            type: "image",
            data: "base64-encoded-image-data",
            mimeType: "image/png",
          },
        ],
      },
    },
  ],
})) {
  if (event.type === "message:delta") {
    process.stdout.write(event.content);
  }
}
```

### Ollama-Specific Options

```typescript
const ollama = createOllama({
  baseUrl: "http://localhost:11434",
  options: {
    num_ctx: 8192, // Context window
    temperature: 0.7, // Creativity
    top_p: 0.9, // Nucleus sampling
    repeat_penalty: 1.1, // Reduce repetition
    seed: 42, // Reproducibility
  },
});
```

### Express Server

```typescript
import { createRuntime } from "@yourgpt/llm-sdk";
import { createOllama } from "@yourgpt/llm-sdk/ollama";

const ollama = createOllama();

const runtime = createRuntime({
  provider: ollama,
  model: "llama3.1",
  systemPrompt: "You are a helpful local AI assistant.",
});

app.post("/api/chat", async (req, res) => {
  await runtime.stream(req.body).pipeToResponse(res);
});
```

## Environment Variables

| Variable          | Default                  | Description       |
| ----------------- | ------------------------ | ----------------- |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL`    | `llama3.1`               | Default model     |
| `PORT`            | `3002`                   | Server port       |

## Supported Models

| Model           | Vision | Tools | Context |
| --------------- | ------ | ----- | ------- |
| llama3.1        | ❌     | ✅    | 128k    |
| llama3.2-vision | ✅     | ✅    | 128k    |
| llava           | ✅     | ❌    | 4k      |
| mistral         | ❌     | ✅    | 8k      |
| mixtral         | ❌     | ✅    | 32k     |
| codellama       | ❌     | ❌    | 16k     |
| qwen2           | ❌     | ✅    | 32k     |
| deepseek        | ❌     | ✅    | 16k     |

## API Endpoints (Server Mode)

| Endpoint           | Method | Description           |
| ------------------ | ------ | --------------------- |
| `/api/chat/stream` | POST   | SSE streaming chat    |
| `/api/chat`        | POST   | Non-streaming chat    |
| `/api/chat/tools`  | POST   | Chat with tools       |
| `/api/health`      | GET    | Health check          |
| `/api/models`      | GET    | List available models |

## Test Commands

```bash
# Start the server
pnpm server

# In another terminal:

# Streaming chat
curl -X POST http://localhost:3002/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'

# Non-streaming chat
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is 2+2?"}]}'

# Chat with tools
curl -X POST http://localhost:3002/api/chat/tools \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is the weather in Paris?"}]}'

# List models
curl http://localhost:3002/api/models
```

## Project Structure

```
ollama-demo/
├── src/
│   ├── index.ts      # CLI demos (chat, tools, vision, options)
│   └── server.ts     # Express server example
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "Cannot connect to Ollama"

```bash
# Make sure Ollama is running
ollama serve

# Check if it's responding
curl http://localhost:11434/api/tags
```

### "Model not found"

```bash
# Pull the required model
ollama pull llama3.1
ollama pull llava  # for vision
```

### "Tool calling not working"

Not all models support tool calling. Use models like:

- `llama3.1` ✅
- `mistral` ✅
- `qwen2` ✅

Models like `codellama` and `gemma2` don't support tools.

## Why Ollama?

- **Privacy**: All data stays on your machine
- **No API Keys**: No billing, no rate limits
- **Offline**: Works without internet
- **Fast**: No network latency for local inference
- **Customizable**: Fine-tune with Ollama modelfiles

## Tech Stack

- @yourgpt/llm-sdk
- Ollama
- Express.js
- TypeScript
