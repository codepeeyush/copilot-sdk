"use client";

import { CopilotProvider } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";

/**
 * Test page for SERVER-SIDE max iterations
 * Uses server-side tools with maxIterations=2 on the server
 */
export default function TestServerIterationsPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Test: Server Max Iterations</h1>
        <p className="text-muted-foreground mb-4">
          This page tests SERVER-SIDE max iterations. Server has
          maxIterations=2. Ask for multiple random numbers to trigger the server
          limit.
        </p>

        <div className="border rounded-xl overflow-hidden h-[600px]">
          <CopilotProvider
            runtimeUrl="/api/chat/test-server-tools"
            debug
            streaming={false}
          >
            {/* No client tools - testing server-side tools only */}
            <CopilotChat
              title="Chat (Server Tools Test)"
              placeholder="Ask: give me 10 random numbers between 1 and 100"
              showPoweredBy={false}
              className="h-full"
            />
          </CopilotProvider>
        </div>
      </div>
    </div>
  );
}
