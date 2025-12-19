"use client";

import React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../../lib/utils";

// ============================================
// TooltipProvider
// ============================================

export type TooltipProviderProps = {
  children: React.ReactNode;
  delayDuration?: number;
};

function TooltipProvider({
  children,
  delayDuration = 300,
}: TooltipProviderProps) {
  return (
    <BaseTooltip.Provider delay={delayDuration}>
      {children}
    </BaseTooltip.Provider>
  );
}

// ============================================
// Tooltip (Root)
// ============================================

export type TooltipProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Tooltip({ children, open, defaultOpen, onOpenChange }: TooltipProps) {
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </BaseTooltip.Root>
  );
}

// ============================================
// TooltipTrigger
// ============================================

export type TooltipTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

function TooltipTrigger({
  children,
  asChild,
  disabled,
  ...props
}: TooltipTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return (
      <BaseTooltip.Trigger disabled={disabled} render={children} {...props} />
    );
  }

  return (
    <BaseTooltip.Trigger disabled={disabled} {...props}>
      {children}
    </BaseTooltip.Trigger>
  );
}

// ============================================
// TooltipContent
// ============================================

export type TooltipContentProps = {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  showArrow?: boolean;
};

function TooltipContent({
  children,
  className,
  side = "top",
  align = "center",
  sideOffset = 8,
  showArrow = true,
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseTooltip.Popup
          className={cn(
            "z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className,
          )}
        >
          {children}
          {showArrow && <BaseTooltip.Arrow className="fill-primary" />}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

// ============================================
// Exports
// ============================================

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
