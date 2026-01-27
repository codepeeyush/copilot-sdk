import { createRuntime } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const runtime = createRuntime({
  provider: anthropic,
  model: "claude-3-5-sonnet-20241022",
  systemPrompt:
    "You are a helpful assistant powered by Anthropic Claude 3.5 Sonnet. Be concise and helpful.",
  debug: process.env.NODE_ENV === "development",
});

export async function POST(request: Request) {
  try {
    const response = await runtime.handleRequest(request);
    return response;
  } catch (error) {
    console.error("[Anthropic Route] Error:", error);
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
    model: "claude-3-5-sonnet-20241022",
  });
}
