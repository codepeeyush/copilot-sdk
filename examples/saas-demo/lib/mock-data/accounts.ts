export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "investment" | "credit";
  accountNumber: string;
  balance: number;
  currency: string;
  trend: number;
  icon: "wallet" | "piggy-bank" | "trending-up" | "credit-card";
}

export const accounts: Account[] = [
  {
    id: "acc-001",
    name: "Primary Checking",
    type: "checking",
    accountNumber: "****4521",
    balance: 12847.56,
    currency: "USD",
    trend: 2.4,
    icon: "wallet",
  },
  {
    id: "acc-002",
    name: "Savings Account",
    type: "savings",
    accountNumber: "****7832",
    balance: 45230.89,
    currency: "USD",
    trend: 5.2,
    icon: "piggy-bank",
  },
  {
    id: "acc-003",
    name: "Investment Portfolio",
    type: "investment",
    accountNumber: "****9156",
    balance: 128450.32,
    currency: "USD",
    trend: 12.8,
    icon: "trending-up",
  },
  {
    id: "acc-004",
    name: "Credit Card",
    type: "credit",
    accountNumber: "****3847",
    balance: -2156.43,
    currency: "USD",
    trend: -8.3,
    icon: "credit-card",
  },
];

export const accountTypes = [
  "checking",
  "savings",
  "investment",
  "credit",
] as const;

export function getTotalBalance(accs: Account[]): number {
  return accs.reduce((sum, acc) => sum + acc.balance, 0);
}

export function getAccountsByType(
  accs: Account[],
  type: Account["type"],
): Account[] {
  return accs.filter((acc) => acc.type === type);
}
