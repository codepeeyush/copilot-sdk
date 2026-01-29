import { generateText, type CoreMessage } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  console.log("[Generate Text Route] Received request");

  try {
    const body = await request.json();
    const { messages } = body;

    console.log("[Generate Text Route] Messages:", messages?.length);

    // Convert to CoreMessage format
    const coreMessages: CoreMessage[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }),
    );

    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: "You are a helpful assistant. Be concise and helpful.",
      messages: coreMessages,
    });

    console.log("[Generate Text Route] Response:", {
      textLength: result.text.length,
      usage: result.usage,
      finishReason: result.finishReason,
    });

    // Return in format compatible with CopilotChat
    return Response.json({
      success: true,
      content: result.text,
      messages: [
        {
          role: "assistant",
          content: result.text,
        },
      ],
      usage: result.usage,
      finishReason: result.finishReason,
    });
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
