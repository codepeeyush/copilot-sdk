"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  BarChart3,
  Settings,
  Home,
  FileText,
  Download,
} from "lucide-react";

export type DashboardView =
  | "overview"
  | "users"
  | "analytics"
  | "export"
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
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "export", label: "Export", icon: Download },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 border-r bg-purple-950/30 dark:bg-purple-950/50 h-full flex flex-col">
      <div className="p-4 border-b border-purple-800/30">
        <h2 className="font-bold text-lg text-purple-100">Dashboard</h2>
        <p className="text-xs text-purple-300/70">Enterprise Copilot Demo</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-purple-200 hover:text-white hover:bg-purple-800/50",
              currentView === item.id && "bg-purple-800/70 text-white",
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t border-purple-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-medium">
            SC
          </div>
          <div>
            <p className="text-sm font-medium text-purple-100">Sarah Chen</p>
            <p className="text-xs text-purple-300/70">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
