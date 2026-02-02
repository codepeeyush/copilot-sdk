"use client";

import React from "react";
import { cn } from "../../../lib/utils";
import { TypingLoader } from "../../ui/loader";

/**
 * Props for LoopProgress
 */
export interface LoopProgressProps {
  /** Current iteration (1-indexed) */
  iteration: number;
  /** Maximum iterations allowed */
  maxIterations: number;
  /** Whether the loop is currently running */
  isRunning?: boolean;
  /** Whether max iterations was reached */
  maxReached?: boolean;
  /** Class name for the container */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show label */
  showLabel?: boolean;
  /** Custom label format function */
  formatLabel?: (iteration: number, maxIterations: number) => string;
}

/**
 * Loop Progress Component
 *
 * Displays the progress of the agentic loop with iteration count
 * and a progress bar visualization.
 *
 * @example
 * ```tsx
 * <LoopProgress
 *   iteration={3}
 *   maxIterations={20}
 *   isRunning={true}
 * />
 * ```
 */
export function LoopProgress({
  iteration,
  maxIterations,
  isRunning = false,
  maxReached = false,
  className,
  size = "md",
  showLabel = true,
  formatLabel,
}: LoopProgressProps) {
  const progress = Math.min((iteration / maxIterations) * 100, 100);

  const defaultLabel =
    formatLabel?.(iteration, maxIterations) ??
    `${iteration}/${maxIterations} iterations`;

  const sizeClasses = {
    sm: {
      container: "gap-1.5",
      bar: "h-1",
      text: "text-xs",
      loader: "sm" as const,
    },
    md: {
      container: "gap-2",
      bar: "h-1.5",
      text: "text-sm",
      loader: "sm" as const,
    },
    lg: {
      container: "gap-2.5",
      bar: "h-2",
      text: "text-base",
      loader: "md" as const,
    },
  };

  const classes = sizeClasses[size];

  // Determine color based on state
  const getProgressColor = () => {
    if (maxReached) return "bg-yellow-500";
    if (progress >= 80) return "bg-orange-500";
    if (isRunning) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className={cn("flex flex-col", classes.container, className)}>
      {/* Label and status */}
      <div className="flex items-center justify-between">
        {showLabel && (
          <div className="flex items-center gap-2">
            {isRunning && (
              <TypingLoader size={classes.loader} className="text-blue-500" />
            )}
            <span
              className={cn(
                classes.text,
                "font-medium",
                maxReached
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-foreground",
              )}
            >
              {defaultLabel}
            </span>
          </div>
        )}

        {maxReached && (
          <span className="text-xs text-yellow-600 dark:text-yellow-400">
            Max reached
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          classes.bar,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            getProgressColor(),
            isRunning && "animate-pulse",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Compact Loop Progress Component
 *
 * A more compact version that shows only the iteration count as a badge.
 *
 * @example
 * ```tsx
 * <LoopProgressBadge iteration={3} maxIterations={20} isRunning />
 * ```
 */
export interface LoopProgressBadgeProps {
  /** Current iteration (1-indexed) */
  iteration: number;
  /** Maximum iterations allowed */
  maxIterations: number;
  /** Whether the loop is currently running */
  isRunning?: boolean;
  /** Whether max iterations was reached */
  maxReached?: boolean;
  /** Class name for the badge */
  className?: string;
}

export function LoopProgressBadge({
  iteration,
  maxIterations,
  isRunning = false,
  maxReached = false,
  className,
}: LoopProgressBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        maxReached
          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
          : isRunning
            ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
            : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {isRunning && <TypingLoader size="sm" className="size-3" />}
      <span>
        {iteration}/{maxIterations}
      </span>
      {maxReached && (
        <svg
          className="size-3 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      )}
    </div>
  );
}
