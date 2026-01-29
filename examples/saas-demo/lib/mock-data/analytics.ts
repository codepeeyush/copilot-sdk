import { categoryColors, type TransactionCategory } from "./transactions";

export interface SpendingByCategory {
  category: TransactionCategory;
  label: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface BalanceHistoryPoint {
  date: string;
  balance: number;
}

export const spendingByCategory: SpendingByCategory[] = [
  {
    category: "groceries",
    label: "Groceries",
    amount: 593.02,
    color: categoryColors.groceries,
    percentage: 24,
  },
  {
    category: "dining",
    label: "Dining",
    amount: 359.75,
    color: categoryColors.dining,
    percentage: 15,
  },
  {
    category: "transport",
    label: "Transport",
    amount: 213.99,
    color: categoryColors.transport,
    percentage: 9,
  },
  {
    category: "utilities",
    label: "Utilities",
    amount: 345.16,
    color: categoryColors.utilities,
    percentage: 14,
  },
  {
    category: "entertainment",
    label: "Entertainment",
    amount: 207.98,
    color: categoryColors.entertainment,
    percentage: 8,
  },
  {
    category: "shopping",
    label: "Shopping",
    amount: 1644.78,
    color: categoryColors.shopping,
    percentage: 22,
  },
  {
    category: "healthcare",
    label: "Healthcare",
    amount: 244.56,
    color: categoryColors.healthcare,
    percentage: 8,
  },
];

export const monthlyTrends: MonthlyTrend[] = [
  { month: "Aug", income: 9200, expenses: 4850, net: 4350 },
  { month: "Sep", income: 8900, expenses: 5200, net: 3700 },
  { month: "Oct", income: 9500, expenses: 4600, net: 4900 },
  { month: "Nov", income: 10200, expenses: 6800, net: 3400 },
  { month: "Dec", income: 11500, expenses: 8200, net: 3300 },
  { month: "Jan", income: 10000, expenses: 3609, net: 6391 },
];

export const balanceHistory: BalanceHistoryPoint[] = [
  { date: "Dec 29", balance: 9245.32 },
  { date: "Dec 30", balance: 9456.78 },
  { date: "Dec 31", balance: 9123.45 },
  { date: "Jan 1", balance: 9345.67 },
  { date: "Jan 2", balance: 9567.89 },
  { date: "Jan 3", balance: 9234.56 },
  { date: "Jan 4", balance: 9890.12 },
  { date: "Jan 5", balance: 10234.56 },
  { date: "Jan 6", balance: 10567.89 },
  { date: "Jan 7", balance: 10123.45 },
  { date: "Jan 8", balance: 10890.12 },
  { date: "Jan 9", balance: 11234.56 },
  { date: "Jan 10", balance: 10890.23 },
  { date: "Jan 11", balance: 11456.78 },
  { date: "Jan 12", balance: 11234.56 },
  { date: "Jan 13", balance: 11678.9 },
  { date: "Jan 14", balance: 11890.12 },
  { date: "Jan 15", balance: 13245.67 },
  { date: "Jan 16", balance: 12890.45 },
  { date: "Jan 17", balance: 12456.78 },
  { date: "Jan 18", balance: 12234.56 },
  { date: "Jan 19", balance: 11890.12 },
  { date: "Jan 20", balance: 11678.9 },
  { date: "Jan 21", balance: 11456.78 },
  { date: "Jan 22", balance: 11234.56 },
  { date: "Jan 23", balance: 11567.89 },
  { date: "Jan 24", balance: 11890.12 },
  { date: "Jan 25", balance: 12345.67 },
  { date: "Jan 26", balance: 12567.89 },
  { date: "Jan 27", balance: 12690.45 },
  { date: "Jan 28", balance: 12847.56 },
];

export function getTotalSpending(): number {
  return spendingByCategory.reduce((sum, cat) => sum + cat.amount, 0);
}

export function getTopSpendingCategory(): SpendingByCategory {
  return spendingByCategory.reduce((max, cat) =>
    cat.amount > max.amount ? cat : max,
  );
}

export function getAverageMonthlyExpenses(): number {
  return (
    monthlyTrends.reduce((sum, month) => sum + month.expenses, 0) /
    monthlyTrends.length
  );
}

export function getIncomeVsExpensesRatio(): number {
  const totalIncome = monthlyTrends.reduce(
    (sum, month) => sum + month.income,
    0,
  );
  const totalExpenses = monthlyTrends.reduce(
    (sum, month) => sum + month.expenses,
    0,
  );
  return totalIncome / totalExpenses;
}
