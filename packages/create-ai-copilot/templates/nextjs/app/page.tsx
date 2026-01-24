'use client';

import { Dashboard } from './components/dashboard';
import { CopilotSidebar } from './components/copilot-sidebar';

export default function Home() {
  return (
    <div className="h-screen flex bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>

      {/* Copilot Sidebar */}
      <CopilotSidebar />
    </div>
  );
}
