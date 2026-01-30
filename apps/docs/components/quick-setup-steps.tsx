"use client";

import { cn } from "@/lib/utils";
import { Terminal, Server, Sparkles, Check, Copy } from "lucide-react";
import { useState } from "react";

interface StepData {
  title: string;
  description: string;
  code: string;
  language: string;
}

const steps: StepData[] = [
  {
    title: "Install",
    description: "Add the SDK packages",
    language: "bash",
    code: "pnpm add @yourgpt/copilot-sdk @yourgpt/llm-sdk openai",
  },
  {
    title: "Backend",
    description: "Create your API route",
    language: "typescript",
    code: `import { streamText } from '@yourgpt/llm-sdk';
import { openai } from '@yourgpt/llm-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai('gpt-5.2'),
    messages,
  });
  return result.toTextStreamResponse();
}`,
  },
  {
    title: "Frontend",
    description: "Add the chat component",
    language: "tsx",
    code: `import { CopilotProvider } from '@yourgpt/copilot-sdk/react';
import { CopilotChat } from '@yourgpt/copilot-sdk/ui';

export default function App() {
  return (
    <CopilotProvider runtimeUrl="/api/chat">
      <CopilotChat />
    </CopilotProvider>
  );
}`,
  },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-lg border border-fd-border bg-fd-secondary/30 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-fd-border/50 bg-fd-secondary/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/15" />
            <div className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/15" />
            <div className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/15" />
          </div>
          <span className="text-[10px] font-medium text-fd-muted-foreground/70 uppercase tracking-wider ml-2">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-fd-muted-foreground/10"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-fd-muted-foreground" />
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="text-fd-foreground/90 font-mono">{code}</code>
      </pre>
    </div>
  );
}

function StepCard({
  step,
  index,
  isLast,
}: {
  step: StepData;
  index: number;
  isLast: boolean;
}) {
  const icons = [
    <Terminal key="terminal" className="h-4 w-4" />,
    <Server key="server" className="h-4 w-4" />,
    <Sparkles key="sparkles" className="h-4 w-4" />,
  ];

  return (
    <div className="relative flex gap-5">
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        {/* Connector line - top */}
        {index > 0 && (
          <div className="absolute bottom-1/2 w-px h-8 -translate-y-4 bg-gradient-to-b from-fd-primary/40 to-fd-primary/60" />
        )}

        {/* Step circle */}
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-fd-primary/20 blur-md" />

          {/* Circle */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-fd-primary/40 bg-fd-background text-fd-primary shadow-sm">
            {icons[index]}
          </div>

          {/* Number badge */}
          <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-fd-primary text-[9px] font-bold text-fd-primary-foreground shadow-sm">
            {index + 1}
          </div>
        </div>

        {/* Connector line - bottom */}
        {!isLast && (
          <div className="flex-1 w-px bg-gradient-to-b from-fd-primary/60 via-fd-primary/30 to-fd-border/50 min-h-[2rem]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-fd-foreground mb-0.5">
            {step.title}
          </h3>
          <p className="text-xs text-fd-muted-foreground">{step.description}</p>
        </div>

        <CodeBlock code={step.code} language={step.language} />
      </div>
    </div>
  );
}

export function QuickSetupSteps({ className }: { className?: string }) {
  return (
    <div className={cn("not-prose my-10", className)}>
      {/* Header card */}
      <div className="relative mb-8 rounded-xl overflow-hidden border border-fd-border">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-gradient-to-r from-fd-primary/[0.04] via-transparent to-fd-primary/[0.04]" />
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 25%, currentColor 25%, currentColor 26%, transparent 26%, transparent 75%, currentColor 75%, currentColor 76%, transparent 76%)`,
            backgroundSize: "8px 8px",
            color: "var(--color-fd-muted-foreground)",
          }}
        />

        <div className="relative flex items-center px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fd-primary/10 border border-fd-primary/20 text-fd-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-fd-foreground m-0">
                Quick Setup
              </h2>
              <p className="text-xs text-fd-muted-foreground m-0">
                Three steps to your AI copilot
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="pl-1">
        {steps.map((step, index) => (
          <StepCard
            key={step.title}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* Completion card */}
      <div className="relative mt-4 ml-[3.75rem] rounded-xl overflow-hidden border border-green-500/30 bg-green-500/[0.04]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-500 border border-green-500/20">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-fd-foreground m-0">
              Ready to launch
            </p>
            <p className="text-xs text-fd-muted-foreground m-0">
              Run{" "}
              <code className="rounded bg-fd-secondary/80 px-1.5 py-0.5 font-mono text-fd-foreground">
                pnpm dev
              </code>{" "}
              and open localhost:3000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
