import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CopilotProvider } from '@yourgpt/copilot-sdk/react';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CopilotProvider runtimeUrl="/api/chat">
      <App />
    </CopilotProvider>
  </StrictMode>
);
