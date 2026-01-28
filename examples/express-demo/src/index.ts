import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRuntime } from "@yourgpt/llm-sdk";
import { createOpenAI } from "@yourgpt/llm-sdk/openai";

const app = express();
app.use(cors());
app.use(express.json());

// Create runtime once at startup
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runtime = createRuntime({
  provider: openai,
  model: "gpt-4o-mini",
  systemPrompt: "You are a helpful AI assistant. Keep responses concise.",
});

// ============================================
// COPILOT SDK COMPATIBLE ENDPOINTS
// Use these with CopilotProvider
// ============================================

/**
 * Streaming (SSE) - Primary endpoint for Copilot SDK
 * Returns: text/event-stream with SSE events
 */
app.post("/api/copilot/stream", async (req, res) => {
  console.log("[/api/copilot/stream] SSE streaming");
  //log headers
  console.log("Headers:", req.headers);

  await runtime
    .stream(req.body, {
      onFinish: ({ messages, usage }) => {
        console.log("\n=== onFinish ===");
        console.log("Messages:", messages.length);
        console.log("Usage:", usage);
      },
    })
    .pipeToResponse(res);
});

/**
 * Non-streaming - For Copilot SDK with streaming={false}
 * Returns: { text, messages, toolCalls }
 */
app.post("/api/copilot/chat", async (req, res) => {
  console.log("[/api/copilot/chat] Non-streaming JSON");
  const result = await runtime.chat(req.body);
  console.log("[/api/copilot/chat] Result:", result);
  res.json(result);
});

/**
 * Express handler - One-liner alternative
 * Returns: text/event-stream with SSE events
 */
app.post("/api/copilot/handler", runtime.expressHandler());

// ============================================
// RAW STREAMING ENDPOINTS
// For custom clients (NOT Copilot SDK)
// ============================================

/**
 * Raw text stream - Plain text chunks
 * Returns: text/plain stream
 */
app.post("/api/raw/stream/text", async (req, res) => {
  console.log("[/api/raw/stream/text] Plain text streaming");
  await runtime.stream(req.body).pipeTextToResponse(res);
});

/**
 * Raw stream with events - Stream with logging
 * Returns: text/event-stream (but logs events server-side)
 */
app.post("/api/raw/stream/events", async (req, res) => {
  console.log("[/api/raw/stream/events] Streaming with event handlers");

  const result = runtime
    .stream(req.body)
    .on("text", (text: string) => {
      process.stdout.write(text);
    })
    .on("toolCall", (call: { name: string; args: unknown }) => {
      console.log("\n[Tool Call]", call.name, call.args);
    })
    .on("done", (final: { text: string }) => {
      console.log("\n[Done] Total length:", final.text.length);
    })
    .on("error", (err: Error) => {
      console.error("\n[Error]", err.message);
    });

  await result.pipeToResponse(res);
});

// ============================================
// RAW NON-STREAMING ENDPOINTS
// For custom clients (NOT Copilot SDK)
// ============================================

/**
 * Generate text only
 * Returns: { text: string }
 */
app.post("/api/raw/generate/text", async (req, res) => {
  console.log("[/api/raw/generate/text] Text only response");
  const text = await runtime.stream(req.body).text();
  res.json({ text });
});

/**
 * Generate full response
 * Returns: { text, messages, toolCalls }
 */
app.post("/api/raw/generate/full", async (req, res) => {
  console.log("[/api/raw/generate/full] Full response data");
  const { text, messages, toolCalls } = await runtime
    .stream(req.body)
    .collect();
  res.json({ text, messages, toolCalls });
});

/**
 * Generate with metadata
 * Returns: { text, messageCount, toolCallCount }
 */
app.post("/api/raw/generate/summary", async (req, res) => {
  console.log("[/api/raw/generate/summary] Summary response");
  const { text, messages, toolCalls } = await runtime
    .stream(req.body)
    .collect();
  res.json({
    text,
    messageCount: messages.length,
    toolCallCount: toolCalls.length,
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    copilotEndpoints: [
      "POST /api/copilot/stream - SSE streaming (CopilotProvider default)",
      "POST /api/copilot/chat - Non-streaming JSON (streaming={false})",
      "POST /api/copilot/handler - Express handler one-liner",
    ],
    rawStreamEndpoints: [
      "POST /api/raw/stream/text - Plain text stream",
      "POST /api/raw/stream/events - Stream with server-side event logging",
    ],
    rawGenerateEndpoints: [
      "POST /api/raw/generate/text - Returns { text }",
      "POST /api/raw/generate/full - Returns { text, messages, toolCalls }",
      "POST /api/raw/generate/summary - Returns { text, messageCount, toolCallCount }",
    ],
  });
});

// ============================================
// SERVER START
// ============================================

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`
Express Demo Server running on http://localhost:${port}

=== COPILOT SDK ENDPOINTS ===
  POST /api/copilot/stream   - SSE streaming (default)
  POST /api/copilot/chat     - Non-streaming JSON
  POST /api/copilot/handler  - Express handler

=== RAW STREAMING ===
  POST /api/raw/stream/text   - Plain text stream
  POST /api/raw/stream/events - Stream with event logging

=== RAW NON-STREAMING ===
  POST /api/raw/generate/text    - Returns { text }
  POST /api/raw/generate/full    - Returns { text, messages, toolCalls }
  POST /api/raw/generate/summary - Returns { text, messageCount, toolCallCount }

=== TEST CURLS ===

# Copilot SDK - Streaming
curl -X POST http://localhost:${port}/api/copilot/stream \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Say hello"}]}'

# Copilot SDK - Non-streaming
curl -X POST http://localhost:${port}/api/copilot/chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Say hello"}]}'

# Raw - Text only
curl -X POST http://localhost:${port}/api/raw/stream/text \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Say hello"}]}'

# Raw - Generate text
curl -X POST http://localhost:${port}/api/raw/generate/text \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Say hello"}]}'
  `);
});
