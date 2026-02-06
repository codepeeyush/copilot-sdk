# Banking SaaS Demo

> Production-ready banking dashboard showcasing AI-powered financial assistant with rich Gen UI visualizations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/saas-demo&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=banking-copilot-demo)

## Features Showcased

### AI Tools with Visual Renders

- **Spending Analysis** - Donut chart breakdown with category insights and overspending alerts
- **Financial Health** - Score gauge with factor analysis and recommendations
- **Smart Transfer** - Approval workflow with balance warnings and confirmation UI
- **Subscriptions** - Visual bars with usage warnings and savings opportunities
- **Upcoming Bills** - Timeline visualization with balance projections

### Custom Copilot UI

- Custom home view with branded welcome screen
- Custom header with ThreadPicker for conversation management
- Icon-based suggestion buttons using `useCopilotChatContext`
- Supabase theme integration

### SDK Patterns Demonstrated

- `useTool` with custom `render` functions for rich visual outputs
- `useAIContext` for real-time data synchronization
- Compound components (`CopilotChat.Root`, `CopilotChat.HomeView`, etc.)
- `useCopilotChatContext` for custom suggestions
- Tool approval workflow with `needsApproval: true`

## Quick Start

### Prerequisites

- Node.js 18+
- **pnpm** (required for workspace setup - npm/yarn won't work)
- OpenAI API key

### Installation

```bash
# Clone the repository
https://github.com/YourGPT/copilot-sdk.git
cd copilot-sdk

# Install all dependencies from root (required for workspace)
pnpm install

# Set up environment
cp examples/saas-demo/.env.example examples/saas-demo/.env.local
# Add OPENAI_API_KEY to .env.local

# Run development server
cd examples/saas-demo

# Install dependencies
pnpm install

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/saas-demo&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=banking-copilot-demo)

## Environment Variables

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your-api-key-here
```

| Variable         | Description         |
| ---------------- | ------------------- |
| `OPENAI_API_KEY` | Your OpenAI API key |

## Project Structure

```
saas-demo/
├── app/
│   ├── page.tsx                    # Main dashboard with state and AI context
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind styles
│   ├── copilot/
│   │   ├── tools.tsx               # All 5 AI tools with render functions
│   │   └── components.tsx          # Custom copilot UI components
│   ├── components/                 # Dashboard components (Sidebar, charts)
│   └── api/
│       └── chat/route.ts           # Copilot API endpoint
├── components/
│   └── ui/                         # shadcn components
├── lib/
│   └── utils.ts
└── README.md
```

## Testing the AI Workflow

1. Open the app - you'll see the banking dashboard
2. Click the Copilot button to open the assistant
3. Try these prompts:
   - "Analyze my spending"
   - "What's my financial health score?"
   - "Show my upcoming bills"
   - "Transfer $100 to savings" (requires approval)
4. Watch the rich visualizations render in real-time

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Recharts
- @yourgpt/copilot-sdk
- @yourgpt/llm-sdk

## Important Notes

> **Workspace Dependency**: This example uses `workspace:*` dependencies. You must use `pnpm install` from the monorepo root. Regular `npm install` or `yarn install` will not resolve workspace dependencies correctly.
