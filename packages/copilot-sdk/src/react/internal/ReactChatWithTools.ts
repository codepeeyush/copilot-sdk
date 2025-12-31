/**
 * ReactChatWithTools - React-specific wrapper for ChatWithTools
 *
 * Injects ReactChatState for proper useSyncExternalStore integration.
 */

import {
  ChatWithTools,
  type ChatWithToolsConfig,
  type ChatWithToolsCallbacks,
  type UIMessage,
  type ToolExecution,
} from "../../chat";
import { ReactChatState } from "./ReactChatState";

/**
 * React-specific configuration
 */
export interface ReactChatWithToolsConfig extends Omit<
  ChatWithToolsConfig,
  "state"
> {
  /** Initial messages */
  initialMessages?: UIMessage[];
}

/**
 * ReactChatWithTools - Chat + Tools with React state management
 *
 * @example
 * ```tsx
 * const chatRef = useRef(new ReactChatWithTools(config, callbacks));
 *
 * const messages = useSyncExternalStore(
 *   chatRef.current.subscribe,
 *   () => chatRef.current.messages
 * );
 * ```
 */
export class ReactChatWithTools extends ChatWithTools {
  private reactState: ReactChatState<UIMessage>;

  constructor(
    config: ReactChatWithToolsConfig,
    callbacks: ChatWithToolsCallbacks = {},
  ) {
    // Create React-specific state
    const reactState = new ReactChatState<UIMessage>(config.initialMessages);

    // Pass state to parent
    super({ ...config, state: reactState }, callbacks);

    this.reactState = reactState;
  }

  /**
   * Subscribe to state changes (for useSyncExternalStore)
   */
  subscribe = (callback: () => void): (() => void) => {
    return this.reactState.subscribe(callback);
  };

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    super.dispose();
    this.reactState.dispose();
  }
}

/**
 * Create a ReactChatWithTools instance
 */
export function createReactChatWithTools(
  config: ReactChatWithToolsConfig,
  callbacks?: ChatWithToolsCallbacks,
): ReactChatWithTools {
  return new ReactChatWithTools(config, callbacks);
}
