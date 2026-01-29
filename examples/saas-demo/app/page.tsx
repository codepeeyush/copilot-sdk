"use client";

import { useState, useCallback } from "react";
import { CopilotProvider, useAIContext } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import "@yourgpt/copilot-sdk/ui/themes/supabase.css";
import { DemoLayout } from "@/components/shared/DemoLayout";
import { Sidebar, type DashboardView } from "@/app/components/Sidebar";
import { AccountsOverview } from "@/app/components/AccountsOverview";
import { TransactionsTable } from "@/app/components/TransactionsTable";
import { BalanceChart } from "@/app/components/BalanceChart";
import { SpendingChart } from "@/app/components/SpendingChart";
import { QuickActions } from "@/app/components/QuickActions";
import { TransferForm } from "@/app/components/TransferForm";
import { CardManager } from "@/app/components/CardManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  accounts as initialAccounts,
  type Account,
  getTotalBalance,
} from "@/lib/mock-data/accounts";
import {
  transactions as initialTransactions,
  type Transaction,
  type TransactionCategory,
} from "@/lib/mock-data/transactions";
import {
  cards as initialCards,
  type Card as CardType,
} from "@/lib/mock-data/cards";
import {
  spendingByCategory,
  balanceHistory,
  monthlyTrends,
} from "@/lib/mock-data/analytics";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
} from "lucide-react";

// Import copilot tools and components
import {
  useSpendingAnalysisTool,
  useFinancialHealthTool,
  useSmartTransferTool,
  useSubscriptionsTool,
  useUpcomingBillsTool,
} from "./copilot/tools";
import { CustomSuggestions } from "./copilot/components";

