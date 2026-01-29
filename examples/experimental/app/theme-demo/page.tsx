"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";

// Import SDK base styles + all themes
import "@yourgpt/copilot-sdk/ui/styles.css";
import "@yourgpt/copilot-sdk/ui/themes/vercel.css";
import "@yourgpt/copilot-sdk/ui/themes/posthog.css";
import "@yourgpt/copilot-sdk/ui/themes/linear.css";
import "@yourgpt/copilot-sdk/ui/themes/claude.css";
import "@yourgpt/copilot-sdk/ui/themes/supabase.css";
import "@yourgpt/copilot-sdk/ui/themes/twitter.css";
import "@yourgpt/copilot-sdk/ui/themes/catppuccin.css";
import "@yourgpt/copilot-sdk/ui/themes/modern-minimal.css";

// Override Tailwind's @theme mappings to use CSS variable inheritance
const themeOverrideStyles = `
  .csdk-theme-vercel,
  .csdk-theme-posthog,
  .csdk-theme-linear,
  .csdk-theme-claude,
  .csdk-theme-supabase,
  .csdk-theme-twitter,
  .csdk-theme-catppuccin,
  .csdk-theme-modern {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
  }
`;

const themes = [
  {
    name: "Default",
    class: "",
    description: "Neutral shadcn default",
    primary: "#18181b",
  },
  {
    name: "Claude",
    class: "csdk-theme-claude",
    description: "Warm, earthy AI theme",
    primary: "#c96442",
  },
  {
    name: "Vercel",
    class: "csdk-theme-vercel",
    description: "Monochrome, minimal",
    primary: "#000000",
  },
  {
    name: "Supabase",
    class: "csdk-theme-supabase",
    description: "Green developer theme",
    primary: "#72e3ad",
  },
  {
    name: "Twitter",
    class: "csdk-theme-twitter",
    description: "Bold blue, rounded",
    primary: "#1e9df1",
  },
  {
    name: "Linear",
    class: "csdk-theme-linear",
    description: "Purple sophistication",
    primary: "#5e4bbd",
  },
  {
    name: "PostHog",
    class: "csdk-theme-posthog",
    description: "Yellow NeoBrutalism",
    primary: "#d4a017",
  },
  {
    name: "Catppuccin",
    class: "csdk-theme-catppuccin",
    description: "Community favorite",
    primary: "#8839ef",
  },
  {
    name: "Modern",
    class: "csdk-theme-modern",
    description: "Clean tech blue",
    primary: "#3b82f6",
  },
];

function ThemeCard({ theme }: { theme: (typeof themes)[0] }) {
  return (
    <div className={`${theme.class} h-full`}>
      <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
        {/* Theme info header */}
        <div className="p-3 border-b bg-card flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: theme.primary }}
          />
          <div className="min-w-0">
            <h2 className="font-semibold text-card-foreground text-sm">
              {theme.name}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {theme.description}
            </p>
          </div>
        </div>

        {/* Copilot Chat */}
        <div className="flex-1 min-h-0">
          <CopilotProvider runtimeUrl="/api/chat/openai">
            <CopilotChat
              placeholder={`Message ${theme.name}...`}
              showPoweredBy={false}
              className="h-full"
            />
          </CopilotProvider>
        </div>
      </div>
    </div>
  );
}

export default function ThemeDemo() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeOverrideStyles }} />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-center">
              Copilot SDK Themes
            </h1>
            <p className="text-muted-foreground text-sm text-center mt-1">
              {themes.length} themes available •{" "}
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
                Cmd+J
              </kbd>{" "}
              toggle dark mode
            </p>
          </div>
        </header>

        {/* Theme Grid */}
        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div key={theme.name} className="h-[500px]">
                <ThemeCard theme={theme} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
