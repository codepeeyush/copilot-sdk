"use client";

import { memo } from "react";
import { Terminal, Palette, Cpu } from "lucide-react";
import type { CopilotTheme } from "@/lib/types";
import { themes } from "@/lib/constants";

interface ConfigSectionProps {
  copilotTheme: CopilotTheme;
  onThemeChange: (theme: CopilotTheme) => void;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

function ConfigSectionComponent({
  copilotTheme,
  onThemeChange,
  systemPrompt,
  onSystemPromptChange,
}: ConfigSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Configuration
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Theme */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              theme
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono transition-all ${
                  copilotTheme === t.id
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-transparent"
                    : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: t.accent }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* System Prompt */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              systemPrompt
            </span>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            className="w-full h-24 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 resize-none focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder="// System prompt..."
          />
        </div>
      </div>
    </section>
  );
}

export const ConfigSection = memo(ConfigSectionComponent);
