import { NextRequest } from "next/server";
import { Runtime } from "@yourgpt/runtime";
import { OpenAIAdapter } from "@yourgpt/runtime/adapters";

// Initialize runtime with OpenAI adapter and Knowledge Base
const runtime = new Runtime({
  adapter: new OpenAIAdapter({
    apiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4o-mini",
  }),
  systemPrompt: `You are a helpful AI assistant. Be concise and helpful.`,

  // Knowledge Base configuration (placeholder implementation)
  // When fully implemented, this will connect to a vector database
  knowledgeBase: {
    id: "yourgpt-docs",
    name: "YourGPT Documentation",
    provider: "pinecone", // or 'qdrant', 'chroma', 'supabase', etc.
    // apiKey: process.env.PINECONE_API_KEY, // Uncomment when implementing
    index: "docs-index",
    namespace: "yourgpt-sdk",
    topK: 5,
    scoreThreshold: 0.7,
  },

  debug: true, // Enable to see KB logs
});

// Register demo actions
runtime.registerAction({
  name: "get_weather",
  description: "Get the current weather for a location",
  parameters: {
    location: {
      type: "string",
      description: "The city name",
      required: true,
    },
  },
  handler: async (params) => {
    // Simulated weather data
    const weatherData: Record<string, { temp: number; condition: string }> = {
      tokyo: { temp: 22, condition: "Partly cloudy" },
      london: { temp: 15, condition: "Rainy" },
      "new york": { temp: 28, condition: "Sunny" },
      paris: { temp: 18, condition: "Cloudy" },
    };

    const location = (params.location as string).toLowerCase();
    const data = weatherData[location] || { temp: 20, condition: "Unknown" };

    return {
      location: params.location,
      temperature: data.temp,
      condition: data.condition,
      unit: "celsius",
    };
  },
});

runtime.registerAction({
  name: "search_docs",
  description: "Search the YourGPT documentation",
  parameters: {
    query: {
      type: "string",
      description: "Search query",
      required: true,
    },
  },
  handler: async (params) => {
    // Simulated doc search
    return {
      results: [
        {
          title: "Getting Started",
          url: "/docs/getting-started",
          snippet: "Learn how to install and configure YourGPT Copilot SDK...",
        },
        {
          title: "useChat Hook",
          url: "/docs/hooks/use-chat",
          snippet: "The useChat hook provides access to chat functionality...",
        },
      ],
      query: params.query,
    };
  },
});

export async function POST(request: NextRequest) {
  // Use the runtime's built-in request handler
  return runtime.handleRequest(request);
}

export async function GET() {
  return Response.json({
    name: "YourGPT Copilot Chat API",
    version: "1.0.0",
    status: "ready",
  });
}
