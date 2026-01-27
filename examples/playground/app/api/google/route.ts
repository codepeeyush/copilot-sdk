import { createRuntime } from "@yourgpt/llm-sdk";
import { createGoogleGenerativeAI } from "@yourgpt/llm-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const runtime = createRuntime({
  provider: google,
  model: "gemini-1.5-flash",
  systemPrompt:
    "You are a helpful assistant powered by Google Gemini 1.5 Flash. Be concise and helpful.",
  debug: process.env.NODE_ENV === "development",
});

export async function POST(request: Request) {
  try {
    const response = await runtime.handleRequest(request);
    return response;
  } catch (error) {
    console.error("[Google Route] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    provider: "google",
    model: "gemini-1.5-flash",
  });
}
