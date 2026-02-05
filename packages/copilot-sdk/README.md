<a href="https://copilot-sdk.yourgpt.ai">
  <img src="https://copilot-sdk.yourgpt.ai/images/yourgpt-copilot-sdk-npm.png" alt="YourGPT Copilot SDK" width="100%" />
</a>

# Copilot SDK

Build AI Copilots for Your Product.

Production-ready AI Copilots for any product. Connect any LLM, deploy on your infrastructure, own your data.

**Documentation:** [copilot-sdk.yourgpt.ai](https://copilot-sdk.yourgpt.ai)

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

## Examples

Explore real-world implementations and demo projects.

<a href="https://copilot-sdk.yourgpt.ai/docs/examples">
  <img src="https://copilot-sdk.yourgpt.ai/images/debug-assistant-demo.webp" alt="Debug Assistant" width="100%" style="border-radius: 12px;" />
</a>

<a href="https://copilot-sdk.yourgpt.ai/docs/examples">
  <img src="https://copilot-sdk.yourgpt.ai/images/copilot-sdk-support-demo.png" alt="Support Ticket System" width="100%" style="border-radius: 12px;" />
</a>

<a href="https://copilot-sdk.yourgpt.ai/docs/examples">
  <img src="https://copilot-sdk.yourgpt.ai/images/saas-demo.webp" alt="SaaS Application" width="100%" style="border-radius: 12px;" />
</a>

**[View all examples →](https://copilot-sdk.yourgpt.ai/docs/examples)**

## License

MIT
