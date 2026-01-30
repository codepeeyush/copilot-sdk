"use client";

import { memo } from "react";

interface StatusDotProps {
  active: boolean;
  pulse?: boolean;
}

function StatusDotComponent({ active, pulse }: StatusDotProps) {
  return (
    <span className="relative flex h-2 w-2">
      {pulse && active ? (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      ) : null}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600"}`}
      />
    </span>
  );
}

export const StatusDot = memo(StatusDotComponent);
