import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ProviderLogosGrid } from "@/components/provider-logos-grid";
import { ProviderLogo } from "@/components/provider-logo";
import { ProviderCards } from "@/components/provider-cards";
import { ProviderHeader } from "@/components/provider-header";
import { Video } from "@/components/video";
import { DocsHero } from "@/components/docs-hero";
import { QuickSetupSteps } from "@/components/quick-setup-steps";
import { ExamplesShowcase } from "@/components/examples-showcase";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ServerFlowDiagram } from "@/components/server-flow-diagram";
import { DemoVideo } from "@/components/demo-video";
import { PlaygroundShowcase } from "@/components/playground-showcase";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ProviderLogosGrid,
    ProviderLogo,
    ProviderCards,
    ProviderHeader,
    Video,
    DocsHero,
    QuickSetupSteps,
    ExamplesShowcase,
    ArchitectureDiagram,
    ServerFlowDiagram,
    DemoVideo,
    PlaygroundShowcase,
    ...components,
  };
}
