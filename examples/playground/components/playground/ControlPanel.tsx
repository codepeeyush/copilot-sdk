"use client";

import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings2,
  Terminal,
  Palette,
  Zap,
  Layers,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CircleDot,
  Gauge,
  User,
  Sparkles,
  Radio,
  MessageSquare,
  PanelTop,
  Layout,
  Cpu,
} from "lucide-react";
import type {
  CopilotTheme,
  DashboardState,
  GenerativeUIConfig,
  GenerativeUIKey,
  ToolsEnabledConfig,
  ToolKey,
  PersonData,
  SDKConfig,
  LayoutTemplate,
  ProviderId,
} from "@/lib/types";
import {
  themes,
  samplePersons,
  layoutTemplates,
  providers,
} from "@/lib/constants";
import { WeatherModule } from "./modules/WeatherModule";
import { StockModule } from "./modules/StockModule";
import { AlertModule } from "./modules/AlertModule";

const generativeUIKeys: GenerativeUIKey[] = [
  "weather",
  "stock",
  "notification",
];

const exampleQuestions = [
  "What's my current plan?",
  "How many credits do I have?",
  "What's my name and role?",
];

// Reusable section label
function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: typeof Zap;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-3.5 w-3.5 text-zinc-400" />
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}

// Industrial toggle switch
function ToggleSwitch({
  active,
  onChange,
  size = "default",
}: {
  active: boolean;
  onChange: () => void;
  size?: "sm" | "default";
}) {
  const sizeClasses = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const dotClasses = size === "sm" ? "h-3 w-3 top-1" : "h-4 w-4 top-1";
  const translateClass = size === "sm" ? "left-5" : "left-6";

  return (
    <button
      onClick={onChange}
      className={`relative ${sizeClasses} rounded-full transition-all duration-200 ${active ? "bg-emerald-500/20 ring-1 ring-emerald-500/50" : "bg-zinc-200 dark:bg-zinc-800 ring-1 ring-zinc-300 dark:ring-zinc-700"}`}
    >
      <span
        className={`absolute ${dotClasses} rounded-full transition-all duration-200 ${active ? `${translateClass} bg-emerald-500 shadow-lg shadow-emerald-500/50` : "left-1 bg-zinc-400 dark:bg-zinc-500"}`}
      />
    </button>
  );
}

interface ControlPanelProps {
  copilotTheme: CopilotTheme;
  onThemeChange: (theme: CopilotTheme) => void;
  layoutTemplate: LayoutTemplate;
  onLayoutChange: (layout: LayoutTemplate) => void;
  selectedProvider: ProviderId;
  onProviderChange: (provider: ProviderId) => void;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  generativeUI: GenerativeUIConfig;
  onToggleGenerativeUI: (key: GenerativeUIKey) => void;
  toolsEnabled: ToolsEnabledConfig;
  onToggleTool: (key: ToolKey) => void;
  dashboardState: DashboardState;
  onIncrementCounter: () => void;
  onDecrementCounter: () => void;
  onAddToCart: () => void;
  onClearCart: () => void;
  onReset: () => void;
  selectedPerson: PersonData;
  onSelectPerson: (person: PersonData) => void;
  sdkConfig: SDKConfig;
  onSDKConfigChange: <K extends keyof SDKConfig>(
    key: K,
    value: SDKConfig[K],
  ) => void;
}

