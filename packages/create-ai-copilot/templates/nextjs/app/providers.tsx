'use client';

import { CopilotProvider } from '@yourgpt/copilot-sdk/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotProvider runtimeUrl="/api/chat">
      {children}
    </CopilotProvider>
  );
}
