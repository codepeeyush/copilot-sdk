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

```css
/* app/globals.css */
@import "tailwindcss";
@source "node_modules/@yourgpt/copilot-sdk/src/**/*.{ts,tsx}";
@custom-variant dark (&:is(.dark *));
```

## Theming

Works automatically with existing shadcn/ui setup. For projects without shadcn:

```tsx
import "@yourgpt/copilot-sdk/ui/styles.css";
import "@yourgpt/copilot-sdk/ui/themes/claude.css"; // Optional preset

<div className="csdk-theme-claude">
  <CopilotChat />
</div>;
```

**8 theme presets available:** Claude, Vercel, Supabase, Twitter, Linear, PostHog, Catppuccin, Modern

## Documentation

Visit [copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai) for full documentation including:

- Theme customization & CSS variables
- Semantic CSS classes (`csdk-*`)
- Creating custom themes
- Dark mode support

## License

MIT
