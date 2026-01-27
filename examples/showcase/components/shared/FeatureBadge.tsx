"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeatureBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function FeatureBadge({
  children,
  variant = "secondary",
  className,
}: FeatureBadgeProps) {
  return (
    <Badge variant={variant} className={cn("text-xs", className)}>
      {children}
    </Badge>
  );
}
