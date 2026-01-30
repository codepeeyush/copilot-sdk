"use client";

import { highlight } from "sugar-high";

interface CodeSnippetProps {
  code: string;
  className?: string;
}

export function CodeSnippet({ code, className = "" }: CodeSnippetProps) {
  const html = highlight(code);

  return (
    <pre className={`rounded-lg bg-zinc-950 p-3 overflow-x-auto ${className}`}>
      <code
        className="text-[10px] font-mono leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
