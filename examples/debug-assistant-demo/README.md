# Debug Assistant Demo

> AI support assistant with built-in debugging tools and Gen UI for payment resolution.

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/debug-assistant-demo&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20(or%20configure%20another%20provider)&project-name=debug-assistant-demo>)

## Features Showcased

### Built-in Tools

- **Screenshot Capture** - `capture_screenshot` with approval dialog to see what the user sees
- **Console Logs** - `get_console_logs` with approval dialog to retrieve browser console output

### Custom Gen UI Tool

- **Payment Link Generator** - `generate_payment_link` with skeleton loading state and payment card UI
- Shows animated skeleton during execution
- Displays invoice details and "Pay Now" button on completion

### Custom Copilot Home

- Branded welcome screen with Acme logo
- Quick action suggestion buttons using `useCopilotChatContext`
- Help articles section with external links
- Custom input placeholder

### Error Simulation

- Mock 402 Payment Required API (`/api/subscription`)
- Error banner in dashboard for testing AI diagnostic workflow
- Console errors with invoice details for AI analysis

## SDK Patterns Demonstrated

- `useTools` for registering built-in tools with approval dialogs
- `useTool` with custom `render` function for Gen UI components
- Compound components (`CopilotChat.Root`, `CopilotChat.HomeView`, `CopilotChat.ChatView`, etc.)
- `useCopilotChatContext` for custom suggestion buttons
- `CopilotChat.ThreadPicker` for conversation management
- Custom header with back button and branding

## Quick Start

### Prerequisites

- Node.js 18+
- **pnpm** (required for workspace setup - npm/yarn won't work)
- LLM provider API key (Anthropic, OpenAI, Google, xAI, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/YourGPT/yourgpt-copilot.git
cd yourgpt-copilot

# Install all dependencies from root (required for workspace)
pnpm install

# Set up environment
cp examples/debug-assistant-demo/.env.example examples/debug-assistant-demo/.env.local
# Add your LLM provider API key to .env.local

# Run development server
cd examples/debug-assistant-demo
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/debug-assistant-demo&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20(or%20configure%20another%20provider)&project-name=debug-assistant-demo>)

## Environment Variables

Create a `.env.local` file with your API key:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

This demo uses Anthropic by default, but you can configure any supported provider by updating `app/api/chat/route.ts`.

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `ANTHROPIC_API_KEY` | Anthropic API key (default) |
| `OPENAI_API_KEY`    | OpenAI API key              |
| `GOOGLE_API_KEY`    | Google AI API key           |
| `XAI_API_KEY`       | xAI API key                 |

See the [@yourgpt/llm-sdk documentation](https://github.com/YourGPT/yourgpt-copilot/tree/main/packages/llm-sdk) for all supported providers and configuration options.

## Project Structure

```
debug-assistant-demo/
├── app/
│   ├── page.tsx                    # Main dashboard with layout and state
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind styles
│   ├── copilot/
│   │   ├── components.tsx          # Custom home view, suggestions, articles
│   │   └── tools.tsx               # Payment link tool with Gen UI
│   ├── components/
│   │   └── Sidebar.tsx             # Collapsible navigation
│   └── api/
│       ├── chat/route.ts           # Copilot API endpoint
│       └── subscription/route.ts   # Mock 402 error API
├── components/
│   ├── ui/                         # shadcn components
│   └── shared/DemoLayout.tsx
├── public/
│   └── logo.svg                    # Acme logo
├── lib/
│   └── utils.ts
└── README.md
```

## Testing the AI Workflow

1. Open the app - the error banner appears automatically
2. Click "Why am I seeing an error?" in the Copilot
3. The AI will:
   - Take a screenshot (requires approval)
   - Get console logs (requires approval)
   - Analyze the 402 payment error
   - Offer to generate a payment link
4. Payment link tool shows skeleton, then displays payment card

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- @yourgpt/copilot-sdk
- @yourgpt/llm-sdk

## Important Notes

> **Workspace Dependency**: This example uses `workspace:*` dependencies. You must use `pnpm install` from the monorepo root. Regular `npm install` or `yarn install` will not resolve workspace dependencies correctly.
