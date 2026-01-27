"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";

interface SettingsPanelProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export function SettingsPanel({
  systemPrompt,
  onSystemPromptChange,
}: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="Enter a system prompt..."
            className="min-h-[100px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This prompt will be used for all providers
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
