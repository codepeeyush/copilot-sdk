"use client";

import { memo } from "react";
import { Bell, Check } from "lucide-react";

interface NotificationCardProps {
  message?: string;
  queueSize?: number;
  isLoading?: boolean;
  isPreview?: boolean;
  error?: boolean;
}

function NotificationCardComponent({
  message,
  queueSize,
  isLoading,
  isPreview,
  error,
}: NotificationCardProps) {
  // Preview mode - static demo data
  if (isPreview) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 mb-1">
              Notifications
            </p>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              3 pending
            </p>
            <p className="text-[10px] text-amber-600/60 dark:text-amber-400/60 mt-1">
              Last: 2m ago
            </p>
          </div>
          <Bell className="h-8 w-8 text-amber-400 dark:text-amber-500/60" />
        </div>
      </div>
    );
  }

  // Loading state - skeleton
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-amber-200/50 dark:bg-amber-700/30 rounded animate-pulse" />
            <div className="h-3 w-20 bg-amber-200/50 dark:bg-amber-700/30 rounded animate-pulse" />
          </div>
          <Bell className="h-8 w-8 text-amber-300 dark:text-amber-600/40 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-red-200 dark:border-red-500/30 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-red-600/70 dark:text-red-400/70 mb-1">
              Notification
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to send
            </p>
          </div>
          <Bell className="h-8 w-8 text-red-300 dark:text-red-500/40" />
        </div>
      </div>
    );
  }

  // Completed state - actual data
  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 shrink-0">
          <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70">
              Notification Added
            </p>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-200 truncate">
            &quot;{message}&quot;
          </p>
          {queueSize !== undefined && (
            <p className="text-[10px] text-amber-600/60 dark:text-amber-400/60 mt-1">
              Queue: {queueSize} notification(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const NotificationCard = memo(NotificationCardComponent);
