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

// ✨ Simple one-liner with StreamResult API
app.post('/api/chat', async (req, res) => {
  await runtime.stream(req.body).pipeToResponse(res);
});

// Alternative: Use the expressHandler() method
// app.post('/api/chat', runtime.expressHandler());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
