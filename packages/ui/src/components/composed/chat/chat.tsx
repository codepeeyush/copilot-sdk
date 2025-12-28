"use client";

import React, { useState, useCallback } from "react";
import { cn } from "../../../lib/utils";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "../../ui/chat-container";
import { ScrollButton } from "../../ui/scroll-button";
import { Message, MessageAvatar } from "../../ui/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "../../ui/prompt-input";
import { Loader } from "../../ui/loader";
import { Button } from "../../ui/button";
import { StopIcon, PlusIcon, ArrowUpIcon } from "../../icons";
import { ChatHeader } from "./chat-header";
import { Suggestions } from "./suggestions";
import { DefaultMessage } from "./default-message";
import { ToolExecutionMessage } from "./tool-execution-message";
import { LoopProgressBadge } from "../tools/loop-progress";
import type { ChatProps } from "./types";

export function Chat({
  // Core
  messages = [],
  onSendMessage,
  onStop,
  isLoading = false,
  // Labels
  placeholder = "Type a message...",
  welcomeMessage,
  title,
  // Header
  showHeader = false,
  onClose,
  // Appearance
  showPoweredBy = true,
  showUserAvatar = false,
  userAvatar = { fallback: "U" },
  assistantAvatar = { fallback: "AI" },
  loaderVariant = "typing",
  fontSize = "sm",
  // Suggestions
  suggestions = [],
  onSuggestionClick,
  // Tool Executions
  toolExecutions = [],
  showToolExecutions = false,
  loopIteration,
  loopMaxIterations,
  loopRunning = false,
  isProcessing = false,
  // Tool Approval
  onApproveToolExecution,
  onRejectToolExecution,
  // Follow-up Questions
  showFollowUps = true,
  followUpClassName,
  followUpButtonClassName,
  // Custom rendering
  renderMessage,
  renderInput,
  renderHeader,
  // Styling
  className,
  classNames = {},
}: ChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSendMessage?.(input);
    setInput("");
  }, [input, isLoading, onSendMessage]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion);
      } else {
        onSendMessage?.(suggestion);
      }
    },
    [onSuggestionClick, onSendMessage],
  );

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-background",
        className,
        classNames.root,
      )}
    >
      {/* Header */}
      {showHeader &&
        (renderHeader ? (
          renderHeader()
        ) : (
          <ChatHeader
            title={title}
            onClose={onClose}
            className={classNames.header}
          />
        ))}

      {/* Messages */}
      <ChatContainerRoot
        className={cn("relative flex-1", classNames.container)}
      >
        <ChatContainerContent
          className={cn("gap-4 p-4", classNames.messageList)}
        >
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              {welcomeMessage || "Send a message to start the conversation"}
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            const isEmptyAssistant =
              message.role === "assistant" && !message.content?.trim();

            // Check if there are pending tool approvals
            const hasPendingApprovals = toolExecutions.some(
              (exec) => exec.approvalStatus === "required",
            );

            // Handle empty assistant messages (ones with tool_calls but no content)
            if (isEmptyAssistant) {
              // Don't hide if this is the last message and has pending approvals
              // (need to show approval UI)
              if (isLastMessage && hasPendingApprovals) {
                // Continue to render with tool executions attached
              } else if (isLastMessage && isLoading) {
                // If there are tool executions, don't show loader here
                // The ToolExecutionMessage component will handle displaying tool progress
                if (toolExecutions.length > 0) {
                  return null;
                }
                // Show loader while streaming (no tool executions)
                return (
                  <Message key={message.id} className="flex gap-2">
                    <MessageAvatar
                      src={assistantAvatar.src || ""}
                      alt="Assistant"
                      fallback={assistantAvatar.fallback}
                      className="bg-primary text-primary-foreground"
                    />
                    <div className="rounded-lg bg-muted px-4 py-2">
                      <Loader variant={loaderVariant} size="sm" />
                    </div>
                  </Message>
                );
              } else {
                // Hide empty assistant messages (tool-only, no content, no pending approvals)
                return null;
              }
            }

            // Use tool executions from the message directly
            // (connected-chat.tsx already matches executions to their respective messages)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const savedExecutions = (message as any).metadata
              ?.toolExecutions as typeof toolExecutions | undefined;
            const messageToolExecutions =
              message.toolExecutions || savedExecutions;

            const messageWithExecutions = messageToolExecutions
              ? { ...message, toolExecutions: messageToolExecutions }
              : message;

            // Handle follow-up click - use onSendMessage if available
            const handleFollowUpClick = (question: string) => {
              if (onSuggestionClick) {
                onSuggestionClick(question);
              } else {
                onSendMessage?.(question);
              }
            };

            return renderMessage ? (
              <React.Fragment key={message.id}>
                {renderMessage(messageWithExecutions, index)}
              </React.Fragment>
            ) : (
              <DefaultMessage
                key={message.id}
                message={messageWithExecutions}
                userAvatar={userAvatar}
                assistantAvatar={assistantAvatar}
                showUserAvatar={showUserAvatar}
                userMessageClassName={classNames.userMessage}
                assistantMessageClassName={classNames.assistantMessage}
                size={fontSize}
                isLastMessage={isLastMessage}
                isLoading={isLoading}
                onApproveToolExecution={onApproveToolExecution}
                onRejectToolExecution={onRejectToolExecution}
                showFollowUps={showFollowUps}
                onFollowUpClick={handleFollowUpClick}
                followUpClassName={followUpClassName}
                followUpButtonClassName={followUpButtonClassName}
              />
            );
          })}

          {/* Standalone Tool Execution Message - shown when tools are running but no content yet */}
          {toolExecutions.length > 0 &&
            isLoading &&
            (() => {
              // Check if last message has content
              const lastMessage = messages[messages.length - 1];
              const lastIsEmptyAssistant =
                lastMessage?.role === "assistant" &&
                !lastMessage?.content?.trim();
              // Show standalone tool message if no messages or last assistant has no content
              if (messages.length === 0 || lastIsEmptyAssistant) {
                return (
                  <ToolExecutionMessage
                    executions={toolExecutions}
                    assistantAvatar={assistantAvatar}
                    onApprove={onApproveToolExecution}
                    onReject={onRejectToolExecution}
                  />
                );
              }
              return null;
            })()}

          {/* "Continuing..." loader - shown after tool completion while waiting for server */}
          {isProcessing && (
            <Message className="flex gap-2">
              <MessageAvatar
                src={assistantAvatar?.src || ""}
                alt="Assistant"
                fallback={assistantAvatar?.fallback || "AI"}
                className="bg-primary text-primary-foreground"
              />
              <div className="rounded-lg bg-muted px-4 py-2 flex items-center gap-2">
                <Loader variant="dots" size="sm" />
                <span className="text-sm text-muted-foreground">
                  Continuing...
                </span>
              </div>
            </Message>
          )}

          {/* Loop Progress Badge - commented out for now
          {showToolExecutions &&
            loopIteration !== undefined &&
            loopMaxIterations !== undefined &&
            (loopRunning || loopIteration > 0) && (
              <div className={cn("mt-2", classNames.loopProgress)}>
                <LoopProgressBadge
                  iteration={loopIteration}
                  maxIterations={loopMaxIterations}
                  isRunning={loopRunning}
                  maxReached={loopIteration >= loopMaxIterations}
                />
              </div>
            )}
          */}

          <ChatContainerScrollAnchor />
        </ChatContainerContent>

        {/* Scroll to bottom button */}
        <div className="absolute right-4 bottom-4">
          <ScrollButton className="shadow-sm" />
        </div>
      </ChatContainerRoot>

      {/* Suggestions */}
      {suggestions.length > 0 && !isLoading && (
        <Suggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          className={classNames.suggestions}
        />
      )}

      {/* Input */}
      {renderInput ? (
        renderInput()
      ) : (
        <div className={cn("p-2", classNames.input)}>
          <PromptInput
            value={input}
            onValueChange={setInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className=""
          >
            <PromptInputTextarea placeholder={placeholder} />
            <PromptInputActions className="flex justify-between">
              <div>
                <PromptInputAction tooltip="Attach files">
                  <label
                    htmlFor="file-upload"
                    className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                  >
                    <input
                      type="file"
                      multiple
                      onChange={() => {}}
                      className="hidden"
                      id="file-upload"
                    />
                    <PlusIcon className="text-primary size-5" />
                  </label>
                </PromptInputAction>
              </div>
              <PromptInputAction tooltip={isLoading ? "Stop" : "Send"}>
                {isLoading ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full size-9"
                    onClick={onStop}
                  >
                    <StopIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-full size-9"
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </Button>
                )}
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      )}
    </div>
  );
}
