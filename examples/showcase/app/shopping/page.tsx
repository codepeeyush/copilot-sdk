"use client";

import { useState, useCallback } from "react";
import {
  CopilotProvider,
  useAIContext,
  useTool,
} from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { DemoLayout } from "@/components/shared/DemoLayout";
import { ProductCatalog } from "./components/ProductCatalog";
import { Cart, type CartItem } from "./components/Cart";
import {
  CheckoutForm,
  type ShippingDetails,
  type PaymentDetails,
} from "./components/CheckoutForm";
import { OrderConfirmation } from "./components/OrderConfirmation";
import { products, coupons, type Product } from "@/lib/mock-data/products";
import "@yourgpt/copilot-sdk/ui/themes/modern-minimal.css";

type ViewMode = "shopping" | "checkout" | "confirmation";

function ShoppingContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("shopping");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{
    code: string;
    discount: number;
    type: "percent" | "fixed";
  } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = coupon
    ? coupon.type === "percent"
      ? subtotal * (coupon.discount / 100)
      : coupon.discount
    : 0;
  const total = Math.max(0, subtotal - discount);

  // Provide context to AI
  useAIContext({
    key: "cart",
    data: {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      })),
      subtotal,
      discount,
      total,
      couponApplied: coupon?.code || null,
    },
    description: "Current shopping cart with items, prices, and totals",
  });

  useAIContext({
    key: "checkout_state",
    data: {
      viewMode,
      shippingFilled: Boolean(
        shippingDetails.firstName && shippingDetails.address,
      ),
      paymentFilled: Boolean(paymentDetails.cardNumber),
    },
    description: "Current checkout state and form completion status",
  });

  // Cart functions
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId),
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const couponData = coupons[code];
      if (couponData) {
        if (couponData.minPurchase && subtotal < couponData.minPurchase) {
          return {
            success: false,
            message: `Minimum purchase of $${couponData.minPurchase} required`,
          };
        }
        setCoupon({ code, ...couponData });
        setCouponInput("");
        return { success: true, message: `Coupon ${code} applied!` };
      }
      return { success: false, message: "Invalid coupon code" };
    },
    [subtotal],
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  const placeOrder = useCallback(() => {
    setIsPlacingOrder(true);
    // Simulate order processing
    setTimeout(() => {
      const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      setOrderId(newOrderId);
      setViewMode("confirmation");
      setIsPlacingOrder(false);
    }, 1500);
  }, []);

  const continueShopping = useCallback(() => {
    setCartItems([]);
    setCoupon(null);
    setShippingDetails({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
    setPaymentDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setOrderId(null);
    setViewMode("shopping");
  }, []);

  // Register AI tools
  useTool({
    name: "search_products",
    description:
      "Search for products in the catalog by name, category, or tags",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term for products" },
        category: {
          type: "string",
          description:
            "Filter by category: Electronics, Furniture, or Accessories",
        },
      },
    },
    handler: async ({
      query,
      category,
    }: {
      query?: string;
      category?: string;
    }) => {
      const filtered = products.filter((p) => {
        const matchesQuery =
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
        const matchesCategory = !category || p.category === category;
        return matchesQuery && matchesCategory;
      });
      return {
        success: true,
        data: {
          count: filtered.length,
          products: filtered.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            inStock: p.inStock,
            rating: p.rating,
          })),
        },
      };
    },
  });

  useTool({
    name: "add_to_cart",
    description: "Add a product to the shopping cart",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The product ID to add" },
        quantity: {
          type: "number",
          description: "Quantity to add (default: 1)",
        },
      },
      required: ["productId"],
    },
    handler: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        return { success: false, error: "Product not found" };
      }
      if (!product.inStock) {
        return { success: false, error: "Product is out of stock" };
      }
      addToCart(product, quantity);
      return {
        success: true,
        data: {
          added: { name: product.name, quantity, price: product.price },
          cartTotal: cartItems.length + 1,
        },
      };
    },
  });

  useTool({
    name: "remove_from_cart",
    description: "Remove a product from the shopping cart",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The product ID to remove" },
      },
      required: ["productId"],
    },
    handler: async ({ productId }: { productId: string }) => {
      const item = cartItems.find((i) => i.product.id === productId);
      if (!item) {
        return { success: false, error: "Item not in cart" };
      }
      removeItem(productId);
      return {
        success: true,
        data: { removed: item.product.name },
      };
    },
  });

  useTool({
    name: "apply_coupon",
    description:
      "Apply a coupon code to get a discount. Available codes: SAVE10, SAVE20, FLAT50, WELCOME15",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "The coupon code to apply" },
      },
      required: ["code"],
    },
    needsApproval: true,
    approvalMessage: (params: { code: string }) =>
      `Apply coupon "${params.code}" to your order?`,
    handler: async ({ code }: { code: string }) => {
      const result = applyCoupon(code.toUpperCase());
      return result;
    },
  });

  useTool({
    name: "fill_shipping_form",
    description: "Fill in the shipping form with the provided details",
    inputSchema: {
      type: "object",
      properties: {
        firstName: { type: "string", description: "First name" },
        lastName: { type: "string", description: "Last name" },
        email: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number (optional)" },
        address: { type: "string", description: "Street address" },
        city: { type: "string", description: "City" },
        state: { type: "string", description: "State/Province" },
        zipCode: { type: "string", description: "ZIP/Postal code" },
        country: { type: "string", description: "Country" },
      },
      required: [
        "firstName",
        "lastName",
        "email",
        "address",
        "city",
        "zipCode",
      ],
    },
    needsApproval: true,
    approvalMessage: (params: ShippingDetails) =>
      `Fill shipping form for ${params.firstName} ${params.lastName} at ${params.address}, ${params.city}?`,
    handler: async (details: ShippingDetails) => {
      setShippingDetails((prev) => ({
        ...prev,
        ...details,
        country: details.country || prev.country,
      }));
      if (viewMode !== "checkout") {
        setViewMode("checkout");
      }
      return {
        success: true,
        data: { message: "Shipping form filled successfully", details },
      };
    },
    render: ({ status, args }) => {
      if (status === "executing" || status === "approval-required") {
        return (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 text-sm">
            <p className="font-medium text-blue-700 dark:text-blue-300">
              Shipping Details Preview
            </p>
            <p className="text-blue-600 dark:text-blue-400 mt-1">
              {args.firstName} {args.lastName}
              <br />
              {args.address}
              <br />
              {args.city}, {args.state} {args.zipCode}
            </p>
          </div>
        );
      }
      return null;
    },
  });

  useTool({
    name: "place_order",
    description:
      "Place the order and complete the checkout. Requires shipping and payment details to be filled.",
    inputSchema: {
      type: "object",
      properties: {
        confirm: { type: "boolean", description: "Confirm order placement" },
      },
      required: ["confirm"],
    },
    needsApproval: true,
    approvalMessage: () =>
      `Place order for $${total.toFixed(2)}? This will complete your purchase.`,
    handler: async ({ confirm }: { confirm: boolean }) => {
      if (!confirm) {
        return { success: false, error: "Order not confirmed" };
      }
      if (cartItems.length === 0) {
        return { success: false, error: "Cart is empty" };
      }
      if (!shippingDetails.firstName || !shippingDetails.address) {
        return {
          success: false,
          error: "Please fill in shipping details first",
        };
      }
      placeOrder();
      return {
        success: true,
        data: { message: "Order placed successfully!", total },
      };
    },
    render: ({ status, result }) => {
      if (status === "completed" && result?.success) {
        return (
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 text-sm">
            <p className="font-medium text-green-700 dark:text-green-300">
              Order Placed!
            </p>
            <p className="text-green-600 dark:text-green-400">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        );
      }
      return null;
    },
  });

  useTool({
    name: "go_to_checkout",
    description: "Navigate to the checkout page",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      if (cartItems.length === 0) {
        return { success: false, error: "Cart is empty" };
      }
      setViewMode("checkout");
      return { success: true, data: { message: "Navigated to checkout" } };
    },
  });

  return (
    <DemoLayout title="Shopping Assistant" theme="modern-minimal">
      <div className="flex h-[calc(100vh-41px)]">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "shopping" && (
            <div className="flex gap-6">
              <div className="flex-1">
                <ProductCatalog onAddToCart={addToCart} />
              </div>
              <div className="w-80 shrink-0">
                <Cart
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onCheckout={() => setViewMode("checkout")}
                  coupon={coupon}
                  onApplyCoupon={(code) => applyCoupon(code)}
                  onRemoveCoupon={removeCoupon}
                  couponInput={couponInput}
                  setCouponInput={setCouponInput}
                />
              </div>
            </div>
          )}

          {viewMode === "checkout" && (
            <CheckoutForm
              cartItems={cartItems}
              total={total}
              discount={discount}
              shippingDetails={shippingDetails}
              paymentDetails={paymentDetails}
              onShippingChange={setShippingDetails}
              onPaymentChange={setPaymentDetails}
              onPlaceOrder={placeOrder}
              onBack={() => setViewMode("shopping")}
              isPlacingOrder={isPlacingOrder}
            />
          )}

          {viewMode === "confirmation" && orderId && (
            <OrderConfirmation
              orderId={orderId}
              cartItems={cartItems}
              total={total}
              shippingDetails={shippingDetails}
              onContinueShopping={continueShopping}
            />
          )}
        </div>

        {/* Chat Panel */}
        <div
          className="w-96 border-l bg-background flex flex-col"
          data-csdk-theme="modern-minimal"
        >
          <CopilotChat
            placeholder="Ask about products or your order..."
            className="h-full"
            persistence={true}
            showThreadPicker={true}
            header={{
              name: "Shopping Assistant",
            }}
            suggestions={[
              "Show me bestselling products",
              "What's in my cart?",
              "Help me checkout",
            ]}
          />
        </div>
      </div>
    </DemoLayout>
  );
}

export default function ShoppingPage() {
  return (
    <CopilotProvider
      runtimeUrl="/api/chat"
      systemPrompt={`You are a helpful shopping assistant for an e-commerce store. You can:
- Search for products using the search_products tool
- Add items to cart using add_to_cart tool
- Remove items from cart using remove_from_cart tool
- Apply coupon codes (SAVE10, SAVE20, FLAT50, WELCOME15) using apply_coupon tool
- Fill shipping forms using fill_shipping_form tool
- Navigate to checkout using go_to_checkout tool
- Place orders using place_order tool

Always be helpful and guide users through their shopping experience. When users want to checkout, help them fill in their shipping details.

Available coupon codes for reference:
- SAVE10: 10% off
- SAVE20: 20% off (min $100 purchase)
- FLAT50: $50 off (min $200 purchase)
- WELCOME15: 15% off

The cart context is automatically available to you, so you always know what's in the user's cart.`}
      debug={process.env.NODE_ENV === "development"}
    >
      <ShoppingContent />
    </CopilotProvider>
  );
}
