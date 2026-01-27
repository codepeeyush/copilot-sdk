"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { type Product } from "@/lib/mock-data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  coupon: { code: string; discount: number; type: "percent" | "fixed" } | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  couponInput: string;
  setCouponInput: (value: string) => void;
}

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponInput,
  setCouponInput,
}: CartProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  let discount = 0;
  if (coupon) {
    if (coupon.type === "percent") {
      discount = subtotal * (coupon.discount / 100);
    } else {
      discount = coupon.discount;
    }
  }

  const total = subtotal - discount;

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Shopping Cart</span>
          <Badge variant="secondary">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Your cart is empty
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          Math.max(0, item.quantity - 1),
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Coupon Section */}
            <div className="space-y-2">
              {coupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {coupon.code} applied
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveCoupon}
                    className="h-6 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    className="h-9"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyCoupon(couponInput)}
                    disabled={!couponInput}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter>
          <Button className="w-full" size="lg" onClick={onCheckout}>
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
