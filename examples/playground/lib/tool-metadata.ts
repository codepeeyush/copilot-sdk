import type { ToolMetadata } from "./types";

export const toolMetadata: Record<string, ToolMetadata> = {
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
    displayName: "Preference",
    description:
      "Update user preference setting. Common values: dark, light, auto, system.",
    suggestedQuery: "Set my preference to dark mode",
    codeSnippet: `useTool({
  name: "updatePreference",
  description: "Update user preference setting",
  inputSchema: {
    type: "object",
    properties: {
      preference: {
        type: "string",
        description: "The new preference value",
      },
    },
    required: ["preference"],
  },
  handler: async ({ preference }) => {
    // Handle preference update
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
