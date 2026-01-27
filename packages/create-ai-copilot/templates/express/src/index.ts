import express from 'express';
import cors from 'cors';
import { createRuntime } from '@yourgpt/llm-sdk';
import { create{{providerClass}} } from '@yourgpt/llm-sdk/{{provider}}';

const app = express();
app.use(cors());
app.use(express.json());

const {{provider}} = create{{providerClass}}({
  apiKey: process.env.{{envKey}},
});

const runtime = createRuntime({
  provider: {{provider}},
  model: '{{model}}',
  systemPrompt: 'You are a helpful AI assistant.',
});

// ✨ Streaming - SSE response (works with CopilotChat)
app.post('/api/chat', async (req, res) => {
  await runtime.stream(req.body).pipeToResponse(res);
});

// ✨ Non-streaming - JSON response (works with CopilotChat)
app.post('/api/chat/generate', async (req, res) => {
  const result = await runtime.generate(req.body);
  res.json(result.toResponse());
});

// Alternative: Use the expressHandler() middleware
// app.post('/api/chat', runtime.expressHandler());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
