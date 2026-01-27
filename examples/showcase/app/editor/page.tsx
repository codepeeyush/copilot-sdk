"use client";

import { useState, useCallback, useMemo } from "react";
import {
  CopilotProvider,
  useAIContext,
  useTool,
} from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { DemoLayout } from "@/components/shared/DemoLayout";
import { EditorPane } from "./components/EditorPane";
import { ContentPreview } from "./components/ContentPreview";
import { PublishForm, type PublishMetadata } from "./components/PublishForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Eye, Settings } from "lucide-react";
import "@yourgpt/copilot-sdk/ui/themes/catppuccin.css";

function EditorContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "publish">(
    "editor",
  );

  const [metadata, setMetadata] = useState<PublishMetadata>({
    seoTitle: "",
    seoDescription: "",
    category: "",
    tags: [],
    slug: "",
  });

  // Calculate word and character counts
  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const charCount = useMemo(() => {
    return content.length;
  }, [content]);

  // Provide context to AI
  useAIContext({
    key: "editor_content",
    data: {
      title,
      content,
      wordCount,
      charCount,
      hasContent: content.length > 0,
    },
    description:
      "Current editor content including title, body text, and statistics",
  });

  useAIContext({
    key: "publish_metadata",
    data: metadata,
    description: "SEO and publishing metadata for the article",
  });

  useAIContext({
    key: "editor_state",
    data: {
      activeTab,
      isPublished,
      readyToPublish: Boolean(title && content && metadata.seoTitle),
    },
    description: "Current editor state and tab",
  });

  // Generate slug from title
  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
  }, []);

  // Register AI tools
  useTool({
    name: "generate_content",
    description:
      "Generate content based on a topic or prompt. The AI will write content that appears in the editor.",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The topic or prompt to generate content about",
        },
        template: {
          type: "string",
          description: "Content template: blog, product, email, or social",
        },
        tone: {
          type: "string",
          description:
            "Writing tone: professional, casual, friendly, or formal",
        },
        length: {
          type: "string",
          description: "Content length: short, medium, or long",
        },
      },
      required: ["topic"],
    },
    handler: async ({
      topic,
      template = "blog",
      tone = "professional",
      length = "medium",
    }: {
      topic: string;
      template?: string;
      tone?: string;
      length?: string;
    }) => {
      // Simulate AI content generation
      const lengthGuide =
        length === "short"
          ? "2-3 paragraphs"
          : length === "long"
            ? "5-6 paragraphs"
            : "3-4 paragraphs";

      const generatedTitle = `${topic.charAt(0).toUpperCase() + topic.slice(1)}`;

      let generatedContent = "";

      if (template === "blog") {
        generatedContent = `# ${generatedTitle}

## Introduction

This article explores ${topic} in depth, providing valuable insights for readers interested in this subject.

## Key Points

Here are the main points to consider:

- **First key insight**: Understanding the fundamentals of ${topic} is essential for success.
- **Second key insight**: Many people overlook the importance of proper planning.
- **Third key insight**: Continuous learning and adaptation are crucial.

## Deep Dive

When we examine ${topic} more closely, several interesting patterns emerge. The most successful approaches tend to combine traditional methods with innovative techniques.

### Best Practices

1. Start with a clear understanding of your goals
2. Research thoroughly before making decisions
3. Iterate based on feedback and results
4. Document your learnings for future reference

## Conclusion

In conclusion, ${topic} represents an exciting opportunity for those willing to invest the time and effort to master it. By following the principles outlined in this article, you'll be well-positioned for success.`;
      } else if (template === "product") {
        generatedContent = `# Introducing: ${generatedTitle}

## Transform Your Workflow

Discover how ${topic} can revolutionize the way you work and help you achieve better results in less time.

### Key Benefits

- **Increased Efficiency**: Save hours every week
- **Better Results**: Achieve outcomes you didn't think possible
- **Easy to Use**: Get started in minutes, not days

### Features

Our solution includes everything you need:

1. Intuitive interface designed for real users
2. Powerful automation capabilities
3. Seamless integration with your existing tools
4. 24/7 customer support

## Get Started Today

Ready to transform your approach to ${topic}? Start your free trial now and see the difference for yourself.`;
      } else if (template === "email") {
        generatedContent = `Subject: Exciting News About ${generatedTitle}

Hi there,

I wanted to reach out and share some exciting news about ${topic}.

**Here's what you need to know:**

We've been working hard to bring you the best solutions for ${topic}, and I'm thrilled to announce some major updates.

**What's New:**
- Improved features based on your feedback
- New tools to help you succeed
- Enhanced support options

**Next Steps:**

Click the link below to learn more and get started.

Best regards,
Your Team`;
      } else {
        generatedContent = `${generatedTitle}

${topic.charAt(0).toUpperCase() + topic.slice(1)} is changing the game. Here's what you need to know:

1. It's more accessible than ever
2. The results speak for themselves
3. Now is the time to get started

Ready to learn more? Let's connect.

#${topic.replace(/\s+/g, "")} #innovation #growth`;
      }

      setTitle(generatedTitle);
      setContent(generatedContent);
      setMetadata((prev) => ({
        ...prev,
        seoTitle: generatedTitle,
        slug: generateSlug(generatedTitle),
      }));
      setActiveTab("editor");

      return {
        success: true,
        data: {
          title: generatedTitle,
          wordCount: generatedContent.split(/\s+/).length,
          template,
          tone,
        },
      };
    },
  });

  useTool({
    name: "improve_text",
    description: "Improve or rewrite the current content to make it better",
    inputSchema: {
      type: "object",
      properties: {
        instruction: {
          type: "string",
          description:
            "What improvement to make: clearer, more engaging, shorter, longer",
        },
      },
      required: ["instruction"],
    },
    handler: async ({ instruction }: { instruction: string }) => {
      if (!content) {
        return { success: false, error: "No content to improve" };
      }

      // Simulate text improvement
      let improved = content;

      if (instruction.includes("shorter") || instruction.includes("concise")) {
        // Remove some content to simulate shortening
        improved = content.split("\n\n").slice(0, -1).join("\n\n");
      } else if (
        instruction.includes("longer") ||
        instruction.includes("expand")
      ) {
        // Add content to simulate expansion
        improved =
          content +
          "\n\n## Additional Thoughts\n\nThis section provides further insights and considerations that complement the main content above.";
      } else if (instruction.includes("engaging")) {
        // Add engaging elements
        improved = content.replace(/\. /g, ". ").replace(/\n/g, "\n");
      }

      setContent(improved);
      setActiveTab("editor");

      return {
        success: true,
        data: {
          instruction,
          originalWordCount: content.split(/\s+/).length,
          newWordCount: improved.split(/\s+/).length,
        },
      };
    },
  });

  useTool({
    name: "change_tone",
    description: "Change the tone of the content to a different style",
    inputSchema: {
      type: "object",
      properties: {
        tone: {
          type: "string",
          description:
            "Target tone: professional, casual, friendly, formal, humorous",
        },
      },
      required: ["tone"],
    },
    handler: async ({ tone }: { tone: string }) => {
      if (!content) {
        return { success: false, error: "No content to modify" };
      }

      // Simulate tone change (in real app, this would use AI)
      let modified = content;

      if (tone === "casual" || tone === "friendly") {
        modified = content
          .replace(/Therefore/g, "So")
          .replace(/However/g, "But")
          .replace(/In conclusion/g, "To wrap up")
          .replace(/It is important to note/g, "Here's the thing");
      } else if (tone === "formal" || tone === "professional") {
        modified = content
          .replace(/So/g, "Therefore")
          .replace(/But/g, "However")
          .replace(/wrap up/g, "conclude");
      }

      setContent(modified);

      return {
        success: true,
        data: { tone, modified: true },
      };
    },
  });

  useTool({
    name: "add_section",
    description: "Add a new section to the content",
    inputSchema: {
      type: "object",
      properties: {
        heading: { type: "string", description: "Section heading" },
        content: { type: "string", description: "Section content" },
        position: {
          type: "string",
          description: "Where to add: start, end, or after a specific heading",
        },
      },
      required: ["heading", "content"],
    },
    handler: async ({
      heading,
      content: sectionContent,
      position = "end",
    }: {
      heading: string;
      content: string;
      position?: string;
    }) => {
      const newSection = `\n\n## ${heading}\n\n${sectionContent}`;

      if (position === "start") {
        // Add after title/intro
        const lines = content.split("\n");
        const introEndIndex = lines.findIndex(
          (line, i) => i > 0 && line.startsWith("## "),
        );
        if (introEndIndex > 0) {
          lines.splice(introEndIndex, 0, newSection);
          setContent(lines.join("\n"));
        } else {
          setContent(content + newSection);
        }
      } else {
        setContent(content + newSection);
      }

      setActiveTab("editor");

      return {
        success: true,
        data: { heading, position },
      };
    },
  });

  useTool({
    name: "fill_metadata",
    description: "Fill in the SEO and publishing metadata for the article",
    inputSchema: {
      type: "object",
      properties: {
        seoTitle: { type: "string", description: "SEO title (max 60 chars)" },
        seoDescription: {
          type: "string",
          description: "Meta description (max 160 chars)",
        },
        category: { type: "string", description: "Article category" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Article tags",
        },
        slug: { type: "string", description: "URL slug" },
      },
    },
    needsApproval: true,
    approvalMessage: (params: Partial<PublishMetadata>) =>
      `Fill metadata: "${params.seoTitle || title}"?`,
    handler: async (params: Partial<PublishMetadata>) => {
      setMetadata((prev) => ({
        ...prev,
        ...params,
        tags: params.tags || prev.tags,
        slug: params.slug || generateSlug(params.seoTitle || title),
      }));
      setActiveTab("publish");

      return {
        success: true,
        data: { metadata: params },
      };
    },
    render: ({ status, args }) => {
      if (status === "approval-required" || status === "executing") {
        return (
          <div className="p-3 bg-[#cba6f7]/20 rounded-lg border border-[#cba6f7]/30 text-sm">
            <p className="font-medium text-[#cba6f7]">Metadata Preview</p>
            <p className="text-[#cdd6f4] mt-1 font-bold">{args.seoTitle}</p>
            {args.seoDescription && (
              <p className="text-[#a6adc8] text-xs mt-1 line-clamp-2">
                {args.seoDescription}
              </p>
            )}
            {args.tags && args.tags.length > 0 && (
              <p className="text-[#6c7086] text-xs mt-1">
                Tags: {args.tags.join(", ")}
              </p>
            )}
          </div>
        );
      }
      return null;
    },
  });

  useTool({
    name: "set_title",
    description: "Set or update the article title",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "The new article title" },
      },
      required: ["title"],
    },
    handler: async ({ title: newTitle }: { title: string }) => {
      setTitle(newTitle);
      if (!metadata.seoTitle) {
        setMetadata((prev) => ({
          ...prev,
          seoTitle: newTitle,
          slug: generateSlug(newTitle),
        }));
      }
      return {
        success: true,
        data: { title: newTitle },
      };
    },
  });

  useTool({
    name: "clear_editor",
    description: "Clear all content from the editor and start fresh",
    inputSchema: {
      type: "object",
      properties: {},
    },
    needsApproval: true,
    approvalMessage: () => "Clear all content? This cannot be undone.",
    handler: async () => {
      setTitle("");
      setContent("");
      setMetadata({
        seoTitle: "",
        seoDescription: "",
        category: "",
        tags: [],
        slug: "",
      });
      setIsPublished(false);
      setActiveTab("editor");
      return {
        success: true,
        data: { cleared: true },
      };
    },
  });

  return (
    <DemoLayout title="Content Editor" theme="catppuccin">
      <div className="flex h-[calc(100vh-41px)]">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-[#11111b]">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-[#313244] bg-[#1e1e2e] h-12 px-4">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:bg-[#313244] data-[state=active]:text-[#cdd6f4] text-[#6c7086]"
              >
                <FileText className="h-4 w-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-[#313244] data-[state=active]:text-[#cdd6f4] text-[#6c7086]"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="publish"
                className="data-[state=active]:bg-[#313244] data-[state=active]:text-[#cdd6f4] text-[#6c7086]"
              >
                <Settings className="h-4 w-4 mr-2" />
                Publish
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0 p-4">
              <EditorPane
                content={content}
                onChange={setContent}
                title={title}
                onTitleChange={setTitle}
                wordCount={wordCount}
                charCount={charCount}
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 p-4">
              <ContentPreview title={title} content={content} />
            </TabsContent>

            <TabsContent
              value="publish"
              className="flex-1 m-0 p-4 overflow-y-auto"
            >
              <div className="max-w-xl mx-auto">
                <PublishForm
                  metadata={metadata}
                  onUpdate={setMetadata}
                  onPublish={() => setIsPublished(true)}
                  isPublished={isPublished}
                  articleTitle={title}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Panel */}
        <div
          className="w-96 border-l border-[#313244] bg-[#1e1e2e] flex flex-col"
          data-csdk-theme="catppuccin"
        >
          <CopilotChat
            placeholder="Ask me to write or improve content..."
            className="h-full"
            persistence={true}
            showThreadPicker={true}
            header={{
              name: "Writing Assistant",
            }}
            suggestions={[
              "Write a blog post about AI",
              "Create a product description",
              "Draft a newsletter email",
            ]}
          />
        </div>
      </div>
    </DemoLayout>
  );
}

export default function EditorPage() {
  return (
    <CopilotProvider
      runtimeUrl="/api/chat"
      systemPrompt={`You are an AI writing assistant that helps users create and improve content. You have access to:

1. generate_content - Create new content based on a topic, with options for template (blog, product, email, social), tone, and length
2. improve_text - Improve existing content (make it clearer, more engaging, shorter, longer)
3. change_tone - Change the tone (professional, casual, friendly, formal, humorous)
4. add_section - Add new sections to the content
5. fill_metadata - Fill in SEO title, description, category, and tags
6. set_title - Set or update the article title
7. clear_editor - Clear all content and start fresh

Available content templates:
- blog: Full blog post with intro, key points, and conclusion
- product: Product description with benefits and features
- email: Newsletter or marketing email
- social: Social media post

When users ask you to write content:
1. Ask clarifying questions if needed (topic, tone, length)
2. Use generate_content to create the content
3. Offer to improve or modify as needed

The current editor content and metadata are available to you, so you can see what's already written.`}
      debug={process.env.NODE_ENV === "development"}
    >
      <EditorContent />
    </CopilotProvider>
  );
}
