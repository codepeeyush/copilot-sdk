import { createRuntime } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const runtime = createRuntime({
  provider: anthropic,
  model: "claude-sonnet-4-20250514",
  systemPrompt: "You are a helpful assistant. Be concise and helpful.",
  debug: process.env.NODE_ENV === "development",
});

export async function POST(request: Request) {
  console.log("[Generate Text Route] Received request");

  try {
    const response = await runtime.handleRequest(request);
    return response;
  } catch (error) {
    console.error("[Generate Text Route] Error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    provider: "anthropic",
    method: "generateText",
  });
}
