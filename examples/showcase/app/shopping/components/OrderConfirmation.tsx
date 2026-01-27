"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Mail } from "lucide-react";
import { type CartItem } from "./Cart";
import { type ShippingDetails } from "./CheckoutForm";

interface OrderConfirmationProps {
  orderId: string;
  cartItems: CartItem[];
  total: number;
  shippingDetails: ShippingDetails;
  onContinueShopping: () => void;
}

export function OrderConfirmation({
  orderId,
  cartItems,
  total,
  shippingDetails,
  onContinueShopping,
}: OrderConfirmationProps) {
  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">
            Thank you for your purchase, {shippingDetails.firstName}!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-xl font-mono font-bold">{orderId}</p>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Confirmation Email Sent</p>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation to {shippingDetails.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Shipping To</p>
              <p className="text-sm text-muted-foreground">
                {shippingDetails.address}, {shippingDetails.city},{" "}
                {shippingDetails.state} {shippingDetails.zipCode}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Order Summary</h4>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
