"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type FollowUpProps = {
  /** Follow-up questions to display */
  questions: string[];
  /** Called when a follow-up is clicked */
  onSelect: (question: string) => void;
  /** Custom class for container */
  className?: string;
  /** Custom class for buttons */
  buttonClassName?: string;
};

/**
 * Parse follow-up questions from message content
 * Format: [FOLLOWUP: question1 | question2 | question3]
 */
export function parseFollowUps(content: string): {
  cleanContent: string;
  followUps: string[];
} {
  if (!content) {
    return { cleanContent: content, followUps: [] };
  }

  const followUpRegex = /\[FOLLOWUP:\s*([^\]]+)\]/gi;
  const matches = content.match(followUpRegex);

  if (!matches || matches.length === 0) {
    return { cleanContent: content, followUps: [] };
  }

  // Extract follow-ups from the last match
  const lastMatch = matches[matches.length - 1];
  const innerContent = lastMatch.replace(/\[FOLLOWUP:\s*|\]/gi, "");
  const followUps = innerContent
    .split("|")
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  // Remove ALL FOLLOWUP tags from content
  const cleanContent = content.replace(followUpRegex, "").trim();

  return { cleanContent, followUps };
}

/**
 * Follow-up questions component
 * Displays clickable chips for suggested follow-up actions
 */
export function FollowUpQuestions({
  questions,
  onSelect,
  className,
  buttonClassName,
}: FollowUpProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className={cn("csdk-followup flex flex-wrap gap-2 mt-2", className)}>
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className={cn(
            "csdk-followup-button px-3 py-1.5 text-sm rounded-full",
            "bg-primary/10 hover:bg-primary/20 text-primary",
            "border border-primary/20 hover:border-primary/40",
            "transition-colors duration-150",
            "text-left whitespace-nowrap",
            buttonClassName,
          )}
        >
          {question}
        </button>
      ))}
    </div>
  );
}
