"use client";

import { useCopilotChatContext } from "@yourgpt/copilot-sdk/ui";
import {
  AlertCircle,
  CreditCard,
  FileText,
  Headphones,
  BookOpen,
  ExternalLink,
  Clock,
} from "lucide-react";

// Quick Action Chip - Compact suggestion button
function QuickActionChip({
  icon: Icon,
  label,
  accentColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accentColor: string;
}) {
  const { send } = useCopilotChatContext();

  return (
    <button
      onClick={() => send(label)}
      className="group flex items-center gap-2 px-3 py-2 rounded-full text-left transition-all duration-200 bg-muted/50 border border-border/50 hover:border-border hover:bg-muted hover:shadow-sm"
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${accentColor} bg-current/10`}
      >
        <Icon className="w-3 h-3 text-current" />
      </div>
      <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground">
        {label}
      </span>
    </button>
  );
}

// Help Article Link
function HelpArticle({
  title,
  readTime,
  href,
}: {
  title: string;
  readTime: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
        <BookOpen className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{readTime}</span>
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
    </a>
  );
}

// Main Home View Component
export function AcmeSupportHome({ input }: { input?: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-500/10 via-background to-background">
      {/* Header Section */}
      <div className="flex flex-col items-center px-4 pt-8 pb-4">
        {/* Logo */}
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 flex items-center justify-center shadow-sm">
            <img src="/logo.svg" alt="Acme" className="w-8 h-8" />
          </div>
          {/* Status dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-foreground">Acme AI</h2>
        <p className="text-muted-foreground text-sm mb-4">
          How can I help you today?
        </p>

        {/* Input - First */}
        {input && <div className="w-full">{input}</div>}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Quick Suggestions - Second */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-2">
            <QuickActionChip
              icon={AlertCircle}
              label="Why am I seeing an error?"
              accentColor="text-rose-500"
            />
            <QuickActionChip
              icon={CreditCard}
              label="Update payment"
              accentColor="text-blue-500"
            />
            <QuickActionChip
              icon={FileText}
              label="View invoices"
              accentColor="text-emerald-500"
            />
            <QuickActionChip
              icon={Headphones}
              label="Contact support"
              accentColor="text-violet-500"
            />
          </div>
        </div>

        {/* Help Articles - Last */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Popular articles
          </p>
          <div className="space-y-1 -mx-3">
            <HelpArticle
              title="How to update your billing information"
              readTime="2 min read"
              href="#"
            />
            <HelpArticle
              title="Understanding your invoice"
              readTime="3 min read"
              href="#"
            />
            <HelpArticle
              title="Troubleshooting payment errors"
              readTime="4 min read"
              href="#"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Legacy exports for backward compatibility
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

export function AcmeSuggestions() {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <SuggestionCard
        icon={AlertCircle}
        label="Why am I seeing an error?"
        iconBg="bg-rose-500/15"
        iconColor="text-rose-400"
      />
      <SuggestionCard
        icon={CreditCard}
        label="Update payment method"
        iconBg="bg-blue-500/15"
        iconColor="text-blue-400"
      />
      <SuggestionCard
        icon={FileText}
        label="View my invoices"
        iconBg="bg-emerald-500/15"
        iconColor="text-emerald-400"
      />
      <SuggestionCard
        icon={Headphones}
        label="Contact support"
        iconBg="bg-violet-500/15"
        iconColor="text-violet-400"
      />
    </div>
  );
}
