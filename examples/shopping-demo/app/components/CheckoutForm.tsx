"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, MapPin, User } from "lucide-react";
import { type CartItem } from "./Cart";

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  discount: number;
  shippingDetails: ShippingDetails;
  paymentDetails: PaymentDetails;
  onShippingChange: (details: ShippingDetails) => void;
  onPaymentChange: (details: PaymentDetails) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
  isPlacingOrder: boolean;
}

export function CheckoutForm({
  cartItems,
  total,
  discount,
  shippingDetails,
  paymentDetails,
  onShippingChange,
  onPaymentChange,
  onPlaceOrder,
  onBack,
  isPlacingOrder,
}: CheckoutFormProps) {
  const [step, setStep] = useState<"shipping" | "payment" | "review">(
    "shipping",
  );

  const isShippingComplete =
    shippingDetails.firstName &&
    shippingDetails.lastName &&
    shippingDetails.email &&
    shippingDetails.address &&
    shippingDetails.city &&
    shippingDetails.zipCode;

  const isPaymentComplete =
    paymentDetails.cardNumber &&
    paymentDetails.expiryDate &&
    paymentDetails.cvv &&
    paymentDetails.cardholderName;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: "shipping", label: "Shipping", icon: MapPin },
          { id: "payment", label: "Payment", icon: CreditCard },
          { id: "review", label: "Review", icon: Check },
        ].map((s, index) => {
          const isActive = step === s.id;
          const isPast =
            (step === "payment" && s.id === "shipping") ||
            (step === "review" && (s.id === "shipping" || s.id === "payment"));

          return (
            <div key={s.id} className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isPast || isActive) setStep(s.id as typeof step);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isPast
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{s.label}</span>
              </button>
              {index < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          );
        })}
      </div>

      {/* Shipping Form */}
      {step === "shipping" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Information
            </CardTitle>
            <CardDescription>Where should we send your order?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={shippingDetails.firstName}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={shippingDetails.lastName}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      lastName: e.target.value,
                    })
                  }
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingDetails.email}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      email: e.target.value,
                    })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={shippingDetails.address}
                onChange={(e) =>
                  onShippingChange({
                    ...shippingDetails,
                    address: e.target.value,
                  })
                }
                placeholder="123 Main Street, Apt 4B"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingDetails.city}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      city: e.target.value,
                    })
                  }
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingDetails.state}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      state: e.target.value,
                    })
                  }
                  placeholder="NY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={shippingDetails.zipCode}
                  onChange={(e) =>
                    onShippingChange({
                      ...shippingDetails,
                      zipCode: e.target.value,
                    })
                  }
                  placeholder="10001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={shippingDetails.country}
                onChange={(e) =>
                  onShippingChange({
                    ...shippingDetails,
                    country: e.target.value,
                  })
                }
                placeholder="United States"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to Cart
            </Button>
            <Button
              onClick={() => setStep("payment")}
              disabled={!isShippingComplete}
            >
              Continue to Payment
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Payment Form */}
      {step === "payment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>Enter your card details securely</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={paymentDetails.cardholderName}
                onChange={(e) =>
                  onPaymentChange({
                    ...paymentDetails,
                    cardholderName: e.target.value,
                  })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
                  onPaymentChange({ ...paymentDetails, cardNumber: formatted });
                }}
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2);
                    }
                    onPaymentChange({ ...paymentDetails, expiryDate: value });
                  }}
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={paymentDetails.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    onPaymentChange({ ...paymentDetails, cvv: value });
                  }}
                  placeholder="123"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is a demo. No real payment will be processed.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("shipping")}>
              Back
            </Button>
            <Button
              onClick={() => setStep("review")}
              disabled={!isPaymentComplete}
            >
              Review Order
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Review */}
      {step === "review" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Review Your Order
            </CardTitle>
            <CardDescription>
              Please review your order details before placing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Shipping Summary */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" /> Shipping Address
              </h4>
              <p className="text-sm text-muted-foreground">
                {shippingDetails.firstName} {shippingDetails.lastName}
                <br />
                {shippingDetails.address}
                <br />
                {shippingDetails.city}, {shippingDetails.state}{" "}
                {shippingDetails.zipCode}
                <br />
                {shippingDetails.country}
              </p>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4" /> Payment Method
              </h4>
              <p className="text-sm text-muted-foreground">
                Card ending in {paymentDetails.cardNumber.slice(-4)}
              </p>
            </div>

            <Separator />

            {/* Order Summary */}
            <div>
              <h4 className="font-medium mb-2">Order Summary</h4>
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
              </div>
              {discount > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("payment")}>
              Back
            </Button>
            <Button onClick={onPlaceOrder} disabled={isPlacingOrder}>
              {isPlacingOrder ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
