export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with AI-Powered Development",
    content: `# Getting Started with AI-Powered Development

Artificial intelligence is transforming the way we build software. In this comprehensive guide, we'll explore how developers can leverage AI tools to boost productivity and create better applications.

## Why AI Matters for Developers

The integration of AI into development workflows has shown remarkable results:
- 40% faster code completion
- Reduced debugging time
- Improved code quality through intelligent suggestions

## Key Tools and Techniques

### Code Assistants
Modern code assistants use large language models to understand context and provide relevant suggestions...

### Automated Testing
AI can generate test cases based on your code structure, ensuring comprehensive coverage...`,
    excerpt:
      "Explore how AI tools can boost your development productivity and code quality.",
    status: "published",
    category: "Technology",
    tags: ["AI", "Development", "Productivity"],
    author: "Sarah Chen",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    seoTitle: "AI Development Guide 2024 | Boost Your Coding Productivity",
    seoDescription:
      "Learn how to leverage AI tools for faster, better software development.",
  },
  {
    id: "2",
    title: "Building Modern UI Components",
    content: `# Building Modern UI Components

Creating reusable, accessible, and beautiful UI components is essential for modern web development...`,
    excerpt:
      "Learn best practices for creating reusable and accessible UI components.",
    status: "draft",
    category: "Design",
    tags: ["UI", "Components", "React"],
    author: "Amanda Foster",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "3",
    title: "The Future of Remote Work",
    content: `# The Future of Remote Work

As we enter 2024, remote work continues to evolve. Companies are finding new ways to maintain culture and productivity...`,
    excerpt: "How companies are adapting to the new era of distributed teams.",
    status: "published",
    category: "Business",
    tags: ["Remote Work", "Culture", "Productivity"],
    author: "Marcus Johnson",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    seoTitle: "Remote Work Trends 2024 | Future of Distributed Teams",
    seoDescription:
      "Discover how companies are building successful remote-first cultures.",
  },
];

export const articleCategories = [
  "Technology",
  "Design",
  "Business",
  "Marketing",
  "Tutorials",
];
export const articleStatuses = ["draft", "published", "archived"] as const;

export const contentTemplates = [
  {
    id: "blog",
    name: "Blog Post",
    structure: "Introduction, Main Points (3-5), Conclusion, Call to Action",
  },
  {
    id: "product",
    name: "Product Description",
    structure: "Headline, Benefits, Features, Social Proof, CTA",
  },
  {
    id: "email",
    name: "Email Newsletter",
    structure: "Subject, Preview, Greeting, Body, CTA, Footer",
  },
  {
    id: "social",
    name: "Social Media Post",
    structure: "Hook, Value, CTA, Hashtags",
  },
];
