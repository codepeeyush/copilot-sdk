import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Runtime } from "./runtime";
import type { RuntimeConfig } from "./types";
import { createRuntime } from "./runtime";
import { createSSEResponse } from "./streaming";

/**
 * Create Hono app with chat endpoint
 */
export function createHonoApp(runtime: Runtime): Hono {
  const app = new Hono();

  // Enable CORS
  app.use("*", cors());

  // Health check
  app.get("/", (c) => {
    return c.json({ status: "ok", provider: "yourgpt-copilot" });
  });

  // Chat endpoint at root (for Next.js App Router mounting)
  // e.g., mounted at /api/chat/openai → POST /api/chat/openai works
  app.post("/", async (c) => {
    const request = c.req.raw;
    return runtime.handleRequest(request);
  });

  // Chat endpoint (standard - single turn)
  // Also available at /chat sub-path for flexibility
  app.post("/chat", async (c) => {
    const request = c.req.raw;
    return runtime.handleRequest(request);
  });

  // Chat endpoint with agent loop (multi-turn with tools)
  // Note: With Vercel AI SDK pattern, this is the same as /chat
  // Client sends tool results in messages, server doesn't wait
  app.post("/chat/loop", async (c) => {
    try {
      const body = await c.req.json();
      const signal = c.req.raw.signal;

      // Process with tool support
      const generator = runtime.processChatWithLoop(body, signal);
      return createSSEResponse(generator);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        500,
      );
    }
  });

  // Get available actions (legacy)
  app.get("/actions", (c) => {
    const actions = runtime.getActions().map((a) => ({
      name: a.name,
      description: a.description,
      parameters: a.parameters,
    }));
    return c.json({ actions });
  });

  // Get available tools (new)
  app.get("/tools", (c) => {
    const tools = runtime.getTools().map((t) => ({
      name: t.name,
      description: t.description,
      location: t.location,
      inputSchema: t.inputSchema,
    }));
    return c.json({ tools });
  });

  // Get model capabilities (for UI feature flags)
  app.get("/capabilities", (c) => {
    const provider = runtime.getProvider();
    const model = runtime.getModel();

    if (provider) {
      const capabilities = provider.getCapabilities(model);
      return c.json({
        provider: provider.name,
        model,
        capabilities,
        supportedModels: provider.supportedModels,
      });
    }

    // Fallback for legacy config (no provider instance)
    return c.json({
      provider: "unknown",
      model,
      capabilities: {
        supportsVision: false,
        supportsTools: true,
        supportsThinking: false,
        supportsStreaming: true,
        supportsPDF: false,
        supportsAudio: false,
        supportsVideo: false,
        maxTokens: 8192,
        supportedImageTypes: [],
        supportsJsonMode: false,
        supportsSystemMessages: true,
      },
      supportedModels: [],
    });
  });

  return app;
}

/**
 * Next.js App Router handler
 *
 * For simple Next.js routes, prefer using `streamText()` directly:
 * @example
 * ```ts
 * // app/api/chat/route.ts (RECOMMENDED)
 * import { streamText } from '@yourgpt/llm-sdk';
 * import { openai } from '@yourgpt/llm-sdk/openai';
 *
 * export async function POST(req: Request) {
 *   const { messages } = await req.json();
 *   const result = await streamText({
 *     model: openai('gpt-4o'),
 *     system: 'You are a helpful assistant.',
 *     messages,
 *   });
 *   return result.toTextStreamResponse();
 * }
 * ```
 *
 * Use createNextHandler when you need runtime features like tools:
 * @example
 * ```ts
 * // app/api/chat/route.ts
 * import { createNextHandler } from '@yourgpt/llm-sdk';
 * import { createOpenAI } from '@yourgpt/llm-sdk/openai';
 *
 * export const POST = createNextHandler({
 *   provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
 *   model: 'gpt-4o',
 *   systemPrompt: 'You are a helpful assistant.',
 * });
 * ```
 */
export function createNextHandler(config: RuntimeConfig) {
  const runtime = createRuntime(config);

  return async function handler(request: Request): Promise<Response> {
    return runtime.handleRequest(request);
  };
}

/**
 * Express middleware (Simplified with StreamResult)
 *
 * Creates an Express-compatible middleware that uses the new StreamResult API.
 * Much simpler internally - no more manual request/response conversion.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { createExpressMiddleware } from '@yourgpt/llm-sdk';
 * import { createOpenAI } from '@yourgpt/llm-sdk/openai';
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Simple usage
 * app.post('/api/chat', createExpressMiddleware({
 *   provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
 *   model: 'gpt-4o',
 * }));
 *
 * // With options
 * app.post('/api/chat', createExpressMiddleware({
 *   provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
 *   model: 'gpt-4o',
 * }, { format: 'text' }));
 * ```
 */
export function createExpressMiddleware(
  config: RuntimeConfig,
  options?: {
    /** Response format: 'sse' (default) or 'text' */
    format?: "sse" | "text";
    /** Additional headers to include */
    headers?: Record<string, string>;
  },
) {
  const runtime = createRuntime(config);

  // Express response type - more permissive to work with different Express versions
  type ExpressResponse = {
    status: (code: number) => { json: (data: unknown) => void };
    setHeader: (
      name: string,
      value: string | number | readonly string[],
    ) => unknown;
    write: (data: string | Buffer) => boolean;
    end: () => unknown;
  };

  return async (req: { body: unknown }, res: ExpressResponse) => {
    try {
      // Use the new StreamResult API - much simpler!
      const result = runtime.stream(req.body as import("./types").ChatRequest);

      // Cast to the interface expected by pipeToResponse
      // This is safe because Express response satisfies these methods
      const nodeRes = res as unknown as {
        setHeader(
          name: string,
          value: string | number | readonly string[],
        ): void;
        write(chunk: string | Buffer): boolean;
        end(): void;
      };

      if (options?.format === "text") {
        await result.pipeTextToResponse(nodeRes, { headers: options?.headers });
      } else {
        await result.pipeToResponse(nodeRes, { headers: options?.headers });
      }
    } catch (error) {
      console.error("[Express Middleware] Error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}

/**
 * Create Express handler from existing Runtime instance
 *
 * Use this when you already have a Runtime instance and want to create
 * an Express handler from it.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { createRuntime, createExpressHandler } from '@yourgpt/llm-sdk';
 * import { createOpenAI } from '@yourgpt/llm-sdk/openai';
 *
 * const runtime = createRuntime({
 *   provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
 *   model: 'gpt-4o',
 * });
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Use with existing runtime
 * app.post('/api/chat', createExpressHandler(runtime));
 *
 * // Or use runtime.expressHandler() directly
 * app.post('/api/chat', runtime.expressHandler());
 * ```
 */
export function createExpressHandler(
  runtime: Runtime,
  options?: {
    format?: "sse" | "text";
    headers?: Record<string, string>;
  },
) {
  return runtime.expressHandler(options);
}

/**
 * Node.js HTTP handler
 *
 * @example
 * ```ts
 * import http from 'http';
 * import { createNodeHandler } from '@yourgpt/llm-sdk';
 * import { createOpenAI } from '@yourgpt/llm-sdk/openai';
 *
 * const handler = createNodeHandler({
 *   provider: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
 *   model: 'gpt-4o',
 *   systemPrompt: 'You are a helpful assistant.',
 * });
 *
 * const server = http.createServer(handler);
 * server.listen(3001);
 * ```
 */
export function createNodeHandler(config: RuntimeConfig) {
  const runtime = createRuntime(config);
  const app = createHonoApp(runtime);

  return app.fetch;
}
