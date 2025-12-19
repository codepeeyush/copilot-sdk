"use client";

import { cn } from "../../lib/utils";

export type PoweredByProps = {
  className?: string;
  showLogo?: boolean;
};

function YourGPTLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function PoweredBy({ className, showLogo = true }: PoweredByProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground",
        className,
      )}
    >
      <span>Powered by</span>
      {showLogo && <YourGPTLogo className="h-3 w-3" />}
      <a
        href="https://yourgpt.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground hover:underline"
      >
        YourGPT
      </a>
    </div>
  );
}
