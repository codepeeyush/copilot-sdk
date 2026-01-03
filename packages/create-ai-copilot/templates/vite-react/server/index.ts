import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamText } from '@yourgpt/llm-sdk';
import { {{provider}} } from '@yourgpt/llm-sdk/{{provider}}';

const app = new Hono();

// Enable CORS for development
app.use('/*', cors());

// Chat endpoint
app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json();

  const result = await streamText({
    model: {{provider}}('{{model}}'),
    system: 'You are a helpful AI assistant.',
    messages,
  });

  return result.toTextStreamResponse();
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

const port = 3001;
console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
