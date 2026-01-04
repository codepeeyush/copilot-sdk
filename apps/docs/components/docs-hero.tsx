"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface DocsHeroProps {
  title: string;
  description: string;
  badge?: string;
  video?: string;
  videoHref?: string;
  className?: string;
}

export function DocsHero({
  title,
  description,
  badge,
  video,
  videoHref = "/docs/examples",
  className,
}: DocsHeroProps) {
  return (
    <div className={cn("not-prose relative mb-12 -mt-2", className)}>
      {/* Outer container with rounded corners */}
      <div className="relative overflow-hidden rounded-2xl border border-fd-border/60">
        {/* Layered background */}
        <div className="absolute inset-0">
          {/* Base gradient - subtle warm to cool */}
          <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/[0.03] via-fd-background to-fd-primary/[0.06]" />

          {/* Mesh gradient overlay */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(var(--color-fd-primary-rgb, 99 102 241) / 0.08), transparent),
                radial-gradient(ellipse 60% 40% at 80% 20%, rgba(var(--color-fd-primary-rgb, 99 102 241) / 0.05), transparent)
              `,
            }}
          />

          {/* Dot matrix pattern */}
          <div
            className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle at center, currentColor 0.5px, transparent 0.5px)`,
              backgroundSize: "20px 20px",
              color: "var(--color-fd-muted-foreground)",
            }}
          />

          {/* Top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fd-primary/20 to-transparent" />

          {/* Fade to bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-fd-background to-transparent" />
        </div>

        {/* Content */}
        <div className="relative px-6 sm:px-8 py-10 sm:py-14">
          {/* Badge */}
          {badge && (
            <div className="mb-5 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-fd-primary/10 border border-fd-primary/20 px-3 py-1 text-xs font-medium text-fd-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fd-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fd-primary" />
                </span>
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-fd-foreground leading-[1.1] mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-fd-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* Video */}
          {video && (
            <Link
              href={videoHref}
              className="group/video block relative mt-8 rounded-xl overflow-hidden border border-fd-border bg-fd-secondary/30"
            >
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/video:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                <span className="flex items-center gap-2 text-sm font-medium text-white opacity-0 group-hover/video:opacity-100 transition-opacity duration-200">
                  View examples
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {/* Decorative corner accent */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-fd-primary/20"
            >
              <path
                d="M40 0v40H0"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="40" cy="0" r="3" fill="currentColor" />
              <circle cx="0" cy="40" r="3" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
