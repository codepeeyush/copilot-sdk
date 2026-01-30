// Metadata for configuration options in the Control Panel

export const configMetadata = {
  theme: {
    description:
      "Choose from pre-built visual themes that customize the Copilot's appearance including colors, typography, and component styling.",
    tip: "Each theme is designed for different use cases - try 'modern-minimal' for a clean SaaS look.",
    codeSnippet: `<Copilot
  theme="modern-minimal"
  // or use a custom theme object
  theme={{
    colors: {
      primary: "#6366f1",
      background: "#ffffff"
    }
  }}
/>`,
    codeLabel: "Theme Usage",
  },

  layout: {
    description:
      "Select a layout template that changes the overall structure of the Copilot interface. Each layout is optimized for different integration scenarios.",
    tip: "Use 'SaaS' layout for dashboard integrations, 'Support' for help desk scenarios.",
    codeSnippet: `<Copilot
  layout="saas"
  // Layouts control header, footer,
  // and message arrangement
/>`,
    codeLabel: "Layout Usage",
  },

  model: {
    description:
      "Select the AI model provider and specific model to power your Copilot. Different models have varying capabilities, speeds, and costs.",
    tip: "GPT-4o is great for complex reasoning, Claude for nuanced conversations, Gemini for speed.",
    codeSnippet: `import { createOpenAI } from "@ai-sdk/openai";

const provider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use in your API route
const model = provider("gpt-4o");`,
    codeLabel: "Provider Setup",
  },

  systemPrompt: {
    description:
      "Define the AI's personality, knowledge boundaries, and behavioral guidelines. This prompt is sent with every conversation to shape responses.",
    tip: "Be specific about what the AI should and shouldn't do. Include your product context.",
    codeSnippet: `<Copilot
  systemPrompt={\`You are a helpful assistant
for [Product Name]. You help users with:
- Account management
- Billing questions
- Feature usage

Never discuss competitors or pricing
outside our published rates.\`}
/>`,
    codeLabel: "System Prompt",
  },

  generativeUI: {
    weather: {
      description:
        "Enable dynamic weather cards that render when the AI fetches weather information. Uses the getWeather tool to display temperature, conditions, and forecasts.",
      tip: "Try asking: 'What's the weather in San Francisco?'",
      codeSnippet: `useTool({
  name: "getWeather",
  description: "Get weather for a location",
  inputSchema: {
    type: "object",
    properties: {
      location: { type: "string" }
    }
  },
  handler: async ({ location }) => {
    // Fetch weather data
    return { temperature: 72, condition: "Sunny" };
  },
  render: ({ result }) => <WeatherCard {...result} />
});`,
      codeLabel: "Weather Tool",
    },
    stock: {
      description:
        "Enable dynamic stock price cards that render real-time market data. Uses the getStockPrice tool to display prices, changes, and volume.",
      tip: "Try asking: 'What's the stock price of AAPL?'",
      codeSnippet: `useTool({
  name: "getStockPrice",
  description: "Get stock price for a symbol",
  inputSchema: {
    type: "object",
    properties: {
      symbol: { type: "string" }
    }
  },
  handler: async ({ symbol }) => {
    // Fetch stock data
    return { price: 187.50, change: 2.5 };
  },
  render: ({ result }) => <StockCard {...result} />
});`,
      codeLabel: "Stock Tool",
    },
    notification: {
      description:
        "Enable the AI to create notification messages that appear in the dashboard queue. Uses the addNotification tool.",
      tip: "Try asking: 'Send me a notification about the meeting'",
      codeSnippet: `useTool({
  name: "addNotification",
  description: "Add a notification message",
  inputSchema: {
    type: "object",
    properties: {
      message: { type: "string" }
    }
  },
  handler: async ({ message }) => {
    addToQueue(message);
    return { success: true };
  },
  render: ({ args }) => <NotificationCard message={args.message} />
});`,
      codeLabel: "Notification Tool",
    },
  },

  context: {
    description:
      "Demonstrate how useAIContext hook provides real-time user data to the AI. The AI can access this context to personalize responses.",
    tip: "Select different users to see how context changes AI responses.",
    codeSnippet: `import { useAIContext } from "@yourgpt/copilot-sdk/react";

function UserProvider({ children }) {
  useAIContext({
    name: "userContext",
    description: "Current user information",
    value: {
      name: user.name,
      plan: user.plan,
      credits: user.credits
    }
  });

  return children;
}`,
    codeLabel: "useAIContext Hook",
  },
};
