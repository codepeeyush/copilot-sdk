import React from "react";
import type { ToolExecutionData, ToolApprovalStatus } from "../tools";
import type { PermissionLevel } from "../../ui/permission-confirmation";

/**
 * Message attachment (images, files, etc.)
 */
export type MessageAttachment = {
  /** Type of attachment */
  type: "image" | "file" | "audio" | "video";
  /** Base64 data or URL */
  data: string;
  /** MIME type */
  mimeType: string;
  /** Optional filename */
  filename?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  /** Thinking/reasoning content (for models with extended thinking) */
  thinking?: string;
  /** Tool executions associated with this message */
  toolExecutions?: ToolExecutionData[];
  /** Attachments (images, files) */
  attachments?: MessageAttachment[];
  /** Tool call ID - for tool result messages (links to assistant's tool_calls) */
  tool_call_id?: string;
  /** Tool calls made by assistant */
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
};

export type { ToolApprovalStatus, PermissionLevel };

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

  // === Follow-up Questions ===
  /**
   * Show AI-generated follow-up questions below the last message
   * AI should include them in format: [FOLLOWUP: Q1? | Q2? | Q3?]
   * @default true
   */
  showFollowUps?: boolean;
  /** Custom class for follow-up container */
  followUpClassName?: string;
  /** Custom class for follow-up buttons */
  followUpButtonClassName?: string;

  // === Tool Executions ===
  /** Global tool executions to display (not per-message) */
  toolExecutions?: ToolExecutionData[];
  /** Show tool executions inline with messages */
  showToolExecutions?: boolean;
  /** Current loop iteration */
  loopIteration?: number;
  /** Maximum loop iterations */
  loopMaxIterations?: number;
  /** Whether the loop is running */
  loopRunning?: boolean;
  /** Whether waiting for server after tool completion (shows "Continuing..." loader) */
  isProcessing?: boolean;

  // === Tool Approval (Human-in-the-loop) ===
  /** Called when user approves a tool execution */
  onApproveToolExecution?: (
    executionId: string,
    permissionLevel?: PermissionLevel,
  ) => void;
  /** Called when user rejects a tool execution */
  onRejectToolExecution?: (
    executionId: string,
    reason?: string,
    permissionLevel?: PermissionLevel,
  ) => void;

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
    toolExecutions?: string;
    loopProgress?: string;
  };
};
