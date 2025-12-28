"use client";

import React from "react";
import { useYourGPTContext } from "@yourgpt/copilot-sdk-react";
import { Chat, type ChatProps } from "./chat";
import type { ToolExecutionData } from "./tools/tool-execution-list";

/**
 * Props for CopilotChat - auto-connects to YourGPTProvider context
 * No need to pass messages, sendMessage, etc. - handled internally
 */
export type CopilotChatProps = Omit<
  ChatProps,
  | "messages"
  | "onSendMessage"
  | "onStop"
  | "isLoading"
  | "toolExecutions"
  | "loopIteration"
  | "loopMaxIterations"
  | "loopRunning"
  | "onApproveToolExecution"
  | "onRejectToolExecution"
> & {
  /**
   * Show tool executions in the chat (default: true when tools are being executed)
   */
  showToolExecutions?: boolean;
};

/**
 * CopilotChat - Auto-connected chat component
 *
 * Automatically connects to YourGPTProvider context.
 * No need to use hooks or pass messages - everything is handled internally.
 *
 * @example
 * ```tsx
 * import { YourGPTProvider } from '@yourgpt/copilot-sdk-react';
 * import { CopilotChat } from '@yourgpt/copilot-sdk-ui';
 *
 * function App() {
 *   return (
 *     <YourGPTProvider runtimeUrl="/api/chat">
 *       <CopilotChat
 *         title="AI Assistant"
 *         placeholder="Ask anything..."
 *       />
 *     </YourGPTProvider>
 *   );
 * }
 * ```
 */
export function CopilotChat(props: CopilotChatProps) {
  // Auto-connect to context internally
  const {
    chat,
    actions,
    agentLoop,
    isPremium,
    approveToolExecution,
    rejectToolExecution,
  } = useYourGPTContext();

  // Auto-hide powered by for premium users (unless explicitly set)
  const showPoweredBy = props.showPoweredBy ?? !isPremium;

  // Convert tool executions to the expected format
  const toolExecutions: ToolExecutionData[] = agentLoop.toolExecutions.map(
    (exec) => ({
      id: exec.id,
      name: exec.name,
      args: exec.args,
      status: exec.status,
      result: exec.result,
      error: exec.error,
      timestamp: exec.timestamp,
      duration: exec.duration,
      approvalStatus: exec.approvalStatus,
      approvalMessage: exec.approvalMessage,
    }),
  );

  // Include all messages (user, assistant, tool) in the chat display
  // Tool messages are shown as separate items for transparency
  const visibleMessages = chat.messages.map((m) => {
    // For assistant messages, match tool executions by tool_calls IDs
    let messageToolExecutions: ToolExecutionData[] | undefined;

    if (m.role === "assistant" && m.tool_calls && m.tool_calls.length > 0) {
      // Match executions to this message's tool_calls by ID
      const toolCallIds = new Set(m.tool_calls.map((tc) => tc.id));
      const matchedExecutions = toolExecutions.filter((exec) =>
        toolCallIds.has(exec.id),
      );
      if (matchedExecutions.length > 0) {
        messageToolExecutions = matchedExecutions;
      }
    }

    // Check for saved executions in metadata (for historical messages)
    const savedExecutions = (
      m.metadata as { toolExecutions?: ToolExecutionData[] }
    )?.toolExecutions;
    if (
      savedExecutions &&
      savedExecutions.length > 0 &&
      !messageToolExecutions
    ) {
      messageToolExecutions = savedExecutions;
    }

    return {
      id: m.id,
      role: m.role as "user" | "assistant" | "system" | "tool",
      content: m.content ?? "",
      thinking: m.metadata?.thinking,
      // Include attachments (images, files)
      attachments: m.metadata?.attachments,
      // Include tool_call_id for tool messages
      tool_call_id: m.tool_call_id,
      // Include tool_calls for assistant messages
      tool_calls: m.tool_calls,
      // Attach matched tool executions to assistant messages
      toolExecutions: messageToolExecutions,
    };
  });

  // Show suggestions only when no messages
  const suggestions =
    visibleMessages.length === 0 && props.suggestions?.length
      ? props.suggestions
      : [];

  // Show tool executions when there are any (they get cleared on new message)
  const showToolExecutions =
    props.showToolExecutions ?? toolExecutions.length > 0;

  // Determine if agent loop is running
  const loopRunning = chat.isLoading && agentLoop.iteration > 0;

  return (
    <Chat
      {...props}
      messages={visibleMessages}
      onSendMessage={actions.sendMessage}
      onStop={actions.stopGeneration}
      isLoading={chat.isLoading}
      showPoweredBy={showPoweredBy}
      suggestions={suggestions}
      // Tool execution props
      toolExecutions={toolExecutions}
      showToolExecutions={showToolExecutions}
      loopIteration={agentLoop.iteration}
      loopMaxIterations={agentLoop.maxIterations}
      loopRunning={loopRunning}
      isProcessing={agentLoop.isProcessing}
      // Tool approval props
      onApproveToolExecution={approveToolExecution}
      onRejectToolExecution={rejectToolExecution}
    />
  );
}

// Alias for backwards compatibility
export const ConnectedChat = CopilotChat;
export type ConnectedChatProps = CopilotChatProps;
