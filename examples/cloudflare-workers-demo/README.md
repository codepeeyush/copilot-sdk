# Cloudflare Workers Demo

Deploy your Copilot API to Cloudflare's global edge network (300+ locations).

This example demonstrates **both streaming and non-streaming** modes using **Anthropic Claude**.

## Endpoints

| Endpoint       | Method | Mode            | Description                   |
| -------------- | ------ | --------------- | ----------------------------- |
| `/`            | GET    | -               | Health check                  |
| `/chat/stream` | POST   | Streaming (SSE) | Real-time streaming responses |
| `/chat`        | POST   | Non-streaming   | Complete JSON response        |

## Setup

### 1. Install Dependencies

```bash
cd examples/cloudflare-workers-demo
pnpm install
```

### 2. Configure Environment Variables

**For Local Development:**

```bash
# Copy the example env file
cp .dev.vars.example .dev.vars

# Edit .dev.vars and add your API key
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

> `.dev.vars` is automatically loaded by `wrangler dev` and is gitignored.

**For Production (Cloudflare):**

```bash
# This securely stores your key in Cloudflare
npx wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted
```

### 3. Run Locally

```bash
pnpm dev
```

Server starts at `http://localhost:8787`

## Testing

### Health Check

```bash
curl http://localhost:8787/
```

Response:

```json
{
  "status": "ok",
  "message": "Cloudflare Workers Copilot API",
  "endpoints": {
    "streaming": "POST /chat/stream",
    "nonStreaming": "POST /chat"
  }
}
```

### Test Streaming (SSE)

```bash
curl -N -X POST http://localhost:8787/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Say hello in 3 different languages" }
    ]
  }'
```

You'll see Server-Sent Events streaming:

```
data: {"type":"message:start"}
data: {"type":"message:delta","content":"Hello"}
data: {"type":"message:delta","content":" (English)"}
...
data: {"type":"done","messages":[...]}
```

### Test Non-Streaming (JSON)

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "What is 2+2?" }
    ]
  }'
```

Response (complete JSON):

```json
{
  "text": "2 + 2 = 4",
  "messages": [...],
  "toolCalls": [],
  "requiresAction": false
}
```

### Test with Thread ID (Conversation Persistence)

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "my-conversation-123",
    "messages": [
      { "role": "user", "content": "My name is John" }
    ]
  }'
```

## Deploy to Production

```bash
# Deploy to Cloudflare
pnpm deploy
```

Your API will be live at:

```
https://copilot-api.<your-subdomain>.workers.dev
```

### View Logs

```bash
# Stream live logs from production
pnpm tail
```

## Connect to Frontend

```tsx
import { CopilotProvider } from "@yourgpt/copilot-sdk/react";

function App() {
  return (
    // Streaming (default)
    <CopilotProvider runtimeUrl="https://copilot-api.your-subdomain.workers.dev/chat/stream">
      <YourApp />
    </CopilotProvider>

    // Or non-streaming
    // <CopilotProvider
    //   runtimeUrl="https://copilot-api.your-subdomain.workers.dev/chat"
    //   streaming={false}
    // />
  );
}
```

## Using Different Providers

### OpenAI

Update `src/index.ts`:

```ts
import { createOpenAI } from "@yourgpt/llm-sdk/openai";

const runtime = createRuntime({
  provider: createOpenAI({ apiKey: c.env.OPENAI_API_KEY }),
  model: "gpt-4o",
});
```

Set the secret:

```bash
npx wrangler secret put OPENAI_API_KEY
```

### Google (Gemini)

```ts
import { createGoogle } from "@yourgpt/llm-sdk/google";

const runtime = createRuntime({
  provider: createGoogle({ apiKey: c.env.GOOGLE_API_KEY }),
  model: "gemini-2.0-flash",
});
```

## Files

```
cloudflare-workers-demo/
├── src/
│   └── index.ts        # Worker with streaming & non-streaming
├── .dev.vars.example   # Example env file (copy to .dev.vars)
├── .gitignore          # Ignores .dev.vars and node_modules
├── wrangler.toml       # Cloudflare configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "ANTHROPIC_API_KEY is not defined"

Make sure you've created `.dev.vars` with your key:

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add your key
```

### Streaming not working

Make sure you're using `-N` flag with curl to disable buffering:

```bash
curl -N -X POST http://localhost:8787/chat/stream ...
```

### CORS errors from frontend

The example includes CORS middleware. If you still have issues, check that your frontend origin is allowed.

## Learn More

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Copilot SDK Deployment Guide](https://copilot-sdk.yourgpt.ai/docs/server/deployment)
