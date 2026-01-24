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

// Chat endpoint
app.post('/api/chat', async (c) => {
  return runtime.handleRequest(c.req.raw);
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

const port = 3001;
console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
