/**
 * Provider Formatters
 *
 * Routes to the correct provider formatter based on provider type
 */

import type { AIProvider } from "@yourgpt/copilot-sdk-core";
import type { ProviderFormatter } from "./types";
import { anthropicFormatter } from "./anthropic";
import { openaiFormatter } from "./openai";
import { geminiFormatter } from "./gemini";

// Provider formatter registry
const formatters: Record<string, ProviderFormatter> = {
  anthropic: anthropicFormatter,
  openai: openaiFormatter,
  xai: openaiFormatter, // xAI uses OpenAI-compatible format
  grok: openaiFormatter, // Grok uses OpenAI-compatible format
  gemini: geminiFormatter,
  groq: openaiFormatter, // Groq uses OpenAI-compatible format
};

/**
 * Get the formatter for a provider
 */
export function getFormatter(provider: AIProvider | string): ProviderFormatter {
  const formatter = formatters[provider];
  if (!formatter) {
    // Default to OpenAI format for unknown providers
    console.warn(
      `Unknown provider "${provider}", falling back to OpenAI format`,
    );
    return openaiFormatter;
  }
  return formatter;
}

/**
 * Check if a provider is supported
 */
export function isProviderSupported(provider: string): boolean {
  return provider in formatters;
}

/**
 * Get list of supported providers
 */
export function getSupportedProviders(): string[] {
  return Object.keys(formatters);
}

// Re-export types and formatters
export type { ProviderFormatter } from "./types";
export { anthropicFormatter } from "./anthropic";
export { openaiFormatter } from "./openai";
export { geminiFormatter } from "./gemini";

// Re-export all types
export type {
  AnthropicTool,
  AnthropicToolUse,
  AnthropicToolResult,
  OpenAITool,
  OpenAIToolCall,
  OpenAIToolResult,
  GeminiFunctionDeclaration,
  GeminiFunctionCall,
  GeminiFunctionResponse,
} from "./types";
