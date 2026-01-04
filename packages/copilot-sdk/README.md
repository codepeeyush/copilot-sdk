# @yourgpt/copilot-sdk

Build AI Copilots for Your Product.

Production-ready AI Copilots for any product. Connect any LLM, deploy on your infrastructure, own your data.

## Installation

```bash
npm install @yourgpt/copilot-sdk @yourgpt/llm-sdk
```

## Quick Start

```tsx
import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import "@yourgpt/copilot-sdk/ui/styles.css";

function App() {
  return (
    <CopilotProvider runtimeUrl="/api/chat">
      <YourApp />
      <CopilotChat />
    </CopilotProvider>
  );
}
```

## Subpath Exports

| Subpath  | Description                    |
| -------- | ------------------------------ |
| `/react` | React hooks and provider       |
| `/ui`    | Pre-built UI components        |
| `/core`  | Types, utilities, tool helpers |

## Styling (Tailwind CSS v4)

Add the SDK source to your Tailwind config:

```css
/* app/globals.css */
@import "tailwindcss";

@source "node_modules/@yourgpt/copilot-sdk/src/**/*.{ts,tsx}";

@custom-variant dark (&:is(.dark *));
```

For theming, optionally import the default CSS variables:

```css
@import "@yourgpt/copilot-sdk/ui/styles.css";
```

## Documentation

Visit [copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)

## License

MIT
