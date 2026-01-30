"use client";

import { ExternalLink } from "lucide-react";

const PLAYGROUND_GITHUB_URL =
  "https://github.com/YourGPT/copilot-sdk/tree/main/examples/playground";

interface PlaygroundShowcaseProps {
  imageUrl?: string;
  posterUrl?: string; // alias for imageUrl
}

export function PlaygroundShowcase({
  imageUrl,
  posterUrl,
}: PlaygroundShowcaseProps) {
  const image = imageUrl || posterUrl;

  return (
    <div className="w-full not-prose">
      <div className="relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/[0.03] via-fd-background to-fd-primary/[0.06]" />
            <div
              className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0.5px)`,
                backgroundSize: "24px 24px",
                color: "var(--color-fd-muted-foreground)",
              }}
            />
          </div>

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fd-foreground mb-3">
              Copilot Playground
            </h1>

            <p className="text-sm sm:text-base text-fd-muted-foreground max-w-xl mx-auto leading-relaxed mb-5">
              Test Copilot SDK with multiple providers, configure tools, and
              explore features in an interactive environment.
            </p>

            <div className="flex items-center justify-center gap-3">
              <a
                href="/playground"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Try Playground
              </a>
              <a
                href={PLAYGROUND_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-secondary/80 border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground hover:bg-fd-secondary transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Image */}
        {image ? (
          <img
            src={image}
            alt="Copilot SDK Playground"
            className="w-full h-auto border-t border-fd-border"
          />
        ) : (
          <div
            className="flex items-center justify-center bg-gradient-to-br from-fd-secondary/50 to-fd-secondary/30 border-t border-fd-border"
            style={{ aspectRatio: "16/9" }}
          >
            <span className="text-sm text-fd-muted-foreground">
              Preview coming soon
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-fd-border">
          <div className="flex flex-wrap gap-2">
            {[
              "Multi-Provider",
              "Streaming",
              "Tools",
              "Generative UI",
              "Themes",
            ].map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center rounded-md bg-fd-secondary/70 px-2.5 py-1 text-xs font-medium text-fd-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
