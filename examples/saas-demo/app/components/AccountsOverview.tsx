"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type Account } from "@/lib/mock-data/accounts";
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface AccountsOverviewProps {
  accounts: Account[];
}

const iconMap = {
  wallet: Wallet,
  "piggy-bank": PiggyBank,
  "trending-up": TrendingUp,
  "credit-card": CreditCard,
};

const typeStyles = {
  checking: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
  savings: {
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  investment: {
    gradient: "from-violet-500 to-violet-600",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
  credit: {
    gradient: "from-amber-500 to-amber-600",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
};

export function AccountsOverview({ accounts }: AccountsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {accounts.map((account) => {
        const Icon = iconMap[account.icon];
        const isPositive = account.trend > 0;
        const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
        const style = typeStyles[account.type];

        return (
          <Card
            key={account.id}
            className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${style.bg} ${style.text}`}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{Math.abs(account.trend)}%</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-muted-foreground text-sm">{account.name}</p>
                <p className="text-lg font-semibold text-foreground mt-0.5">
                  {account.balance < 0 ? "-" : ""}$
                  {Math.abs(account.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                  {account.accountNumber}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
