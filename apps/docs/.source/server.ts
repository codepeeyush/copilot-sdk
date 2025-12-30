// @ts-nocheck
import * as __fd_glob_37 from "../content/docs/tools/built-in/screenshot.mdx?collection=docs";
import * as __fd_glob_36 from "../content/docs/tools/built-in/index.mdx?collection=docs";
import * as __fd_glob_35 from "../content/docs/tools/built-in/console.mdx?collection=docs";
import * as __fd_glob_34 from "../content/docs/api-reference/react/index.mdx?collection=docs";
import * as __fd_glob_33 from "../content/docs/api-reference/react/hooks.mdx?collection=docs";
import * as __fd_glob_32 from "../content/docs/api-reference/react/components.mdx?collection=docs";
import * as __fd_glob_31 from "../content/docs/tools/index.mdx?collection=docs";
import * as __fd_glob_30 from "../content/docs/tools/frontend-tools.mdx?collection=docs";
import * as __fd_glob_29 from "../content/docs/tools/backend-tools.mdx?collection=docs";
import * as __fd_glob_28 from "../content/docs/tools/agentic-loop.mdx?collection=docs";
import * as __fd_glob_27 from "../content/docs/providers/openai.mdx?collection=docs";
import * as __fd_glob_26 from "../content/docs/providers/ollama.mdx?collection=docs";
import * as __fd_glob_25 from "../content/docs/providers/mistral.mdx?collection=docs";
import * as __fd_glob_24 from "../content/docs/providers/index.mdx?collection=docs";
import * as __fd_glob_23 from "../content/docs/providers/groq.mdx?collection=docs";
import * as __fd_glob_22 from "../content/docs/providers/google.mdx?collection=docs";
import * as __fd_glob_21 from "../content/docs/providers/custom-provider.mdx?collection=docs";
import * as __fd_glob_20 from "../content/docs/providers/azure.mdx?collection=docs";
import * as __fd_glob_19 from "../content/docs/providers/anthropic.mdx?collection=docs";
import * as __fd_glob_18 from "../content/docs/api-reference/vue.mdx?collection=docs";
import * as __fd_glob_17 from "../content/docs/api-reference/index.mdx?collection=docs";
import * as __fd_glob_16 from "../content/docs/api-reference/core.mdx?collection=docs";
import * as __fd_glob_15 from "../content/docs/api-reference/chat.mdx?collection=docs";
import * as __fd_glob_14 from "../content/docs/api-reference/angular.mdx?collection=docs";
import * as __fd_glob_13 from "../content/docs/smart-ai-context.mdx?collection=docs";
import * as __fd_glob_12 from "../content/docs/quickstart.mdx?collection=docs";
import * as __fd_glob_11 from "../content/docs/overview.mdx?collection=docs";
import * as __fd_glob_10 from "../content/docs/multimodal.mdx?collection=docs";
import * as __fd_glob_9 from "../content/docs/index.mdx?collection=docs";
import * as __fd_glob_8 from "../content/docs/generative-ui.mdx?collection=docs";
import * as __fd_glob_7 from "../content/docs/customizations.mdx?collection=docs";
import * as __fd_glob_6 from "../content/docs/chat.mdx?collection=docs";
import { default as __fd_glob_5 } from "../content/docs/tools/built-in/meta.json?collection=docs";
import { default as __fd_glob_4 } from "../content/docs/api-reference/react/meta.json?collection=docs";
import { default as __fd_glob_3 } from "../content/docs/tools/meta.json?collection=docs";
import { default as __fd_glob_2 } from "../content/docs/providers/meta.json?collection=docs";
import { default as __fd_glob_1 } from "../content/docs/api-reference/meta.json?collection=docs";
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs";
import { server } from "fumadocs-mdx/runtime/server";
import type * as Config from "../source.config";

const create = server<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {};
  }
>({ doc: { passthroughs: ["extractedReferences"] } });

export const docs = await create.docs(
  "docs",
  "content/docs",
  {
    "meta.json": __fd_glob_0,
    "api-reference/meta.json": __fd_glob_1,
    "providers/meta.json": __fd_glob_2,
    "tools/meta.json": __fd_glob_3,
    "api-reference/react/meta.json": __fd_glob_4,
    "tools/built-in/meta.json": __fd_glob_5,
  },
  {
    "chat.mdx": __fd_glob_6,
    "customizations.mdx": __fd_glob_7,
    "generative-ui.mdx": __fd_glob_8,
    "index.mdx": __fd_glob_9,
    "multimodal.mdx": __fd_glob_10,
    "overview.mdx": __fd_glob_11,
    "quickstart.mdx": __fd_glob_12,
    "smart-ai-context.mdx": __fd_glob_13,
    "api-reference/angular.mdx": __fd_glob_14,
    "api-reference/chat.mdx": __fd_glob_15,
    "api-reference/core.mdx": __fd_glob_16,
    "api-reference/index.mdx": __fd_glob_17,
    "api-reference/vue.mdx": __fd_glob_18,
    "providers/anthropic.mdx": __fd_glob_19,
    "providers/azure.mdx": __fd_glob_20,
    "providers/custom-provider.mdx": __fd_glob_21,
    "providers/google.mdx": __fd_glob_22,
    "providers/groq.mdx": __fd_glob_23,
    "providers/index.mdx": __fd_glob_24,
    "providers/mistral.mdx": __fd_glob_25,
    "providers/ollama.mdx": __fd_glob_26,
    "providers/openai.mdx": __fd_glob_27,
    "tools/agentic-loop.mdx": __fd_glob_28,
    "tools/backend-tools.mdx": __fd_glob_29,
    "tools/frontend-tools.mdx": __fd_glob_30,
    "tools/index.mdx": __fd_glob_31,
    "api-reference/react/components.mdx": __fd_glob_32,
    "api-reference/react/hooks.mdx": __fd_glob_33,
    "api-reference/react/index.mdx": __fd_glob_34,
    "tools/built-in/console.mdx": __fd_glob_35,
    "tools/built-in/index.mdx": __fd_glob_36,
    "tools/built-in/screenshot.mdx": __fd_glob_37,
  },
);
