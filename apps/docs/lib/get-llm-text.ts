import { source } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";

export async function getLLMText(
  page: InferPageType<typeof source>,
): Promise<string> {
  const data = page.data as {
    getText?: (mode: "raw" | "processed") => Promise<string>;
  };

  if (data.getText) {
    const processed = await data.getText("processed");
    return `# ${page.data.title} (${page.url})\n\n${processed}`;
  }

  // Fallback if getText is not available
  return `# ${page.data.title} (${page.url})\n\n${page.data.description || ""}`;
}
