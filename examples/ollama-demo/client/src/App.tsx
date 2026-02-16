import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat, useCopilotChatContext } from "@yourgpt/copilot-sdk/ui";

function Suggestions() {
  const { send } = useCopilotChatContext();

  const suggestions = [
    "What can you help me with?",
    "What's the weather in Tokyo?",
    "Calculate 15% tip on $84.50",
    "Write a short poem about coding",
  ];

  return (
    <div className="suggestions">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => send(text)}
          className="suggestion-btn"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function ChatInterface() {
  return (
    <div className="chat-container" data-csdk-theme="modern-minimal">
      <CopilotChat.Root
        persistence={true}
        className="chat-root"
        showPoweredBy={false}
      >
        <CopilotChat.HomeView className="home-view">
          <div className="welcome-icon">🦙</div>
          <h1 className="welcome-title">Ollama Local AI</h1>
          <p className="welcome-subtitle">
            Private, fast, and running entirely on your machine.
          </p>
          <CopilotChat.Input placeholder="Ask anything..." />
          <Suggestions />
        </CopilotChat.HomeView>

        <CopilotChat.ChatView>
          <CopilotChat.Header className="chat-header">
            <CopilotChat.BackButton className="back-btn">
              ←
            </CopilotChat.BackButton>
            <span className="header-title">Ollama Chat</span>
            <CopilotChat.ThreadPicker size="sm" />
          </CopilotChat.Header>
        </CopilotChat.ChatView>
      </CopilotChat.Root>
    </div>
  );
}

export default function App() {
  return (
    <CopilotProvider
      runtimeUrl="/api/copilot"
      systemPrompt="You are a helpful AI assistant running locally via Ollama. You have access to weather and calculator tools. Be concise and helpful."
    >
      <ChatInterface />
    </CopilotProvider>
  );
}
