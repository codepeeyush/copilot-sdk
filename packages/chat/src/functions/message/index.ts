/**
 * Message function exports
 */

export {
  generateMessageId,
  createUserMessage,
  createAssistantMessage,
  createToolMessage,
  createSystemMessage,
  streamStateToMessage,
  createEmptyAssistantMessage,
} from "./createMessage";

export {
  updateMessageContent,
  appendMessageContent,
  updateMessageThinking,
  appendMessageThinking,
  updateMessage,
  removeMessage,
  findMessage,
  getLastMessage,
  getLastAssistantMessage,
  hasPendingToolCalls,
} from "./updateMessage";
