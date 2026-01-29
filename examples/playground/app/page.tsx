"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CopilotProvider,
  useTool,
  useAIContext,
} from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CopilotSDKLogo from "@/components/CopilotSDKLogo";
import {
  Moon,
  Sun,
  Palette,
  Terminal,
  Cpu,
  Activity,
  ShoppingCart,
  Bell,
  Loader2,
  Cloud,
  TrendingUp,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  Zap,
  Box,
  Key,
  Shield,
  Check,
  AlertCircle,
  ExternalLink,
  Github,
  Copy,
  BookOpen,
  Rocket,
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

type CopilotTheme =
  | "default"
  | "claude"
  | "linear"
  | "vercel"
  | "twitter"
  | "catppuccin"
  | "supabase"
  | "modern-minimal"
  | "posthog";

const themes: { id: CopilotTheme; label: string; accent: string }[] = [
  { id: "default", label: "Default", accent: "#6b7280" },
  { id: "claude", label: "Claude", accent: "#f97316" },
  { id: "linear", label: "Linear", accent: "#8b5cf6" },
  { id: "vercel", label: "Vercel", accent: "#171717" },
  { id: "twitter", label: "Twitter", accent: "#0ea5e9" },
  { id: "catppuccin", label: "Catppuccin", accent: "#f472b6" },
  { id: "supabase", label: "Supabase", accent: "#10b981" },
  { id: "modern-minimal", label: "Minimal", accent: "#64748b" },
  { id: "posthog", label: "PostHog", accent: "#eab308" },
];

interface ToolState {
  loading: boolean;
  lastResult?: { success: boolean; message: string };
}

interface DashboardState {
  counter: number;
  userPreference: string;
  notifications: string[];
  cartItems: number;
}

interface ApiKeys {
  openai: string;
  anthropic: string;
  google: string;
  xai: string;
}

type ProviderId = "openai" | "anthropic" | "google" | "xai";

interface ProviderConfig {
  id: ProviderId;
  name: string;
  model: string;
  color: string;
  keyPlaceholder: string;
  keyLink: string;
  keyLinkText: string;
}

const providers: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    model: "GPT-4o-mini",
    color: "#10a37f",
    keyPlaceholder: "sk-...",
    keyLink: "https://platform.openai.com/api-keys",
    keyLinkText: "platform.openai.com",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    model: "Claude 3.5 Sonnet",
    color: "#d97706",
    keyPlaceholder: "sk-ant-...",
    keyLink: "https://console.anthropic.com/settings/keys",
    keyLinkText: "console.anthropic.com",
  },
  {
    id: "google",
    name: "Google",
    model: "Gemini 1.5 Flash",
    color: "#4285f4",
    keyPlaceholder: "AIza...",
    keyLink: "https://aistudio.google.com/apikey",
    keyLinkText: "aistudio.google.com",
  },
  {
    id: "xai",
    name: "xAI",
    model: "Grok 3 Fast",
    color: "#1d9bf0",
    keyPlaceholder: "xai-...",
    keyLink: "https://console.x.ai/",
    keyLinkText: "console.x.ai",
  },
];

const API_KEYS_STORAGE_KEY = "copilot-playground-api-keys";

// Sample person data for useAIContext demo
interface PersonData {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: "free" | "pro" | "enterprise";
  credits: number;
  joinedDate: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

const samplePersons: PersonData[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Developer",
    plan: "pro",
    credits: 2500,
    joinedDate: "2024-03-15",
    preferences: { theme: "dark", notifications: true, language: "en" },
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah@company.io",
    role: "Product Manager",
    plan: "enterprise",
    credits: 10000,
    joinedDate: "2023-11-01",
    preferences: { theme: "system", notifications: true, language: "en" },
  },
  {
    id: "user-3",
    name: "Mike Wilson",
    email: "mike@startup.co",
    role: "Founder",
    plan: "free",
    credits: 100,
    joinedDate: "2025-01-10",
    preferences: { theme: "light", notifications: false, language: "es" },
  },
];

