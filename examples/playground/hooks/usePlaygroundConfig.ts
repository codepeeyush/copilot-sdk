"use client";

import { useState, useCallback } from "react";
import type {
  CopilotTheme,
  GenerativeUIConfig,
  ToolsEnabledConfig,
  GenerativeUIKey,
  ToolKey,
  SDKConfig,
  LayoutTemplate,
} from "@/lib/types";
import {
  DEFAULT_SYSTEM_PROMPT,
  INITIAL_GENERATIVE_UI,
  INITIAL_TOOLS_ENABLED,
  INITIAL_SDK_CONFIG,
} from "@/lib/constants";

/**
 * Manages playground configuration state.
 * Uses stable callbacks to prevent unnecessary re-renders.
 *
 * @see Vercel React best practices: `rerender-functional-setstate`
 */
export function usePlaygroundConfig() {
  // Theme state - default to Vercel theme
  const [copilotTheme, setCopilotTheme] = useState<CopilotTheme>("vercel");

  // Layout template state - default to Support layout
  const [layoutTemplate, setLayoutTemplate] =
    useState<LayoutTemplate>("support");

  // System prompt state
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  // Generative UI toggles
  const [generativeUI, setGenerativeUI] = useState<GenerativeUIConfig>(
    () => INITIAL_GENERATIVE_UI,
  );

  // Tools enabled toggles
  const [toolsEnabled, setToolsEnabled] = useState<ToolsEnabledConfig>(
    () => INITIAL_TOOLS_ENABLED,
  );

  // SDK config
  const [sdkConfig, setSDKConfig] = useState<SDKConfig>(
    () => INITIAL_SDK_CONFIG,
  );

  // Theme setters
  const updateTheme = useCallback((theme: CopilotTheme) => {
    setCopilotTheme(theme);
  }, []);

  // Layout template setter
  const updateLayoutTemplate = useCallback((layout: LayoutTemplate) => {
    setLayoutTemplate(layout);
  }, []);

  // System prompt setter
  const updateSystemPrompt = useCallback((prompt: string) => {
    setSystemPrompt(prompt);
  }, []);

  // Generative UI toggle
  const toggleGenerativeUI = useCallback((key: GenerativeUIKey) => {
    setGenerativeUI((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Tools enabled toggle
  const toggleTool = useCallback((key: ToolKey) => {
    setToolsEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // SDK config update
  const updateSDKConfig = useCallback(
    <K extends keyof SDKConfig>(key: K, value: SDKConfig[K]) => {
      setSDKConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return {
    // State
    copilotTheme,
    layoutTemplate,
    systemPrompt,
    generativeUI,
    toolsEnabled,
    sdkConfig,
    // Actions
    updateTheme,
    updateLayoutTemplate,
    updateSystemPrompt,
    toggleGenerativeUI,
    toggleTool,
    updateSDKConfig,
    // Direct setters (for advanced use cases)
    setCopilotTheme,
    setLayoutTemplate,
    setSystemPrompt,
    setGenerativeUI,
    setToolsEnabled,
    setSDKConfig,
  };
}
