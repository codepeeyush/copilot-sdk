"use client";

import React from "react";
import { Chat, ChatProps } from "./chat";

// Type for the useAIChat hook return value
type UseAIChatReturn = {
  messages: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  sendMessage: (message: string) => void;
  isLoading: boolean;
  stop?: () => void;
};

export type ConnectedChatProps = Omit<
  ChatProps,
  "messages" | "onSendMessage" | "onStop" | "isLoading"
> & {
  /** useAIChat hook instance */
  chat: UseAIChatReturn;
};

/**
 * Chat component pre-connected to useAIChat hook.
 *
 * @example
 * ```tsx
 * import { ConnectedChat } from '@yourgpt/ui';
 * import { useAIChat } from '@yourgpt/react';
 *
 * function MyChat() {
 *   const chat = useAIChat();
 *   return <ConnectedChat chat={chat} />;
 * }
 * ```
 */
export function ConnectedChat({ chat, ...props }: ConnectedChatProps) {
  return (
    <Chat
      messages={chat.messages}
      onSendMessage={chat.sendMessage}
      onStop={chat.stop}
      isLoading={chat.isLoading}
      {...props}
    />
  );
}
