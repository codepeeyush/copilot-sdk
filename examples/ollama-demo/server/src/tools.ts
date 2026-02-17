/**
 * Server-side tool definitions for the Ollama demo.
 * These tools are registered on the runtime and available to the AI.
 */

import type { ToolDefinition } from "@yourgpt/llm-sdk";

function readStringParam(params: Record<string, unknown>, key: string): string {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

export const serverTools: ToolDefinition[] = [
  {
    name: "get_weather",
    description: "Get weather for a location",
    location: "server" as const,
    inputSchema: {
      type: "object" as const,
      properties: {
        location: { type: "string", description: "City name" },
      },
      required: ["location"],
    },
    handler: async (params: Record<string, unknown>) => {
      const location = readStringParam(params, "location");
      // Simulate weather API
      return {
        success: true,
        data: {
          location,
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
    location: "server" as const,
    inputSchema: {
      type: "object" as const,
      properties: {
        expression: { type: "string", description: "Math expression" },
      },
      required: ["expression"],
    },
    handler: async (params: Record<string, unknown>) => {
      const expression = readStringParam(params, "expression");
      try {
        const result = Function(`"use strict"; return (${expression})`)();
        return { success: true, data: { result } };
      } catch {
        return { success: false, error: "Invalid expression" };
      }
    },
  },
];
