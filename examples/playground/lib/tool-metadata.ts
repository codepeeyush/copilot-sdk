import type { ToolMetadata } from "./types";

export const toolMetadata: Record<string, ToolMetadata> = {
  captureScreenshot: {
    name: "captureScreenshot",
    displayName: "Screenshot",
    description:
      "Capture a screenshot of the current page. Useful for debugging UI issues or sharing what you see.",
    suggestedQuery: "Take a screenshot of this page",
    codeSnippet: `import { builtinTools } from "@yourgpt/copilot-sdk/core";
import { useTools } from "@yourgpt/copilot-sdk/react";

// Register built-in screenshot tool
useTools({
  capture_screenshot: builtinTools.capture_screenshot,
});`,
  },
  getConsoleLogs: {
    name: "getConsoleLogs",
    displayName: "Console Logs",
    description:
      "Get recent console logs from the browser. Helpful for debugging errors and understanding application state.",
    suggestedQuery: "Check the console for any errors",
    codeSnippet: `import { builtinTools } from "@yourgpt/copilot-sdk/core";
import { useTools } from "@yourgpt/copilot-sdk/react";

// Register built-in console logs tool
useTools({
  get_console_logs: builtinTools.get_console_logs,
});`,
  },
  updateCounter: {
    name: "updateCounter",
    displayName: "Counter",
    description:
      "Update the dashboard counter. Use this to increment, decrement, or reset the counter value.",
    suggestedQuery: "Increase the counter by 5",
    codeSnippet: `useTool({
  name: "updateCounter",
  description: "Update the dashboard counter",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["increment", "decrement", "reset"],
      },
    },
    required: ["action"],
  },
  handler: async ({ action }) => {
    // Handle counter update
    return { success: true, newValue: counter };
  },
});`,
  },
  updatePreference: {
    name: "updatePreference",
    displayName: "Theme",
    description:
      "Change the app theme. Supports dark mode, light mode, or system preference.",
    suggestedQuery: "Switch to dark mode",
    codeSnippet: `useTool({
  name: "updatePreference",
  description: "Update the app theme",
  inputSchema: {
    type: "object",
    properties: {
      preference: {
        type: "string",
        enum: ["dark", "light", "system"],
      },
    },
    required: ["preference"],
  },
  handler: async ({ preference }) => {
    setTheme(preference); // Uses next-themes
    return { success: true, preference };
  },
});`,
  },
  updateCart: {
    name: "updateCart",
    displayName: "Cart",
    description:
      "Update shopping cart items. Can add items, remove items, or clear the entire cart.",
    suggestedQuery: "Add 3 items to my cart",
    codeSnippet: `useTool({
  name: "updateCart",
  description: "Update shopping cart items",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["add", "remove", "clear"],
      },
      count: {
        type: "number",
        description: "Number of items",
      },
    },
    required: ["action"],
  },
  handler: async ({ action, count }) => {
    // Handle cart update
    return { success: true, newCount: cartItems };
  },
});`,
  },
};
