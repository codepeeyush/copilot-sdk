import { streamText } from '@yourgpt/llm-sdk';
import { {{provider}} } from '@yourgpt/llm-sdk/{{provider}}';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: {{provider}}('{{model}}'),
    system: 'You are a helpful AI assistant.',
    messages,
  });

  return result.toTextStreamResponse();
}
