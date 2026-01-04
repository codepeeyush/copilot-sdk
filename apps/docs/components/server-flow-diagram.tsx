"use client";

import { Monitor, Server, ArrowRight } from "lucide-react";

export function ServerFlowDiagram() {
  return (
    <div className="my-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
      {/* Frontend */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <Monitor className="size-5 text-primary" />
        <div>
          <div className="text-sm font-medium">Frontend</div>
          <div className="text-xs text-muted-foreground">React UI</div>
        </div>
      </div>

      {/* Arrow with labels */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs text-muted-foreground">POST /api/chat</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <ArrowRight className="size-4" />
        </div>
        <div className="text-xs text-muted-foreground">Stream Response</div>
      </div>

      {/* Backend */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <Server className="size-5 text-orange-500" />
        <div>
          <div className="text-sm font-medium">Backend</div>
          <div className="text-xs text-muted-foreground">Your API</div>
        </div>
      </div>
    </div>
  );
}
