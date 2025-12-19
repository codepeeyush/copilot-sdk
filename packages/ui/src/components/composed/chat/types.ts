import React from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatProps = {
  // === Core Props ===
  /** Messages to display */
  messages?: ChatMessage[];
  /** Called when user sends a message */
  onSendMessage?: (message: string) => void;
  /** Called when user stops generation */
  onStop?: () => void;
  /** Whether AI is currently generating */
  isLoading?: boolean;

  // === Labels/Text ===
  /** Placeholder text for input */
  placeholder?: string;
  /** Custom welcome message when no messages */
  welcomeMessage?: React.ReactNode;
  /** Title shown in header (if showHeader is true) */
  title?: string;

  // === Header ===
  /** Show header bar with title and close button */
  showHeader?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;

  // === Appearance ===
  /** Show powered by footer (free tier) */
  showPoweredBy?: boolean;
  /** Show user avatar (default: false) */
  showUserAvatar?: boolean;
  /** User avatar config */
  userAvatar?: {
    src?: string;
    fallback?: string;
  };
  /** Assistant avatar config */
  assistantAvatar?: {
    src?: string;
    fallback?: string;
  };
  /** Loader variant for typing indicator */
  loaderVariant?: "circular" | "classic" | "dots" | "pulse" | "typing";
  /** Font size for messages: 'sm' (14px), 'base' (16px), 'lg' (18px) */
  fontSize?: "sm" | "base" | "lg";

  // === Suggestions ===
  /** Quick reply suggestions */
  suggestions?: string[];
  /** Called when a suggestion is clicked */
  onSuggestionClick?: (suggestion: string) => void;

  // === Custom Rendering ===
  /** Custom message renderer */
  renderMessage?: (message: ChatMessage, index: number) => React.ReactNode;
  /** Custom input renderer (replaces entire input area) */
  renderInput?: () => React.ReactNode;
  /** Custom header renderer (replaces entire header) */
  renderHeader?: () => React.ReactNode;

  // === Styling ===
  /** Class name for root container (use for sizing) */
  className?: string;
  /** Granular class names for sub-components */
  classNames?: {
    root?: string;
    header?: string;
    container?: string;
    messageList?: string;
    userMessage?: string;
    assistantMessage?: string;
    input?: string;
    suggestions?: string;
    footer?: string;
  };
};
