import { createRuntime } from "@yourgpt/llm-sdk";
import { createOpenAI } from "@yourgpt/llm-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runtime = createRuntime({
  provider: openai,
  model: "gpt-4o-mini",
  systemPrompt: "You are a helpful assistant. Be concise.",
});

// Non-streaming - CopilotChat compatible
export async function POST(request: Request) {
  console.log("[Generate Route] Using runtime.generate()");

  const body = await request.json();
  const result = await runtime.generate(body);

  return Response.json(result.toResponse());
}

export async function GET() {
  return Response.json({
    status: "ok",
    provider: "openai",
    streaming: false,
    method: "runtime.generate().toResponse()",
  });
}
