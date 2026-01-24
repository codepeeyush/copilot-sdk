'use client';

import { CopilotChat } from '@yourgpt/copilot-sdk/ui';

export function CopilotSidebar() {
  return (
    <div className="w-[400px] border-l border-border flex flex-col bg-muted/30 shrink-0">
      <CopilotChat
        className="h-full"
        placeholder="Ask me anything..."
        header={{
          name: 'AI Copilot',
        }}
        suggestions={[
          'What can you help me with?',
          'Show me some examples',
          'How does this work?',
        ]}
      />
    </div>
  );
}
