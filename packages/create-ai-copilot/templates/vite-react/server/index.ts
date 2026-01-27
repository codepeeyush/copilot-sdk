import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createRuntime } from '@yourgpt/llm-sdk';
import { create{{providerClass}} } from '@yourgpt/llm-sdk/{{provider}}';

const {{provider}} = create{{providerClass}}({
  apiKey: process.env.{{envKey}},
});

const runtime = createRuntime({
  provider: {{provider}},
  model: '{{model}}',
  systemPrompt: 'You are a helpful AI assistant.',
});

const app = new Hono();

// Enable CORS for development
app.use('/*', cors());

// ✨ Streaming - SSE response (works with CopilotChat)
app.post('/api/chat', async (c) => {
  return runtime.stream(await c.req.json()).toResponse();
});

// ✨ Non-streaming - JSON response (works with CopilotChat)
app.post('/api/chat/generate', async (c) => {
  const result = await runtime.generate(await c.req.json());
  return c.json(result.toResponse());
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

const port = 3001;
console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
