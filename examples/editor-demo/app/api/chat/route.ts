import { createRuntime } from "@yourgpt/llm-sdk";
import { createOpenAI } from "@yourgpt/llm-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runtime = createRuntime({
  provider: openai,
  model: "gpt-5.2",
  systemPrompt:
    "You are a helpful assistant. Be concise and helpful. When using tools, provide clear feedback about what you're doing.",
  debug: process.env.NODE_ENV === "development",
});

export async function POST(request: Request) {
  try {
    const response = await runtime.handleRequest(request);
    return response;
  } catch (error) {
    console.error("[Chat Route] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({ status: "ok", provider: "openai" });
}
