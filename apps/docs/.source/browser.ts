// @ts-nocheck
import { browser } from "fumadocs-mdx/runtime/browser";
import type * as Config from "../source.config";

const create = browser<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {};
  }
>();
const browserCollections = {
  docs: create.doc("docs", {
    "chat.mdx": () => import("../content/docs/chat.mdx?collection=docs"),
    "customizations.mdx": () =>
      import("../content/docs/customizations.mdx?collection=docs"),
    "generative-ui.mdx": () =>
      import("../content/docs/generative-ui.mdx?collection=docs"),
    "index.mdx": () => import("../content/docs/index.mdx?collection=docs"),
    "multimodal.mdx": () =>
      import("../content/docs/multimodal.mdx?collection=docs"),
    "overview.mdx": () =>
      import("../content/docs/overview.mdx?collection=docs"),
    "quickstart.mdx": () =>
      import("../content/docs/quickstart.mdx?collection=docs"),
    "smart-ai-context.mdx": () =>
      import("../content/docs/smart-ai-context.mdx?collection=docs"),
    "api-reference/angular.mdx": () =>
      import("../content/docs/api-reference/angular.mdx?collection=docs"),
    "api-reference/chat.mdx": () =>
      import("../content/docs/api-reference/chat.mdx?collection=docs"),
    "api-reference/core.mdx": () =>
      import("../content/docs/api-reference/core.mdx?collection=docs"),
    "api-reference/index.mdx": () =>
      import("../content/docs/api-reference/index.mdx?collection=docs"),
    "api-reference/vue.mdx": () =>
      import("../content/docs/api-reference/vue.mdx?collection=docs"),
    "providers/anthropic.mdx": () =>
      import("../content/docs/providers/anthropic.mdx?collection=docs"),
    "providers/azure.mdx": () =>
      import("../content/docs/providers/azure.mdx?collection=docs"),
    "providers/custom-provider.mdx": () =>
      import("../content/docs/providers/custom-provider.mdx?collection=docs"),
    "providers/google.mdx": () =>
      import("../content/docs/providers/google.mdx?collection=docs"),
    "providers/groq.mdx": () =>
      import("../content/docs/providers/groq.mdx?collection=docs"),
    "providers/index.mdx": () =>
      import("../content/docs/providers/index.mdx?collection=docs"),
    "providers/mistral.mdx": () =>
      import("../content/docs/providers/mistral.mdx?collection=docs"),
    "providers/ollama.mdx": () =>
      import("../content/docs/providers/ollama.mdx?collection=docs"),
    "providers/openai.mdx": () =>
      import("../content/docs/providers/openai.mdx?collection=docs"),
    "tools/agentic-loop.mdx": () =>
      import("../content/docs/tools/agentic-loop.mdx?collection=docs"),
    "tools/backend-tools.mdx": () =>
      import("../content/docs/tools/backend-tools.mdx?collection=docs"),
    "tools/frontend-tools.mdx": () =>
      import("../content/docs/tools/frontend-tools.mdx?collection=docs"),
    "tools/index.mdx": () =>
      import("../content/docs/tools/index.mdx?collection=docs"),
    "api-reference/react/components.mdx": () =>
      import("../content/docs/api-reference/react/components.mdx?collection=docs"),
    "api-reference/react/hooks.mdx": () =>
      import("../content/docs/api-reference/react/hooks.mdx?collection=docs"),
    "api-reference/react/index.mdx": () =>
      import("../content/docs/api-reference/react/index.mdx?collection=docs"),
    "tools/built-in/console.mdx": () =>
      import("../content/docs/tools/built-in/console.mdx?collection=docs"),
    "tools/built-in/index.mdx": () =>
      import("../content/docs/tools/built-in/index.mdx?collection=docs"),
    "tools/built-in/screenshot.mdx": () =>
      import("../content/docs/tools/built-in/screenshot.mdx?collection=docs"),
  }),
};
export default browserCollections;
