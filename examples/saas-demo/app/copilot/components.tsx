"use client";

import { useCopilotChatContext } from "@yourgpt/copilot-sdk/ui";
import { CreditCard, Calendar, HeartPulse, ArrowUpRight } from "lucide-react";

// Colors for mini charts
export const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

// ============================================
// Suggestion Card Component (uses chat context)
// ============================================
export function SuggestionCard({
  icon: Icon,
  label,
  iconBg,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconBg: string;
  iconColor: string;
}) {
  const { send } = useCopilotChatContext();

  return (
    <button
      onClick={() => send(label)}
      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                 bg-card/80 border border-border/50
                 hover:bg-card hover:border-border hover:shadow-md
                 transition-all duration-200 text-left"
    >
      <div
        className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center
                      group-hover:scale-105 transition-transform duration-200`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <span className="text-sm text-foreground/90 group-hover:text-foreground">
        {label}
      </span>
    </button>
  );
}

// ============================================
// Custom Suggestions Grid (inside CopilotChat context)
// ============================================
export function CustomSuggestions() {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <SuggestionCard
        icon={CreditCard}
        label="What are my subscriptions?"
        iconBg="bg-violet-500/15"
        iconColor="text-violet-400"
      />
      <SuggestionCard
        icon={Calendar}
        label="Upcoming bills"
        iconBg="bg-blue-500/15"
        iconColor="text-blue-400"
      />
      <SuggestionCard
        icon={HeartPulse}
        label="Check my finances"
        iconBg="bg-emerald-500/15"
        iconColor="text-emerald-400"
      />
      <SuggestionCard
        icon={ArrowUpRight}
        label="Move $200 to savings"
        iconBg="bg-amber-500/15"
        iconColor="text-amber-400"
      />
    </div>
  );
}
