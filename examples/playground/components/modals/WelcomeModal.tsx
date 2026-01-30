"use client";

import { useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Key, Github, ExternalLink, Rocket } from "lucide-react";
import { GITHUB_REPO_URL } from "@/lib/constants";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTryWithApiKeys: () => void;
}

function WelcomeModalComponent({
  open,
  onOpenChange,
  onTryWithApiKeys,
}: WelcomeModalProps) {
  const handleTryHere = useCallback(() => {
    onOpenChange(false);
    onTryWithApiKeys();
  }, [onOpenChange, onTryWithApiKeys]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Rocket className="h-5 w-5 text-indigo-500" />
            Welcome to Copilot SDK Playground
          </DialogTitle>
          <DialogDescription className="text-xs">
            Choose how you want to explore the SDK features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {/* Option 1: Run Locally */}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Github className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Run Locally
              </p>
              <ExternalLink className="h-3 w-3 text-zinc-400 ml-auto" />
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Clone the repo for full experience with tool execution.
            </p>
          </a>

          {/* Option 2: Try Here */}
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Try Here
              </p>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
              Add your API keys to test directly in the browser.
            </p>
            <button
              onClick={handleTryHere}
              className="w-full px-4 py-2 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Key className="h-3.5 w-3.5" />
              Add API Keys
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const WelcomeModal = memo(WelcomeModalComponent);
