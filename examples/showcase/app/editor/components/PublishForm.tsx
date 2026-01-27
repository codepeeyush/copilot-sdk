"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Tag, Search, X, CheckCircle2 } from "lucide-react";
import { articleCategories } from "@/lib/mock-data/articles";
import { useState } from "react";

export interface PublishMetadata {
  seoTitle: string;
  seoDescription: string;
  category: string;
  tags: string[];
  slug: string;
}

interface PublishFormProps {
  metadata: PublishMetadata;
  onUpdate: (metadata: PublishMetadata) => void;
  onPublish: () => void;
  isPublished: boolean;
  articleTitle: string;
}

export function PublishForm({
  metadata,
  onUpdate,
  onPublish,
  isPublished,
  articleTitle,
}: PublishFormProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      onUpdate({ ...metadata, tags: [...metadata.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    onUpdate({ ...metadata, tags: metadata.tags.filter((t) => t !== tag) });
  };

  if (isPublished) {
    return (
      <Card className="bg-[#1e1e2e] border-[#313244]">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#a6e3a1]/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#a6e3a1]" />
          </div>
          <h3 className="text-xl font-semibold text-[#cdd6f4] mb-2">
            Article Published!
          </h3>
          <p className="text-[#a6adc8]">
            Your article "{articleTitle}" is now live.
          </p>
          <p className="text-sm text-[#6c7086] mt-2">
            Slug: /{metadata.slug || "untitled"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1e1e2e] border-[#313244]">
      <CardHeader>
        <CardTitle className="text-[#cdd6f4] flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#89b4fa]" />
          Publish Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SEO Title */}
        <div className="space-y-2">
          <Label htmlFor="seoTitle" className="text-[#a6adc8]">
            <Search className="h-3 w-3 inline mr-1" />
            SEO Title
          </Label>
          <Input
            id="seoTitle"
            value={metadata.seoTitle}
            onChange={(e) =>
              onUpdate({ ...metadata, seoTitle: e.target.value })
            }
            placeholder="Title for search engines..."
            className="bg-[#181825] border-[#313244] text-[#cdd6f4] placeholder:text-[#6c7086]"
          />
          <p className="text-xs text-[#6c7086]">
            {metadata.seoTitle.length}/60 characters
          </p>
        </div>

        {/* SEO Description */}
        <div className="space-y-2">
          <Label htmlFor="seoDescription" className="text-[#a6adc8]">
            Meta Description
          </Label>
          <textarea
            id="seoDescription"
            value={metadata.seoDescription}
            onChange={(e) =>
              onUpdate({ ...metadata, seoDescription: e.target.value })
            }
            placeholder="Description for search results..."
            className="flex min-h-[60px] w-full rounded-md border border-[#313244] bg-[#181825] px-3 py-2 text-sm text-[#cdd6f4] placeholder:text-[#6c7086] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#cba6f7]"
          />
          <p className="text-xs text-[#6c7086]">
            {metadata.seoDescription.length}/160 characters
          </p>
        </div>

        <Separator className="bg-[#313244]" />

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-[#a6adc8]">
            Category
          </Label>
          <select
            id="category"
            value={metadata.category}
            onChange={(e) =>
              onUpdate({ ...metadata, category: e.target.value })
            }
            className="w-full h-10 rounded-md border border-[#313244] bg-[#181825] px-3 text-[#cdd6f4] text-sm"
          >
            <option value="" className="bg-[#1e1e2e]">
              Select a category
            </option>
            {articleCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#1e1e2e]">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-[#a6adc8]">
            <Tag className="h-3 w-3 inline mr-1" />
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="bg-[#181825] border-[#313244] text-[#cdd6f4] placeholder:text-[#6c7086]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={addTag}
              className="border-[#313244] text-[#a6adc8] hover:bg-[#313244]"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {metadata.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-[#cba6f7]/20 text-[#cba6f7] border border-[#cba6f7]/30"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-[#f38ba8]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-[#313244]" />

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-[#a6adc8]">
            URL Slug
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-[#6c7086] text-sm">/blog/</span>
            <Input
              id="slug"
              value={metadata.slug}
              onChange={(e) =>
                onUpdate({
                  ...metadata,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="article-url-slug"
              className="bg-[#181825] border-[#313244] text-[#cdd6f4] placeholder:text-[#6c7086]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#cba6f7] hover:bg-[#cba6f7]/90 text-[#1e1e2e]"
          onClick={onPublish}
          disabled={!articleTitle || !metadata.seoTitle}
        >
          <Globe className="h-4 w-4 mr-2" />
          Publish Article
        </Button>
      </CardFooter>
    </Card>
  );
}
