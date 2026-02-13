/**
 * Ollama Express Server Demo
 *
 * A complete Express server using Ollama as the LLM provider.
 * Perfect for building local AI applications without API keys.
 *
 * Prerequisites:
 * - Ollama installed and running (ollama serve)
 * - Model pulled: ollama pull llama3.1
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRuntime } from "@yourgpt/llm-sdk";
import { createOllama } from "@yourgpt/llm-sdk/ollama";

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// SETUP OLLAMA PROVIDER
// ============================================

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.1";

const ollama = createOllama({
  baseUrl: OLLAMA_BASE_URL,
  options: {
    num_ctx: 8192,
    temperature: 0.7,
  },
});

// Create runtime with Ollama
const runtime = createRuntime({
  provider: ollama,
  model: MODEL,
  systemPrompt: "You are a helpful AI assistant running locally via Ollama.",
});

// ============================================
// ENDPOINTS
// ============================================

/**
 * Streaming chat endpoint (SSE)
 */
app.post("/api/chat/stream", async (req, res) => {
  console.log("[/api/chat/stream] Streaming with Ollama");

  await runtime
    .stream(req.body, {
      onFinish: ({ messages }) => {
        console.log(`[Done] ${messages.length} messages`);
      },
    })
    .pipeToResponse(res);
});

/**
 * Non-streaming chat endpoint
 */
app.post("/api/chat", async (req, res) => {
  console.log("[/api/chat] Non-streaming with Ollama");

  const result = await runtime.chat(req.body);
  res.json(result);
});

/**
 * Chat with tools
 */
app.post("/api/chat/tools", async (req, res) => {
  console.log("[/api/chat/tools] Chat with tools");

  // Add tools to the request
  const requestWithTools = {
    ...req.body,
    tools: [
      {
        name: "get_weather",
        description: "Get weather for a location",
        location: "server",
        inputSchema: {
          type: "object",
          properties: {
            location: { type: "string", description: "City name" },
          },
          required: ["location"],
        },
        handler: async (params: { location: string }) => {
          // Simulate weather API
          return {
            success: true,
            data: {
              location: params.location,
              temperature: Math.floor(Math.random() * 30) + 10,
              condition: ["sunny", "cloudy", "rainy"][
                Math.floor(Math.random() * 3)
              ],
            },
          };
        },
      },
      {
        name: "calculate",
        description: "Calculate a math expression",
        location: "server",
        inputSchema: {
          type: "object",
          properties: {
            expression: { type: "string", description: "Math expression" },
          },
          required: ["expression"],
        },
        handler: async (params: { expression: string }) => {
          try {
            // Simple eval for demo (use a proper math parser in production)
            const result = Function(
              `"use strict"; return (${params.expression})`,
            )();
            return { success: true, data: { result } };
          } catch {
            return { success: false, error: "Invalid expression" };
          }
        },
      },
    ],
  };

  await runtime.stream(requestWithTools).pipeToResponse(res);
});

/**
 * Health check
 */
app.get("/api/health", async (_req, res) => {
  // Check Ollama connection
  let ollamaStatus = "unknown";
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (response.ok) {
      const data = await response.json();
      ollamaStatus = `connected (${data.models?.length || 0} models)`;
    }
  } catch {
    ollamaStatus = "disconnected";
  }

  res.json({
    status: "ok",
    ollama: {
      baseUrl: OLLAMA_BASE_URL,
      model: MODEL,
      status: ollamaStatus,
    },
    endpoints: [
      "POST /api/chat/stream - SSE streaming",
      "POST /api/chat - Non-streaming JSON",
      "POST /api/chat/tools - Chat with tools",
    ],
  });
});

/**
 * List available Ollama models
 */
app.get("/api/models", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error("Failed to fetch models");
    }
    const data = await response.json();
    res.json({
      models: data.models?.map((m: { name: string; size: number }) => ({
        name: m.name,
        size: m.size,
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: "Cannot connect to Ollama",
      message: "Make sure Ollama is running: ollama serve",
    });
  }
});

// ============================================
// SERVER START
// ============================================

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║         Ollama Local AI Server                     ║
╠════════════════════════════════════════════════════╣
║  Server:  http://localhost:${port}                    ║
║  Ollama:  ${OLLAMA_BASE_URL.padEnd(35)}║
║  Model:   ${MODEL.padEnd(35)}║
╚════════════════════════════════════════════════════╝

Endpoints:
  POST /api/chat/stream  - SSE streaming
  POST /api/chat         - Non-streaming JSON
  POST /api/chat/tools   - Chat with server-side tools
  GET  /api/health       - Health check
  GET  /api/models       - List available models

Test Commands:

# Streaming chat
curl -X POST http://localhost:${port}/api/chat/stream \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'

# Non-streaming chat
curl -X POST http://localhost:${port}/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"What is 2+2?"}]}'

# Chat with tools
curl -X POST http://localhost:${port}/api/chat/tools \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"What is the weather in Paris?"}]}'

# List models
curl http://localhost:${port}/api/models
  `);
});
