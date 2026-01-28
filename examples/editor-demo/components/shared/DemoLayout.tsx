"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoLayoutProps {
  title: string;
  description?: string;
  theme: "posthog" | "modern-minimal" | "linear" | "catppuccin";
  children: React.ReactNode;
  className?: string;
}

// Themes that need dark mode
const darkThemes = ["linear", "catppuccin"];

// Theme-specific header styles
const themeHeaderStyles: Record<string, string> = {
  posthog:
    "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-900",
  "modern-minimal":
    "bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800",
  linear: "bg-purple-950 border-purple-800/50 text-white",
  catppuccin: "bg-[#1e1e2e] border-[#313244] text-[#cdd6f4]",
};

// Theme-specific page background
const themePageStyles: Record<string, string> = {
  posthog: "bg-yellow-50/30 dark:bg-background",
  "modern-minimal": "bg-gray-50 dark:bg-background",
  linear: "bg-purple-950",
  catppuccin: "bg-[#11111b]",
};

export function DemoLayout({
  title,
  theme,
  children,
  className,
}: DemoLayoutProps) {
  const isDarkTheme = darkThemes.includes(theme);
  const headerStyle = themeHeaderStyles[theme] || "";
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
      <header
        className={cn("border-b sticky top-0 z-50 px-4 py-2", headerStyle)}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity",
              isDarkTheme
                ? "text-white/70 hover:text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span
            className={cn(
              "font-medium text-sm",
              theme === "catppuccin" && "text-[#cdd6f4]",
              theme === "linear" && "text-white",
            )}
          >
            {title}
          </span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
