"use client";

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
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { DashboardTools } from "./DashboardTools";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { SaasLayout } from "./layouts/SaasLayout";
import { SupportLayout } from "./layouts/SupportLayout";

interface CopilotPanelProps {
  theme: CopilotTheme;
  layoutTemplate: LayoutTemplate;
  dashboardState: DashboardState;
  actions: DashboardActions;
  currentPerson: PersonData;
  sdkConfig: SDKConfig;
  toolsEnabled: ToolsEnabledConfig;
  generativeUI: GenerativeUIConfig;
}

export function CopilotPanel({
  theme,
  layoutTemplate,
  dashboardState,
  actions,
  currentPerson,
  sdkConfig,
  toolsEnabled,
  generativeUI,
}: CopilotPanelProps) {
  // Provide dashboard and user context to the AI
  useDashboardContext({ dashboardState, currentPerson });

  // Render the appropriate layout based on template
  const renderLayout = () => {
    switch (layoutTemplate) {
      case "saas":
        return <SaasLayout theme={theme} sdkConfig={sdkConfig} />;
      case "support":
        return <SupportLayout theme={theme} sdkConfig={sdkConfig} />;
      case "default":
      default:
        return <DefaultLayout theme={theme} sdkConfig={sdkConfig} />;
    }
  };

  return (
    <div className="h-full">
      {/* Tools are conditionally rendered - unmounting unregisters from AI */}
      <DashboardTools
        dashboardState={dashboardState}
        actions={actions}
        toolsEnabled={toolsEnabled}
        generativeUI={generativeUI}
      />
      {renderLayout()}
    </div>
  );
}
