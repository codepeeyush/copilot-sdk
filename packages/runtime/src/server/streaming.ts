import type { StreamEvent } from "@yourgpt/core";

/**
 * Create SSE response headers
 */
export function createSSEHeaders(): Record<string, string> {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

/**
 * Format event as SSE data
 */
export function formatSSEData(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * Create a ReadableStream from an async generator of events
 */
export function createEventStream(
  generator: AsyncGenerator<StreamEvent>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of generator) {
          const data = formatSSEData(event);
          controller.enqueue(encoder.encode(data));
        }
      } catch (error) {
        // Send error event
        const errorEvent: StreamEvent = {
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        };
        controller.enqueue(encoder.encode(formatSSEData(errorEvent)));
      } finally {
        // Send done event
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}

/**
 * Create SSE Response object
 */
export function createSSEResponse(
  generator: AsyncGenerator<StreamEvent>,
): Response {
  return new Response(createEventStream(generator), {
    headers: createSSEHeaders(),
  });
}
