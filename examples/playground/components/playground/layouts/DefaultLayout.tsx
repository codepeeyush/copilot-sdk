"use client";

import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import type { CopilotTheme } from "@/lib/types";

export interface LayoutProps {
  theme: CopilotTheme;
}

export function DefaultLayout({ theme }: LayoutProps) {
  return (
    <div
      className="h-full"
      data-csdk-theme={theme === "default" ? undefined : theme}
    >
      <CopilotChat
        placeholder="Enter command..."
        className="h-full"
        showHeader
        header={{ name: "AI Copilot" }}
        showThreadPicker
        persistence
      />
    </div>
  );
}
