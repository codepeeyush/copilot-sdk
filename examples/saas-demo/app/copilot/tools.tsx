"use client";

import { useTool } from "@yourgpt/copilot-sdk/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Account } from "@/lib/mock-data/accounts";
import type { DashboardView } from "@/app/components/Sidebar";
import { categoryLabels } from "@/lib/mock-data/transactions";
import { spendingByCategory } from "@/lib/mock-data/analytics";
import { CHART_COLORS } from "./components";

// Type definitions for tool results
interface SpendingAnalysisData {
  totalSpent: number;
  breakdown: { category: string; amount: number; percentage: number }[];
  insights: string[];
  recommendation: string;
}

interface FinancialHealthData {
  score: number;
  totalBalance: number;
  factors: { label: string; status: string; detail: string }[];
  recommendation: string;
}

interface SubscriptionsData {
  subscriptions: {
    name: string;
    amount: number;
    lastCharge: string;
    status: string;
    warning?: string;
  }[];
  totalMonthly: number;
  yearlyTotal: number;
  unusedCount: number;
  potentialSavings: number;
}

interface UpcomingBillsData {
  bills: {
    name: string;
    amount: number;
    dueDate: string;
    daysUntil: number;
    category: string;
  }[];
  totalDue: number;
  currentBalance: number;
  projectedBalance: number;
  isHealthy: boolean;
  criticalCount: number;
}

