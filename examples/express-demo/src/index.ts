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
// Method 1: One-liner with pipeToResponse()
// ============================================
app.post("/api/chat", async (req, res) => {
  console.log("[/api/chat] Using pipeToResponse()");
  await runtime.stream(req.body).pipeToResponse(res);
});

// ============================================
// Method 2: Text-only streaming (no SSE events)
// ============================================
app.post("/api/chat/text", async (req, res) => {
  console.log("[/api/chat/text] Using pipeTextToResponse()");
  await runtime.stream(req.body).pipeTextToResponse(res);
});

// ============================================
// Method 3: Using expressHandler()
// ============================================
app.post("/api/chat/handler", runtime.expressHandler());

// ============================================
// Method 4: Collect result (streams internally, returns JSON)
// ============================================
app.post("/api/chat/collect", async (req, res) => {
  console.log("[/api/chat/collect] Using collect()");
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
// Method 4b: Non-streaming with generate() - CopilotChat format
// ============================================
app.post("/api/chat/generate", async (req, res) => {
  console.log("[/api/chat/generate] Using runtime.generate()");
  const result = await runtime.generate(req.body);
  res.json(result.toResponse()); // CopilotChat-compatible format
});

// ============================================
// Method 4c: Non-streaming with generate() - Raw access
// ============================================
app.post("/api/chat/generate-raw", async (req, res) => {
  console.log(
    "[/api/chat/generate-raw] Using runtime.generate() with raw access",
  );
  const result = await runtime.generate(req.body);
  res.json({
    text: result.text,
    success: result.success,
    toolCalls: result.toolCalls,
    messageCount: result.messages.length,
  });
});

// ============================================
// Method 5: Event handlers
// ============================================
app.post("/api/chat/events", async (req, res) => {
  console.log("[/api/chat/events] Using event handlers");

  const result = runtime
    .stream(req.body)
    .on("text", (text) => {
      process.stdout.write(text); // Log text as it streams
    })
    .on("toolCall", (call) => {
      console.log("\n[Tool Call]", call.name, call.args);
    })
    .on("done", (final) => {
      console.log("\n[Done] Total length:", final.text.length);
    })
    .on("error", (err) => {
      console.error("\n[Error]", err.message);
    });

  await result.pipeToResponse(res);
});

// ============================================
// Method 6: Web Response (for testing toResponse())
// ============================================
app.post("/api/chat/web", async (req, res) => {
  console.log("[/api/chat/web] Using toResponse()");

  // Get Web Response
  const webResponse = runtime.stream(req.body).toResponse();

  // Copy headers
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Stream body
  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    endpoints: [
      "POST /api/chat - SSE streaming (works with CopilotChat)",
      "POST /api/chat/text - Text-only streaming",
      "POST /api/chat/handler - Using expressHandler()",
      "POST /api/chat/collect - Streams internally, returns raw JSON",
      "POST /api/chat/generate - Non-streaming (works with CopilotChat)",
      "POST /api/chat/generate-raw - Non-streaming raw access",
      "POST /api/chat/events - With event handlers",
      "POST /api/chat/web - Using toResponse()",
    ],
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`
Express Demo Server running on http://localhost:${port}

Available endpoints:
  GET  /api/health            - Health check

  STREAMING:
  POST /api/chat              - SSE streaming (works with CopilotChat)
  POST /api/chat/text         - Text-only streaming
  POST /api/chat/handler      - Using expressHandler()
  POST /api/chat/collect      - Streams internally, returns raw JSON
  POST /api/chat/events       - With event handlers
  POST /api/chat/web          - Using toResponse()

  NON-STREAMING:
  POST /api/chat/generate     - CopilotChat format (works with CopilotChat)
  POST /api/chat/generate-raw - Raw format (text, toolCalls, etc.)

Test streaming:
  curl -X POST http://localhost:${port}/api/chat \\
    -H "Content-Type: application/json" \\
    -d '{"messages":[{"role":"user","content":"Say hello in 3 words"}]}'

Test non-streaming:
  curl -X POST http://localhost:${port}/api/chat/generate \\
    -H "Content-Type: application/json" \\
    -d '{"messages":[{"role":"user","content":"Say hello in 3 words"}]}'
  `);
});
