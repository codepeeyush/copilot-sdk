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

// ✨ Streaming - SSE response (default, works with CopilotChat)
export async function POST(request: Request) {
  const body = await request.json();
  return runtime.stream(body).toResponse();
}

// Alternative: Non-streaming - JSON response
// export async function POST(request: Request) {
//   const body = await request.json();
//   const result = await runtime.generate(body);
//   return Response.json(result.toResponse());
// }
