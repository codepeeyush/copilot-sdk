"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotPanel } from "./CopilotPanel";
import type {
  CopilotTheme,
  DashboardState,
  PersonData,
  SDKConfig,
  LayoutTemplate,
  ToolsEnabledConfig,
  GenerativeUIConfig,
} from "@/lib/types";
import type { DashboardActions } from "@/hooks/useDashboardState";

interface CopilotSidebarProps {
  systemPrompt: string;
  copilotTheme: CopilotTheme;
  layoutTemplate: LayoutTemplate;
  dashboardState: DashboardState;
  actions: DashboardActions;
  selectedPerson: PersonData;
  sdkConfig: SDKConfig;
  toolsEnabled: ToolsEnabledConfig;
  generativeUI: GenerativeUIConfig;
}

export function CopilotSidebar({
  systemPrompt,
  copilotTheme,
  layoutTemplate,
  dashboardState,
  actions,
  selectedPerson,
  sdkConfig,
  toolsEnabled,
  generativeUI,
}: CopilotSidebarProps) {
  return (
    <div className="w-[420px] p-2">
      <div className="flex-1 min-h-0 h-full rounded-2xl overflow-hidden shadow-[0_0_10px_0_rgba(0,0,0,0.05)] border">
        <CopilotProvider
          runtimeUrl="/api/chat"
          systemPrompt={systemPrompt}
          streaming={sdkConfig.streaming}
          maxIterations={5}
          debug={sdkConfig.debug}
        >
          <CopilotPanel
            theme={copilotTheme}
            layoutTemplate={layoutTemplate}
            dashboardState={dashboardState}
            actions={actions}
            currentPerson={selectedPerson}
            sdkConfig={sdkConfig}
            toolsEnabled={toolsEnabled}
            generativeUI={generativeUI}
          />
        </CopilotProvider>
      </div>
    </div>
  );
}
