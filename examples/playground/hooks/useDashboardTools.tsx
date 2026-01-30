"use client";

import { useState, useCallback } from "react";
import { useTool } from "@yourgpt/copilot-sdk/react";
import {
  Plus,
  Minus,
  RotateCcw,
  Palette,
  ShoppingCart,
  Trash2,
  Activity,
  Check,
} from "lucide-react";
import { useLatest } from "./useLatest";
import type {
  DashboardState,
  ToolState,
  ToolsEnabledConfig,
} from "@/lib/types";
import type { DashboardActions } from "./useDashboardState";
import { WeatherCard } from "@/components/playground/cards/WeatherCard";
import { StockCard } from "@/components/playground/cards/StockCard";
import { NotificationCard } from "@/components/playground/cards/NotificationCard";

interface UseDashboardToolsProps {
  dashboardState: DashboardState;
  actions: DashboardActions;
  toolsEnabled: ToolsEnabledConfig;
}

/**
 * Wraps all dashboard tool registrations with the SDK.
 * Uses useLatest to avoid stale closures in tool handlers.
 *
 * @see Vercel React best practices: `advanced-use-latest`
 */
export function useDashboardTools({
  dashboardState,
  actions,
  toolsEnabled,
}: UseDashboardToolsProps) {
  const [toolStates, setToolStates] = useState<Record<string, ToolState>>({});

  // Use refs to always get current state in handlers (avoid stale closures)
  const dashboardStateRef = useLatest(dashboardState);
  const actionsRef = useLatest(actions);

  const simulateDelay = useCallback(
    () =>
      new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700)),
    [],
  );

  // Update Counter Tool
  useTool(
    {
      name: "updateCounter",
      description:
        "Update the dashboard counter. Use this to increment, decrement, or reset the counter value.",
      available: toolsEnabled.updateCounter,
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["increment", "decrement", "reset"],
            description:
              "The action to perform: increment adds 1, decrement subtracts 1, reset sets to 0",
          },
        },
        required: ["action"],
      },
      handler: async ({
        action,
      }: {
        action: "increment" | "decrement" | "reset";
      }) => {
        console.log("[updateCounter] Handler called with action:", action);
        setToolStates((prev) => ({
          ...prev,
          updateCounter: { loading: true },
        }));
        await simulateDelay();
        const currentCount = dashboardStateRef.current.counter;
        const newValue =
          action === "increment"
            ? currentCount + 1
            : action === "decrement"
              ? currentCount - 1
              : 0;

        if (action === "increment") {
          actionsRef.current.incrementCounter();
        } else if (action === "decrement") {
          actionsRef.current.decrementCounter();
        } else {
          actionsRef.current.resetCounter();
        }

        setToolStates((prev) => ({
          ...prev,
          updateCounter: {
            loading: false,
            lastResult: { success: true, message: `counter.${action}()` },
          },
        }));
        const result = {
          success: true,
          action,
          newValue,
          message: `Counter ${action}ed successfully`,
        };
        console.log("[updateCounter] Returning result:", result);
        return result;
      },
      render: ({ status, args, result }) => {
        console.log("updateCounter render", status, args, result);
        if (status === "completed" && result?.success) {
          const actionIcons = {
            increment: <Plus className="h-4 w-4" />,
            decrement: <Minus className="h-4 w-4" />,
            reset: <RotateCcw className="h-4 w-4" />,
          };
          return (
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {actionIcons[args.action as keyof typeof actionIcons] || (
                      <Activity className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Counter Update
                    </p>
                    <p className="text-[10px] text-zinc-500">{args.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {(result as { newValue?: number }).newValue}
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      },
    },
    [toolsEnabled.updateCounter],
  ); // Re-register when availability changes

  // Update Preference Tool
  useTool(
    {
      name: "updatePreference",
      description:
        "Update user preference setting. Common values: dark, light, auto, system.",
      available: toolsEnabled.updatePreference,
      inputSchema: {
        type: "object",
        properties: {
          preference: {
            type: "string",
            description: "The new preference value (e.g., dark, light, auto)",
          },
        },
        required: ["preference"],
      },
      handler: async ({ preference }: { preference: string }) => {
        console.log(
          "[updatePreference] Handler called with preference:",
          preference,
        );
        setToolStates((prev) => ({
          ...prev,
          updatePreference: { loading: true },
        }));
        await simulateDelay();
        actionsRef.current.setPreference(preference);
        setToolStates((prev) => ({
          ...prev,
          updatePreference: {
            loading: false,
            lastResult: { success: true, message: `set "${preference}"` },
          },
        }));
        const result = {
          success: true,
          preference,
          message: `Preference set to ${preference}`,
        };
        console.log("[updatePreference] Returning result:", result);
        return result;
      },
      render: ({ status, args, result }) => {
        if (status === "completed" && result?.success) {
          return (
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Palette className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Preference Update
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Set to &quot;{args.preference}&quot;
                    </p>
                  </div>
                </div>
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          );
        }
        return null;
      },
    },
    [toolsEnabled.updatePreference],
  ); // Re-register when availability changes

  // Add Notification Tool
  useTool(
    {
      name: "addNotification",
      description:
        "Add a notification message to the dashboard notification queue.",
      available: toolsEnabled.addNotification,
      inputSchema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "The notification message to display",
          },
        },
        required: ["message"],
      },
      handler: async ({ message }: { message: string }) => {
        console.log("[addNotification] Handler called with message:", message);
        setToolStates((prev) => ({
          ...prev,
          addNotification: { loading: true },
        }));
        await simulateDelay();
        const queueSize = dashboardStateRef.current.notifications.length + 1;
        actionsRef.current.addNotification(message);
        setToolStates((prev) => ({
          ...prev,
          addNotification: {
            loading: false,
            lastResult: { success: true, message: "pushed to queue" },
          },
        }));
        const result = {
          success: true,
          notificationMessage: message,
          queueSize,
        };
        console.log("[addNotification] Returning result:", result);
        return result;
      },
      render: ({ status, args, result }) => {
        const isLoading = status === "pending" || status === "executing";
        const data =
          status === "completed" && result?.success
            ? (result as {
                notificationMessage?: string;
                queueSize?: number;
              })
            : null;

        return (
          <NotificationCard
            message={data?.notificationMessage || args?.message}
            queueSize={data?.queueSize}
            isLoading={isLoading}
            error={status === "error"}
          />
        );
      },
    },
    [toolsEnabled.addNotification],
  ); // Re-register when availability changes

  // Update Cart Tool
  useTool(
    {
      name: "updateCart",
      description:
        "Update shopping cart items. Can add items, remove items, or clear the entire cart.",
      available: toolsEnabled.updateCart,
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["add", "remove", "clear"],
            description:
              "The cart action: add increases count, remove decreases count, clear empties cart",
          },
          count: {
            type: "number",
            description:
              "Number of items to add or remove (defaults to 1 if not specified)",
          },
        },
        required: ["action"],
      },
      handler: async ({
        action,
        count,
      }: {
        action: "add" | "remove" | "clear";
        count?: number;
      }) => {
        console.log(
          "[updateCart] Handler called with action:",
          action,
          "count:",
          count,
        );
        setToolStates((prev) => ({ ...prev, updateCart: { loading: true } }));
        await simulateDelay();
        const prevCount = dashboardStateRef.current.cartItems;
        const newCount =
          action === "add"
            ? prevCount + (count || 1)
            : action === "remove"
              ? Math.max(0, prevCount - (count || 1))
              : 0;
        actionsRef.current.updateCart(action, count || 1);
        setToolStates((prev) => ({
          ...prev,
          updateCart: {
            loading: false,
            lastResult: {
              success: true,
              message: `cart.${action}(${count || 1})`,
            },
          },
        }));
        const result = {
          success: true,
          action,
          count: count || 1,
          prevCount,
          newCount,
          message: `Cart updated: ${action} ${count || 1} item(s)`,
        };
        console.log("[updateCart] Returning result:", result);
        return result;
      },
      render: ({ status, args, result }) => {
        if (status === "completed" && result?.success) {
          const actionConfig = {
            add: {
              icon: <Plus className="h-4 w-4" />,
              color: "emerald",
              label: "Add to Cart",
            },
            remove: {
              icon: <Minus className="h-4 w-4" />,
              color: "orange",
              label: "Remove from Cart",
            },
            clear: {
              icon: <Trash2 className="h-4 w-4" />,
              color: "rose",
              label: "Clear Cart",
            },
          };
          const config =
            actionConfig[args.action as keyof typeof actionConfig] ||
            actionConfig.add;
          const colorClasses = {
            emerald:
              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
            orange:
              "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
            rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
          };

          return (
            <div
              className={`p-3 rounded-lg border ${colorClasses[config.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-${config.color}-500/20 flex items-center justify-center`}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{config.label}</p>
                    <p className="text-[10px] opacity-70">
                      {args.count || 1} item(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {(result as { newCount?: number }).newCount}
                  </span>
                </div>
              </div>
            </div>
          );
        }
        return null;
      },
    },
    [toolsEnabled.updateCart],
  ); // Re-register when availability changes

  // Weather Tool (Generative UI)
  useTool(
    {
      name: "getWeather",
      description:
        "Get current weather information for a location. Returns temperature, conditions, and forecast.",
      inputSchema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description:
              "City name or location (e.g., 'San Francisco', 'New York')",
          },
        },
        required: ["location"],
      },
      handler: async ({ location }: { location: string }) => {
        console.log("[getWeather] Handler called with location:", location);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("[getWeather] Delay completed, generating result...");
        const conditions = [
          "Sunny",
          "Partly Cloudy",
          "Cloudy",
          "Rainy",
          "Clear",
        ];
        const temp = Math.floor(Math.random() * 30) + 50;
        const humidity = Math.floor(Math.random() * 40) + 40;
        const result = {
          success: true,
          data: {
            location,
            temperature: temp,
            unit: "°F",
            condition:
              conditions[Math.floor(Math.random() * conditions.length)],
            humidity,
          },
        };
        console.log("[getWeather] Returning result:", result);
        return result;
      },
      render: ({ status, result, args }) => {
        const isLoading = status === "pending" || status === "executing";
        const data =
          status === "completed" && result?.success
            ? (result.data as {
                temperature?: number;
                condition?: string;
                humidity?: number;
              })
            : null;

        return (
          <WeatherCard
            location={args?.location}
            temperature={data?.temperature}
            condition={data?.condition}
            humidity={data?.humidity}
            isLoading={isLoading}
            error={status === "error"}
          />
        );
      },
    },
    [],
  ); // Empty dependency array for stable registration

  // Stock Tool (Generative UI)
  useTool(
    {
      name: "getStockPrice",
      description:
        "Get current stock price and market data for a ticker symbol.",
      inputSchema: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "Stock ticker symbol (e.g., 'AAPL', 'GOOGL', 'TSLA')",
          },
        },
        required: ["symbol"],
      },
      handler: async ({ symbol }: { symbol: string }) => {
        console.log("[getStockPrice] Handler called with symbol:", symbol);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const basePrice =
          symbol.toUpperCase() === "AAPL"
            ? 187
            : symbol.toUpperCase() === "GOOGL"
              ? 142
              : symbol.toUpperCase() === "TSLA"
                ? 248
                : Math.floor(Math.random() * 200) + 50;
        const change = (Math.random() * 6 - 3).toFixed(2);
        const changePercent = (Math.random() * 4 - 2).toFixed(2);
        const result = {
          success: true,
          data: {
            symbol: symbol.toUpperCase(),
            price: basePrice + Math.random() * 5,
            change: parseFloat(change),
            changePercent: parseFloat(changePercent),
            volume: Math.floor(Math.random() * 50000000) + 10000000,
            marketCap: `${(basePrice * 15).toFixed(0)}B`,
          },
        };
        console.log("[getStockPrice] Returning result:", result);
        return result;
      },
      render: ({ status, args, result }) => {
        const isLoading = status === "pending" || status === "executing";
        const data =
          status === "completed" && result?.success
            ? (result.data as {
                price?: number;
                change?: number;
                changePercent?: number;
                volume?: number;
                marketCap?: string;
              })
            : null;

        return (
          <StockCard
            symbol={args?.symbol?.toUpperCase()}
            price={data?.price}
            change={data?.change}
            changePercent={data?.changePercent}
            volume={data?.volume}
            marketCap={data?.marketCap}
            isLoading={isLoading}
            error={status === "error"}
          />
        );
      },
    },
    [],
  ); // Empty dependency array for stable registration

  return { toolStates };
}
