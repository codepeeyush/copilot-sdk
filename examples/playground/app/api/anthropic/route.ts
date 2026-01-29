import { createRuntime } from "@yourgpt/llm-sdk";
import { createAnthropic } from "@yourgpt/llm-sdk/anthropic";

export async function POST(request: Request) {
  try {
    // Get API key from URL query param (client-provided) or fallback to env
    const url = new URL(request.url);
    const clientApiKey = url.searchParams.get("key");
    const apiKey = clientApiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "Anthropic API key not configured. Please add your API key in settings.",
        },
        { status: 401 },
      );
    }

    const anthropic = createAnthropic({ apiKey });

    const runtime = createRuntime({
      provider: anthropic,
      model: "claude-3-5-sonnet-20241022",
      systemPrompt: `You are a helpful SDK demo assistant powered by Claude. You have access to tools that can interact with the dashboard.

Available tools:
- updateCounter: Increment, decrement, or reset the counter
- updatePreference: Set user preference (dark, light, auto, etc.)
- addNotification: Add a notification message to the dashboard
- updateCart: Add, remove, or clear items from the cart
- getWeather: Get weather for a location (use when asked about weather)
- getStockPrice: Get stock price for a ticker symbol (use when asked about stocks)

Be concise and helpful. When asked to perform actions or get information, use the appropriate tools.`,
      debug: process.env.NODE_ENV === "development",
    });

    const response = await runtime.handleRequest(request);
    return response;
  } catch (error) {
    console.error("[Anthropic Route] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const hasEnvKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    status: "ok",
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    configured: hasEnvKey,
  });
}
