/**
 * @yourgpt/ui
 *
 * Pre-built UI components for YourGPT Copilot SDK
 */

// ============================================
// Primitives (Building Blocks)
// ============================================
export { Loader } from "./components/ui/loader";
export { Markdown } from "./components/ui/markdown";
export { CodeBlock } from "./components/ui/code-block";
export { Button } from "./components/ui/button";
export { FeedbackBar } from "./components/ui/feedback-bar";
export { ScrollButton } from "./components/ui/scroll-button";
export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  type TooltipProps,
  type TooltipProviderProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
} from "./components/ui/tooltip";

// Message primitives
export {
  Message as MessagePrimitive,
  MessageAvatar,
  MessageContent,
} from "./components/ui/message";

// Input primitives
export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "./components/ui/prompt-input";

// Container primitives
export {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
  useChatContainer,
} from "./components/ui/chat-container";

// Source primitives
export { Source, SourceContent, SourceTrigger } from "./components/ui/source";

// ============================================
// Composed Components (Ready-to-use)
// ============================================
export {
  Chat,
  ConnectedChat,
  PoweredBy,
  type ChatProps,
  type ChatMessage,
  type ConnectedChatProps,
  type PoweredByProps,
} from "./components/composed";

// ============================================
// Icons
// ============================================
export {
  SendIcon,
  StopIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  CheckIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshIcon,
  UserIcon,
  BotIcon,
} from "./components/icons";

// ============================================
// Utilities
// ============================================
export { cn } from "./lib/utils";
