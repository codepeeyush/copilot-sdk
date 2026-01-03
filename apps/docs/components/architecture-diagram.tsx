"use client";

import {
  MessageSquare,
  Wrench,
  Database,
  Server,
  Cpu,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-gradient-to-b from-card/50 to-card p-6 md:p-8">
      {/* Your App Container */}
      <div className="rounded-lg border border-border bg-background/50 p-4 md:p-6">
        <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your React App
        </div>

        {/* CopilotProvider */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 md:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <div className="size-2 rounded-full bg-primary" />
            CopilotProvider
          </div>

          {/* Frontend Components */}
          <div className="grid gap-3 md:grid-cols-3">
            <ComponentBox
              icon={<MessageSquare className="size-4" />}
              title="CopilotChat"
              description="Chat UI"
            />
            <ComponentBox
              icon={<Wrench className="size-4" />}
              title="Tools"
              description="Frontend"
            />
            <ComponentBox
              icon={<Database className="size-4" />}
              title="Context"
              description="App State"
            />
          </div>
        </div>

        {/* Connection Arrow */}
        <div className="flex justify-center py-4">
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ArrowUpDown className="size-5" />
            <span className="text-xs">HTTP Stream</span>
          </div>
        </div>

        {/* Backend */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5">
            <Server className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">/api/chat</span>
            <span className="text-xs text-muted-foreground">(Backend)</span>
          </div>
        </div>

        {/* Connection Arrow */}
        <div className="flex justify-center py-4">
          <ArrowDown className="size-5 text-muted-foreground" />
        </div>

        {/* LLM Provider */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-2.5">
            <Cpu className="size-4 text-orange-500" />
            <span className="text-sm font-medium">LLM Provider</span>
            <span className="text-xs text-muted-foreground">
              (OpenAI, Anthropic, etc)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentBox({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}
