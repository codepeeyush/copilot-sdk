# YourGPT Copilot - Next.js Demo

A demo application showcasing the YourGPT Copilot SDK features.

## Features

- Chat Window component
- Chat Popup component
- Custom hooks usage
- Action registration
- Streaming responses

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment file and add your API keys:

```bash
cp .env.example .env
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using with Knowledge Base

To enable the knowledge base extension:

```tsx
import { YourGPTProvider } from "@yourgpt/react";
import { ChatWindow } from "@yourgpt/ui";
import { KnowledgeBaseExtension } from "@yourgpt/knowledge";

function App() {
  return (
    <YourGPTProvider
      config={{
        provider: "openai",
        apiKey: process.env.OPENAI_API_KEY,
      }}
      extensions={[
        KnowledgeBaseExtension({
          apiKey: process.env.YOURGPT_API_KEY,
          botId: process.env.YOURGPT_BOT_ID,
          autoRetrieve: true,
        }),
      ]}
    >
      <ChatWindow showSources={true} />
    </YourGPTProvider>
  );
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # Chat API endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main demo page
```

## Learn More

- [YourGPT Copilot Documentation](https://docs.yourgpt.ai/copilot)
- [API Reference](https://docs.yourgpt.ai/api)
