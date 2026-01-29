"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { DashboardProvider } from "./components/context/dashboard-context";
import { TicketingTools } from "./components/ticketing-tools";
import {
  DemoSidebar,
  TicketHeader,
  ConversationArea,
  CopilotPanel,
} from "./components/layout";

const SYSTEM_PROMPT = `You are an AI assistant helping customer success agents.

**Response Style:**
Be concise by default. Tools display UI cards with full details, so don't repeat that data in your response. Keep it brief and actionable - elaborate only when the agent asks for more details.`;

export default function SupportTicketsPage() {
  return (
    <DashboardProvider>
      <CopilotProvider
        runtimeUrl="/api/chat"
        systemPrompt={SYSTEM_PROMPT}
        streaming={true}
        maxIterations={2}
      >
        <TicketingTools />
        <div className="h-screen flex bg-background overflow-hidden text-foreground">
          <DemoSidebar />
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            <TicketHeader />
            <div className="flex-1 flex overflow-hidden">
              <ConversationArea />
              <CopilotPanel />
            </div>
          </main>
        </div>
      </CopilotProvider>
    </DashboardProvider>
  );
}
