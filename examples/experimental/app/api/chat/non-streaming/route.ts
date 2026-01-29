import { createRuntime } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const runtime = createRuntime({
  provider: anthropic,
  model: "claude-sonnet-4-20250514",
  systemPrompt:
    "You are a helpful assistant. Be concise and helpful. This is a non-streaming test endpoint.",
  debug: true,
});

export async function POST(request: Request) {
  console.log("[Non-Streaming Route] Using runtime.generate()");
  try {
    const body = await request.json();
    const result = await runtime.generate(body);
    console.log("[Non-Streaming Route] Success:", result.success);
    return Response.json(result.toResponse());
  } catch (error) {
    console.error("[Non-Streaming Route] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    provider: "anthropic",
    streaming: false,
  });
}
