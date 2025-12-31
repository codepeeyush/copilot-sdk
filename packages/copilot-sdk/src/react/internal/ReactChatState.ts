/**
 * ReactChatState - React-specific implementation of ChatState
 *
 * This class implements the ChatState interface with callback-based
 * reactivity for use with React's useSyncExternalStore.
 *
 * Pattern inspired by Vercel AI SDK's useSyncExternalStore pattern.
 */

import type { ChatState, UIMessage, ChatStatus } from "../../chat";

/**
 * ReactChatState implements ChatState with callback-based reactivity
 *
 * @example
 * ```tsx
 * const state = new ReactChatState<UIMessage>();
 *
 * // Subscribe to changes (for useSyncExternalStore)
 * const unsubscribe = state.subscribe(() => {
 *   console.log('State changed');
 * });
 *
 * // Get snapshot (for useSyncExternalStore)
 * const messages = state.messages;
 * ```
 */
export class ReactChatState<
  T extends UIMessage = UIMessage,
> implements ChatState<T> {
  private _messages: T[] = [];
  private _status: ChatStatus = "ready";
  private _error: Error | undefined = undefined;

  // Callbacks for React subscriptions (useSyncExternalStore)
  private subscribers = new Set<() => void>();

  constructor(initialMessages?: T[]) {
    if (initialMessages) {
      this._messages = initialMessages;
    }
  }

  // ============================================
  // Getters
  // ============================================

  get messages(): T[] {
    return this._messages;
  }

  get status(): ChatStatus {
    return this._status;
  }

  get error(): Error | undefined {
    return this._error;
  }

  // ============================================
  // Setters (trigger reactivity)
  // ============================================

  set messages(value: T[]) {
    this._messages = value;
    this.notify();
  }

  set status(value: ChatStatus) {
    this._status = value;
    this.notify();
  }

  set error(value: Error | undefined) {
    this._error = value;
    this.notify();
  }

  // ============================================
  // Mutations
  // ============================================

  pushMessage(message: T): void {
    this._messages = [...this._messages, message];
    this.notify();
  }

  popMessage(): void {
    this._messages = this._messages.slice(0, -1);
    this.notify();
  }

  replaceMessage(index: number, message: T): void {
    this._messages = this._messages.map((m, i) => (i === index ? message : m));
    this.notify();
  }

  updateLastMessage(updater: (message: T) => T): void {
    if (this._messages.length === 0) return;

    const lastIndex = this._messages.length - 1;
    const lastMessage = this._messages[lastIndex];
    this._messages = [
      ...this._messages.slice(0, lastIndex),
      updater(lastMessage),
    ];
    this.notify();
  }

  setMessages(messages: T[]): void {
    this._messages = messages;
    this.notify();
  }

  clearMessages(): void {
    this._messages = [];
    this.notify();
  }

  // ============================================
  // Subscription (for useSyncExternalStore)
  // ============================================

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   *
   * @example
   * ```tsx
   * const messages = useSyncExternalStore(
   *   state.subscribe,
   *   () => state.messages
   * );
   * ```
   */
  subscribe = (callback: () => void): (() => void) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  // ============================================
  // Private Methods
  // ============================================

  private notify(): void {
    this.subscribers.forEach((cb) => cb());
  }

  /**
   * Cleanup subscriptions
   */
  dispose(): void {
    this.subscribers.clear();
  }
}

/**
 * Create a ReactChatState instance
 */
export function createReactChatState<T extends UIMessage = UIMessage>(
  initialMessages?: T[],
): ReactChatState<T> {
  return new ReactChatState<T>(initialMessages);
}
