"use client";

import { Bug, ShoppingBag, LayoutDashboard, PenTool } from "lucide-react";
import { DemoCard } from "@/components/shared/DemoCard";

const demos = [
  {
    title: "Debug Assistant",
    description:
      "AI-powered debugging with automatic context capture, screenshot analysis, and bug report generation.",
    href: "/debug-assistant",
    icon: Bug,
    theme: "posthog",
    features: [
      "Smart Context",
      "Intent Detection",
      "Tool Approval",
      "Render Functions",
    ],
    className:
      "border-yellow-200 hover:border-yellow-300 dark:border-yellow-900 dark:hover:border-yellow-800",
    iconClassName:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    title: "Shopping Assistant",
    description:
      "E-commerce AI that helps find products, manage cart, and complete checkout with form-filling.",
    href: "/shopping",
    icon: ShoppingBag,
    theme: "modern-minimal",
    features: ["useAIContext", "useTool", "Form-filling", "Approval Flow"],
    className:
      "border-blue-200 hover:border-blue-300 dark:border-blue-900 dark:hover:border-blue-800",
    iconClassName:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Dashboard Copilot",
    description:
      "Enterprise dashboard assistant for querying data, managing users, and exporting reports.",
    href: "/dashboard",
    icon: LayoutDashboard,
    theme: "linear",
    features: [
      "Compound Components",
      "Data Tables",
      "CRUD Operations",
      "Export",
    ],
    className:
      "border-purple-200 hover:border-purple-300 dark:border-purple-900 dark:hover:border-purple-800",
    iconClassName:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Content Editor",
    description:
      "AI writing assistant for generating, editing, and refining content with streaming responses.",
    href: "/editor",
    icon: PenTool,
    theme: "catppuccin",
    features: [
      "Streaming",
      "useAIContext",
      "Content Generation",
      "Tone Control",
    ],
    className:
      "border-pink-200 hover:border-pink-300 dark:border-pink-900 dark:hover:border-pink-800",
    iconClassName:
      "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Copilot SDK Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore 4 real-world use cases demonstrating the power and
            flexibility of{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
              @yourgpt/copilot-sdk
            </code>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {demos.map((demo) => (
            <DemoCard key={demo.href} {...demo} />
          ))}
        </div>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Built with Next.js 15, Tailwind CSS v4, and shadcn/ui</p>
          <p className="mt-2">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              Cmd+J
            </kbd>{" "}
            to toggle dark mode
          </p>
        </footer>
      </div>
    </div>
  );
}
