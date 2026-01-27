# Copilot SDK Playground

A multi-provider testing playground for the Copilot SDK.

## Features

- Test multiple LLM providers (OpenAI, Anthropic, Google) side-by-side
- Theme switcher (light/dark)
- Settings panel for adjusting parameters

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the playground.

## API Routes

- `POST /api/openai` - OpenAI GPT-4o
- `POST /api/anthropic` - Anthropic Claude
- `POST /api/google` - Google Gemini
