# OpenRouter Demo

A demo showcasing the YourGPT Copilot SDK with [OpenRouter](https://openrouter.ai) - access 500+ AI models through a single API.

## Features

- **Model Selection** - Switch between models from OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, xAI, and more
- **Unified API** - One API key for all providers
- **Streaming** - Real-time streaming responses
- **Auto Model** - Use `openrouter/auto` to automatically select the best model

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure your API key**

   Create a `.env.local` file:

   ```bash
   OPENROUTER_API_KEY=sk-or-your-key-here
   ```

   Get your key at [openrouter.ai/keys](https://openrouter.ai/keys)

3. **Start the dev server**

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3006](http://localhost:3006)

## Available Models

The demo includes popular models:

| Provider  | Models                                           |
| --------- | ------------------------------------------------ |
| Anthropic | Claude Opus 4, Claude Sonnet 4, Claude 3.5 Haiku |
| OpenAI    | GPT-4.1, GPT-4.1 Mini, o3, o4-mini               |
| Google    | Gemini 2.5 Pro, Gemini 2.5 Flash                 |
| Meta      | Llama 4 Maverick, Llama 4 Scout                  |
| DeepSeek  | DeepSeek R1, DeepSeek V3                         |
| Mistral   | Mistral Large, Codestral                         |
| xAI       | Grok 3, Grok 3 Mini                              |

Browse all available models at [openrouter.ai/models](https://openrouter.ai/models).

## Project Structure

```
openrouter-demo/
├── app/
│   ├── page.tsx          # Main UI with model selector
│   └── api/chat/route.ts # OpenRouter runtime endpoint
├── components/
│   └── ModelSelector.tsx # Model picker component
├── lib/
│   └── models.ts         # Model definitions
└── .env.local            # Your API key (create this)
```

## Learn More

- [OpenRouter Docs](https://openrouter.ai/docs)
- [Browse All Models](https://openrouter.ai/models)
- [YourGPT Copilot SDK](https://github.com/YourGPT/copilot-sdk)
