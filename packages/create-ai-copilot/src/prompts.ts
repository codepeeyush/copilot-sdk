import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import fs from "fs-extra";

export type Framework = "nextjs" | "vite-react";
export type Provider = "openai" | "anthropic" | "google" | "xai";

export interface UserChoices {
  projectName: string;
  framework: Framework;
  provider: Provider;
  apiKey?: string;
}

export async function getPrompts(): Promise<UserChoices | null> {
  // Project name
  const projectName = await p.text({
    message: "Project name?",
    placeholder: "my-ai-app",
    defaultValue: "my-ai-app",
    validate: (value) => {
      if (!value) return "Project name is required";
      if (!/^[a-z0-9-_]+$/i.test(value)) {
        return "Only letters, numbers, hyphens, and underscores allowed";
      }
      const targetPath = path.join(process.cwd(), value);
      if (fs.existsSync(targetPath)) {
        return `Directory "${value}" already exists`;
      }
    },
  });

  if (p.isCancel(projectName)) return null;

  // Framework
  const framework = await p.select({
    message: "Which framework?",
    initialValue: "nextjs" as Framework,
    options: [
      {
        value: "nextjs" as Framework,
        label: "Next.js",
        hint: "Full-stack with API routes (Recommended)",
      },
      {
        value: "vite-react" as Framework,
        label: "Vite + React",
        hint: "Client-side with Hono server",
      },
    ],
  });

  if (p.isCancel(framework)) return null;

  // LLM Provider
  const provider = await p.select({
    message: "Which LLM provider?",
    initialValue: "openai" as Provider,
    options: [
      {
        value: "openai" as Provider,
        label: "OpenAI",
        hint: "GPT-4o, GPT-4o-mini",
      },
      {
        value: "anthropic" as Provider,
        label: "Anthropic",
        hint: "Claude 3.5 Sonnet",
      },
      {
        value: "google" as Provider,
        label: "Google",
        hint: "Gemini 2.0 Flash",
      },
      {
        value: "xai" as Provider,
        label: "xAI",
        hint: "Grok 3 (Ultra fast)",
      },
    ],
  });

  if (p.isCancel(provider)) return null;

  // API Key (optional)
  const wantsApiKey = await p.confirm({
    message: "Add API key now?",
    initialValue: false,
  });

  if (p.isCancel(wantsApiKey)) return null;

  let apiKey: string | undefined;
  if (wantsApiKey) {
    const key = await p.password({
      message: `Enter your ${getProviderName(provider)} API key:`,
      validate: (value) => {
        if (!value) return "API key is required (or press Ctrl+C to skip)";
      },
    });

    if (p.isCancel(key)) {
      // User cancelled API key, but we can continue without it
      p.log.info(pc.dim("Skipping API key. You can add it later in .env"));
    } else {
      apiKey = key;
    }
  }

  return {
    projectName: projectName as string,
    framework: framework as Framework,
    provider: provider as Provider,
    apiKey,
  };
}

function getProviderName(provider: Provider): string {
  const names: Record<Provider, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
    xai: "xAI",
  };
  return names[provider];
}
