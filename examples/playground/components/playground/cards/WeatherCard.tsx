"use client";

import { memo } from "react";
import { Cloud } from "lucide-react";

interface WeatherCardProps {
  location?: string;
  temperature?: number;
  condition?: string;
  humidity?: number;
  isLoading?: boolean;
  isPreview?: boolean;
  error?: boolean;
}

function WeatherCardComponent({
  location,
  temperature,
  condition,
  humidity,
  isLoading,
  isPreview,
  error,
}: WeatherCardProps) {
  // Preview mode - static demo data
  if (isPreview) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-sky-200 dark:border-sky-500/30 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-sky-600/70 dark:text-sky-400/70 mb-1">
              Weather API
            </p>
            <p className="text-2xl font-light text-sky-900 dark:text-sky-100">
              72°F
            </p>
            <p className="text-xs text-sky-700 dark:text-sky-300 mt-0.5">
              Clear skies
            </p>
            <p className="text-[10px] text-sky-600/60 dark:text-sky-400/60 mt-1">
              San Francisco
            </p>
          </div>
          <Cloud className="h-8 w-8 text-sky-400 dark:text-sky-500/60" />
        </div>
      </div>
    );
  }

  // Loading state - skeleton
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-sky-200 dark:border-sky-500/30 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-sky-600/70 dark:text-sky-400/70">
              {location || "Loading..."}
            </p>
            <div className="h-7 w-20 bg-sky-200/50 dark:bg-sky-700/30 rounded animate-pulse" />
            <div className="h-4 w-24 bg-sky-200/50 dark:bg-sky-700/30 rounded animate-pulse" />
          </div>
          <Cloud className="h-8 w-8 text-sky-300 dark:text-sky-600/40 animate-pulse" />
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
              Weather API
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load
            </p>
          </div>
          <Cloud className="h-8 w-8 text-red-300 dark:text-red-500/40" />
        </div>
      </div>
    );
  }

  // Completed state - actual data
  return (
    <div className="relative overflow-hidden rounded-xl border border-sky-200 dark:border-sky-500/30 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-sky-600/70 dark:text-sky-400/70 mb-1">
            {location}
          </p>
          <p className="text-2xl font-light text-sky-900 dark:text-sky-100">
            {temperature}°F
          </p>
          <p className="text-xs text-sky-700 dark:text-sky-300 mt-0.5">
            {condition}
          </p>
          {humidity !== undefined && (
            <p className="text-[10px] text-sky-600/60 dark:text-sky-400/60 mt-1">
              Humidity: {humidity}%
            </p>
          )}
        </div>
        <Cloud className="h-8 w-8 text-sky-400 dark:text-sky-500/60" />
      </div>
    </div>
  );
}

export const WeatherCard = memo(WeatherCardComponent);