function ControlPanelComponent({
  copilotTheme,
  onThemeChange,
  layoutTemplate,
  onLayoutChange,
  selectedProvider,
  onProviderChange,
  systemPrompt,
  onSystemPromptChange,
  generativeUI,
  onToggleGenerativeUI,
  toolsEnabled,
  onToggleTool,
  dashboardState,
  onIncrementCounter,
  onDecrementCounter,
  onAddToCart,
  onClearCart,
  onReset,
  selectedPerson,
  onSelectPerson,
  sdkConfig,
  onSDKConfigChange,
}: ControlPanelProps) {
  const activeToolCount = Object.values(toolsEnabled).filter(Boolean).length;
  const selectedTheme = themes.find((t) => t.id === copilotTheme);
  const selectedLayout = layoutTemplates.find((l) => l.id === layoutTemplate);
  const currentProvider = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      {/* <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-800 ring-1 ring-zinc-700">
              <Settings2 className="h-5 w-5 text-zinc-300" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-100 dark:ring-zinc-950" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Control Panel
            </h1>
            <p className="text-[11px] text-zinc-500 font-mono">
              SDK Configuration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 ring-1 ring-zinc-200 dark:ring-zinc-700">
          <CircleDot className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
            {activeToolCount} Tools
          </span>
        </div>
      </header> */}

      {/* Configuration - Always Visible */}
      <section className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Terminal className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Configuration
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">
              theme · prompt · sdk options
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Row 1: Theme + Layout Select */}
          <div className="flex items-end gap-4">
            <div className="w-40">
              <SectionLabel icon={Palette} label="Theme" />
              <Select
                value={copilotTheme}
                onValueChange={(v) => onThemeChange(v as CopilotTheme)}
              >
                <SelectTrigger className="h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: selectedTheme?.accent }}
                      />
                      <span className="text-xs">{selectedTheme?.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: t.accent }}
                        />
                        <span>{t.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <SectionLabel icon={Layout} label="Layout" />
              <Select
                value={layoutTemplate}
                onValueChange={(v) => onLayoutChange(v as LayoutTemplate)}
              >
                <SelectTrigger className="h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                  <SelectValue>
                    <span className="text-xs">{selectedLayout?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {layoutTemplates.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      <div className="flex flex-col">
                        <span>{l.name}</span>
                        <span className="text-[10px] text-zinc-400">
                          {l.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-48">
              <SectionLabel icon={Cpu} label="Model" />
              <Select
                value={selectedProvider}
                onValueChange={(v) => onProviderChange(v as ProviderId)}
              >
                <SelectTrigger className="h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: currentProvider?.color }}
                      />
                      <span className="text-xs truncate">
                        {currentProvider?.name} · {currentProvider?.model}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span>{p.name}</span>
                        <span className="text-zinc-400 text-[10px]">
                          · {p.model}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SDK Options - Inline toggles */}
            <div className="flex-1">
              <SectionLabel icon={Settings2} label="SDK Options" />
              <div className="flex items-center gap-2">
                {/* Streaming */}
                <button
                  onClick={() =>
                    onSDKConfigChange("streaming", !sdkConfig.streaming)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ring-1 transition-all ${
                    sdkConfig.streaming
                      ? "bg-emerald-500/10 ring-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-zinc-100 dark:bg-zinc-800/50 ring-zinc-200 dark:ring-zinc-700 text-zinc-500"
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">Stream</span>
                </button>

                {/* Header + Thread Picker */}
                <button
                  onClick={() =>
                    onSDKConfigChange("showHeader", !sdkConfig.showHeader)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ring-1 transition-all ${
                    sdkConfig.showHeader
                      ? "bg-emerald-500/10 ring-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-zinc-100 dark:bg-zinc-800/50 ring-zinc-200 dark:ring-zinc-700 text-zinc-500"
                  }`}
                >
                  <PanelTop className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">
                    Header & Threads
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: System Prompt - Full width */}
          <div>
            <SectionLabel icon={MessageSquare} label="System Prompt" />
            <textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              className="w-full h-20 bg-zinc-50 dark:bg-zinc-800/50 ring-1 ring-zinc-200 dark:ring-zinc-700 rounded-lg px-3 py-2.5 text-xs font-mono text-zinc-700 dark:text-zinc-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-400 leading-relaxed"
              placeholder="// Define AI behavior..."
            />
          </div>
        </div>
      </section>

      {/* Collapsible Sections */}
      <Accordion
        type="multiple"
        defaultValue={["tools", "generative", "context"]}
        className="space-y-3"
      >
        {/* Tools & State */}
        <AccordionItem
          value="tools"
          className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <Zap className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Tools & State
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {activeToolCount}/3 tools active
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-1 pb-5">
            <div className="space-y-4">
              {/* Reset button */}
              <div className="flex justify-end">
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 text-[9px] font-mono text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset All
                </button>
              </div>

              {/* Unified Tool + State Cards */}
              <div className="grid grid-cols-4 gap-3">
                {/* Counter Tool + State */}
                <div
                  className={`rounded-xl ring-1 overflow-hidden ${toolsEnabled.updateCounter ? "ring-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10" : "ring-zinc-200 dark:ring-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/30"}`}
                >
                  <button
                    onClick={() => onToggleTool("updateCounter")}
                    className="w-full flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Gauge
                        className={`h-4 w-4 ${toolsEnabled.updateCounter ? "text-emerald-500" : "text-zinc-400"}`}
                      />
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        Counter
                      </span>
                    </div>
                    <span
                      className={`relative text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-md transition-all ${
                        toolsEnabled.updateCounter
                          ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                      }`}
                    >
                      {toolsEnabled.updateCounter ? "ON" : "OFF"}
                    </span>
                  </button>
                  <div className="px-3 pb-3 pt-1">
                    <p className="text-2xl font-light text-zinc-900 dark:text-white tabular-nums mb-2">
                      {dashboardState.counter}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={onDecrementCounter}
                        className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                      <button
                        onClick={onIncrementCounter}
                        className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preference Tool + State */}
                <div
                  className={`rounded-xl ring-1 overflow-hidden ${toolsEnabled.updatePreference ? "ring-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10" : "ring-zinc-200 dark:ring-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/30"}`}
                >
                  <button
                    onClick={() => onToggleTool("updatePreference")}
                    className="w-full flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings2
                        className={`h-4 w-4 ${toolsEnabled.updatePreference ? "text-emerald-500" : "text-zinc-400"}`}
                      />
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        Preference
                      </span>
                    </div>
                    <span
                      className={`relative text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-md transition-all ${
                        toolsEnabled.updatePreference
                          ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                      }`}
                    >
                      {toolsEnabled.updatePreference ? "ON" : "OFF"}
                    </span>
                  </button>
                  <div className="px-3 pb-3 pt-1">
                    <p className="text-xl font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      {dashboardState.userPreference}
                    </p>
                    <p className="text-[9px] text-zinc-400 font-mono mt-1">
                      set via AI tool
                    </p>
                  </div>
                </div>

                {/* Cart Tool + State */}
                <div
                  className={`rounded-xl ring-1 overflow-hidden ${toolsEnabled.updateCart ? "ring-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10" : "ring-zinc-200 dark:ring-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/30"}`}
                >
                  <button
                    onClick={() => onToggleTool("updateCart")}
                    className="w-full flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart
                        className={`h-4 w-4 ${toolsEnabled.updateCart ? "text-emerald-500" : "text-zinc-400"}`}
                      />
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        Cart
                      </span>
                    </div>
                    <span
                      className={`relative text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-md transition-all ${
                        toolsEnabled.updateCart
                          ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                      }`}
                    >
                      {toolsEnabled.updateCart ? "ON" : "OFF"}
                    </span>
                  </button>
                  <div className="px-3 pb-3 pt-1">
                    <p className="text-2xl font-light text-zinc-900 dark:text-white tabular-nums mb-2">
                      {dashboardState.cartItems}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={onAddToCart}
                        className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                      <button
                        onClick={onClearCart}
                        className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Generative UI */}
        <AccordionItem
          value="generative"
          className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
                <Layers className="h-4 w-4 text-violet-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Generative UI
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  dynamic components
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-1 pb-5">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                {generativeUIKeys.map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <ToggleSwitch
                      size="sm"
                      active={generativeUI[key]}
                      onChange={() => onToggleGenerativeUI(key)}
                    />
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 capitalize transition-colors">
                      {key}
                    </span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <WeatherModule show={generativeUI.weather} />
                <StockModule show={generativeUI.stock} />
                <AlertModule show={generativeUI.notification} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Context Demo */}
        <AccordionItem
          value="context"
          className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <Sparkles className="h-4 w-4 text-cyan-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Context Demo
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  useAIContext hook
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-1 pb-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <SectionLabel icon={User} label="User Profile" />
                <div className="space-y-2">
                  {samplePersons.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => onSelectPerson(person)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedPerson.id === person.id
                          ? "bg-cyan-500/10 ring-2 ring-cyan-500/50"
                          : "bg-zinc-50 dark:bg-zinc-800/30 ring-1 ring-zinc-200 dark:ring-zinc-700/50 hover:ring-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {person.name}
                        </span>
                        <span
                          className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            person.plan === "enterprise"
                              ? "bg-violet-500/20 text-violet-600 dark:text-violet-400"
                              : person.plan === "pro"
                                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                          }`}
                        >
                          {person.plan}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {person.role} · {person.credits.toLocaleString()}{" "}
                        credits
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <SectionLabel icon={Terminal} label="AI Context" />
                  <div className="rounded-xl bg-zinc-950 p-3 ring-1 ring-zinc-800">
                    <pre className="text-[10px] font-mono text-cyan-400 leading-relaxed overflow-x-auto">
                      {`{
  "name": "${selectedPerson.name}",
  "plan": "${selectedPerson.plan}",
  "credits": ${selectedPerson.credits}
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <SectionLabel icon={Sparkles} label="Try Asking" />
                  <div className="space-y-1.5">
                    {exampleQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 ring-1 ring-zinc-200 dark:ring-zinc-700/50 text-[10px] font-mono text-zinc-600 dark:text-zinc-400"
                      >
                        &quot;{q}&quot;
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export const ControlPanel = memo(ControlPanelComponent);
