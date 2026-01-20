"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { CloseIcon } from "../../icons";
import CopilotSDKLogo from "../../icons/copilot-sdk-logo";

const DEFAULT_NAME = "AI Copilot";

export type ChatHeaderProps = {
  /** Logo image URL (pass empty string to hide logo) */
  logo?: string;
  /** Copilot name */
  name?: string;
  /** @deprecated Use `name` instead */
  title?: string;
  /** Thread picker element (injected by parent) */
  threadPicker?: React.ReactNode;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Additional class names */
  className?: string;
};

export function ChatHeader({
  logo,
  name,
  title,
  threadPicker,
  onClose,
  className,
}: ChatHeaderProps) {
  const displayName = name || title || DEFAULT_NAME;
  // Use custom logo URL if provided, otherwise use default SDK logo
  // Pass empty string to hide logo entirely
  const showDefaultLogo = logo === undefined;
  const showCustomLogo = typeof logo === "string" && logo.length > 0;

  return (
    <div
      className={cn(
        "flex flex-col border-b border-border bg-background",
        className,
      )}
    >
      {/* Top row: Logo + Name + Close */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2.5 shrink-0">
          {showDefaultLogo && <CopilotSDKLogo className="h-6 w-auto" />}
          {showCustomLogo && (
            <img
              src={logo}
              alt={displayName}
              className="size-6 rounded-md object-contain"
            />
          )}
          <div>
            <div className="font-semibold text-foreground text-sm mb-0.5">
              {displayName}
            </div>
            {/* Bottom row: Thread Picker */}
            {threadPicker && <div className="">{threadPicker}</div>}
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close chat"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
