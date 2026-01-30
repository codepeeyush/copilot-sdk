"use client";

import { memo } from "react";
import {
  Activity,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import type { DashboardState } from "@/lib/types";

interface LiveStateSectionProps {
  dashboardState: DashboardState;
  onIncrementCounter: () => void;
  onDecrementCounter: () => void;
  onAddToCart: () => void;
  onClearCart: () => void;
  onReset: () => void;
}

function LiveStateSectionComponent({
  dashboardState,
  onIncrementCounter,
  onDecrementCounter,
  onAddToCart,
  onClearCart,
  onReset,
}: LiveStateSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Live State
          </h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          RESET
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {/* Counter */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Counter
          </span>
          <p className="text-3xl font-light text-zinc-900 dark:text-white mt-1 mb-3 tabular-nums">
            {dashboardState.counter}
          </p>
          <div className="flex gap-1">
            <button
              onClick={onDecrementCounter}
              className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Minus className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </button>
            <button
              onClick={onIncrementCounter}
              className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Plus className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Cart */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Cart
          </span>
          <p className="text-3xl font-light text-zinc-900 dark:text-white mt-1 mb-3 tabular-nums">
            {dashboardState.cartItems}
          </p>
          <div className="flex gap-1">
            <button
              onClick={onAddToCart}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-[10px] font-mono text-zinc-500 dark:text-zinc-400"
            >
              <ShoppingCart className="h-3 w-3" />
              ADD
            </button>
            <button
              onClick={onClearCart}
              className="flex items-center justify-center px-2 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Trash2 className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Preference */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Preference
          </span>
          <p className="text-lg font-mono text-indigo-600 dark:text-indigo-400 mt-2">
            {dashboardState.userPreference}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
            via tool call
          </p>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Notifications
          </span>
          <p className="text-3xl font-light text-zinc-900 dark:text-white mt-1 tabular-nums">
            {dashboardState.notifications.length}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
            in queue
          </p>
        </div>
      </div>
    </section>
  );
}

export const LiveStateSection = memo(LiveStateSectionComponent);