// ============================================
// TOOL 1: Analyze Spending (with donut chart)
// ============================================
export function useSpendingAnalysisTool(
  setCurrentView: (view: DashboardView) => void,
) {
  useTool({
    name: "analyze_spending",
    description:
      "Analyze spending patterns with insights, comparisons, and category breakdown. Use when user asks about spending, overspending, or where money is going.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional: focus on specific category",
        },
      },
    },
    handler: async ({ category }: { category?: string }) => {
      setCurrentView("analytics");
      const totalSpent = spendingByCategory.reduce(
        (sum, cat) => sum + cat.amount,
        0,
      );
      const topCategory = spendingByCategory.reduce((max, cat) =>
        cat.amount > max.amount ? cat : max,
      );

      const insights = [];
      if (topCategory.percentage > 25) {
        insights.push(
          `${categoryLabels[topCategory.category]} is your biggest expense at ${topCategory.percentage}%`,
        );
      }
      insights.push("Dining spending is 23% higher than last month");
      insights.push("You've saved $340 less than your monthly average");

      return {
        success: true,
        data: {
          totalSpent,
          breakdown: spendingByCategory.map((cat) => ({
            category: categoryLabels[cat.category],
            amount: cat.amount,
            percentage: cat.percentage,
          })),
          insights,
          recommendation:
            "Consider reducing dining expenses to meet your savings goal",
        },
      };
    },
    render: ({ status, result }) => {
      if (status === "completed" && result?.success) {
        const data = result.data as SpendingAnalysisData;
        const chartData = spendingByCategory.slice(0, 5).map((cat, i) => ({
          name: categoryLabels[cat.category],
          value: cat.amount,
          color: CHART_COLORS[i],
        }));
        const total = chartData.reduce((sum, d) => sum + d.value, 0);

        return (
          <div className="p-4 bg-card rounded-xl border border-border space-y-3">
            <div className="text-sm font-medium text-foreground">
              Spending Breakdown
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[100px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-foreground">
                    ${(total / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {chartData.slice(0, 4).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {data.insights && (
              <div className="pt-2 border-t border-border/50 space-y-1">
                {data.insights.slice(0, 2).map((insight: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400"
                  >
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      return null;
    },
  });
}

// ============================================
// TOOL 2: Financial Health Check (with score)
// ============================================
export function useFinancialHealthTool(accounts: Account[]) {
  const getTotalBalance = (accs: Account[]) =>
    accs.reduce((sum, a) => sum + a.balance, 0);

  useTool({
    name: "financial_health_check",
    description:
      "Get overall financial health score with recommendations. Use when user asks about financial health, status, or wants a checkup.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      const totalBalance = getTotalBalance(accounts);
      const savingsAccount = accounts.find((a) => a.type === "savings");
      const checkingAccount = accounts.find((a) => a.type === "checking");
      const creditCard = accounts.find((a) => a.type === "credit");

      let score = 70;
      const factors = [];

      if (savingsAccount && savingsAccount.balance > 5000) {
        score += 10;
        factors.push({
          label: "Emergency fund",
          status: "good",
          detail: "3+ months expenses covered",
        });
      } else {
        factors.push({
          label: "Emergency fund",
          status: "warning",
          detail: "Below recommended 3 months",
        });
      }

      if (creditCard && creditCard.balance < 1000) {
        score += 10;
        factors.push({
          label: "Credit utilization",
          status: "good",
          detail: "Under 30% utilized",
        });
      } else {
        score -= 5;
        factors.push({
          label: "Credit utilization",
          status: "warning",
          detail: "Consider paying down balance",
        });
      }

      if (checkingAccount && checkingAccount.balance > 1000) {
        score += 5;
        factors.push({
          label: "Cash buffer",
          status: "good",
          detail: "Healthy checking balance",
        });
      }

      factors.push({
        label: "Savings rate",
        status: "warning",
        detail: "15% below your target",
      });

      return {
        success: true,
        data: {
          score: Math.min(100, Math.max(0, score)),
          totalBalance,
          factors,
          recommendation:
            "Focus on building your emergency fund to improve your score",
        },
      };
    },
    render: ({ status, result }) => {
      if (status === "completed" && result?.success) {
        const data = result.data as FinancialHealthData;
        const score = data.score;
        const scoreColor =
          score >= 80
            ? "text-emerald-500"
            : score >= 60
              ? "text-amber-500"
              : "text-rose-500";

        return (
          <div className="p-4 bg-card rounded-xl border border-border space-y-3">
            <div className="text-sm font-medium text-foreground">
              Financial Health
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(score / 100) * 176} 176`}
                    className={scoreColor}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${scoreColor}`}>
                    {score}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {data.factors.slice(0, 3).map((factor, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {factor.status === "good" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    )}
                    <span className="text-foreground">{factor.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                {data.recommendation}
              </p>
            </div>
          </div>
        );
      }
      return null;
    },
  });
}

// ============================================
// TOOL 3: Smart Transfer (with warnings)
// ============================================
export function useSmartTransferTool(
  accounts: Account[],
  handleTransfer: (
    fromId: string,
    toId: string,
    amount: number,
    note: string,
  ) => void,
  setCurrentView: (view: DashboardView) => void,
) {
  useTool({
    name: "smart_transfer",
    description:
      "Transfer money between accounts with smart balance warnings. Use when user wants to transfer or move money.",
    inputSchema: {
      type: "object",
      properties: {
        fromAccount: {
          type: "string",
          description:
            "Source account type: 'checking', 'savings', 'investment', or 'credit'",
        },
        toAccount: {
          type: "string",
          description:
            "Destination account type: 'checking', 'savings', 'investment', or 'credit'",
        },
        amount: { type: "number", description: "Amount to transfer" },
      },
      required: ["fromAccount", "toAccount", "amount"],
    },
    needsApproval: true,
    handler: async ({
      fromAccount: fromType,
      toAccount: toType,
      amount,
    }: {
      fromAccount: string;
      toAccount: string;
      amount: number;
    }) => {
      const fromAccount = accounts.find((a) => a.type === fromType);
      const toAccount = accounts.find((a) => a.type === toType);
      if (!fromAccount || !toAccount)
        return {
          success: false,
          error: `Account not found. Available types: checking, savings, investment, credit`,
        };
      if (fromAccount.balance < amount)
        return { success: false, error: "Insufficient funds" };

      handleTransfer(fromAccount.id, toAccount.id, amount, "");
      setCurrentView("transactions");
      return {
        success: true,
        data: {
          message: `Transferred $${amount.toFixed(2)} to ${toAccount.name}`,
          newBalance: fromAccount.balance - amount,
        },
      };
    },
    render: ({ status, args, approval }) => {
      const fromAcc = accounts.find((a) => a.type === args.fromAccount);
      const toAcc = accounts.find((a) => a.type === args.toAccount);
      const remainingBalance = (fromAcc?.balance || 0) - (args.amount || 0);
      const isLowBalance = remainingBalance < 500;

      if (status === "approval-required" && approval) {
        return (
          <div className="p-4 bg-card rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">
                Transfer
              </div>
              <div className="text-lg font-bold text-foreground">
                ${args.amount?.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{fromAcc?.name}</span>
              <span>→</span>
              <span>{toAcc?.name}</span>
            </div>
            {isLowBalance && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  This leaves {fromAcc?.name} at ${remainingBalance.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => approval.onApprove()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Confirm
              </button>
              <button
                onClick={() => approval.onReject("Cancelled")}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      }

      if (status === "completed") {
        return (
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Transfer Complete
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${args.amount?.toFixed(2)} sent to {toAcc?.name}
            </p>
          </div>
        );
      }
      return null;
    },
  });
}

// ============================================
// TOOL 4: Subscription Stack (Visual Bars)
// ============================================
export function useSubscriptionsTool() {
  useTool({
    name: "analyze_subscriptions",
    description:
      "Show all recurring subscriptions with visual breakdown. Use when user asks about subscriptions, recurring charges, or monthly memberships.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      const subscriptions = [
        {
          name: "Netflix",
          amount: 15.99,
          lastCharge: "Jan 15",
          status: "active",
        },
        {
          name: "Spotify",
          amount: 10.99,
          lastCharge: "Jan 12",
          status: "active",
        },
        { name: "iCloud", amount: 9.99, lastCharge: "Jan 8", status: "active" },
        {
          name: "Gym Membership",
          amount: 49.0,
          lastCharge: "Jan 1",
          status: "active",
          warning: "No visits in 45 days",
        },
        {
          name: "HBO Max",
          amount: 15.99,
          lastCharge: "Jan 20",
          status: "active",
          warning: "Unused for 60 days",
        },
        {
          name: "Adobe CC",
          amount: 54.99,
          lastCharge: "Jan 5",
          status: "active",
        },
      ];

      const totalMonthly = subscriptions.reduce((sum, s) => sum + s.amount, 0);
      const unusedSubs = subscriptions.filter((s) => s.warning);
      const potentialSavings = unusedSubs.reduce((sum, s) => sum + s.amount, 0);

      return {
        success: true,
        data: {
          subscriptions,
          totalMonthly,
          yearlyTotal: totalMonthly * 12,
          unusedCount: unusedSubs.length,
          potentialSavings,
        },
      };
    },
    render: ({ status, result }) => {
      if (status === "completed" && result?.success) {
        const data = result.data as SubscriptionsData;
        const { subscriptions, totalMonthly, potentialSavings } = data;
        const maxAmount = Math.max(...subscriptions.map((s) => s.amount));

        return (
          <div className="p-4 bg-card rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">
                Subscriptions
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-foreground">
                  ${totalMonthly.toFixed(2)}/mo
                </div>
                <div className="text-[10px] text-muted-foreground">
                  ${(totalMonthly * 12).toFixed(0)}/year
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {subscriptions.slice(0, 5).map((sub, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{sub.name}</span>
                    <span className="font-medium text-foreground">
                      ${sub.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sub.warning ? "bg-amber-500" : "bg-blue-500"}`}
                      style={{ width: `${(sub.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                  {sub.warning && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{sub.warning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {potentialSavings > 0 && (
              <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Cancel unused → save ${potentialSavings.toFixed(2)}/mo
                </span>
              </div>
            )}
          </div>
        );
      }
      return null;
    },
  });
}

// ============================================
// TOOL 5: Upcoming Bills Timeline
// ============================================
export function useUpcomingBillsTool(accounts: Account[]) {
  useTool({
    name: "upcoming_bills",
    description:
      "Show upcoming bills on a visual timeline. Use when user asks about upcoming bills, due dates, or wants to see what's coming up.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      const checkingAccount = accounts.find((a) => a.type === "checking");
      const currentBalance = checkingAccount?.balance || 0;

      const bills = [
        {
          name: "Rent",
          amount: 1500,
          dueDate: "Feb 1",
          daysUntil: 3,
          category: "housing",
        },
        {
          name: "Electricity",
          amount: 120,
          dueDate: "Feb 5",
          daysUntil: 7,
          category: "utilities",
        },
        {
          name: "Car Insurance",
          amount: 180,
          dueDate: "Feb 10",
          daysUntil: 12,
          category: "insurance",
        },
        {
          name: "Internet",
          amount: 79,
          dueDate: "Feb 12",
          daysUntil: 14,
          category: "utilities",
        },
      ];

      const totalDue = bills.reduce((sum, b) => sum + b.amount, 0);
      const projectedBalance = currentBalance - totalDue;
      const isHealthy = projectedBalance > 500;
      const criticalBills = bills.filter((b) => b.daysUntil <= 5);

      return {
        success: true,
        data: {
          bills,
          totalDue,
          currentBalance,
          projectedBalance,
          isHealthy,
          criticalCount: criticalBills.length,
        },
      };
    },
    render: ({ status, result }) => {
      if (status === "completed" && result?.success) {
        const data = result.data as UpcomingBillsData;
        const { bills, totalDue, projectedBalance, isHealthy } = data;

        return (
          <div className="p-4 bg-card rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">
                Upcoming Bills
              </div>
              <div className="text-sm font-bold text-rose-500">
                -${totalDue.toLocaleString()}
              </div>
            </div>

            {/* Timeline visualization */}
            <div className="relative py-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
              <div className="relative flex justify-between">
                {bills.slice(0, 4).map((bill, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${bill.daysUntil <= 5 ? "bg-rose-500 border-rose-500" : "bg-card border-blue-500"}`}
                    />
                    <div className="mt-2 text-center">
                      <div className="text-[10px] font-medium text-foreground">
                        {bill.dueDate.split(" ")[1]}
                      </div>
                      <div className="text-[9px] text-muted-foreground truncate max-w-[60px]">
                        {bill.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill list */}
            <div className="space-y-1.5">
              {bills.slice(0, 3).map((bill, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${bill.daysUntil <= 5 ? "bg-rose-500" : "bg-blue-500"}`}
                    />
                    <span className="text-foreground">{bill.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {bill.daysUntil}d
                    </span>
                    <span className="font-medium text-foreground">
                      ${bill.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Balance projection */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">After bills</span>
                <span
                  className={`font-bold ${isHealthy ? "text-emerald-500" : "text-amber-500"}`}
                >
                  ${projectedBalance.toLocaleString()}
                </span>
              </div>
              {!isHealthy && (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>
                    Balance will be tight - consider transferring funds
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }
      return null;
    },
  });
}
