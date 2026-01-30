"use client";

import { useMemo, useCallback } from "react";
import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotPanel } from "./CopilotPanel";
import type {
  CopilotTheme,
  DashboardState,
  PersonData,
  LayoutTemplate,
  ToolsEnabledConfig,
  GenerativeUIConfig,
  ProviderId,
  ApiKeys,
} from "@/lib/types";
import type { DashboardActions } from "@/hooks/useDashboardState";

interface CopilotSidebarProps {
  systemPrompt: string;
  copilotTheme: CopilotTheme;
  layoutTemplate: LayoutTemplate;
  dashboardState: DashboardState;
  actions: DashboardActions;
  selectedPerson: PersonData;
  toolsEnabled: ToolsEnabledConfig;
  generativeUI: GenerativeUIConfig;
  selectedProvider: ProviderId;
  apiKeys: ApiKeys;
}

export function CopilotSidebar({
  systemPrompt,
  copilotTheme,
  layoutTemplate,
  dashboardState,
  actions,
  selectedPerson,
  toolsEnabled,
  generativeUI,
  selectedProvider,
  apiKeys,
}: CopilotSidebarProps) {
  // Build runtime URL with provider and optional API key
  const runtimeUrl = useMemo(() => {
    const baseUrl = `/api/${selectedProvider}`;
    const apiKey = apiKeys[selectedProvider];
    if (apiKey) {
      return `${baseUrl}?key=${encodeURIComponent(apiKey)}`;
    }
    return baseUrl;
  }, [selectedProvider, apiKeys]);

  // Error handler - logs to console with clear formatting
  const handleError = useCallback((error: Error) => {
    console.error(
      `%c[Copilot Error]%c ${error.message}`,
      "background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
      "color: #ef4444;",
    );
  }, []);

  return (
    <div className="w-[420px] p-2">
      <div className="flex-1 min-h-0 h-full rounded-2xl overflow-hidden shadow-[0_0_10px_0_rgba(0,0,0,0.05)] border">
        <CopilotProvider
          key={selectedProvider} // Force re-mount when provider changes
          runtimeUrl={runtimeUrl}
          systemPrompt={systemPrompt}
          maxIterations={5}
          onError={handleError}
        >
          <CopilotPanel
            theme={copilotTheme}
            layoutTemplate={layoutTemplate}
            dashboardState={dashboardState}
            actions={actions}
            currentPerson={selectedPerson}
            toolsEnabled={toolsEnabled}
            generativeUI={generativeUI}
          />
        </CopilotProvider>
      </div>
    </div>
  );
}
