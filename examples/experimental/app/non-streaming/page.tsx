"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import "@yourgpt/copilot-sdk/ui/styles.css";
import "@yourgpt/copilot-sdk/ui/themes/claude.css";

export default function NonStreamingPage() {
  return (
    <div className="h-screen w-full flex flex-col">
      <header className="p-4 border-b bg-card">
        <h1 className="text-lg font-semibold">Non-Streaming Demo</h1>
        <p className="text-sm text-muted-foreground">
          Using Anthropic Claude with streaming disabled
        </p>
      </header>

      <div className="flex-1">
        <CopilotProvider
          runtimeUrl="/api/chat/non-streaming"
          streaming={false}
          debug={true}
        >
          <CopilotChat
            className="h-full csdk-theme-claude"
            placeholder="Ask me anything (non-streaming)..."
            suggestions={[
              "What is the capital of France?",
              "Explain quantum computing briefly",
              "Write a haiku about coding",
            ]}
          />
        </CopilotProvider>
      </div>
    </div>
  );
}
