import { Chat } from "@yourgpt/ui";
import { useAIChat } from "@yourgpt/react";
export function Copilot() {
  const { messages, sendMessage, stop, isLoading } = useAIChat();
  return (
    <div className="h-screen sticky top-0 right-0 bg-sidebar p-2 w-[380px]">
      <Chat
        messages={messages}
        onSendMessage={sendMessage}
        onStop={stop}
        isLoading={isLoading}
        showHeader={true}
        title="YourGPT Chat"
        showPoweredBy={true}
        suggestions={
          messages.length === 0
            ? ["What can you do?", "Tell me a joke", "Help me code"]
            : []
        }
        welcomeMessage="Hello! How can I help you today?"
        className="rounded-xl border"
      />
    </div>
  );
}
