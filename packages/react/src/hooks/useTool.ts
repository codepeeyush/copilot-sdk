"use client";

import { useEffect, useRef } from "react";
import type {
  ToolDefinition,
  ToolResponse,
  ToolContext,
  ToolRenderProps,
} from "@yourgpt/core";
import { useYourGPTContext } from "../context/YourGPTContext";

/**
 * Configuration for registering a tool
 */
export interface UseToolConfig<TParams = Record<string, unknown>> {
  /** Unique tool name */
  name: string;
  /** Tool description for LLM */
  description: string;
  /** JSON Schema for input parameters */
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  /** Handler function */
  handler: (
    params: TParams,
    context?: ToolContext,
  ) => Promise<ToolResponse> | ToolResponse;
  /** Optional render function for UI */
  render?: (props: ToolRenderProps<TParams>) => React.ReactNode;
  /** Whether the tool is available */
  available?: boolean;
}

/**
 * Register a client-side tool
 *
 * This hook registers a tool that can be called by the AI during a conversation.
 * The tool will execute on the client side.
 *
 * @example
 * ```tsx
 * useTool({
 *   name: "navigate_to_page",
 *   description: "Navigate to a specific page in the app",
 *   inputSchema: {
 *     type: "object",
 *     properties: {
 *       path: { type: "string", description: "The path to navigate to" },
 *     },
 *     required: ["path"],
 *   },
 *   handler: async ({ path }) => {
 *     router.push(path);
 *     return { success: true, message: `Navigated to ${path}` };
 *   },
 * });
 * ```
 */
export function useTool<TParams = Record<string, unknown>>(
  config: UseToolConfig<TParams>,
  dependencies: unknown[] = [],
): void {
  const { registerTool, unregisterTool } = useYourGPTContext();
  const configRef = useRef(config);

  // Update ref when config changes
  configRef.current = config;

  useEffect(() => {
    // Create tool definition
    const tool: ToolDefinition = {
      name: config.name,
      description: config.description,
      location: "client",
      inputSchema: config.inputSchema as ToolDefinition["inputSchema"],
      handler: async (params, context) => {
        return configRef.current.handler(params as TParams, context);
      },
      render: config.render as ToolDefinition["render"],
      available: config.available ?? true,
    };

    // Register tool
    registerTool(tool);

    // Cleanup on unmount
    return () => {
      unregisterTool(config.name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.name, ...dependencies]);
}

/**
 * Register multiple client-side tools
 *
 * @example
 * ```tsx
 * useTools([
 *   { name: "navigate", ... },
 *   { name: "open_modal", ... },
 * ]);
 * ```
 */
export function useTools<TParams = Record<string, unknown>>(
  tools: UseToolConfig<TParams>[],
  dependencies: unknown[] = [],
): void {
  const { registerTool, unregisterTool } = useYourGPTContext();
  const toolsRef = useRef(tools);

  // Update ref when tools change
  toolsRef.current = tools;

  useEffect(() => {
    // Register all tools
    const toolNames: string[] = [];

    for (const config of tools) {
      const tool: ToolDefinition = {
        name: config.name,
        description: config.description,
        location: "client",
        inputSchema: config.inputSchema as ToolDefinition["inputSchema"],
        handler: async (params, context) => {
          const currentConfig = toolsRef.current.find(
            (t) => t.name === config.name,
          );
          if (currentConfig) {
            return currentConfig.handler(params as TParams, context);
          }
          return { success: false, error: "Tool handler not found" };
        },
        available: config.available ?? true,
      };

      registerTool(tool);
      toolNames.push(config.name);
    }

    // Cleanup on unmount
    return () => {
      for (const name of toolNames) {
        unregisterTool(name);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools.map((t) => t.name).join(","), ...dependencies]);
}

export type { ToolDefinition, ToolResponse, ToolContext };
