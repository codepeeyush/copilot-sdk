# Content Editor Demo

> AI-powered content editor with writing assistance, tone adjustment, and SEO optimization.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/editor-demo&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=editor-copilot-demo)

## Features Showcased

### AI Writing Tools

- `generate_content` - Create blog posts, product descriptions, emails, and social content
- `improve_text` - Enhance clarity, engagement, and readability
- `change_tone` - Adjust writing style (professional, casual, friendly, etc.)
- `add_section` - Insert new sections with AI-generated content
- `fill_metadata` - Auto-generate SEO titles, descriptions, and tags
- `set_title` - Update article title with AI suggestions
- `clear_editor` - Reset content for fresh start

### Editor Features

- Rich text editor with markdown support
- Live preview panel
- Publish form with metadata
- Word and character count
- Editor/Preview/Publish tabs

### SDK Patterns Demonstrated

- `useTool` for content manipulation tools
- Direct editor state updates from AI
- Multi-tab interface with Copilot integration
- Content generation with streaming

## Quick Start

### Prerequisites

- Node.js 18+
- **pnpm** (required for workspace setup - npm/yarn won't work)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YourGPT/yourgpt-copilot.git
cd yourgpt-copilot

# Install all dependencies from root (required for workspace)
pnpm install

# Set up environment
cp examples/editor-demo/.env.example examples/editor-demo/.env.local
# Add OPENAI_API_KEY to .env.local

# Run development server
cd examples/editor-demo
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/editor-demo&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=editor-copilot-demo)

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
editor-demo/
├── app/
│   ├── page.tsx                    # Main editor page with tabs
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind styles
│   ├── copilot/
│   │   └── tools.tsx               # AI writing tools
│   ├── components/
│   │   ├── EditorPane.tsx          # Markdown editor
│   │   ├── ContentPreview.tsx      # Live preview
│   │   └── PublishForm.tsx         # Metadata form
│   └── api/
│       └── chat/route.ts           # Copilot API endpoint
├── components/
│   ├── ui/                         # shadcn components
│   └── shared/DemoLayout.tsx
├── lib/
│   └── utils.ts
└── README.md
```

## Testing the AI Workflow

1. Open the editor - you'll see a blank content area
2. Ask the Copilot:
   - "Write a blog post about AI assistants"
   - "Make this more professional"
   - "Add a conclusion section"
   - "Generate SEO metadata"
3. Switch between Editor/Preview/Publish tabs
4. Watch content update in real-time

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- @yourgpt/copilot-sdk
- @yourgpt/llm-sdk

## Important Notes

> **Workspace Dependency**: This example uses `workspace:*` dependencies. You must use `pnpm install` from the monorepo root. Regular `npm install` or `yarn install` will not resolve workspace dependencies correctly.
