"use client";

import Link from "next/link";

interface DemoVideoProps {
  src: string;
  href?: string;
}

export function DemoVideo({ src, href = "/docs/examples" }: DemoVideoProps) {
  return (
    <div className="not-prose relative my-8 rounded-2xl border border-fd-border overflow-hidden bg-fd-secondary/30">
      <Link href={href} className="group block relative">
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full aspect-video object-cover"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-fd-background/0 group-hover:bg-fd-background/10 transition-colors duration-200" />
      </Link>
    </div>
  );
}
