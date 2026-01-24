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

app.post('/api/chat', async (req, res) => {
  const webRequest = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  const response = await runtime.handleRequest(webRequest);

  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(response.status);

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
