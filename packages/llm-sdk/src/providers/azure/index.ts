/**
 * Azure OpenAI Provider
 *
 * Wraps the AzureAdapter with provider interface.
 * Azure OpenAI provides enterprise-grade OpenAI models with Azure security.
 *
 * Features:
 * - Vision (for supported deployments)
 * - Tools/Function calling
 * - Enterprise security & compliance
 * - Private networking options
 *
 * Note: Capabilities depend on which model is deployed, not a model ID.
 * The provider attempts to detect capabilities from the deployment name.
 */

import { createAzureAdapter } from "../../adapters/azure";
import {
  createCallableProvider,
  type AIProvider,
  type ProviderCapabilities,
  type AzureProviderConfig,
} from "../types";

// ============================================
// Model Capability Patterns
// ============================================

/**
 * Detect model capabilities from deployment name
 * Azure deployments are user-named, so we look for common patterns
 */
function detectCapabilitiesFromDeployment(deploymentName: string): {
  vision: boolean;
  tools: boolean;
  maxTokens: number;
} {
  const name = deploymentName.toLowerCase();

  // GPT-4o variants (vision, tools, 128k context)
  if (name.includes("gpt-4o") || name.includes("gpt4o")) {
    return { vision: true, tools: true, maxTokens: 128000 };
  }

  // GPT-4 Turbo with vision
  if (
    (name.includes("gpt-4") || name.includes("gpt4")) &&
    (name.includes("turbo") || name.includes("vision"))
  ) {
    return { vision: true, tools: true, maxTokens: 128000 };
  }

  // GPT-4 base
  if (name.includes("gpt-4") || name.includes("gpt4")) {
    return { vision: false, tools: true, maxTokens: 8192 };
  }

  // GPT-3.5 Turbo
  if (
    name.includes("gpt-35") ||
    name.includes("gpt-3.5") ||
    name.includes("gpt35")
  ) {
    return { vision: false, tools: true, maxTokens: 16385 };
  }

  // o1 reasoning models
  if (name.includes("o1")) {
    return { vision: true, tools: false, maxTokens: 128000 };
  }

  // Default fallback
  return { vision: false, tools: true, maxTokens: 8192 };
}

// ============================================
// Provider Implementation
// ============================================

/**
 * Create an Azure OpenAI provider (callable, Vercel AI SDK style)
 *
 * @example
 * ```typescript
 * const azure = createAzure({
 *   apiKey: '...',
 *   resourceName: 'my-azure-resource',
 *   deploymentName: 'gpt-4o-deployment',
 * });
 *
 * // Callable - Vercel AI SDK style
 * const model = azure('gpt-4o-deployment');
 *
 * // Also supports method call (backward compatible)
 * const model2 = azure.languageModel('gpt-4o-deployment');
 * ```
 */
export function createAzure(config: AzureProviderConfig): AIProvider {
  const apiKey = config.apiKey ?? process.env.AZURE_OPENAI_API_KEY ?? "";
  const resourceName =
    config.resourceName ?? process.env.AZURE_OPENAI_RESOURCE ?? "";
  const defaultDeployment =
    config.deploymentName ?? process.env.AZURE_OPENAI_DEPLOYMENT ?? "";

  // For Azure, the "supported models" are actually deployment names
  const supportedModels = defaultDeployment ? [defaultDeployment] : [];

  // Create the callable function
  const providerFn = (deploymentName: string) => {
    return createAzureAdapter({
      apiKey,
      resourceName,
      deploymentName: deploymentName || defaultDeployment,
      apiVersion: config.apiVersion,
      baseUrl: config.baseUrl,
    });
  };

  // Get capabilities helper
  const getCapabilities = (deploymentName: string): ProviderCapabilities => {
    const detected = detectCapabilitiesFromDeployment(
      deploymentName || defaultDeployment,
    );

    return {
      supportsVision: detected.vision,
      supportsTools: detected.tools,
      supportsThinking: false,
      supportsStreaming: true,
      supportsPDF: false,
      supportsAudio: false,
      supportsVideo: false,
      maxTokens: detected.maxTokens,
      supportedImageTypes: detected.vision
        ? ["image/png", "image/jpeg", "image/gif", "image/webp"]
        : [],
      supportsJsonMode: true,
      supportsSystemMessages: true,
    };
  };

  return createCallableProvider(providerFn, {
    name: "azure",
    supportedModels,
    getCapabilities,
  });
}

// Alias for consistency
export const createAzureProvider = createAzure;
