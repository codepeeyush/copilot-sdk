"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Send,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type DashboardView =
  | "overview"
  | "accounts"
  | "transactions"
  | "analytics"
  | "payments"
  | "cards"
  | "settings";

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navItems: {
  id: DashboardView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "accounts", label: "Accounts", icon: Wallet },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "payments", label: "Payments", icon: Send },
  { id: "cards", label: "Cards", icon: CreditCard },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "bg-card border-r border-border/50 h-full flex flex-col transition-all duration-300 ease-in-out relative overflow- z-[222]",
          isExpanded ? "w-52" : "w-16",
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        >
          {isExpanded ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Logo Section */}
        <div
          className={cn(
            "p-4 border-b border-border/50",
            isExpanded ? "px-4" : "px-3",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
            </div>
            {isExpanded && (
              <div className="overflow-hidden">
                <h2 className="font-semibold text-foreground text-sm truncate">
                  SecureBank
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  Banking
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const button = (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full h-10 transition-all duration-200",
                  isExpanded
                    ? "justify-start gap-3 px-3"
                    : "justify-center px-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                onClick={() => onViewChange(item.id)}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive && "text-primary-foreground",
                  )}
                />
                {isExpanded && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </Button>
            );

            if (!isExpanded) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="text-sm">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return button;
          })}

          <div className="pt-2 border-t border-border/50 mt-2">
            {(() => {
              const isActive = currentView === "settings";
              const button = (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-10 transition-all duration-200",
                    isExpanded
                      ? "justify-start gap-3 px-3"
                      : "justify-center px-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary hover:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                  onClick={() => onViewChange("settings")}
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  {isExpanded && (
                    <span className="text-sm font-medium">Settings</span>
                  )}
                </Button>
              );

              if (!isExpanded) {
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" className="text-sm">
                      Settings
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return button;
            })()}
          </div>
        </nav>

        {/* User Section */}
        <div
          className={cn(
            "p-3 border-t border-border/50",
            isExpanded ? "px-4" : "px-2",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                  !isExpanded && "justify-center",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shadow-sm flex-shrink-0">
                  AM
                </div>
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      Alex Morgan
                    </p>
                    <p className="text-xs text-muted-foreground">Premium</p>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right" className="text-sm">
                Alex Morgan
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
