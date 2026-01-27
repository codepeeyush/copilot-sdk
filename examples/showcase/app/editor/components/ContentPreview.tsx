"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface ContentPreviewProps {
  title: string;
  content: string;
}

export function ContentPreview({ title, content }: ContentPreviewProps) {
  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    if (!text) return null;

    return text.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <h1
            key={i}
            className="text-2xl font-bold text-[#cdd6f4] mt-6 mb-4 first:mt-0"
          >
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold text-[#cdd6f4] mt-5 mb-3">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-lg font-semibold text-[#cdd6f4] mt-4 mb-2"
          >
            {line.slice(4)}
          </h3>
        );
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="text-[#bac2de] ml-4 list-disc">
            {renderInline(line.slice(2))}
          </li>
        );
      }

      // Numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.+)$/);
      if (numberedMatch) {
        return (
          <li key={i} className="text-[#bac2de] ml-4 list-decimal">
            {renderInline(numberedMatch[2])}
          </li>
        );
      }

      // Empty lines
      if (line.trim() === "") {
        return <br key={i} />;
      }

      // Regular paragraphs
      return (
        <p key={i} className="text-[#bac2de] mb-3 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    // Bold
    text = text.replace(
      /\*\*(.+?)\*\*/g,
      "<strong class='text-[#cdd6f4] font-semibold'>$1</strong>",
    );
    // Italic
    text = text.replace(/\*(.+?)\*/g, "<em class='text-[#f5c2e7]'>$1</em>");
    // Code
    text = text.replace(
      /`(.+?)`/g,
      "<code class='bg-[#313244] px-1.5 py-0.5 rounded text-[#f38ba8] text-sm font-mono'>$1</code>",
    );
    // Links
    text = text.replace(
      /\[(.+?)\]\((.+?)\)/g,
      "<a href='$2' class='text-[#89b4fa] hover:underline'>$1</a>",
    );

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <Card className="h-full flex flex-col bg-[#1e1e2e] border-[#313244]">
      <CardHeader className="pb-2 border-b border-[#313244]">
        <CardTitle className="text-[#cdd6f4] flex items-center gap-2">
          <Eye className="h-5 w-5 text-[#a6e3a1]" />
          Preview
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6">
        {title && (
          <h1 className="text-3xl font-bold text-[#cdd6f4] mb-6 pb-4 border-b border-[#313244]">
            {title}
          </h1>
        )}

        <article className="prose prose-invert max-w-none">
          {content ? (
            renderContent(content)
          ) : (
            <p className="text-[#6c7086] italic">
              Start writing to see the preview...
            </p>
          )}
        </article>
      </CardContent>
    </Card>
  );
}
