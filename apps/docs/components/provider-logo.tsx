"use client";

import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

// Import all provider logos
import { Openai } from "@/components/ui/svgs/openai";
import { OpenaiDark } from "@/components/ui/svgs/openaiDark";
import { AnthropicBlack } from "@/components/ui/svgs/anthropicBlack";
import { AnthropicWhite } from "@/components/ui/svgs/anthropicWhite";
import { Gemini } from "@/components/ui/svgs/gemini";
import { XaiLight } from "@/components/ui/svgs/xaiLight";
import { XaiDark } from "@/components/ui/svgs/xaiDark";

export type Provider = "openai" | "anthropic" | "google" | "gemini" | "xai";

interface ProviderLogoProps extends SVGProps<SVGSVGElement> {
  provider: Provider;
  className?: string;
}

/**
 * Provider logo component that automatically handles light/dark theme
 * Uses CSS to show/hide appropriate logo variant based on theme
 */
export function ProviderLogo({
  provider,
  className,
  ...props
}: ProviderLogoProps) {
  const baseClass = cn("h-8 w-8", className);

  switch (provider) {
    case "openai":
      return (
        <>
          <Openai
            className={cn(baseClass, "dark:hidden fill-current")}
            {...props}
          />
          <OpenaiDark
            className={cn(baseClass, "hidden dark:block fill-current")}
            {...props}
          />
        </>
      );

    case "anthropic":
      return (
        <>
          <AnthropicBlack
            className={cn(baseClass, "dark:hidden fill-current")}
            {...props}
          />
          <AnthropicWhite
            className={cn(baseClass, "hidden dark:block fill-current")}
            {...props}
          />
        </>
      );

    case "google":
    case "gemini":
      return <Gemini className={baseClass} {...props} />;

    case "xai":
      return (
        <>
          <XaiLight
            className={cn(baseClass, "dark:hidden fill-current")}
            {...props}
          />
          <XaiDark className={cn(baseClass, "hidden dark:block")} {...props} />
        </>
      );

    default:
      return null;
  }
}

// Export individual logos for direct use if needed
export {
  Openai,
  OpenaiDark,
  AnthropicBlack,
  AnthropicWhite,
  Gemini,
  XaiLight,
  XaiDark,
};
