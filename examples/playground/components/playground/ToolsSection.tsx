"use client";

import { memo } from "react";
import { Zap } from "lucide-react";
import type { ToolsEnabledConfig, ToolKey } from "@/lib/types";
import { StatusDot } from "./StatusDot";

// Hoisted outside component to prevent re-renders
const toolKeys: ToolKey[] = ["updateCounter", "updatePreference", "updateCart"];

interface ToolsSectionProps {
  toolsEnabled: ToolsEnabledConfig;
  onToggle: (key: ToolKey) => void;
}

function ToolsSectionComponent({ toolsEnabled, onToggle }: ToolsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Registered Tools
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {toolKeys.map((tool) => (
          <button
            key={tool}
            onClick={() => onToggle(tool)}
            className={`relative overflow-hidden rounded-lg border p-3 text-left transition-all ${
              toolsEnabled[tool]
                ? "border-emerald-400/50 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5"
                : "border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-700"
            }`}
          >
            {toolsEnabled[tool] ? (
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl rounded-full" />
            ) : null}
            <div className="relative flex items-center justify-between mb-2">
              <StatusDot
                active={toolsEnabled[tool]}
                pulse={toolsEnabled[tool]}
              />
              <span
                className={`text-[10px] font-mono ${toolsEnabled[tool] ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-600"}`}
              >
                {toolsEnabled[tool] ? "ACTIVE" : "OFF"}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate">
              {tool}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export const ToolsSection = memo(ToolsSectionComponent);
