'use client';

import { CopilotChat } from '@yourgpt/copilot-sdk/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl h-screen p-4">
        <CopilotChat className="h-full rounded-xl border shadow-sm" />
      </div>
    </main>
  );
}
