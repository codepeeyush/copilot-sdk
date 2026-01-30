"use client";

import { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Key,
  BookOpen,
  ExternalLink,
  Github,
  Copy,
  Rocket,
} from "lucide-react";
import { WELCOME_DISMISSED_KEY, GITHUB_REPO_URL } from "@/lib/constants";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

function WelcomeModalComponent({ open, onOpenChange }: WelcomeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(WELCOME_DISMISSED_KEY, "true");
    onOpenChange(false);
  }, [onOpenChange]);

  const copyCommand = useCallback((cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

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

          {copied ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
              Copied to clipboard!
            </p>
          ) : null}
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

export const WelcomeModal = memo(WelcomeModalComponent);
