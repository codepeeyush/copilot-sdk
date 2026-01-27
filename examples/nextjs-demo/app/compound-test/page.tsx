"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat, useCopilotChatContext } from "@yourgpt/copilot-sdk/ui";
import {
  Sparkles,
  BarChart3,
  PenLine,
  Lightbulb,
  Code2,
  Bot,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";

// Suggestion card component
function SuggestionCard({
  icon,
  title,
  description,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  message: string;
}) {
  const { send } = useCopilotChatContext();

  return (
    <button
      onClick={() => send(message)}
      className="flex items-center gap-3 p-2 rounded-full border bg-card hover:bg-accent/50 transition-colors text-left group"
    >
      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <span className="text-primary">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="font-medium text-sm">{title}</div>
      </div>
    </button>
  );
}

// Wrapper for suggestion cards (needs context)
function SuggestionCards() {
  return (
    <div className="grid gap-2 w-full max-w-sm mt-2">
      <SuggestionCard
        icon={<BarChart3 className="w-5 h-5" />}
        title="Analyze my data"
        description="Get insights from your files"
        message="Help me analyze my data and get insights"
      />
      <SuggestionCard
        icon={<PenLine className="w-5 h-5" />}
        title="Help me write"
        description="Draft emails, documents, and more"
        message="Help me write a professional email"
      />
      <SuggestionCard
        icon={<Lightbulb className="w-5 h-5" />}
        title="Brainstorm ideas"
        description="Creative solutions for any challenge"
        message="Help me brainstorm ideas for my project"
      />
      <SuggestionCard
        icon={<Code2 className="w-5 h-5" />}
        title="Write some code"
        description="Build features, fix bugs, explain code"
        message="Help me write code for a new feature"
      />
    </div>
  );
}

// Custom header component
function CustomHeader({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
      {icon}
      <span className="font-medium">{title}</span>
    </div>
  );
}

// Custom footer component
function CustomFooter() {
  return (
    <div className="text-xs text-center text-muted-foreground py-2 border-t bg-muted/20">
      Powered by AI • Built with Copilot SDK
    </div>
  );
}

export default function CompoundTestPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold">Compound Components Test</h1>
        <p className="text-muted-foreground text-sm">
          Layout Composition Patterns
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {/* Default CopilotChat (backward compatible) */}
        <div className="border rounded-lg overflow-hidden h-[600px]">
          <div className="bg-muted p-2 text-sm font-medium border-b">
            Default
          </div>
          <CopilotProvider runtimeUrl="/api/chat/openai">
            <CopilotChat
              showHeader
              showThreadPicker
              persistence
              className="h-[calc(100%-40px)]"
              showPoweredBy={false}
            />
          </CopilotProvider>
        </div>

        {/* Custom Home with Compound Components (Legacy Pattern) */}
        <div className="border rounded-lg overflow-hidden h-[600px]">
          <div className="bg-muted p-2 text-sm font-medium border-b">
            Custom Home (Legacy)
          </div>
          <CopilotProvider runtimeUrl="/api/chat/openai">
            <CopilotChat
              showHeader
              showThreadPicker
              persistence
              className="h-[calc(100%-40px)]"
              showPoweredBy={false}
            >
              <CopilotChat.Home className="gap-6 p-6 bg-linear-to-b from-primary/5 via-background to-background">
                {/* Brand Logo */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>

                {/* Heading */}
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">
                    How can I help you today?
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your AI assistant for everything
                  </p>
                </div>

                {/* Input */}
                <CopilotChat.Input
                  placeholder="Ask me anything..."
                  className="w-full max-w-sm"
                />

                {/* Suggestion Cards */}
                <SuggestionCards />
              </CopilotChat.Home>
            </CopilotChat>
          </CopilotProvider>
        </div>

        {/* View-Specific Header with Navigation (New Pattern) */}
        <div className="border rounded-lg overflow-hidden h-[600px]">
          <div className="bg-muted p-2 text-sm font-medium border-b">
            View-Specific Header
          </div>
          <CopilotProvider runtimeUrl="/api/chat/openai">
            <CopilotChat.Root
              persistence={true}
              className="h-[calc(100%-40px)]"
              showPoweredBy={false}
            >
              {/* Home View - no header, clean welcome */}
              <CopilotChat.HomeView className="gap-6 p-6 bg-gradient-to-b from-blue-500/5 via-background to-background">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Welcome!</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Start a conversation with AI
                  </p>
                </div>
                <CopilotChat.Input
                  placeholder="Type your message..."
                  className="w-full max-w-sm"
                />
                <CopilotChat.Suggestions
                  items={[
                    "Tell me a joke",
                    "Explain quantum computing",
                    "Write a poem",
                  ]}
                  className="max-w-sm"
                />
              </CopilotChat.HomeView>

              {/* Chat View - header ONLY shows here (by composition!) */}
              <CopilotChat.ChatView>
                <CopilotChat.Header className="flex items-start p-2 bg-muted/30">
                  <CopilotChat.BackButton className="text-muted-foreground hover:text-foreground aspect-square">
                    <ChevronLeft className="size-4" />
                  </CopilotChat.BackButton>
                  <div className="flex flex-col ml-1">
                    <span className="font-medium text-sm">Chats</span>
                    <CopilotChat.ThreadPicker size="sm" />
                  </div>
                </CopilotChat.Header>
                {/* Default messages + input render automatically */}
              </CopilotChat.ChatView>

              {/* Shared Footer - shows in both views */}
              <CopilotChat.Footer>
                <CustomFooter />
              </CopilotChat.Footer>
            </CopilotChat.Root>
          </CopilotProvider>
        </div>
      </div>

      <footer className="mt-6 text-center text-xs text-muted-foreground">
        Click a suggestion or type a message to see the chat view transition
      </footer>
    </div>
  );
}
