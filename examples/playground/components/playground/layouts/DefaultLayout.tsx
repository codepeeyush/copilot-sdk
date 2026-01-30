"use client";

import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import type { CopilotTheme, SDKConfig } from "@/lib/types";

export interface LayoutProps {
  theme: CopilotTheme;
  sdkConfig: SDKConfig;
}

export function DefaultLayout({ theme, sdkConfig }: LayoutProps) {
  return (
    <div
      className="h-full"
      data-csdk-theme={theme === "default" ? undefined : theme}
    >
      <CopilotChat
        placeholder="Enter command..."
        className="h-full"
        showHeader={sdkConfig.showHeader}
        header={sdkConfig.showHeader ? { name: "AI Copilot" } : undefined}
        showThreadPicker={sdkConfig.showHeader}
        persistence={sdkConfig.showHeader}
      />
    </div>
  );
}
