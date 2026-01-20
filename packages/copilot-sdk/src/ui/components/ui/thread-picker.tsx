"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import type { Thread } from "../../../core/types/thread";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

// ============================================
// Helper Functions
// ============================================

/**
 * Format a date for display
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60 * 1000) {
    return "Just now";
  }

  // Less than 1 hour
  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / (60 * 1000));
    return `${mins}m ago`;
  }

  // Less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}h ago`;
  }

  // Less than 7 days
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d ago`;
  }

  // Otherwise show date
  return date.toLocaleDateString();
}

// ============================================
// Types
// ============================================

export interface ThreadPickerProps {
  /** Currently selected thread ID */
  value?: string | null;
  /** List of threads to display */
  threads: Thread[];
  /** Called when a thread is selected */
  onSelect?: (threadId: string) => void;
  /** Called when "New conversation" is clicked */
  onNewThread?: () => void;
  /** Placeholder text when no thread is selected */
  placeholder?: string;
  /** Text for new conversation button */
  newThreadLabel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional class name for root container */
  className?: string;
  /** Class name for the trigger button */
  buttonClassName?: string;
  /** Class name for the dropdown container */
  dropdownClassName?: string;
  /** Class name for thread items */
  itemClassName?: string;
  /** Class name for the new conversation button */
  newButtonClassName?: string;
}

// ============================================
// Icons
// ============================================

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ============================================
// Component
// ============================================

/**
 * ThreadPicker - Dropdown for selecting conversations
 *
 * @example
 * ```tsx
 * const { threads, currentThread, switchThread, createThread } = useThreadManager();
 *
 * <ThreadPicker
 *   value={currentThread?.id}
 *   threads={threads}
 *   onSelect={switchThread}
 *   onNewThread={() => createThread()}
 * />
 * ```
 */
export function ThreadPicker({
  value,
  threads,
  onSelect,
  onNewThread,
  placeholder = "Select conversation...",
  newThreadLabel = "New conversation",
  disabled = false,
  loading = false,
  size = "md",
  className,
  buttonClassName,
  dropdownClassName,
  itemClassName,
  newButtonClassName,
}: ThreadPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Find selected thread
  const selectedThread = React.useMemo(() => {
    if (!value) return null;
    return threads.find((t) => t.id === value) ?? null;
  }, [value, threads]);

  const handleSelect = (threadId: string) => {
    onSelect?.(threadId);
    setIsOpen(false);
  };

  const handleNewThread = () => {
    onNewThread?.();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled || loading}
        className={cn(
          "flex items-center gap-1 w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className,
          buttonClassName,
        )}
      >
        <div className="flex items-center gap-1 min-w-0 text-xs flex-1">
          {loading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : selectedThread ? (
            <span className="truncate font-medium text-muted-foreground hover:text-foreground">
              {selectedThread.title || "Untitled conversation"}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>

        <ChevronIcon
          className={cn(
            "flex-shrink-0 size-3 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn(
          "w-[var(--anchor-width)] min-w-[250px] p-0 max-h-[300px] overflow-auto",
          dropdownClassName,
        )}
      >
        {/* New conversation button */}
        {onNewThread && (
          <button
            type="button"
            onClick={handleNewThread}
            className={cn(
              "flex items-center gap-2 w-full px-2.5 py-1.5 text-left",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground focus:outline-none",
              "border-b",
              newButtonClassName,
            )}
          >
            <PlusIcon className="text-primary size-3" />
            <span className="font-medium text-xs">{newThreadLabel}</span>
          </button>
        )}

        {/* Thread list */}
        {threads.length > 0 ? (
          threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => handleSelect(thread.id)}
              className={cn(
                "flex flex-col gap-0.5 w-full px-2.5 py-1.5 text-left",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                value === thread.id && "bg-accent",
                itemClassName,
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-xs truncate">
                  {thread.title || "Untitled conversation"}
                </span>
                {value === thread.id && (
                  <CheckIcon className="flex-shrink-0 text-primary size-3" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {thread.preview && (
                  <span className="truncate max-w-[180px]">
                    {thread.preview}
                  </span>
                )}
                {thread.preview && thread.updatedAt && (
                  <span className="flex-shrink-0">·</span>
                )}
                {thread.updatedAt && (
                  <span className="flex-shrink-0">
                    {formatDate(thread.updatedAt)}
                  </span>
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="px-2.5 py-3 text-center text-xs text-muted-foreground">
            No conversations yet
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
