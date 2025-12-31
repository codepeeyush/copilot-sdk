/**
 * Intent Detector
 *
 * Detects user intent from messages to suggest relevant tools.
 * Framework-agnostic implementation using keyword matching.
 */

import type { ToolType, IntentDetectionResult } from "./types";

/**
 * Keywords that suggest screenshot might be helpful
 */
const SCREENSHOT_KEYWORDS = [
  // Visual references
  "see",
  "seeing",
  "look",
  "looking",
  "looks",
  "appear",
  "appears",
  "show",
  "showing",
  "shows",
  "display",
  "displays",
  "displayed",
  "visible",
  "invisible",

  // UI elements
  "screen",
  "page",
  "ui",
  "interface",
  "layout",
  "design",
  "button",
  "input",
  "form",
  "modal",
  "popup",
  "menu",
  "dropdown",
  "sidebar",
  "header",
  "footer",
  "navbar",
  "navigation",
  "image",
  "icon",
  "text",
  "font",
  "color",
  "style",
  "css",
  "alignment",
  "position",
  "spacing",

  // Visual issues
  "broken",
  "misaligned",
  "overlapping",
  "cutoff",
  "overflow",
  "blank",
  "empty",
  "missing",
  "wrong",
  "weird",
  "strange",
  "different",
  "changed",
];

/**
 * Keywords that suggest console logs might be helpful
 */
const CONSOLE_KEYWORDS = [
  // Errors
  "error",
  "errors",
  "exception",
  "exceptions",
  "crash",
  "crashed",
  "crashing",
  "bug",
  "bugs",
  "buggy",
  "broken",
  "break",
  "breaks",

  // Issues
  "issue",
  "issues",
  "problem",
  "problems",
  "not working",
  "doesnt work",
  "doesn't work",
  "stopped working",
  "fails",
  "failed",
  "failing",
  "failure",

  // Debug references
  "debug",
  "debugging",
  "console",
  "log",
  "logs",
  "warning",
  "warnings",
  "warn",
  "stack",
  "stacktrace",
  "trace",
  "traceback",

  // State issues
  "undefined",
  "null",
  "nan",
  "typeerror",
  "referenceerror",
  "syntaxerror",
  "unexpected",
  "uncaught",
];

/**
 * Keywords that suggest network inspection might be helpful
 */
const NETWORK_KEYWORDS = [
  // API references
  "api",
  "apis",
  "endpoint",
  "endpoints",
  "request",
  "requests",
  "response",
  "responses",
  "fetch",
  "fetching",

  // HTTP
  "http",
  "https",
  "rest",
  "graphql",
  "post",
  "get",
  "put",
  "delete",
  "patch",

  // Issues
  "timeout",
  "timeouts",
  "timed out",
  "slow",
  "loading",
  "loads",
  "load",
  "forever",

  // Status
  "404",
  "500",
  "401",
  "403",
  "400",
  "not found",
  "unauthorized",
  "forbidden",
  "server error",
  "bad request",

  // Data
  "data",
  "json",
  "payload",
  "body",
  "headers",
  "cors",
  "network",
  "connection",
  "backend",
  "server",
];

/**
 * Default confidence thresholds
 */
const DEFAULT_THRESHOLDS = {
  suggest: 0.3, // Minimum confidence to suggest a tool
  high: 0.6, // High confidence threshold
};

/**
 * Normalize text for matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Find matching keywords in text
 */
function findMatches(text: string, keywords: string[]): string[] {
  const normalizedText = normalizeText(text);
  const words = new Set(normalizedText.split(" "));
  const matches: string[] = [];

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);

    // Check for exact word match
    if (words.has(normalizedKeyword)) {
      matches.push(keyword);
      continue;
    }

    // Check for phrase match (multi-word keywords)
    if (
      normalizedKeyword.includes(" ") &&
      normalizedText.includes(normalizedKeyword)
    ) {
      matches.push(keyword);
      continue;
    }

    // Check for partial match at word boundaries
    const pattern = new RegExp(`\\b${normalizedKeyword}`, "i");
    if (pattern.test(normalizedText)) {
      matches.push(keyword);
    }
  }

  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Calculate confidence score based on matches
 */
function calculateConfidence(
  matches: string[],
  totalKeywords: number,
  textLength: number,
): number {
  if (matches.length === 0) return 0;

  // Base score from number of matches
  const matchRatio = Math.min(matches.length / 5, 1); // Cap at 5 matches = max

  // Bonus for multiple matches
  const multiMatchBonus =
    matches.length > 2 ? 0.2 : matches.length > 1 ? 0.1 : 0;

  // Penalty for very short messages (might be false positives)
  const lengthPenalty = textLength < 20 ? 0.2 : 0;

  return Math.min(matchRatio * 0.7 + multiMatchBonus - lengthPenalty, 1);
}

/**
 * Detect user intent from a message
 *
 * @param message - User message to analyze
 * @returns Detection result with suggested tools
 *
 * @example
 * ```typescript
 * const result = detectIntent("I'm seeing an error on my screen");
 * // Returns:
 * // {
 * //   suggestedTools: ['screenshot', 'console'],
 * //   confidence: { screenshot: 0.6, console: 0.8, network: 0 },
 * //   matchedKeywords: { screenshot: ['seeing', 'screen'], console: ['error'] }
 * // }
 * ```
 */
