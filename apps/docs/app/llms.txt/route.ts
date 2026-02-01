import { source } from "@/lib/source";

export const revalidate = false;

const baseUrl = "https://copilot-sdk.yourgpt.ai";

export async function GET() {
  const pages = source.getPages();

  const docsList = pages
    .map((page) => {
      const desc = page.data.description ? `: ${page.data.description}` : "";
      return `- [${page.data.title}](${baseUrl}${page.url})${desc}`;
    })
    .join("\n");

  const output = `# YourGPT Copilot SDK Documentation

> Build AI copilots with app context awareness. Multi-provider LLM support, streaming, tools, and beautiful UI components.

## Documentation

${docsList}

---

## Quick Links

- [GitHub](https://github.com/YourGPT/copilot-sdk)
- [NPM: @yourgpt/copilot-sdk](https://www.npmjs.com/package/@yourgpt/copilot-sdk)
- [NPM: @yourgpt/llm-sdk](https://www.npmjs.com/package/@yourgpt/llm-sdk)
`;

  return new Response(output, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
