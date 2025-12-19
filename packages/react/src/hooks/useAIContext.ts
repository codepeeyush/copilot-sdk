"use client";

import { useEffect, useRef } from "react";
import { useYourGPTContext } from "../context/YourGPTContext";

/**
 * Context item for AI
 */
export interface AIContextItem {
  /** Unique key for this context */
  key: string;
  /** Data to provide to AI (will be JSON stringified) */
  data: unknown;
  /** Optional description to help AI understand the context */
  description?: string;
}

/**
 * Hook to provide app state/context to the AI
 *
 * This hook allows you to inject React state into the AI's context,
 * so it can understand and reference your app's current state.
 *
 * @example
 * ```tsx
 * function CartPage() {
 *   const [cart, setCart] = useState([]);
 *
 *   // Provide cart data to AI
 *   useAIContext({
 *     key: 'cart',
 *     data: cart,
 *     description: 'User shopping cart items',
 *   });
 *
 *   return <CartUI cart={cart} />;
 * }
 * ```
 *
 * @example Multiple contexts
 * ```tsx
 * useAIContext({ key: 'user', data: currentUser });
 * useAIContext({ key: 'cart', data: cartItems });
 * useAIContext({ key: 'preferences', data: userPrefs });
 * ```
 */
export function useAIContext(item: AIContextItem): void {
  const { addContext, removeContext } = useYourGPTContext();
  const contextIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Format the context value
    const formattedValue =
      typeof item.data === "string"
        ? item.data
        : JSON.stringify(item.data, null, 2);

    const contextString = item.description
      ? `${item.description}:\n${formattedValue}`
      : `${item.key}:\n${formattedValue}`;

    // Add context and store the ID
    contextIdRef.current = addContext(contextString);

    // Cleanup: remove context when component unmounts or data changes
    return () => {
      if (contextIdRef.current) {
        removeContext(contextIdRef.current);
        contextIdRef.current = null;
      }
    };
  }, [item.key, item.data, item.description, addContext, removeContext]);
}

/**
 * Hook to provide multiple context items at once
 *
 * @example
 * ```tsx
 * useAIContexts([
 *   { key: 'user', data: currentUser },
 *   { key: 'cart', data: cartItems },
 *   { key: 'page', data: { route: '/checkout', step: 2 } },
 * ]);
 * ```
 */
export function useAIContexts(items: AIContextItem[]): void {
  const { addContext, removeContext } = useYourGPTContext();
  const contextIdsRef = useRef<string[]>([]);

  useEffect(() => {
    // Clear previous contexts
    contextIdsRef.current.forEach((id) => removeContext(id));
    contextIdsRef.current = [];

    // Add new contexts
    for (const item of items) {
      const formattedValue =
        typeof item.data === "string"
          ? item.data
          : JSON.stringify(item.data, null, 2);

      const contextString = item.description
        ? `${item.description}:\n${formattedValue}`
        : `${item.key}:\n${formattedValue}`;

      const id = addContext(contextString);
      contextIdsRef.current.push(id);
    }

    // Cleanup
    return () => {
      contextIdsRef.current.forEach((id) => removeContext(id));
      contextIdsRef.current = [];
    };
  }, [items, addContext, removeContext]);
}
