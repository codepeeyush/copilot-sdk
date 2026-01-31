"use client";

import React, { useState } from "react";
import { ChevronDown, Copy, FileText, CopyCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function ChatGptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="44"
      height="44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11.7453 14.85 6.90436 12V7C6.90436 4.79086 8.72949 3 10.9809 3 12.3782 3 13.6113 3.6898 14.3458 4.74128" />
      <path d="M9.59961 19.1791C10.3266 20.2757 11.5866 21.0008 13.0192 21.0008 15.2707 21.0008 17.0958 19.21 17.0958 17.0008V12.0008L12.1612 9.0957" />
      <path d="M9.45166 13.5 9.45123 7.66938 13.8642 5.16938C15.814 4.06481 18.3072 4.72031 19.4329 6.63348 20.1593 7.86806 20.1388 9.32466 19.5089 10.4995" />
      <path d="M4.48963 13.4993C3.8595 14.6742 3.83887 16.131 4.56539 17.3657 5.6911 19.2789 8.18428 19.9344 10.1341 18.8298L14.5471 16.3298 14.643 10.7344" />
      <path d="M17.0959 17.6309C18.4415 17.5734 19.7295 16.8634 20.4529 15.634 21.5786 13.7209 20.9106 11.2745 18.9608 10.1699L14.5478 7.66992 9.48907 10.4255" />
      <path d="M6.90454 6.36938C5.55865 6.42662 4.27032 7.13672 3.54684 8.3663 2.42113 10.2795 3.08917 12.7258 5.03896 13.8304L9.45196 16.3304 14.5 13.5807" />
    </svg>
  );
}

function ClaudeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="44"
      height="44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 12 18.5 5M7.63965 3 12.5 12 13.6865 3M4.48381 6.71679 11.9872 12M3 12 11.9872 12.473M12.2244 13.177 7 20M4.84194 16.8682 11.2824 12.9758M11.5 21 12.665 13.177M21 14 13.1846 12.668M21 10.5788 13 12.3223M16.779 19.646 12.8876 13.3772M19.3566 18.207 13.313 12.9893" />
    </svg>
  );
}

function PerplexityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 48 48">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 4.5v39M13.73 16.573v-9.99L24 16.573m0 14.5L13.73 41.417V27.01L24 16.573m0 0l10.27-9.99v9.99"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.73 31.396H9.44V16.573h29.12v14.823h-4.29"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 16.573L34.27 27.01v14.407L24 31.073"
      />
    </svg>
  );
}

interface PageActionsProps {
  url?: string;
  className?: string;
}

export function PageActions({ url, className }: PageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getPageUrl = () => {
    return typeof window !== "undefined" ? window.location.href : url || "";
  };

  const handleCopyMarkdown = async () => {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const mdxUrl = `${origin}${pathname}.mdx`;

    try {
      const response = await fetch(mdxUrl);
      if (response.ok) {
        const markdown = await response.text();
        await navigator.clipboard.writeText(markdown);
      } else {
        // Fallback: copy page URL with prompt
        const pageUrl = getPageUrl();
        await navigator.clipboard.writeText(
          `Please help me understand this documentation page: ${pageUrl}`,
        );
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleViewMarkdown = () => {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (pathname) {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      window.open(`${origin}${pathname}.mdx`, "_blank");
    }
    setIsOpen(false);
  };

  const handleOpenInChatGPT = () => {
    const pageUrl = getPageUrl();
    const prompt = `Please help me understand this documentation page: ${pageUrl}`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(
      `https://chatgpt.com/?prompt=${encodedPrompt}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsOpen(false);
  };

  const handleOpenInClaude = () => {
    const pageUrl = getPageUrl();
    const prompt = `Please help me understand this documentation page: ${pageUrl}`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(
      `https://claude.ai/new?q=${encodedPrompt}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsOpen(false);
  };

  const handleOpenInPerplexity = () => {
    const pageUrl = getPageUrl();
    const prompt = `Please help me understand this documentation page: ${pageUrl}`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(
      `https://www.perplexity.ai/?q=${encodedPrompt}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2 not-prose", className)}>
      {/* Copy Markdown button */}
      <button
        onClick={handleCopyMarkdown}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors",
          "border border-fd-border bg-fd-background hover:bg-fd-accent hover:text-fd-accent-foreground",
          "h-8 px-3 rounded-lg",
        )}
      >
        {copied ? (
          <CopyCheck className="size-4 text-green-600" />
        ) : (
          <Copy className="size-4" />
        )}
        {copied ? "Copied" : "Copy Markdown"}
      </button>

      {/* Open dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors",
            "border border-fd-border bg-fd-background hover:bg-fd-accent hover:text-fd-accent-foreground",
            "h-8 px-3 rounded-lg",
          )}
        >
          Open
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1 z-50 min-w-[16rem] rounded-lg border border-fd-border bg-fd-popover p-1 shadow-lg">
              <button
                onClick={handleViewMarkdown}
                className="flex items-start gap-3 w-full rounded-md px-3 py-2 hover:bg-fd-accent text-left"
              >
                <FileText className="size-4 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">View as Markdown</p>
                  <p className="text-xs text-fd-muted-foreground">
                    View this page as plain text
                  </p>
                </div>
              </button>

              <button
                onClick={handleOpenInChatGPT}
                className="flex items-start gap-3 w-full rounded-md px-3 py-2 hover:bg-fd-accent text-left"
              >
                <ChatGptIcon className="size-4 shrink-0 mt-0.5 text-emerald-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Open in ChatGPT</p>
                  <p className="text-xs text-fd-muted-foreground">
                    Ask questions about this page
                  </p>
                </div>
              </button>

              <button
                onClick={handleOpenInClaude}
                className="flex items-start gap-3 w-full rounded-md px-3 py-2 hover:bg-fd-accent text-left"
              >
                <ClaudeIcon className="size-4 shrink-0 mt-0.5 text-amber-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Open in Claude</p>
                  <p className="text-xs text-fd-muted-foreground">
                    Ask questions about this page
                  </p>
                </div>
              </button>

              <button
                onClick={handleOpenInPerplexity}
                className="flex items-start gap-3 w-full rounded-md px-3 py-2 hover:bg-fd-accent text-left"
              >
                <PerplexityIcon className="size-4 shrink-0 mt-0.5 text-teal-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Open in Perplexity</p>
                  <p className="text-xs text-fd-muted-foreground">
                    Ask questions about this page
                  </p>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
