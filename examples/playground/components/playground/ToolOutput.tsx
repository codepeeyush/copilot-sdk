"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";
import type { ToolState } from "@/lib/types";

interface ToolOutputProps {
  states: Record<string, ToolState>;
}

function ToolOutputComponent({ states }: ToolOutputProps) {
  const entries = Object.entries(states);
  if (entries.length === 0) return null;

  return (
    <div className="font-mono text-[11px] space-y-1 p-3 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-300 dark:border-zinc-800">
      {entries.map(([name, state]) => (
        <div key={name} className="flex items-center gap-2">
          <span className="text-zinc-400 dark:text-zinc-500">$</span>
          <span className="text-cyan-600 dark:text-cyan-400">{name}</span>
          {state.loading ? (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              running...
            </span>
          ) : state.lastResult ? (
            <span
              className={
                state.lastResult.success
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }
            >
              → {state.lastResult.message}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export const ToolOutput = memo(ToolOutputComponent);
