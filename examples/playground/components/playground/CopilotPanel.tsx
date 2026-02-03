"use client";

import type {
  CopilotTheme,
  DashboardState,
  PersonData,
  LayoutTemplate,
  ToolsEnabledConfig,
  GenerativeUIConfig,
  LoaderVariant,
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
  toolsEnabled: ToolsEnabledConfig;
  generativeUI: GenerativeUIConfig;
  loaderVariant: LoaderVariant;
}

export function CopilotPanel({
  theme,
  layoutTemplate,
  dashboardState,
  actions,
  currentPerson,
  toolsEnabled,
  generativeUI,
  loaderVariant,
}: CopilotPanelProps) {
  // Provide dashboard and user context to the AI
  useDashboardContext({ dashboardState, currentPerson });

  // Render the appropriate layout based on template
  const renderLayout = () => {
    switch (layoutTemplate) {
      case "saas":
        return <SaasLayout theme={theme} loaderVariant={loaderVariant} />;
      case "support":
        return <SupportLayout theme={theme} loaderVariant={loaderVariant} />;
      case "default":
      default:
        return <DefaultLayout theme={theme} loaderVariant={loaderVariant} />;
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
