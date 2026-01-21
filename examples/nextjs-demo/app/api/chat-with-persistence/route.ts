/**
 * Chat Route with Server-Side Persistence
 *
 * This example demonstrates how to use the `onFinish` callback
 * to save messages to your database after each chat response.
 *
 * The `onFinish` callback is called after the stream completes,
 * providing the assistant's messages for you to persist.
 */

import { createOpenAI, createRuntime } from "@yourgpt/llm-sdk";
import { threads } from "../threads/_store";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runtime = createRuntime({
  provider: openai,
  model: "gpt-4o-mini",
  systemPrompt: "You are a helpful assistant. Be concise and friendly.",
  debug: process.env.NODE_ENV === "development",
});

export async function POST(request: Request) {
  console.log("[Chat with Persistence] Received request");

  try {
    // Handle the request with onFinish callback for persistence
    const response = await runtime.handleRequest(request, {
      /**
       * onFinish is called after the stream completes.
       * Use this to save messages to your database.
       *
       * In a real app, you would:
       * 1. Save to your database (Prisma, Drizzle, etc.)
       * 2. Handle errors appropriately
       * 3. Consider retry logic for database failures
       */
      onFinish: async ({ messages, threadId }) => {
        if (!threadId) {
          console.log(
            "[Chat with Persistence] No threadId provided, skipping persistence",
          );
          return;
        }

        console.log(
          `[Chat with Persistence] Saving ${messages.length} messages to thread: ${threadId}`,
        );

        // Get existing thread or create new one
        let thread = threads.get(threadId);
        const now = new Date().toISOString();

        if (!thread) {
          // Create new thread
          thread = {
            id: threadId,
            title: undefined,
            preview: undefined,
            messageCount: 0,
            createdAt: now,
            updatedAt: now,
            messages: [],
            sources: [],
          };
        }

        // Append new messages (convert DoneEventMessage to stored format)
        const newMessages = messages.map((m, i) => ({
          id: `msg_${Date.now()}_${i}`,
          role: m.role,
          content: m.content ?? "",
          created_at: now,
          tool_calls: m.tool_calls,
          tool_call_id: m.tool_call_id,
        }));

        thread.messages = [...thread.messages, ...newMessages];
        thread.messageCount = thread.messages.length;
        thread.updatedAt = now;

        // Generate title from first user message if not set
        if (!thread.title) {
          const firstUserMessage = thread.messages.find(
            (m) => m.role === "user",
          );
          if (firstUserMessage?.content) {
            thread.title =
              firstUserMessage.content.length > 50
                ? firstUserMessage.content.slice(0, 47) + "..."
                : firstUserMessage.content;
          }
        }

        // Update preview
        const firstUserMessage = thread.messages.find((m) => m.role === "user");
        thread.preview = firstUserMessage?.content?.slice(0, 100);

        // Save to storage
        threads.set(threadId, thread);

        console.log(
          `[Chat with Persistence] Saved thread ${threadId} with ${thread.messages.length} total messages`,
        );
      },
    });

    return response;
  } catch (error) {
    console.error("[Chat with Persistence] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    description:
      "Chat route with server-side persistence via onFinish callback",
  });
}
