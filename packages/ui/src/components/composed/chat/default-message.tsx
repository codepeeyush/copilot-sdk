"use client";

import { cn } from "../../../lib/utils";
import { Message, MessageAvatar, MessageContent } from "../../ui/message";
import type { ChatMessage } from "./types";

type DefaultMessageProps = {
  message: ChatMessage;
  userAvatar: { src?: string; fallback?: string };
  assistantAvatar: { src?: string; fallback?: string };
  showUserAvatar?: boolean;
  userMessageClassName?: string;
  assistantMessageClassName?: string;
  /** Font size variant: 'sm' (14px), 'base' (16px), 'lg' (18px) */
  size?: "sm" | "base" | "lg";
};

export function DefaultMessage({
  message,
  userAvatar,
  assistantAvatar,
  showUserAvatar = false,
  userMessageClassName,
  assistantMessageClassName,
  size = "sm",
}: DefaultMessageProps) {
  const isUser = message.role === "user";

  // User message - right aligned, avatar optional
  if (isUser) {
    return (
      <Message
        className={cn(
          "flex gap-2",
          showUserAvatar ? "justify-end" : "justify-end",
        )}
      >
        <MessageContent
          className={cn(
            "max-w-[80%] rounded-lg px-4 py-2 bg-primary text-primary-foreground",
            userMessageClassName,
          )}
          size={size}
        >
          {message.content || ""}
        </MessageContent>
        {showUserAvatar && (
          <MessageAvatar
            src={userAvatar.src || ""}
            alt="User"
            fallback={userAvatar.fallback}
          />
        )}
      </Message>
    );
  }

  // Assistant message - left aligned with avatar
  return (
    <Message className="flex gap-2">
      <MessageAvatar
        src={assistantAvatar.src || ""}
        alt="Assistant"
        fallback={assistantAvatar.fallback}
        className="bg-primary text-primary-foreground"
      />
      <MessageContent
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 bg-muted",
          assistantMessageClassName,
        )}
        markdown
        size={size}
      >
        {message.content || ""}
      </MessageContent>
    </Message>
  );
}
