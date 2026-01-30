"use client";

import { useState, useCallback } from "react";
import type { DashboardState } from "@/lib/types";
import { INITIAL_DASHBOARD_STATE } from "@/lib/constants";

/**
 * Manages dashboard state with stable action callbacks.
 * Uses functional setState for optimal re-render behavior.
 *
 * @see Vercel React best practices: `rerender-functional-setstate`, `rerender-lazy-state-init`
 */
export function useDashboardState() {
  // Lazy initialization with initial state
  const [state, setState] = useState<DashboardState>(
    () => INITIAL_DASHBOARD_STATE,
  );

  // Counter actions
  const incrementCounter = useCallback(() => {
    setState((prev) => ({ ...prev, counter: prev.counter + 1 }));
  }, []);

  const decrementCounter = useCallback(() => {
    setState((prev) => ({ ...prev, counter: prev.counter - 1 }));
  }, []);

  const resetCounter = useCallback(() => {
    setState((prev) => ({ ...prev, counter: 0 }));
  }, []);

  const setCounter = useCallback((value: number) => {
    setState((prev) => ({ ...prev, counter: value }));
  }, []);

  // Preference actions
  const setPreference = useCallback((preference: string) => {
    setState((prev) => ({ ...prev, userPreference: preference }));
  }, []);

  // Notification actions
  const addNotification = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [...prev.notifications, message],
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: [] }));
  }, []);

  // Cart actions
  const updateCart = useCallback(
    (action: "add" | "remove" | "clear", count: number = 1) => {
      setState((prev) => ({
        ...prev,
        cartItems:
          action === "add"
            ? prev.cartItems + count
            : action === "remove"
              ? Math.max(0, prev.cartItems - count)
              : 0,
      }));
    },
    [],
  );

  const setCartItems = useCallback((count: number) => {
    setState((prev) => ({ ...prev, cartItems: count }));
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setState(INITIAL_DASHBOARD_STATE);
  }, []);

  return {
    state,
    setState,
    actions: {
      incrementCounter,
      decrementCounter,
      resetCounter,
      setCounter,
      setPreference,
      addNotification,
      clearNotifications,
      updateCart,
      setCartItems,
      reset,
    },
  };
}

export type DashboardActions = ReturnType<typeof useDashboardState>["actions"];
