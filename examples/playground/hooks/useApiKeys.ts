"use client";

import { useState, useCallback } from "react";
import type { ApiKeys, ProviderId } from "@/lib/types";
import { API_KEYS_STORAGE_KEY, INITIAL_API_KEYS } from "@/lib/constants";

/**
 * Manages API key state with localStorage persistence.
 * Uses lazy initialization to avoid hydration issues.
 *
 * @see Vercel React best practices: `rerender-lazy-state-init`, `js-cache-storage`
 */
export function useApiKeys() {
  // Lazy initialization from localStorage (only runs on first render)
  const [keys, setKeys] = useState<ApiKeys>(() => {
    // Check if we're on the client
    if (typeof window === "undefined") {
      return INITIAL_API_KEYS;
    }

    // Cache localStorage read
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as ApiKeys;
      } catch {
        return INITIAL_API_KEYS;
      }
    }
    return INITIAL_API_KEYS;
  });

  // Update keys and persist to localStorage
  const updateKeys = useCallback((newKeys: ApiKeys) => {
    setKeys(newKeys);
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(newKeys));
  }, []);

  // Check if a specific provider has a key configured
  const hasKey = useCallback(
    (provider: ProviderId): boolean => {
      return !!keys[provider];
    },
    [keys],
  );

  return {
    keys,
    updateKeys,
    hasKey,
  };
}
