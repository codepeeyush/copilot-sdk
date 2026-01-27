"use client";

import { useState, useEffect } from "react";
import { ThemeSwitcher, type CopilotTheme } from "@/components/ThemeSwitcher";
import { ProviderPanel } from "@/components/ProviderPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Columns2,
  Columns3,
  LayoutGrid,
  Sparkles,
  Info,
} from "lucide-react";
import { useTheme } from "next-themes";

// Import all theme CSS files
import "@yourgpt/copilot-sdk/ui/themes/claude.css";
import "@yourgpt/copilot-sdk/ui/themes/linear.css";
import "@yourgpt/copilot-sdk/ui/themes/vercel.css";
import "@yourgpt/copilot-sdk/ui/themes/twitter.css";
import "@yourgpt/copilot-sdk/ui/themes/catppuccin.css";
import "@yourgpt/copilot-sdk/ui/themes/supabase.css";
import "@yourgpt/copilot-sdk/ui/themes/modern-minimal.css";
import "@yourgpt/copilot-sdk/ui/themes/posthog.css";

type ViewMode = "single" | "dual" | "triple";
type Provider = "openai" | "anthropic" | "google";

export default function PlaygroundPage() {
  const [copilotTheme, setCopilotTheme] = useState<CopilotTheme>("claude");
  const [viewMode, setViewMode] = useState<ViewMode>("dual");
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([
    "openai",
    "anthropic",
  ]);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant. Be concise and helpful in your responses.",
  );
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleProvider = (provider: Provider) => {
    if (selectedProviders.includes(provider)) {
      if (selectedProviders.length > 1) {
        setSelectedProviders(selectedProviders.filter((p) => p !== provider));
      }
    } else {
      const maxProviders =
        viewMode === "single" ? 1 : viewMode === "dual" ? 2 : 3;
      if (selectedProviders.length < maxProviders) {
        setSelectedProviders([...selectedProviders, provider]);
      } else {
        setSelectedProviders([...selectedProviders.slice(1), provider]);
      }
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    const maxProviders = mode === "single" ? 1 : mode === "dual" ? 2 : 3;
    if (selectedProviders.length > maxProviders) {
      setSelectedProviders(selectedProviders.slice(0, maxProviders));
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Copilot SDK Playground</h1>
              <p className="text-xs text-muted-foreground">
                Compare providers & explore themes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              @yourgpt/copilot-sdk
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Theme Selection */}
          <Card>
            <CardContent className="pt-6">
              <ThemeSwitcher
                currentTheme={copilotTheme}
                onThemeChange={setCopilotTheme}
              />
            </CardContent>
          </Card>

          {/* Provider Selection */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <LayoutGrid className="h-4 w-4" />
                Providers
              </div>
              <div className="flex flex-wrap gap-2">
                {(["openai", "anthropic", "google"] as Provider[]).map(
                  (provider) => (
                    <Button
                      key={provider}
                      variant={
                        selectedProviders.includes(provider)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleProvider(provider)}
                      className="capitalize"
                    >
                      {provider === "openai" && "OpenAI"}
                      {provider === "anthropic" && "Anthropic"}
                      {provider === "google" && "Google"}
                    </Button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* View Mode */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Columns2 className="h-4 w-4" />
                View Mode
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "single" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewModeChange("single")}
                >
                  Single
                </Button>
                <Button
                  variant={viewMode === "dual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewModeChange("dual")}
                >
                  <Columns2 className="h-4 w-4 mr-2" />
                  Dual
                </Button>
                <Button
                  variant={viewMode === "triple" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewModeChange("triple")}
                >
                  <Columns3 className="h-4 w-4 mr-2" />
                  Triple
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <SettingsPanel
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />

        {/* Chat Panels */}
        <div
          className={`grid gap-6 ${
            viewMode === "single"
              ? "grid-cols-1 max-w-2xl mx-auto"
              : viewMode === "dual"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {selectedProviders.map((provider) => (
            <ProviderPanel
              key={`${provider}-${copilotTheme}-${systemPrompt}`}
              provider={provider}
              theme={copilotTheme}
              systemPrompt={systemPrompt}
            />
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              About this Playground
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              This playground demonstrates the{" "}
              <code className="bg-muted px-1 py-0.5 rounded">
                @yourgpt/copilot-sdk
              </code>{" "}
              with multiple AI providers.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Compare responses from OpenAI, Anthropic, and Google in
                real-time
              </li>
              <li>
                Switch between 8 built-in themes to see the SDK's theming
                capabilities
              </li>
              <li>
                Customize the system prompt to change AI behavior across all
                providers
              </li>
              <li>Use dual or triple view to compare providers side-by-side</li>
            </ul>
            <p className="pt-2">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-background rounded text-xs font-mono border">
                Cmd+J
              </kbd>{" "}
              to toggle dark mode
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
