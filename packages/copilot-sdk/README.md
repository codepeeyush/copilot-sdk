# @yourgpt/copilot-sdk

Build AI copilots with app context awareness.

## Installation

```bash
npm install @yourgpt/copilot-sdk
```

## Usage

```tsx
// React hooks & provider
import {
  CopilotProvider,
  useTools,
  useAIContext,
} from "@yourgpt/copilot-sdk/react";

// UI components
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";

// Core types and utilities
import { tool, success, type ToolDefinition } from "@yourgpt/copilot-sdk/core";
```

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

## Subpath Exports

| Subpath  | Description                    |
| -------- | ------------------------------ |
| `/core`  | Types, utilities, tool helpers |
| `/react` | React hooks and provider       |
| `/ui`    | Pre-built UI components        |

## Documentation

Visit [https://copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)

## License

MIT