function DashboardContent() {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TransactionCategory | "all"
  >("all");
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Provide context to AI
  useAIContext({
    key: "accounts_overview",
    data: {
      totalBalance: getTotalBalance(accounts),
      accountCount: accounts.length,
      accounts: accounts.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        balance: a.balance,
        trend: a.trend,
      })),
    },
    description: "User's bank accounts with balances and trends",
  });

  useAIContext({
    key: "recent_transactions",
    data: {
      totalTransactions: transactions.length,
      pendingCount: transactions.filter((t) => t.status === "pending").length,
      recentTransactions: transactions.slice(0, 10).map((t) => ({
        id: t.id,
        merchant: t.merchant,
        amount: t.amount,
        category: t.category,
        date: t.date,
        status: t.status,
      })),
    },
    description: "Recent transactions summary",
  });

  useAIContext({
    key: "spending_analytics",
    data: {
      spendingByCategory: spendingByCategory.map((s) => ({
        category: s.category,
        amount: s.amount,
        percentage: s.percentage,
      })),
      monthlyTrends: monthlyTrends,
    },
    description: "Spending analytics by category and monthly trends",
  });

  useAIContext({
    key: "cards_info",
    data: {
      totalCards: cards.length,
      activeCards: cards.filter((c) => c.status === "active").length,
      frozenCards: cards.filter((c) => c.status === "frozen").length,
      cards: cards.map((c) => ({
        id: c.id,
        type: c.type,
        lastFour: c.lastFour,
        status: c.status,
        network: c.network,
      })),
    },
    description: "User's payment cards information",
  });

  // Handle transfer
  const handleTransfer = useCallback(
    (fromId: string, toId: string, amount: number, note: string) => {
      const fromAccount = accounts.find((a) => a.id === fromId);
      const toAccount = accounts.find((a) => a.id === toId);

      if (fromAccount && toAccount) {
        setAccounts((prev) =>
          prev.map((acc) => {
            if (acc.id === fromId) {
              return { ...acc, balance: acc.balance - amount };
            }
            if (acc.id === toId) {
              return { ...acc, balance: acc.balance + amount };
            }
            return acc;
          }),
        );

        const newTxnId = `txn-${Date.now()}`;
        const date = new Date().toISOString().split("T")[0];
        setTransactions((prev) => [
          {
            id: newTxnId,
            accountId: fromId,
            date,
            description: note || `Transfer to ${toAccount.name}`,
            merchant: "Internal Transfer",
            category: "transfer" as TransactionCategory,
            amount: -amount,
            type: "transfer" as const,
            status: "completed" as const,
          },
          {
            id: `${newTxnId}-recv`,
            accountId: toId,
            date,
            description: note || `Transfer from ${fromAccount.name}`,
            merchant: "Internal Transfer",
            category: "transfer" as TransactionCategory,
            amount: amount,
            type: "transfer" as const,
            status: "completed" as const,
          },
          ...prev,
        ]);
      }
    },
    [accounts],
  );

  const handleToggleCardFreeze = useCallback((cardId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, status: card.status === "active" ? "frozen" : "active" }
          : card,
      ),
    );
  }, []);

  // Register AI tools
  useSpendingAnalysisTool(setCurrentView);
  useFinancialHealthTool(accounts);
  useSmartTransferTool(accounts, handleTransfer, setCurrentView);
  useSubscriptionsTool();
  useUpcomingBillsTool(accounts);

  const totalBalance = getTotalBalance(accounts);
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending",
  ).length;
  const thisMonthIncome = transactions
    .filter((t) => t.category === "income" && t.date.startsWith("2025-01"))
    .reduce((sum, t) => sum + t.amount, 0);
  const thisMonthExpenses = transactions
    .filter(
      (t) =>
        t.category !== "income" &&
        t.category !== "transfer" &&
        t.date.startsWith("2025-01"),
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const viewTitles: Record<DashboardView, string> = {
    overview: "Overview",
    accounts: "Accounts",
    transactions: "Transactions",
    analytics: "Analytics",
    payments: "Payments",
    cards: "Cards",
    settings: "Settings",
  };

  return (
    <DemoLayout theme="default">
      <div className="flex h-screen bg-muted/30 overflow-visible">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-card border-b border-border/50">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground dark:text-white">
                  {viewTitles[currentView]}
                </h1>
                <p className="text-xs text-muted-foreground dark:text-neutral-400">
                  Welcome back, Alex
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="relative p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground text-xs font-medium shadow-sm">
                  AM
                </div>
              </div>
            </div>
          </header>

          <main className="p-5">
            {currentView === "overview" && (
              <div className="space-y-5">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Total Balance */}
                  <Card className="col-span-2 bg-gradient-to-br from-primary to-primary/90 border-0 shadow-lg shadow-primary/15 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-primary-foreground/70 text-xs font-medium">
                            Total Balance
                          </p>
                          <p className="text-3xl font-bold text-primary-foreground mt-1 tracking-tight">
                            $
                            {totalBalance.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-primary-foreground/60 text-xs mt-1.5 flex items-center gap-1">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            +12.5% vs last month
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Income */}
                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Income
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                      </div>
                      <p className="text-xl font-semibold text-foreground">
                        +${thisMonthIncome.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This month
                      </p>
                    </CardContent>
                  </Card>

                  {/* Expenses */}
                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Expenses
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                          <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                        </div>
                      </div>
                      <p className="text-xl font-semibold text-foreground">
                        -${thisMonthExpenses.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Notice */}
                {pendingTransactions > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      <span className="font-medium">
                        {pendingTransactions} pending
                      </span>{" "}
                      transactions
                    </p>
                  </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-2 gap-4">
                  <BalanceChart data={balanceHistory} />
                  <SpendingChart data={spendingByCategory} />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <AccountsOverview accounts={accounts} />
                  </div>
                  <QuickActions
                    onTransferClick={() => setIsTransferOpen(true)}
                    onPayBillClick={() => setCurrentView("payments")}
                  />
                </div>
              </div>
            )}

            {currentView === "accounts" && (
              <AccountsOverview accounts={accounts} />
            )}

            {currentView === "transactions" && (
              <TransactionsTable
                transactions={transactions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}

            {currentView === "analytics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <BalanceChart data={balanceHistory} />
                  <SpendingChart data={spendingByCategory} />
                </div>
                <Card className="bg-card border-border/50 shadow-sm">
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Monthly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {monthlyTrends.map((month) => (
                        <div
                          key={month.month}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="text-xs font-medium text-foreground">
                            {month.month}
                          </span>
                          <div className="flex gap-6 text-xs">
                            <div className="text-right">
                              <span className="text-emerald-600 dark:text-emerald-400">
                                +${month.income.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-rose-600 dark:text-rose-400">
                                -${month.expenses.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right w-16">
                              <span
                                className={
                                  month.net >= 0
                                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                    : "text-rose-600 dark:text-rose-400 font-medium"
                                }
                              >
                                {month.net >= 0 ? "+" : ""}$
                                {month.net.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === "payments" && (
              <Card className="bg-card border-border/50 shadow-sm">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Quick Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <QuickActions
                    onTransferClick={() => setIsTransferOpen(true)}
                    onPayBillClick={() => alert("Coming soon!")}
                  />
                </CardContent>
              </Card>
            )}

            {currentView === "cards" && (
              <CardManager
                cards={cards}
                onToggleFreeze={handleToggleCardFreeze}
              />
            )}

            {currentView === "settings" && (
              <Card className="bg-card border-border/50 shadow-sm">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    Settings panel coming soon.
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>

        {/* Chat Panel - Custom Design with Compound Components */}
        <div
          className="w-[400px] border-l border-border/50 flex flex-col"
          data-csdk-theme="supabase"
        >
          <CopilotChat.Root
            persistence={true}
            className="h-full"
            showPoweredBy={false}
          >
            {/* Home View - Custom welcome screen */}
            <CopilotChat.HomeView className="gap-4 p-6 bg-gradient-to-b from-primary/30 via-background to-background  items-stretch w-full">
              {/* Logo */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center self-center mb-4">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="w-8 h-8 text-primary mx-auto"
                />
              </div>

              {/* Title */}
              <div className="text-center mb-3">
                <h2 className="text-xl font-semibold">Finance Assistant</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Your smart banking copilot
                </p>
              </div>

              {/* Input + Suggestions grouped together */}
              <div className="w-full max-w-xs space-y-3">
                <CopilotChat.Input
                  placeholder="Ask about your finances..."
                  className="w-full"
                />
                <CustomSuggestions />
              </div>
            </CopilotChat.HomeView>

            {/* Chat View - Custom header */}
            <CopilotChat.ChatView className="items-stretch w-full">
              <CopilotChat.Header className="flex items-center gap-2 p-3 border-b bg-card/50">
                <CopilotChat.BackButton className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/50">
                  <ChevronLeft className="w-4 h-4" />
                </CopilotChat.BackButton>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <img src="/logo.svg" alt="Logo" className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">
                      Finance Assistant
                    </span>
                    <CopilotChat.ThreadPicker size="sm" />
                  </div>
                </div>
              </CopilotChat.Header>
            </CopilotChat.ChatView>
          </CopilotChat.Root>
        </div>
      </div>

      <TransferForm
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={accounts}
        onTransfer={handleTransfer}
      />
    </DemoLayout>
  );
}

export default function BankingDashboardPage() {
  return (
    <CopilotProvider
      runtimeUrl="/api/chat"
      systemPrompt={`You are a smart banking assistant. Be brief and conversational.

RESPONSE STYLE:
- Keep responses to 1-2 short sentences
- Let the tool renders speak for themselves - don't repeat data shown in charts
- Use casual, friendly tone
- Only add insight if it's actionable

Tools:
- analyze_spending: For "where's my money going?", "am I overspending?"
- financial_health_check: For "check my finances", "how am I doing?"
- smart_transfer: For "move $X to savings" - use account types (checking, savings, investment, credit)
- analyze_subscriptions: For "my subscriptions", "recurring charges"
- upcoming_bills: For "upcoming bills", "what's due soon"

Example good response: "Here's your spending breakdown. Looks like dining is up this month."
Example bad response: "I've analyzed your spending patterns. As you can see from the chart, your total spending is $4,250 with the following breakdown: Housing at $1,500 (35%), Food at $850 (20%)..." (too long, repeats chart data)`}
      debug={process.env.NODE_ENV === "development"}
    >
      <DashboardContent />
    </CopilotProvider>
  );
}
