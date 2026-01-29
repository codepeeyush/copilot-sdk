"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type Transaction,
  type TransactionCategory,
  categoryLabels,
} from "@/lib/mock-data/transactions";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
} from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: TransactionCategory | "all";
  onCategoryChange: (category: TransactionCategory | "all") => void;
}

const ITEMS_PER_PAGE = 8;

// Format date to human-readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TransactionsTable({
  transactions,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || txn.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const categories: (TransactionCategory | "all")[] = [
    "all",
    "groceries",
    "dining",
    "transport",
    "utilities",
    "shopping",
  ];

  const getIcon = (type: Transaction["type"]) => {
    if (type === "credit")
      return <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />;
    if (type === "debit")
      return <ArrowUpRight className="h-3.5 w-3.5 text-rose-500" />;
    return <ArrowLeftRight className="h-3.5 w-3.5 text-blue-500" />;
  };

  const getStatusStyle = (status: Transaction["status"]) => {
    if (status === "completed")
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (status === "pending")
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
  };

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Transactions
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {filteredTransactions.length} total
          </span>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm bg-muted/30 border-border/50"
            />
          </div>
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                className={`text-xs h-9 px-3 rounded-lg ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-muted/30"}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat === "all" ? "All" : categoryLabels[cat]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-1.5">
          {paginatedTransactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                  {getIcon(txn.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {txn.merchant}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {txn.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${getStatusStyle(txn.status)}`}
                >
                  {txn.status}
                </span>
                <div className="text-right min-w-[80px]">
                  <p
                    className={`text-sm font-medium ${txn.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}
                  >
                    {txn.amount > 0 ? "+" : ""}$
                    {Math.abs(txn.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(txn.date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {paginatedTransactions.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">
              No transactions found
            </p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs h-8"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