export function detectIntent(message: string): IntentDetectionResult {
  const screenshotMatches = findMatches(message, SCREENSHOT_KEYWORDS);
  const consoleMatches = findMatches(message, CONSOLE_KEYWORDS);
  const networkMatches = findMatches(message, NETWORK_KEYWORDS);

  const textLength = message.length;

  const confidence: Record<ToolType, number> = {
    screenshot: calculateConfidence(
      screenshotMatches,
      SCREENSHOT_KEYWORDS.length,
      textLength,
    ),
    console: calculateConfidence(
      consoleMatches,
      CONSOLE_KEYWORDS.length,
      textLength,
    ),
    network: calculateConfidence(
      networkMatches,
      NETWORK_KEYWORDS.length,
      textLength,
    ),
  };

  // Determine suggested tools based on confidence
  const suggestedTools: ToolType[] = [];

  if (confidence.screenshot >= DEFAULT_THRESHOLDS.suggest) {
    suggestedTools.push("screenshot");
  }
  if (confidence.console >= DEFAULT_THRESHOLDS.suggest) {
    suggestedTools.push("console");
  }
  if (confidence.network >= DEFAULT_THRESHOLDS.suggest) {
    suggestedTools.push("network");
  }

  // Sort by confidence (highest first)
  suggestedTools.sort((a, b) => confidence[b] - confidence[a]);

  return {
    suggestedTools,
    confidence,
    matchedKeywords: {
      screenshot: screenshotMatches,
      console: consoleMatches,
      network: networkMatches,
    },
  };
}

/**
 * Check if a message suggests any tools
 */
export function hasToolSuggestions(message: string): boolean {
  const result = detectIntent(message);
  return result.suggestedTools.length > 0;
}

/**
 * Get the primary suggested tool (highest confidence)
 */
export function getPrimaryTool(message: string): ToolType | null {
  const result = detectIntent(message);
  return result.suggestedTools[0] || null;
}

/**
 * Generate a reason string for why tools are being suggested
 */
export function generateSuggestionReason(
  result: IntentDetectionResult,
): string {
  if (result.suggestedTools.length === 0) {
    return "";
  }

  const reasons: string[] = [];

  if (result.suggestedTools.includes("screenshot")) {
    const keywords = result.matchedKeywords.screenshot.slice(0, 3);
    reasons.push(`visual elements mentioned (${keywords.join(", ")})`);
  }

  if (result.suggestedTools.includes("console")) {
    const keywords = result.matchedKeywords.console.slice(0, 3);
    reasons.push(`potential errors indicated (${keywords.join(", ")})`);
  }

  if (result.suggestedTools.includes("network")) {
    const keywords = result.matchedKeywords.network.slice(0, 3);
    reasons.push(`API/network issues suggested (${keywords.join(", ")})`);
  }

  return `Based on your message: ${reasons.join("; ")}.`;
}

/**
 * Custom keyword configuration
 */
export interface CustomKeywords {
  screenshot?: string[];
  console?: string[];
  network?: string[];
}

/**
 * Create a custom intent detector with additional keywords
 */
export function createCustomDetector(customKeywords: CustomKeywords) {
  const extendedScreenshot = [
    ...SCREENSHOT_KEYWORDS,
    ...(customKeywords.screenshot || []),
  ];
  const extendedConsole = [
    ...CONSOLE_KEYWORDS,
    ...(customKeywords.console || []),
  ];
  const extendedNetwork = [
    ...NETWORK_KEYWORDS,
    ...(customKeywords.network || []),
  ];

  return function detectCustomIntent(message: string): IntentDetectionResult {
    const screenshotMatches = findMatches(message, extendedScreenshot);
    const consoleMatches = findMatches(message, extendedConsole);
    const networkMatches = findMatches(message, extendedNetwork);

    const textLength = message.length;

    const confidence: Record<ToolType, number> = {
      screenshot: calculateConfidence(
        screenshotMatches,
        extendedScreenshot.length,
        textLength,
      ),
      console: calculateConfidence(
        consoleMatches,
        extendedConsole.length,
        textLength,
      ),
      network: calculateConfidence(
        networkMatches,
        extendedNetwork.length,
        textLength,
      ),
    };

    const suggestedTools: ToolType[] = [];

    if (confidence.screenshot >= DEFAULT_THRESHOLDS.suggest) {
      suggestedTools.push("screenshot");
    }
    if (confidence.console >= DEFAULT_THRESHOLDS.suggest) {
      suggestedTools.push("console");
    }
    if (confidence.network >= DEFAULT_THRESHOLDS.suggest) {
      suggestedTools.push("network");
    }

    suggestedTools.sort((a, b) => confidence[b] - confidence[a]);

    return {
      suggestedTools,
      confidence,
      matchedKeywords: {
        screenshot: screenshotMatches,
        console: consoleMatches,
        network: networkMatches,
      },
    };
  };
}
