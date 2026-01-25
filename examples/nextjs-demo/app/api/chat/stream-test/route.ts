/**
 * Test route demonstrating the new StreamResult API
 *
 * This shows the new `runtime.stream()` method which returns a StreamResult
 * object with multiple response helpers.
 */
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

/**
 * SSE Streaming using runtime.stream().toResponse()
 *
 * This is the new recommended pattern for Next.js
 */
export async function POST(request: Request) {
  console.log("[Stream Test] Using runtime.stream().toResponse()");

  try {
    const body = await request.json();

    // New API: runtime.stream() returns StreamResult with helpers
    const result = runtime.stream(body);

    // For Next.js, use toResponse() which returns a Web Response
    return result.toResponse();
  } catch (error) {
    console.error("[Stream Test] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

/**
 * Non-streaming endpoint using collect()
 */
export async function PUT(request: Request) {
  console.log("[Stream Test] Using runtime.stream().collect()");

  try {
    const body = await request.json();

    // Collect full response (non-streaming)
    const { text, messages, toolCalls, requiresAction } = await runtime
      .stream(body)
      .collect();

    return Response.json({
      text,
      messageCount: messages.length,
      toolCallCount: toolCalls.length,
      requiresAction,
    });
  } catch (error) {
    console.error("[Stream Test] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    description: "StreamResult API test endpoint",
    methods: {
      POST: "SSE streaming with toResponse()",
      PUT: "Non-streaming with collect()",
    },
    example: {
      method: "POST",
      body: { messages: [{ role: "user", content: "Hello" }] },
    },
  });
}
