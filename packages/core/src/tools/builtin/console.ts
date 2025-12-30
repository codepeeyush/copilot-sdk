/**
 * Built-in Console Logs Tool
 *
 * A pre-configured tool that retrieves browser console logs.
 * Can be used with useTools() hook in React.
 */

import { tool, success, failure } from "../../types/tools";
import {
  getConsoleLogs,
  formatLogsForAI,
  isConsoleCaptureActive,
  startConsoleCapture,
} from "../console";

/**
 * Console logs tool - retrieves browser console output
 *
 * @example
 * ```tsx
 * import { consoleLogsTool } from '@yourgpt/copilot-sdk-core';
 *
 * // In your component
 * useTools({
 *   get_console_logs: consoleLogsTool,
 * });
 * ```
 */
export const consoleLogsTool = tool<{ limit?: number; types?: string[] }>({
  description:
    "Get recent console logs from the browser. Use this when debugging JavaScript errors, checking for warnings, or understanding what's happening in the application.",
  location: "client",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of logs to return (default: 50)",
      },
      types: {
        type: "array",
        description:
          "Filter by log types: 'error', 'warn', 'info', 'log', 'debug'",
        items: {
          type: "string",
          enum: ["error", "warn", "info", "log", "debug"],
        },
      },
    },
    required: [],
  },
  needsApproval: true,
  approvalMessage: "Allow AI to access browser console logs?",
  handler: async (params) => {
    try {
      // Start capture if not already active
      if (!isConsoleCaptureActive()) {
        startConsoleCapture();
      }

      const logs = getConsoleLogs({
        limit: params.limit || 50,
        types: params.types as
          | ("error" | "warn" | "info" | "log" | "debug")[]
          | undefined,
      });

      const formattedLogs = formatLogsForAI(logs.logs);

      return success(
        {
          logs: formattedLogs,
          count: logs.logs.length,
          totalCaptured: logs.totalCaptured,
        },
        `Retrieved ${logs.logs.length} console logs`,
      );
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Failed to get console logs",
      );
    }
  },
});

/**
 * Create a custom console logs tool with different options
 */
export function createConsoleLogsTool(options?: {
  needsApproval?: boolean;
  approvalMessage?: string;
  defaultLimit?: number;
}) {
  return tool<{ limit?: number; types?: string[] }>({
    ...consoleLogsTool,
    needsApproval: options?.needsApproval ?? true,
    approvalMessage:
      options?.approvalMessage ?? "Allow AI to access browser console logs?",
    handler: async (params) => {
      try {
        if (!isConsoleCaptureActive()) {
          startConsoleCapture();
        }

        const logs = getConsoleLogs({
          limit: params.limit || options?.defaultLimit || 50,
          types: params.types as
            | ("error" | "warn" | "info" | "log" | "debug")[]
            | undefined,
        });

        const formattedLogs = formatLogsForAI(logs.logs);

        return success(
          {
            logs: formattedLogs,
            count: logs.logs.length,
            totalCaptured: logs.totalCaptured,
          },
          `Retrieved ${logs.logs.length} console logs`,
        );
      } catch (error) {
        return failure(
          error instanceof Error ? error.message : "Failed to get console logs",
        );
      }
    },
  });
}
