# Express Demo - StreamResult API

This example demonstrates the new `StreamResult` API for Express servers.

## Setup

```bash
# From repo root
pnpm install

# Set your API key
export OPENAI_API_KEY=sk-your-key-here

# Run the server
cd examples/express-demo
pnpm dev
```

## Endpoints

| Endpoint            | Method                 | Description                 |
| ------------------- | ---------------------- | --------------------------- |
| `/api/chat`         | `pipeToResponse()`     | SSE streaming (recommended) |
| `/api/chat/text`    | `pipeTextToResponse()` | Text-only streaming         |
| `/api/chat/handler` | `expressHandler()`     | Built-in handler            |
| `/api/chat/collect` | `collect()`            | Non-streaming JSON          |
| `/api/chat/events`  | Event handlers         | With `on('text', ...)`      |
| `/api/chat/web`     | `toResponse()`         | Web Response conversion     |

## Test Commands

### SSE Streaming (default)

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello in 3 words"}]}'
```

### Text-only Streaming

```bash
curl -X POST http://localhost:3001/api/chat/text \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Count to 5"}]}'
```

### Non-streaming JSON

```bash
curl -X POST http://localhost:3001/api/chat/collect \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is 2+2?"}]}'
```

## Code Examples

### One-liner (Recommended)

```typescript
app.post("/api/chat", async (req, res) => {
  await runtime.stream(req.body).pipeToResponse(res);
});
```

### With Event Handlers

```typescript
app.post("/api/chat", async (req, res) => {
  const result = runtime
    .stream(req.body)
    .on("text", (text) => console.log(text))
    .on("done", (final) => console.log("Done:", final.text.length));

  await result.pipeToResponse(res);
});
```

### Non-streaming

```typescript
app.post("/api/chat", async (req, res) => {
  const { text, messages } = await runtime.stream(req.body).collect();
  res.json({ response: text });
});
```
