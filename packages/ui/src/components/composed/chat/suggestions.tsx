"use client";

import { cn } from "../../../lib/utils";

type SuggestionsProps = {
  suggestions: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
};

export function Suggestions({
  suggestions,
  onSuggestionClick,
  className,
}: SuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 px-4 py-2", className)}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSuggestionClick?.(suggestion)}
          className="inline-flex items-center rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
