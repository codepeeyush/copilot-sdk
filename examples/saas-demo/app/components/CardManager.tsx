"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Card as CardType } from "@/lib/mock-data/cards";
import { Snowflake, Lock, Wifi } from "lucide-react";

interface CardManagerProps {
  cards: CardType[];
  onToggleFreeze: (cardId: string) => void;
}

const cardStyles = {
  slate: "from-slate-700 via-slate-800 to-slate-900",
  gold: "from-amber-500 via-amber-600 to-amber-700",
  platinum: "from-slate-400 via-slate-500 to-slate-600",
};

export function CardManager({ cards, onToggleFreeze }: CardManagerProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => {
        const isFrozen = card.status === "frozen";
        return (
          <Card
            key={card.id}
            className="bg-card border-border/50 shadow-sm overflow-hidden"
          >
            <CardContent className="p-0">
              <div
                className={`relative h-36 bg-gradient-to-br ${cardStyles[card.color]} p-4`}
              >
                {isFrozen && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <Snowflake className="h-5 w-5 text-white mx-auto mb-1" />
                      <p className="text-white text-[10px] font-medium">
                        Frozen
                      </p>
                    </div>
                  </div>
                )}
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-7 h-5 rounded bg-gradient-to-br from-amber-300/80 to-amber-500/80 flex items-center justify-center">
                      <Wifi className="h-3 w-3 text-amber-900 rotate-90" />
                    </div>
                    <span className="text-white font-bold text-sm">
                      {card.network === "visa" ? "VISA" : "MC"}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs tracking-[0.2em] font-mono">
                      •••• {card.lastFour}
                    </p>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <p className="text-white/50 text-[8px] uppercase">
                          Holder
                        </p>
                        <p className="text-white text-[10px]">
                          {card.cardHolder}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-[8px] uppercase">
                          Exp
                        </p>
                        <p className="text-white text-[10px]">
                          {card.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-foreground">
                    {card.type === "credit" ? "Credit" : "Debit"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {card.network.charAt(0).toUpperCase() +
                      card.network.slice(1)}{" "}
                    •{" "}
                    <span
                      className={
                        isFrozen ? "text-amber-500" : "text-emerald-500"
                      }
                    >
                      {isFrozen ? "Frozen" : "Active"}
                    </span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFreeze(card.id)}
                  className={`h-7 px-2 text-[10px] rounded-full ${isFrozen ? "text-emerald-600 bg-emerald-500/10" : "text-amber-600 bg-amber-500/10"}`}
                >
                  {isFrozen ? (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Unfreeze
                    </>
                  ) : (
                    <>
                      <Snowflake className="h-3 w-3 mr-1" />
                      Freeze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
