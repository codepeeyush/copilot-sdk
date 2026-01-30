"use client";

import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  symbol?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: string;
  isLoading?: boolean;
  isPreview?: boolean;
  error?: boolean;
}

function StockCardComponent({
  symbol,
  price,
  change,
  changePercent,
  volume,
  marketCap,
  isLoading,
  isPreview,
  error,
}: StockCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // Preview mode - static demo data
  if (isPreview) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 mb-1">
              AAPL
            </p>
            <p className="text-2xl font-light text-emerald-900 dark:text-emerald-100">
              $187.44
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              +2.34 (1.26%)
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-emerald-400 dark:text-emerald-500/60" />
        </div>
      </div>
    );
  }

  // Loading state - skeleton
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {symbol || "Loading..."}
            </p>
            <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          </div>
          <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
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
              {symbol || "Stock"}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load
            </p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-300 dark:text-red-500/40" />
        </div>
      </div>
    );
  }

  // Completed state - actual data
  const colorClasses = isPositive
    ? "border-emerald-200 dark:border-emerald-500/30 from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
    : "border-rose-200 dark:border-rose-500/30 from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20";

  const textColorClasses = isPositive
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 ${colorClasses}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            {symbol}
          </p>
          <p className="text-2xl font-light text-zinc-900 dark:text-zinc-100">
            ${price?.toFixed(2)}
          </p>
          <p className={`text-xs mt-0.5 font-medium ${textColorClasses}`}>
            {isPositive ? "+" : ""}
            {change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
          </p>
        </div>
        <TrendIcon
          className={`h-8 w-8 ${isPositive ? "text-emerald-400 dark:text-emerald-500/60" : "text-rose-400 dark:text-rose-500/60"}`}
        />
      </div>
      {(volume || marketCap) && (
        <div className="mt-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50 flex justify-between text-[10px] text-zinc-500">
          {volume && <span>Vol: {(volume / 1000000).toFixed(1)}M</span>}
          {marketCap && <span>Cap: ${marketCap}</span>}
        </div>
      )}
    </div>
  );
}

export const StockCard = memo(StockCardComponent);
