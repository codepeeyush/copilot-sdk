# Support Tickets Demo

> AI-powered customer support ticket management system with 17 tools and rich Gen UI components.

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/support-tickets-demo&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20(or%20configure%20another%20provider)&project-name=support-tickets-demo>)

## Features Showcased

### AI Tools (17 Total)

**Generative UI Tools**

- `draft_response` - Draft email responses with editable preview
- `compose_email` - Email composition with templates

**Analysis Tools**

- `analyze_sentiment` - Customer emotion analysis with visual indicators
- `assess_customer_risk` - Churn risk assessment with recommendations
- `get_customer_context` - Customer history and insights

**Knowledge & Suggestions**

- `search_knowledge_base` - FAQ and help article lookup
- `get_resolution_suggestions` - AI-powered solution recommendations
- `find_similar_tickets` - Related ticket discovery

**Action Tools**

- `offer_compensation` - Discount/compensation workflow
- `schedule_callback` - Appointment booking
- `escalate_ticket` - Support escalation workflow
- `process_product_exchange` - Item replacement flow
- `process_refund` - Refund confirmation

**Data Display Tools**

- `get_customer_profile` - Full customer details card
- `get_order_details` - Order information display
- `get_ticket_summary` - Current ticket overview

### Custom UI Components

- 15+ tool card components with rich visualizations
- Skeleton loading states for all tools
- Customer conversation view with message history
- Sidebar with ticket navigation
- Real-time dashboard context

### SDK Patterns Demonstrated

- `useTool` with custom `render` functions for Gen UI
- `useAIContext` for real-time ticket data sync
- Dashboard context provider for state management
- Tool cards with loading skeletons
- Compound components for layout

## Quick Start

### Prerequisites

- Node.js 18+
- **pnpm** (required for workspace setup - npm/yarn won't work)
- Anthropic API key (or any supported LLM provider)

### Installation

#### Option 1: Within Monorepo (Recommended for Development)

```bash
# Clone the repository
https://github.com/YourGPT/copilot-sdk.git
cd copilot-sdk

# Install all dependencies from root (required for workspace)
pnpm install

# Set up environment
cp examples/support-tickets-demo/.env.example examples/support-tickets-demo/.env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Run development server
cd examples/support-tickets-demo

# Install dependencies
pnpm install

pnpm dev
```

#### Option 2: Standalone (After Publishing)

```bash
# Create new project
npx create-next-app@latest my-support-demo
cd my-support-demo

# Install dependencies
npm install @yourgpt/copilot-sdk @yourgpt/llm-sdk

# Copy the demo files and configure
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/support-tickets-demo&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20(or%20configure%20another%20provider)&project-name=support-tickets-demo>)

## Environment Variables

Create a `.env.local` file with:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

| Variable            | Description                     |
| ------------------- | ------------------------------- |
| `ANTHROPIC_API_KEY` | Anthropic API key (default)     |
| `OPENAI_API_KEY`    | OpenAI API key (alternative)    |
| `GOOGLE_API_KEY`    | Google AI API key (alternative) |

See the [@yourgpt/llm-sdk documentation](https://github.com/YourGPT/yourgpt-copilot/tree/main/packages/llm-sdk) for all supported providers.

## Project Structure

```
support-tickets-demo/
├── app/
│   ├── page.tsx                    # Main dashboard page
│   ├── layout.tsx                  # Root layout with providers
│   ├── globals.css                 # Tailwind styles
│   ├── api/
│   │   └── chat/route.ts           # Copilot API endpoint
│   └── components/
│       ├── ticketing-tools.tsx     # All 17 AI tools definitions
│       ├── types.ts                # TypeScript interfaces
│       ├── context/
│       │   └── dashboard-context.tsx
│       ├── data/
│       │   └── mock-data.ts        # Sample tickets & customers
│       ├── layout/
│       │   ├── conversation-area.tsx
│       │   ├── copilot-panel.tsx
│       │   ├── demo-sidebar.tsx
│       │   ├── ticket-header.tsx
│       │   └── message.tsx
│       └── tool-cards/             # 15+ Gen UI components
│           ├── draft-response-card.tsx
│           ├── sentiment-card.tsx
│           ├── customer-profile-card.tsx
│           └── ...
├── components/
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts
└── README.md
```

## Testing the AI Workflow

1. Open the app - you'll see a sample support ticket
2. Ask the Copilot: "What's the customer's issue?"
3. The AI will use tools to:
   - Get ticket summary
   - Analyze customer sentiment
   - Fetch customer context
4. Ask: "Draft a response" to see the Gen UI response composer
5. Try: "Check for similar tickets" or "Suggest resolutions"

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- @yourgpt/copilot-sdk
- @yourgpt/llm-sdk

## Important Notes

> **Workspace Dependency**: This example uses `workspace:*` dependencies. You must use `pnpm install` from the monorepo root. Regular `npm install` or `yarn install` will not resolve workspace dependencies correctly.
