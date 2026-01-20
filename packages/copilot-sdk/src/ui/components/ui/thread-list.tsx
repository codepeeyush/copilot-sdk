"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import type { Thread } from "../../../core/types/thread";

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

export interface ThreadListProps {
  /** List of threads to display */
  threads: Thread[];
  /** Currently selected thread ID */
  selectedId?: string | null;
  /** Called when a thread is selected */
  onSelect?: (threadId: string) => void;
  /** Called when a thread's delete button is clicked */
  onDelete?: (threadId: string) => void;
  /** Called when "New conversation" is clicked */
  onNewThread?: () => void;
  /** Text for new conversation button */
  newThreadLabel?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state text */
  emptyText?: string;
  /** Show delete buttons */
  showDelete?: boolean;
  /** Additional class name */
  className?: string;
}

export interface ThreadCardProps {
  /** Thread data */
  thread: Thread;
  /** Whether this thread is selected */
  selected?: boolean;
  /** Called when clicked */
  onClick?: () => void;
  /** Called when delete is clicked */
  onDelete?: () => void;
  /** Show delete button */
  showDelete?: boolean;
  /** Additional class name */
  className?: string;
}

// ============================================
// Icons
// ============================================

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
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

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

// ============================================
// Loading Skeleton
// ============================================

function ThreadCardSkeleton() {
  return (
    <div className="p-3 rounded-lg border bg-card animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Thread Card Component
// ============================================

/**
 * ThreadCard - Individual thread item in the list
 */
export function ThreadCard({
  thread,
  selected = false,
  onClick,
  onDelete,
  showDelete = true,
  className,
}: ThreadCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full p-3 rounded-lg border bg-card text-left transition-colors",
        "hover:bg-accent hover:border-accent-foreground/20",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        selected && "bg-accent border-primary/50",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            selected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <MessageIcon />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm truncate">
              {thread.title || "Untitled conversation"}
            </h3>
            {showDelete && isHovered && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className={cn(
                  "flex-shrink-0 p-1 rounded",
                  "hover:bg-destructive/10 hover:text-destructive",
                  "focus:outline-none focus:ring-2 focus:ring-destructive",
                )}
                aria-label="Delete conversation"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {thread.preview && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {thread.preview}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {thread.messageCount !== undefined && thread.messageCount > 0 && (
              <span>{thread.messageCount} messages</span>
            )}
            {thread.messageCount !== undefined &&
              thread.messageCount > 0 &&
              thread.updatedAt && <span>·</span>}
            {thread.updatedAt && <span>{formatDate(thread.updatedAt)}</span>}
          </div>
        </div>
      </div>
    </button>
  );
}

// ============================================
// Thread List Component
// ============================================

/**
 * ThreadList - Card-based list of conversations
 *
 * @example
 * ```tsx
 * const { threads, currentThread, switchThread, deleteThread, createThread } = useThreadManager();
 *
 * <ThreadList
 *   threads={threads}
 *   selectedId={currentThread?.id}
 *   onSelect={switchThread}
 *   onDelete={deleteThread}
 *   onNewThread={() => createThread()}
 * />
 * ```
 */
export function ThreadList({
  threads,
  selectedId,
  onSelect,
  onDelete,
  onNewThread,
  newThreadLabel = "New conversation",
  loading = false,
  emptyText = "No conversations yet",
  showDelete = true,
  className,
}: ThreadListProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* New conversation button */}
      {onNewThread && (
        <button
          type="button"
          onClick={onNewThread}
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg border border-dashed",
            "hover:bg-accent hover:border-accent-foreground/20",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-colors",
          )}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <PlusIcon className="text-primary" />
          </div>
          <span className="font-medium text-sm">{newThreadLabel}</span>
        </button>
      )}

      {/* Loading state */}
      {loading && (
        <>
          <ThreadCardSkeleton />
          <ThreadCardSkeleton />
          <ThreadCardSkeleton />
        </>
      )}

      {/* Thread list */}
      {!loading &&
        threads.length > 0 &&
        threads.map((thread) => (
          <ThreadCard
            key={thread.id}
            thread={thread}
            selected={selectedId === thread.id}
            onClick={() => onSelect?.(thread.id)}
            onDelete={() => onDelete?.(thread.id)}
            showDelete={showDelete}
          />
        ))}

      {/* Empty state */}
      {!loading && threads.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      )}
    </div>
  );
}
