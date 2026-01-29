export interface Card {
  id: string;
  accountId: string;
  type: "debit" | "credit";
  lastFour: string;
  cardHolder: string;
  expiryDate: string;
  status: "active" | "frozen";
  network: "visa" | "mastercard";
  color: "slate" | "gold" | "platinum";
}

export const cards: Card[] = [
  {
    id: "card-001",
    accountId: "acc-001",
    type: "debit",
    lastFour: "4521",
    cardHolder: "ALEX MORGAN",
    expiryDate: "09/27",
    status: "active",
    network: "visa",
    color: "slate",
  },
  {
    id: "card-002",
    accountId: "acc-004",
    type: "credit",
    lastFour: "3847",
    cardHolder: "ALEX MORGAN",
    expiryDate: "12/26",
    status: "active",
    network: "mastercard",
    color: "gold",
  },
  {
    id: "card-003",
    accountId: "acc-001",
    type: "debit",
    lastFour: "8912",
    cardHolder: "ALEX MORGAN",
    expiryDate: "03/28",
    status: "frozen",
    network: "visa",
    color: "platinum",
  },
];

export function getCardsByStatus(
  cardsArr: Card[],
  status: Card["status"],
): Card[] {
  return cardsArr.filter((card) => card.status === status);
}

export function getCardsByType(cardsArr: Card[], type: Card["type"]): Card[] {
  return cardsArr.filter((card) => card.type === type);
}
