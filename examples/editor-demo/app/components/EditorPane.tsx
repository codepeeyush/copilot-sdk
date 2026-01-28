"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Bold,
  Italic,
  List,
  Link2,
  Image,
  Code,
  Undo,
  Redo,
} from "lucide-react";

interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  wordCount: number;
  charCount: number;
}

export function EditorPane({
  content,
  onChange,
  title,
  onTitleChange,
  wordCount,
  charCount,
}: EditorPaneProps) {
  return (
    <Card className="h-full flex flex-col bg-[#1e1e2e] border-[#313244]">
      <CardHeader className="pb-2 border-b border-[#313244]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#cdd6f4] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#cba6f7]" />
            Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs border-[#45475a] text-[#a6adc8]"
            >
              {wordCount} words
            </Badge>
            <Badge
              variant="outline"
              className="text-xs border-[#45475a] text-[#a6adc8]"
            >
              {charCount} chars
            </Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 mt-3 p-1 rounded-lg bg-[#181825] border border-[#313244]">
          <ToolbarButton icon={Bold} title="Bold" />
          <ToolbarButton icon={Italic} title="Italic" />
          <div className="w-px h-5 bg-[#313244] mx-1" />
          <ToolbarButton icon={List} title="List" />
          <ToolbarButton icon={Link2} title="Link" />
          <ToolbarButton icon={Image} title="Image" />
          <ToolbarButton icon={Code} title="Code" />
          <div className="flex-1" />
          <ToolbarButton icon={Undo} title="Undo" />
          <ToolbarButton icon={Redo} title="Redo" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="text-2xl font-bold bg-transparent border-none outline-none text-[#cdd6f4] placeholder:text-[#6c7086]"
        />

        {/* Content Editor */}
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing your content here...

You can use Markdown syntax:
- **bold** for emphasis
- *italic* for style
- # Headers
- [links](url)
- `code` for inline code"
          className="flex-1 w-full bg-transparent border-none outline-none resize-none text-[#cdd6f4] placeholder:text-[#6c7086] font-mono text-sm leading-relaxed"
        />
      </CardContent>
    </Card>
  );
}

function ToolbarButton({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]"
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
