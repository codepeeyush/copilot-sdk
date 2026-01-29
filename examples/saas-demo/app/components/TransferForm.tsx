"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Account } from "@/lib/mock-data/accounts";
import { ArrowRight } from "lucide-react";

interface TransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onTransfer: (from: string, to: string, amount: number, note: string) => void;
}

export function TransferForm({
  isOpen,
  onClose,
  accounts,
  onTransfer,
}: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAccount && toAccount && amount && fromAccount !== toAccount) {
      onTransfer(fromAccount, toAccount, parseFloat(amount), note);
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setNote("");
      onClose();
    }
  };

  const availableAccounts = accounts.filter((acc) => acc.type !== "credit");
  const selectedFrom = accounts.find((a) => a.id === fromAccount);
  const selectedTo = accounts.find((a) => a.id === toAccount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 text-foreground sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Transfer Money
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {selectedFrom && selectedTo && amount && (
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-[11px] text-foreground">
                {selectedFrom.name}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] text-foreground">
                {selectedTo.name}
              </span>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-[11px]">From</Label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-muted/30 border border-border/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select account</option>
              {availableAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - ${acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px]">To</Label>
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-muted/30 border border-border/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select account</option>
              {availableAccounts
                .filter((acc) => acc.id !== fromAccount)
                .map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px]">Amount</Label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-6 h-9 text-xs bg-muted/30 border-border/50"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px]">
              Note <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-9 text-xs bg-muted/30 border-border/50"
              placeholder="Add a note..."
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !fromAccount ||
                !toAccount ||
                !amount ||
                fromAccount === toAccount
              }
              className="text-xs h-8"
            >
              Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
