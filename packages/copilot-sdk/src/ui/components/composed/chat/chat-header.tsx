"use client";

import { cn } from "../../../lib/utils";
import { CloseIcon } from "../../icons";

type ChatHeaderProps = {
  title?: string;
  onClose?: () => void;
  className?: string;
};

export function ChatHeader({ title, onClose, className }: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-4 py-3",
        className,
      )}
    >
      <h2 className="font-semibold text-foreground">{title || "Chat"}</h2>
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
  );
}
