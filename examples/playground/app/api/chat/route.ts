import { createRuntime } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const runtime = createRuntime({
  provider: anthropic,
  model: "claude-3-5-haiku-20241022",
  systemPrompt:
    "You are a helpful assistant. When the user asks you to perform an action, ALWAYS use the available tools. Do not just respond with text.",
  debug: true,
});

export async function POST(request: Request) {
  return runtime.handleRequest(request);
}

export async function GET() {
  return Response.json({
    status: "ok",
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
  });
}
