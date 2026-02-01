/**
 * Cloudflare Workers Example
 *
 * Demonstrates both streaming and non-streaming modes with Anthropic.
 *
 * Endpoints:
 * - POST /chat/stream  → Streaming (SSE)
 * - POST /chat         → Non-streaming (JSON)
 * - GET  /             → Health check
 */

import { createRuntime, createHonoApp } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";
import { Hono } from "hono";
import { cors } from "hono/cors";

// Environment variables (set via wrangler secret)
export interface Env {
  ANTHROPIC_API_KEY: string;
}

// Create a Hono app with custom routes
const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use("*", cors());

// Health check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Cloudflare Workers Copilot API",
    endpoints: {
      streaming: "POST /chat/stream",
      nonStreaming: "POST /chat",
    },
  });
});

// ============================================
// Streaming Endpoint (SSE)
// ============================================
app.post("/chat/stream", async (c) => {
  const runtime = createRuntime({
    provider: createAnthropic({ apiKey: c.env.ANTHROPIC_API_KEY }),
    model: "claude-haiku-4-5",
    systemPrompt:
      "You are a helpful assistant powered by Claude on Cloudflare Workers.",
  });

  const body = await c.req.json();
  return runtime.stream(body).toResponse();
});

// ============================================
// Non-Streaming Endpoint (JSON)
// ============================================
app.post("/chat", async (c) => {
  const runtime = createRuntime({
    provider: createAnthropic({ apiKey: c.env.ANTHROPIC_API_KEY }),
    model: "claude-haiku-4-5",
    systemPrompt:
      "You are a helpful assistant powered by Claude on Cloudflare Workers.",
  });

  const body = await c.req.json();
  const result = await runtime.chat(body);
  return c.json(result);
});

// ============================================
// Alternative: Use createHonoApp for full Copilot SDK compatibility
// ============================================
// If you want the default Copilot SDK endpoints, uncomment this:
//
// app.route("/copilot", createHonoApp(runtime));
//
// This gives you:
// - POST /copilot/       → Streaming chat
// - POST /copilot/chat   → Streaming chat
// - GET  /copilot/tools  → List available tools

export default app;
