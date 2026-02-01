"use client";

import { useState, useMemo, useEffect } from "react";
import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { ModelSelector } from "@/components/ModelSelector";
import { DEFAULT_MODEL } from "@/lib/models";
import { ExternalLink, Github, Terminal, Copy, Check } from "lucide-react";

export default function OpenRouterDemo() {
  const [mounted, setMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("OPENROUTER_API_KEY=sk-or-...");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runtimeUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("model", selectedModel);
    return `/api/chat?${params.toString()}`;
  }, [selectedModel]);

  if (!mounted) return null;

  return (
    <div className="dark h-screen flex bg-background text-foreground">
      {/* Left Sidebar */}
      <aside className="w-80 flex-none border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold">OpenRouter Demo</h1>
              <p className="text-xs text-muted-foreground">
                Access 500+ AI models with one API
              </p>
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="p-5 border-b border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
            Model
          </label>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>

        {/* Setup Guide */}
        <div className="p-5 flex-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
            Setup
          </label>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex-none w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                1
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">Get your API key</p>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                >
                  openrouter.ai/keys
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex-none w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                2
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">Add to .env.local</p>
                <div className="mt-2 relative">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md font-mono text-xs text-muted-foreground">
                    <Terminal className="h-3 w-3 flex-none" />
                    <code className="truncate">
                      OPENROUTER_API_KEY=sk-or-...
                    </code>
                    <button
                      onClick={handleCopy}
                      className="flex-none ml-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex-none w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                3
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  Restart the dev server
                </p>
                <div className="mt-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md font-mono text-xs text-muted-foreground">
                    <Terminal className="h-3 w-3 flex-none" />
                    <code>pnpm dev</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="p-5 border-t border-border space-y-2">
          <a
            href="https://openrouter.ai/models"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Explore all models
          </a>
          <a
            href="https://github.com/YourGPT/copilot-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </aside>

      {/* Right Side - Chat */}
      <main className="flex-1 min-w-0">
        <CopilotProvider
          key={selectedModel}
          runtimeUrl={runtimeUrl}
          maxIterations={5}
        >
          <CopilotChat className="h-full" />
        </CopilotProvider>
      </main>
    </div>
  );
}
