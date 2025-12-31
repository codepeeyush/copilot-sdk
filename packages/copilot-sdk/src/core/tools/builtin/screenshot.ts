/**
 * Built-in Screenshot Tool
 *
 * A pre-configured tool that captures screenshots of the user's viewport.
 * Can be used with useTools() hook in React.
 */

import { tool, success, failure } from "../../types/tools";
import { captureScreenshot, isScreenshotSupported } from "../screenshot";
import type { ScreenshotOptions } from "../types";

/**
 * Screenshot tool - captures the user's screen
 *
 * @example
 * ```tsx
 * import { screenshotTool } from '@yourgpt/copilot-sdk-core';
 *
 * // In your component
 * useTools({
 *   capture_screenshot: screenshotTool,
 * });
 * ```
 */
export const screenshotTool = tool<{ quality?: number }>({
  description:
    "Capture a screenshot of the user's current screen/viewport. Use this when the user asks you to look at their screen, see what they're seeing, help with visual issues, or debug UI problems.",
  location: "client",
  inputSchema: {
    type: "object",
    properties: {
      quality: {
        type: "number",
        description: "Image quality from 0 to 1 (default: 0.8)",
        minimum: 0,
        maximum: 1,
      },
    },
    required: [],
  },
  needsApproval: true,
  approvalMessage: "Allow AI to capture a screenshot of your screen?",
  handler: async (params) => {
    if (!isScreenshotSupported()) {
      return failure("Screenshot capture is not supported in this environment");
    }

    try {
      const options: ScreenshotOptions = {};
      if (params.quality !== undefined) {
        options.quality = params.quality;
      }

      const result = await captureScreenshot(options);

      // Return with addAsUserMessage flag so the provider adds it as a user message
      // This allows the AI to actually SEE the image through vision capabilities
      return {
        success: true,
        message: `Screenshot captured (${result.width}x${result.height}). The image is shared in the conversation.`,
        addAsUserMessage: true,
        data: {
          attachment: {
            type: "image" as const,
            data: result.data,
            mimeType: `image/${result.format}`,
            filename: "screenshot.png",
          },
          dimensions: {
            width: result.width,
            height: result.height,
          },
        },
      };
    } catch (error) {
      return failure(
        error instanceof Error ? error.message : "Screenshot capture failed",
      );
    }
  },
});

/**
 * Create a custom screenshot tool with different options
 */
export function createScreenshotTool(options?: {
  needsApproval?: boolean;
  approvalMessage?: string;
  defaultQuality?: number;
}) {
  return tool<{ quality?: number }>({
    ...screenshotTool,
    needsApproval: options?.needsApproval ?? true,
    approvalMessage:
      options?.approvalMessage ??
      "Allow AI to capture a screenshot of your screen?",
    handler: async (params) => {
      if (!isScreenshotSupported()) {
        return failure(
          "Screenshot capture is not supported in this environment",
        );
      }

      try {
        const result = await captureScreenshot({
          quality: params.quality ?? options?.defaultQuality ?? 0.8,
        });

        // Return with addAsUserMessage flag so the provider adds it as a user message
        return {
          success: true,
          message: `Screenshot captured (${result.width}x${result.height}). The image is shared in the conversation.`,
          addAsUserMessage: true,
          data: {
            attachment: {
              type: "image" as const,
              data: result.data,
              mimeType: `image/${result.format}`,
              filename: "screenshot.png",
            },
            dimensions: {
              width: result.width,
              height: result.height,
            },
          },
        };
      } catch (error) {
        return failure(
          error instanceof Error ? error.message : "Screenshot capture failed",
        );
      }
    },
  });
}
