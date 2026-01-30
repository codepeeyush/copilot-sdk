"use client";

import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CodeSnippet } from "./CodeSnippet";

interface ConfigInfoHoverCardProps {
  description: string;
  tip?: string;
  codeSnippet?: string;
  codeLabel?: string;
}

export function ConfigInfoHoverCard({
  description,
  tip,
  codeSnippet,
  codeLabel = "Example",
}: ConfigInfoHoverCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 overflow-hidden"
        side="right"
        align="start"
        sideOffset={8}
      >
        <div className="p-4 space-y-3">
          {/* Description */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
              Description
            </p>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tip */}
          {tip && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                Tip
              </p>
              <div className="px-3 py-2 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {tip}
                </p>
              </div>
            </div>
          )}

          {/* Code Snippet */}
          {codeSnippet && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                {codeLabel}
              </p>
              <CodeSnippet code={codeSnippet} className="max-h-48" />
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
