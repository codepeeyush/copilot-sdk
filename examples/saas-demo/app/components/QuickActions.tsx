"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Receipt, FileDown, Plus } from "lucide-react";

interface QuickActionsProps {
  onTransferClick: () => void;
  onPayBillClick: () => void;
}

export function QuickActions({
  onTransferClick,
  onPayBillClick,
}: QuickActionsProps) {
  const actions = [
    {
      label: "Transfer",
      icon: Send,
      onClick: onTransferClick,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Pay Bills",
      icon: Receipt,
      onClick: onPayBillClick,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Statement",
      icon: FileDown,
      onClick: () => alert("Downloading..."),
      gradient: "from-violet-500 to-violet-600",
    },
    {
      label: "Add Account",
      icon: Plus,
      onClick: () => {},
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="group p-4 rounded-lg bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all text-left"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2.5`}
              >
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
