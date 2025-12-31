import type { StreamEvent } from "../types";

/**
 * Parse SSE stream data
 */
export function parseSSELine(line: string): StreamEvent | null {
  if (!line.startsWith("data: ")) {
    return null;
  }

  const data = line.slice(6).trim();

  if (data === "[DONE]") {
    return { type: "done" };
  }

  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    return null;
  }
}

/**
 * Create an async iterator from SSE response
 */
export async function* streamSSE(
  response: Response,
): AsyncGenerator<StreamEvent, void, undefined> {
  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const event = parseSSELine(line);
        if (event) {
          yield event;
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      const event = parseSSELine(buffer);
      if (event) {
        yield event;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Create SSE response from async generator
 */
export function createSSEStream(
  generator: AsyncGenerator<StreamEvent, void, undefined>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of generator) {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const errorEvent: StreamEvent = {
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`),
        );
        controller.close();
      }
    },
  });
}
