"use client";

import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import type { CopilotTheme, LoaderVariant } from "@/lib/types";

export interface LayoutProps {
  theme: CopilotTheme;
  loaderVariant: LoaderVariant;
}

export function DefaultLayout({ theme, loaderVariant }: LayoutProps) {
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
        loaderVariant={loaderVariant}
        assistantAvatar={{
          src: "https://api.dicebear.com/7.x/bottts/svg?seed=assistant",
        }}
        showUserAvatar
        userAvatar={{
          src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        }}
      />
    </div>
  );
}
