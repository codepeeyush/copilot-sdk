"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type CopilotTheme } from "./ThemeSwitcher";

interface ProviderPanelProps {
  provider: "openai" | "anthropic" | "google";
  theme: CopilotTheme;
  systemPrompt: string;
}

const providerConfig = {
  openai: {
    name: "OpenAI",
    model: "GPT-4o-mini",
    color: "bg-green-500",
    apiUrl: "/api/openai",
  },
  anthropic: {
    name: "Anthropic",
    model: "Claude 3.5 Sonnet",
    color: "bg-orange-500",
    apiUrl: "/api/anthropic",
  },
  google: {
    name: "Google",
    model: "Gemini 1.5 Flash",
    color: "bg-blue-500",
    apiUrl: "/api/google",
  },
};

export function ProviderPanel({
  provider,
  theme,
  systemPrompt,
}: ProviderPanelProps) {
  const config = providerConfig[provider];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${config.color}`} />
            {config.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {config.model}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <CopilotProvider runtimeUrl={config.apiUrl} systemPrompt={systemPrompt}>
          <div className="h-[500px]" data-csdk-theme={theme}>
            <CopilotChat
              placeholder={`Ask ${config.name}...`}
              className="h-full"
              persistence={true}
              showThreadPicker={true}
              header={{
                name: config.name,
              }}
            />
          </div>
        </CopilotProvider>
      </CardContent>
    </Card>
  );
}
