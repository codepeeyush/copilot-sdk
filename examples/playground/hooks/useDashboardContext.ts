"use client";

import { useAIContext } from "@yourgpt/copilot-sdk/react";
import type { DashboardState, PersonData } from "@/lib/types";

interface UseDashboardContextProps {
  dashboardState: DashboardState;
  currentPerson: PersonData;
}

/**
 * Provides dashboard context to the AI using useAIContext hooks.
 */
export function useDashboardContext({
  dashboardState,
  currentPerson,
}: UseDashboardContextProps) {
  // Provide dashboard state context
  useAIContext({
    key: "dashboardState",
    data: dashboardState,
    description:
      "Current dashboard state with counter, cartItems, preference, and notifications",
  });

  // Provide available tools context
  useAIContext({
    key: "availableTools",
    data: [
      "updateCounter",
      "updatePreference",
      "addNotification",
      "updateCart",
      "getWeather",
      "getStockPrice",
    ],
    description: "List of available tools that can be used",
  });

  // Provide current user context
  useAIContext({
    key: "currentUser",
    data: currentPerson,
    description:
      "Current user's profile including name, email, role, subscription plan, credits, and preferences",
  });
}