// Status indicator component
function StatusDot({ active, pulse }: { active: boolean; pulse?: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {pulse && active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      )}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600"}`}
      />
    </span>
  );
}

// Tool status with terminal-like output
function ToolOutput({ states }: { states: Record<string, ToolState> }) {
  const entries = Object.entries(states);
  if (entries.length === 0) return null;

  return (
    <div className="font-mono text-[11px] space-y-1 p-3 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-300 dark:border-zinc-800">
      {entries.map(([name, state]) => (
        <div key={name} className="flex items-center gap-2">
          <span className="text-zinc-400 dark:text-zinc-500">$</span>
          <span className="text-cyan-600 dark:text-cyan-400">{name}</span>
          {state.loading ? (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              running...
            </span>
          ) : state.lastResult ? (
            <span
              className={
                state.lastResult.success
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }
            >
              → {state.lastResult.message}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

// Generative UI Components
function WeatherModule({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800 bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 dark:bg-cyan-500/10 blur-2xl rounded-full" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusDot active pulse />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Weather API
            </span>
          </div>
          <p className="text-2xl font-light text-zinc-900 dark:text-white tracking-tight">
            72°F
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Clear skies • San Francisco
          </p>
        </div>
        <Cloud className="h-8 w-8 text-cyan-500 dark:text-cyan-400/60" />
      </div>
    </div>
  );
}

function StockModule({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 dark:bg-emerald-500/10 blur-2xl rounded-full" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusDot active pulse />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Market Data
            </span>
          </div>
          <p className="text-2xl font-light text-zinc-900 dark:text-white tracking-tight">
            $187.44
          </p>
          <p className="text-xs mt-1">
            <span className="text-zinc-500 dark:text-zinc-400">AAPL</span>
            <span className="text-emerald-600 dark:text-emerald-400 ml-2">
              ↑ 2.4%
            </span>
          </p>
        </div>
        <TrendingUp className="h-8 w-8 text-emerald-500 dark:text-emerald-400/60" />
      </div>
    </div>
  );
}

function AlertModule({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 dark:bg-amber-500/10 blur-2xl rounded-full" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusDot active pulse />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Notifications
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            3 pending alerts
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Last update: 2m ago
          </p>
        </div>
        <Bell className="h-8 w-8 text-amber-500 dark:text-amber-400/60" />
      </div>
    </div>
  );
}

// API Key Configuration Modal
function ApiKeyModal({
  open,
  onOpenChange,
  apiKeys,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
}) {
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  const handleSave = () => {
    onSave(localKeys);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4" />
            API Configuration
          </DialogTitle>
          <DialogDescription className="text-xs">
            Configure your API keys for different providers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Keys are stored locally in your browser only. We never send or
              store your keys on any server.
            </p>
          </div>

          {/* Provider Keys */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {providers.map((provider) => (
              <div key={provider.id} className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: provider.color }}
                  />
                  {provider.name}
                  {localKeys[provider.id] && (
                    <Check className="h-3 w-3 text-emerald-500 ml-auto" />
                  )}
                </label>
                <input
                  type="password"
                  value={localKeys[provider.id]}
                  onChange={(e) =>
                    setLocalKeys((prev) => ({
                      ...prev,
                      [provider.id]: e.target.value,
                    }))
                  }
                  placeholder={provider.keyPlaceholder}
                  className="w-full h-8 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[10px] text-zinc-500">
                  Get your key from{" "}
                  <a
                    href={provider.keyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {provider.keyLinkText}
                  </a>
                </p>
              </div>
            ))}
          </div>

          {/* Explore more link */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <a
              href="https://copilot-sdk.yourgpt.ai/docs/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Explore more providers in Copilot SDK docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="h-3 w-3" />
                Saved
              </>
            ) : (
              "Save Keys"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const WELCOME_DISMISSED_KEY = "copilot-playground-welcome-dismissed";
const GITHUB_REPO_URL =
  "https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/playground";

// Welcome Modal with setup instructions
function WelcomeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_DISMISSED_KEY, "true");
    onOpenChange(false);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      step: 1,
      title: "Clone the repository",
      cmd: "git clone https://github.com/YourGPT/yourgpt-copilot.git",
    },
    {
      step: 2,
      title: "Navigate to playground",
      cmd: "cd yourgpt-copilot/examples/playground",
    },
    { step: 3, title: "Install dependencies", cmd: "npm install" },
    { step: 4, title: "Start development server", cmd: "npm run dev" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Rocket className="h-5 w-5 text-indigo-500" />
            Welcome to Copilot SDK Playground
          </DialogTitle>
          <DialogDescription className="text-xs">
            Interactive demo to explore the SDK features and capabilities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Info Card */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                Run locally for full experience
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400/80">
                Clone the repo and add your API key to test all features
                including tool execution.
              </p>
            </div>
          </div>

          {/* Setup Steps */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Quick Setup
            </p>
            <div className="space-y-2">
              {steps.map(({ step, title, cmd }) => (
                <div key={step} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                      {step}
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {title}
                    </span>
                  </div>
                  <div className="ml-7 flex items-center gap-2">
                    <code className="flex-1 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                      {cmd}
                    </code>
                    <button
                      onClick={() => copyCommand(cmd)}
                      className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                      title="Copy command"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <Key className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Add your OpenAI API key using the{" "}
              <span className="font-medium">API Key</span> button in the header.
              Keys are stored locally in your browser only.
            </p>
          </div>

          {copied && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
              Copied to clipboard!
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          >
            Get Started
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Copilot Panel with tools
function CopilotPanel({
  theme,
  toolsEnabled,
  generativeUI,
  dashboardState,
  setDashboardState,
  currentPerson,
}: {
  theme: CopilotTheme;
  toolsEnabled: {
    updateCounter: boolean;
    updatePreference: boolean;
    addNotification: boolean;
    updateCart: boolean;
  };
  generativeUI: {
    weather: boolean;
    stock: boolean;
    notification: boolean;
  };
  dashboardState: DashboardState;
  setDashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
  currentPerson: PersonData;
}) {
  const [toolStates, setToolStates] = useState<Record<string, ToolState>>({});

  // Use ref to always get current state in handlers (avoid stale closures)
  const dashboardStateRef = useRef(dashboardState);
  dashboardStateRef.current = dashboardState;

  const simulateDelay = () =>
    new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

  // Update Counter Tool
  useTool({
    name: "updateCounter",
    description:
      "Update the dashboard counter. Use this to increment, decrement, or reset the counter value.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["increment", "decrement", "reset"],
          description:
            "The action to perform: increment adds 1, decrement subtracts 1, reset sets to 0",
        },
      },
      required: ["action"],
    },
    handler: async ({
      action,
    }: {
      action: "increment" | "decrement" | "reset";
    }) => {
      console.log("[updateCounter] Handler called with action:", action);
      setToolStates((prev) => ({ ...prev, updateCounter: { loading: true } }));
      await simulateDelay();
      const currentCount = dashboardStateRef.current.counter;
      const newValue =
        action === "increment"
          ? currentCount + 1
          : action === "decrement"
            ? currentCount - 1
            : 0;
      setDashboardState((prev) => ({
        ...prev,
        counter:
          action === "increment"
            ? prev.counter + 1
            : action === "decrement"
              ? prev.counter - 1
              : 0,
      }));
      setToolStates((prev) => ({
        ...prev,
        updateCounter: {
          loading: false,
          lastResult: { success: true, message: `counter.${action}()` },
        },
      }));
      const result = {
        success: true,
        action,
        newValue,
        message: `Counter ${action}ed successfully`,
      };
      console.log("[updateCounter] Returning result:", result);
      return result;
    },
    render: ({ status, args, result }) => {
      if (status === "completed" && result?.success) {
        const actionIcons = {
          increment: <Plus className="h-4 w-4" />,
          decrement: <Minus className="h-4 w-4" />,
          reset: <RotateCcw className="h-4 w-4" />,
        };
        return (
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {actionIcons[args.action as keyof typeof actionIcons] || (
                    <Activity className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Counter Update
                  </p>
                  <p className="text-[10px] text-zinc-500">{args.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {(result as { newValue?: number }).newValue}
                </p>
              </div>
            </div>
          </div>
        );
      }
      return null;
    },
  });

  // Update Preference Tool
  useTool({
    name: "updatePreference",
    description:
      "Update user preference setting. Common values: dark, light, auto, system.",
    inputSchema: {
      type: "object",
      properties: {
        preference: {
          type: "string",
          description: "The new preference value (e.g., dark, light, auto)",
        },
      },
      required: ["preference"],
    },
    handler: async ({ preference }: { preference: string }) => {
      console.log(
        "[updatePreference] Handler called with preference:",
        preference,
      );
      setToolStates((prev) => ({
        ...prev,
        updatePreference: { loading: true },
      }));
      await simulateDelay();
      setDashboardState((prev) => ({ ...prev, userPreference: preference }));
      setToolStates((prev) => ({
        ...prev,
        updatePreference: {
          loading: false,
          lastResult: { success: true, message: `set "${preference}"` },
        },
      }));
      const result = {
        success: true,
        preference,
        message: `Preference set to ${preference}`,
      };
      console.log("[updatePreference] Returning result:", result);
      return result;
    },
    render: ({ status, args, result }) => {
      if (status === "completed" && result?.success) {
        return (
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Preference Update
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Set to &quot;{args.preference}&quot;
                  </p>
                </div>
              </div>
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
        );
      }
      return null;
    },
  });

  // Add Notification Tool
  useTool({
    name: "addNotification",
    description:
      "Add a notification message to the dashboard notification queue.",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The notification message to display",
        },
      },
      required: ["message"],
    },
    handler: async ({ message }: { message: string }) => {
      console.log("[addNotification] Handler called with message:", message);
      setToolStates((prev) => ({
        ...prev,
        addNotification: { loading: true },
      }));
      await simulateDelay();
      const queueSize = dashboardStateRef.current.notifications.length + 1;
      setDashboardState((prev) => ({
        ...prev,
        notifications: [...prev.notifications, message],
      }));
      setToolStates((prev) => ({
        ...prev,
        addNotification: {
          loading: false,
          lastResult: { success: true, message: "pushed to queue" },
        },
      }));
      const result = { success: true, notificationMessage: message, queueSize };
      console.log("[addNotification] Returning result:", result);
      return result;
    },
    render: ({ status, args, result }) => {
      if (status === "completed" && result?.success) {
        return (
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    New Notification
                  </p>
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400/80 truncate">
                  &quot;{args.message}&quot;
                </p>
                <p className="text-[10px] text-amber-600/60 dark:text-amber-500/60 mt-1">
                  Queue: {(result as { queueSize?: number }).queueSize}{" "}
                  notification(s)
                </p>
              </div>
            </div>
          </div>
        );
      }
      return null;
    },
  });

  // Update Cart Tool
  useTool({
    name: "updateCart",
    description:
      "Update shopping cart items. Can add items, remove items, or clear the entire cart.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["add", "remove", "clear"],
          description:
            "The cart action: add increases count, remove decreases count, clear empties cart",
        },
        count: {
          type: "number",
          description:
            "Number of items to add or remove (defaults to 1 if not specified)",
        },
      },
      required: ["action"],
    },
    handler: async ({
      action,
      count,
    }: {
      action: "add" | "remove" | "clear";
      count?: number;
    }) => {
      console.log(
        "[updateCart] Handler called with action:",
        action,
        "count:",
        count,
      );
      setToolStates((prev) => ({ ...prev, updateCart: { loading: true } }));
      await simulateDelay();
      const prevCount = dashboardStateRef.current.cartItems;
      const newCount =
        action === "add"
          ? prevCount + (count || 1)
          : action === "remove"
            ? Math.max(0, prevCount - (count || 1))
            : 0;
      setDashboardState((prev) => ({
        ...prev,
        cartItems:
          action === "add"
            ? prev.cartItems + (count || 1)
            : action === "remove"
              ? Math.max(0, prev.cartItems - (count || 1))
              : 0,
      }));
      setToolStates((prev) => ({
        ...prev,
        updateCart: {
          loading: false,
          lastResult: {
            success: true,
            message: `cart.${action}(${count || 1})`,
          },
        },
      }));
      const result = {
        success: true,
        action,
        count: count || 1,
        prevCount,
        newCount,
        message: `Cart updated: ${action} ${count || 1} item(s)`,
      };
      console.log("[updateCart] Returning result:", result);
      return result;
    },
    render: ({ status, args, result }) => {
      if (status === "completed" && result?.success) {
        const actionConfig = {
          add: {
            icon: <Plus className="h-4 w-4" />,
            color: "emerald",
            label: "Add to Cart",
          },
          remove: {
            icon: <Minus className="h-4 w-4" />,
            color: "orange",
            label: "Remove from Cart",
          },
          clear: {
            icon: <Trash2 className="h-4 w-4" />,
            color: "rose",
            label: "Clear Cart",
          },
        };
        const config =
          actionConfig[args.action as keyof typeof actionConfig] ||
          actionConfig.add;
        const colorClasses = {
          emerald:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
          orange:
            "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
          rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
        };

        return (
          <div
            className={`p-3 rounded-lg border ${colorClasses[config.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-${config.color}-500/20 flex items-center justify-center`}
                >
                  {config.icon}
                </div>
                <div>
                  <p className="text-xs font-medium">{config.label}</p>
                  <p className="text-[10px] opacity-70">
                    {args.count || 1} item(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm font-bold">
                  {(result as { newCount?: number }).newCount}
                </span>
              </div>
            </div>
          </div>
        );
      }
      return null;
    },
  });

  // Weather Tool (Generative UI)
  useTool({
    name: "getWeather",
    description:
      "Get current weather information for a location. Returns temperature, conditions, and forecast.",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "City name or location (e.g., 'San Francisco', 'New York')",
        },
      },
      required: ["location"],
    },
    handler: async ({ location }: { location: string }) => {
      console.log("[getWeather] Handler called with location:", location);
      // Simple delay without using component function
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("[getWeather] Delay completed, generating result...");
      // Mock weather data
      const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Clear"];
      const temp = Math.floor(Math.random() * 30) + 50; // 50-80°F
      const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
      const result = {
        success: true,
        data: {
          location,
          temperature: temp,
          unit: "°F",
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity,
        },
      };
      console.log("[getWeather] Returning result:", result);
      return result;
    },
    render: ({ status, result, args }) => {
      console.log(
        "[getWeather render] status:",
        status,
        "args:",
        args,
        "result:",
        result,
      );
      const data =
        status === "completed" && result?.success
          ? (result.data as {
              temperature?: number;
              condition?: string;
              humidity?: number;
            })
          : null;
      const isLoading = status === "pending" || status === "executing";

      return (
        <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-500/30 bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-1">
                {args?.location || "Loading..."}
              </p>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-sky-500 mt-2" />
              )}
              {status === "completed" && data && (
                <>
                  <p className="text-3xl font-light text-sky-900 dark:text-sky-100">
                    {data.temperature}°F
                  </p>
                  <p className="text-sm text-sky-700 dark:text-sky-300">
                    {data.condition}
                  </p>
                  <p className="text-xs text-sky-600/70 dark:text-sky-400/70 mt-1">
                    Humidity: {data.humidity}%
                  </p>
                </>
              )}
              {status === "error" && (
                <p className="text-xs text-red-500 mt-1">
                  Error loading weather
                </p>
              )}
            </div>
            <Cloud className="h-10 w-10 text-sky-400 dark:text-sky-500/60" />
          </div>
        </div>
      );
    },
  });

  // Stock Tool (Generative UI)
  useTool({
    name: "getStockPrice",
    description: "Get current stock price and market data for a ticker symbol.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock ticker symbol (e.g., 'AAPL', 'GOOGL', 'TSLA')",
        },
      },
      required: ["symbol"],
    },
    handler: async ({ symbol }: { symbol: string }) => {
      console.log("[getStockPrice] Handler called with symbol:", symbol);
      // Simple delay without using component function
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock stock data
      const basePrice =
        symbol.toUpperCase() === "AAPL"
          ? 187
          : symbol.toUpperCase() === "GOOGL"
            ? 142
            : symbol.toUpperCase() === "TSLA"
              ? 248
              : Math.floor(Math.random() * 200) + 50;
      const change = (Math.random() * 6 - 3).toFixed(2);
      const changePercent = (Math.random() * 4 - 2).toFixed(2);
      const result = {
        success: true,
        data: {
          symbol: symbol.toUpperCase(),
          price: basePrice + Math.random() * 5,
          change: parseFloat(change),
          changePercent: parseFloat(changePercent),
          volume: Math.floor(Math.random() * 50000000) + 10000000,
          marketCap: `${(basePrice * 15).toFixed(0)}B`,
        },
      };
      console.log("[getStockPrice] Returning result:", result);
      return result;
    },
    render: ({ status, args, result }) => {
      if (status === "completed" && result?.success) {
        const data = result.data as {
          price?: number;
          change?: number;
          changePercent?: number;
          volume?: number;
          marketCap?: string;
        };
        const isPositive = (data?.change ?? 0) >= 0;
        return (
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500 font-mono">
                  {args.symbol?.toUpperCase()}
                </p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  ${data.price?.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {isPositive ? "+" : ""}
                  {data.change?.toFixed(2)} ({data.changePercent?.toFixed(2)}%)
                </p>
              </div>
              <TrendingUp
                className={`h-8 w-8 ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
              />
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-xs text-zinc-500">
              <span>Vol: {((data.volume ?? 0) / 1000000).toFixed(1)}M</span>
              <span>Cap: ${data.marketCap}</span>
            </div>
          </div>
        );
      }
      return null;
    },
  });

  // Provide context to AI
  useAIContext({
    key: "dashboardState",
    data: dashboardState,
    description:
      "Current dashboard state with counter, cartItems, preference, and notifications",
  });
  useAIContext({
    key: "availableTools",
    data: [
      "updateCounter",
      "updatePreference",
      "addNotification",
      "updateCart",
      "getWeather",
      "getStockPrice",
    ],
    description: "List of available tools that can be used",
  });
  useAIContext({
    key: "currentUser",
    data: currentPerson,
    description:
      "Current user's profile including name, email, role, subscription plan, credits, and preferences",
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <ToolOutput states={toolStates} />
      <div
        className="flex-1 min-h-0"
        data-csdk-theme={theme === "default" ? undefined : theme}
      >
        <CopilotChat placeholder="Enter command..." className="h-full" />
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  const [copilotTheme, setCopilotTheme] = useState<CopilotTheme>("default");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful SDK demo assistant. Use available tools to interact with the dashboard. Be concise.",
  );
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [generativeUI, setGenerativeUI] = useState({
    weather: true,
    stock: true,
    notification: false,
  });
  const [toolsEnabled, setToolsEnabled] = useState({
    updateCounter: true,
    updatePreference: true,
    addNotification: true,
    updateCart: true,
  });
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    counter: 0,
    userPreference: "auto",
    notifications: [],
    cartItems: 0,
  });
  const [appState, setAppState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [selectedPerson, setSelectedPerson] = useState<PersonData>(
    samplePersons[0],
  );
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderId>("openai");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: "",
    anthropic: "",
    google: "",
    xai: "",
  });
  const [providerKey, setProviderKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Load API keys from localStorage
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    // Show welcome modal if not dismissed
    const welcomeDismissed = localStorage.getItem(WELCOME_DISMISSED_KEY);
    if (!welcomeDismissed) {
      setWelcomeModalOpen(true);
    }
  }, []);

  const handleSaveApiKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
    // Force re-render of CopilotProvider
    setProviderKey((prev) => prev + 1);
  };

  const resetDashboard = useCallback(() => {
    setDashboardState({
      counter: 0,
      userPreference: "auto",
      notifications: [],
      cartItems: 0,
    });
  }, []);

  const hasApiKey = !!apiKeys[selectedProvider];
  const currentProvider = providers.find((p) => p.id === selectedProvider)!;

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="relative z-10 border-b border-zinc-300 dark:border-zinc-800 px-5 py-3 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <CopilotSDKLogo className="h-7 w-7" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight">
              Copilot SDK Playground
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Interactive Demo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* API Key Status & Button */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
              hasApiKey
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
            }`}
          >
            {hasApiKey ? (
              <>
                <Check className="h-3 w-3" />
                <span className="text-[10px] font-mono">API Key Set</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                <span className="text-[10px] font-mono">Add API Key</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Main Panel */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-5xl">
            {/* Config Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Configuration
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Theme */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      theme
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setCopilotTheme(t.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono transition-all ${
                          copilotTheme === t.id
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-transparent"
                            : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                        }`}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.accent }}
                        />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* System Prompt */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      systemPrompt
                    </span>
                  </div>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full h-24 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 resize-none focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    placeholder="// System prompt..."
                  />
                </div>
              </div>
            </section>

            {/* Generative UI Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Box className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Generative UI Modules
                </h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
                {(["weather", "stock", "notification"] as const).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <button
                      onClick={() =>
                        setGenerativeUI((p) => ({ ...p, [key]: !p[key] }))
                      }
                      className={`relative h-5 w-9 rounded-full transition-colors ${generativeUI[key] ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${generativeUI[key] ? "translate-x-4 left-0.5" : "translate-x-0 left-0.5"}`}
                      />
                    </button>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                      {key}
                    </span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <WeatherModule show={generativeUI.weather} />
                <StockModule show={generativeUI.stock} />
                <AlertModule show={generativeUI.notification} />
              </div>
            </section>

            {/* Tools Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Registered Tools
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {(
                  Object.keys(toolsEnabled) as (keyof typeof toolsEnabled)[]
                ).map((tool) => (
                  <button
                    key={tool}
                    onClick={() =>
                      setToolsEnabled((p) => ({ ...p, [tool]: !p[tool] }))
                    }
                    className={`relative overflow-hidden rounded-lg border p-3 text-left transition-all ${
                      toolsEnabled[tool]
                        ? "border-emerald-400/50 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5"
                        : "border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-700"
                    }`}
                  >
                    {toolsEnabled[tool] && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl rounded-full" />
                    )}
                    <div className="relative flex items-center justify-between mb-2">
                      <StatusDot
                        active={toolsEnabled[tool]}
                        pulse={toolsEnabled[tool]}
                      />
                      <span
                        className={`text-[10px] font-mono ${toolsEnabled[tool] ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-600"}`}
                      >
                        {toolsEnabled[tool] ? "ACTIVE" : "OFF"}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate">
                      {tool}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Dashboard State */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Live State
                  </h2>
                </div>
                <button
                  onClick={resetDashboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  RESET
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {/* Counter */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Counter
                  </span>
                  <p className="text-3xl font-light text-zinc-900 dark:text-white mt-1 mb-3 tabular-nums">
                    {dashboardState.counter}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setDashboardState((p) => ({
                          ...p,
                          counter: p.counter - 1,
                        }))
                      }
                      className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Minus className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                    </button>
                    <button
                      onClick={() =>
                        setDashboardState((p) => ({
                          ...p,
                          counter: p.counter + 1,
                        }))
                      }
                      className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Plus className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Cart */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Cart
                  </span>
                  <p className="text-3xl font-light text-zinc-900 dark:text-white mt-1 mb-3 tabular-nums">
                    {dashboardState.cartItems}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setDashboardState((p) => ({
                          ...p,
                          cartItems: p.cartItems + 1,
                        }))
                      }
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-[10px] font-mono text-zinc-500 dark:text-zinc-400"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      ADD
                    </button>
                    <button
                      onClick={() =>
                        setDashboardState((p) => ({ ...p, cartItems: 0 }))
                      }
                      className="flex items-center justify-center px-2 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Preference */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Preference
                  </span>
                  <p className="text-lg font-mono text-indigo-600 dark:text-indigo-400 mt-2">
                    {dashboardState.userPreference}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
                    via tool call
                  </p>
                </div>

                {/* Notifications */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Notifications
                  </span>
                  <p className="text-3xl font-light text-zinc-900 dark:text-white mt-1 tabular-nums">
                    {dashboardState.notifications.length}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
                    in queue
                  </p>
                </div>
              </div>
            </section>

            {/* Context Demo */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  useAIContext Demo
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Person Selector */}
                <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    Select a user profile. The AI sees this context and responds
                    accordingly.
                  </p>
                  <div className="space-y-2">
                    {samplePersons.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => setSelectedPerson(person)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedPerson.id === person.id
                            ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30"
                            : "bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            {person.name}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              person.plan === "enterprise"
                                ? "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
                                : person.plan === "pro"
                                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
                            }`}
                          >
                            {person.plan}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          {person.role} · {person.credits.toLocaleString()}{" "}
                          credits
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Preview & Example Questions */}
                <div className="space-y-4">
                  {/* Context JSON Preview */}
                  <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3">
                    <p className="text-[10px] font-mono text-zinc-400 mb-2">
                      // AI receives this context
                    </p>
                    <pre className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto">
                      {`{
  "name": "${selectedPerson.name}",
  "plan": "${selectedPerson.plan}",
  "credits": ${selectedPerson.credits},
  "role": "${selectedPerson.role}"
}`}
                    </pre>
                  </div>

                  {/* Example Questions */}
                  <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3">
                    <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                      Try asking:
                    </p>
                    <div className="space-y-1.5">
                      {[
                        "What's my current plan?",
                        "How many credits do I have?",
                        "What's my name and role?",
                        "Am I on the enterprise plan?",
                      ].map((q, i) => (
                        <p
                          key={i}
                          className="text-xs text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded"
                        >
                          &quot;{q}&quot;
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Copilot Sidebar */}
        <div className="w-[440px] border-l border-zinc-300 dark:border-zinc-800 flex flex-col shrink-0 bg-zinc-50 dark:bg-zinc-900">
          <div className="px-4 py-2.5 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: hasApiKey
                    ? currentProvider.color
                    : "#a1a1aa",
                }}
              />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Copilot
              </span>
            </div>
            <Select
              value={selectedProvider}
              onValueChange={(v) => setSelectedProvider(v as ProviderId)}
            >
              <SelectTrigger className="h-7 w-auto min-w-[140px] text-[10px] font-mono border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <SelectValue>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: currentProvider.color }}
                    />
                    {currentProvider.name} · {currentProvider.model}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end" className="min-w-[180px]">
                {providers.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    className="text-xs font-mono"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>{p.name}</span>
                      <span className="text-zinc-400">· {p.model}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-h-0">
            <CopilotProvider
              key={`${providerKey}-${selectedProvider}-${apiKeys[selectedProvider]}`}
              runtimeUrl={`/api/${selectedProvider}${apiKeys[selectedProvider] ? `?key=${encodeURIComponent(apiKeys[selectedProvider])}` : ""}`}
              systemPrompt={`${systemPrompt}\n\nCurrent app state: ${appState}`}
            >
              <CopilotPanel
                theme={copilotTheme}
                toolsEnabled={toolsEnabled}
                generativeUI={generativeUI}
                dashboardState={dashboardState}
                setDashboardState={setDashboardState}
                currentPerson={selectedPerson}
              />
            </CopilotProvider>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        apiKeys={apiKeys}
        onSave={handleSaveApiKeys}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        open={welcomeModalOpen}
        onOpenChange={setWelcomeModalOpen}
      />
    </div>
  );
}
