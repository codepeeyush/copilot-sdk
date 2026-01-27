"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

export type CopilotTheme =
  | "claude"
  | "linear"
  | "vercel"
  | "twitter"
  | "catppuccin"
  | "supabase"
  | "modern-minimal"
  | "posthog";

interface ThemeSwitcherProps {
  currentTheme: CopilotTheme;
  onThemeChange: (theme: CopilotTheme) => void;
}

const themes: { id: CopilotTheme; label: string; color: string }[] = [
  { id: "claude", label: "Claude", color: "bg-orange-500" },
  { id: "linear", label: "Linear", color: "bg-purple-600" },
  { id: "vercel", label: "Vercel", color: "bg-gray-900" },
  { id: "twitter", label: "Twitter", color: "bg-blue-500" },
  { id: "catppuccin", label: "Catppuccin", color: "bg-pink-400" },
  { id: "supabase", label: "Supabase", color: "bg-emerald-500" },
  { id: "modern-minimal", label: "Minimal", color: "bg-slate-500" },
  { id: "posthog", label: "PostHog", color: "bg-yellow-500" },
];

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
}: ThemeSwitcherProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Palette className="h-4 w-4" />
        SDK Theme
      </div>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant={currentTheme === theme.id ? "default" : "outline"}
            size="sm"
            onClick={() => onThemeChange(theme.id)}
            className={cn(
              "gap-2",
              currentTheme === theme.id && "ring-2 ring-offset-2",
            )}
          >
            <span className={cn("h-3 w-3 rounded-full", theme.color)} />
            {theme.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
