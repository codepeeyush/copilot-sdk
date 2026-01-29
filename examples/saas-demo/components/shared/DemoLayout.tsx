"use client";

import { cn } from "@/lib/utils";

interface DemoLayoutProps {
  theme: "posthog" | "modern-minimal" | "linear" | "catppuccin" | "default";
  children: React.ReactNode;
  className?: string;
}

// Themes that need dark mode
const darkThemes = ["linear", "catppuccin"];

// Theme-specific page background
const themePageStyles: Record<string, string> = {
  posthog: "bg-yellow-50/30 dark:bg-background",
  "modern-minimal": "bg-gray-50 dark:bg-background",
  linear: "bg-purple-950",
  catppuccin: "bg-[#11111b]",
  default: "bg-background",
};

export function DemoLayout({ theme, children, className }: DemoLayoutProps) {
  const isDarkTheme = darkThemes.includes(theme);
  const pageStyle = themePageStyles[theme] || "";

  return (
    <div
      className={cn(
        "min-h-screen",
        isDarkTheme && "dark",
        pageStyle,
        className,
      )}
    >
      <main>{children}</main>
    </div>
  );
}
