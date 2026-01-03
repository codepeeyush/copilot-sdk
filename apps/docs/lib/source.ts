import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { createElement } from "react";
import {
  Rocket,
  Package,
  Atom,
  Palette,
  Server,
  Wrench,
  BookOpen,
  Zap,
  Code2,
  Settings,
  Blocks,
  MessageSquare,
  Hammer,
  FileCode,
  Plug,
  Globe,
  Layers,
  MonitorSmartphone,
  RefreshCw,
  Box,
  Anchor,
  Component,
  SquareCode,
  Triangle,
  Image,
  Lightbulb,
  Paintbrush,
} from "lucide-react";

// Custom icons
import {
  BrainIcon,
  RobotIcon,
  NotebookIcon,
  RocketIcon,
  MessageQuestionIcon,
  AiChip1,
  Grid1,
} from "@/components/icons";

const icons: Record<string, React.ComponentType> = {
  // Lucide icons
  Rocket,
  Package,
  Atom,
  Palette,
  Server,
  Wrench,
  BookOpen,
  Zap,
  Code2,
  Settings,
  Blocks,
  MessageSquare,
  Hammer,
  FileCode,
  Plug,
  Globe,
  Layers,
  MonitorSmartphone,
  RefreshCw,
  Box,
  Anchor,
  Component,
  SquareCode,
  TriangleRight: Triangle,
  Image,
  Lightbulb,
  Paintbrush,
  // Custom icons
  Brain: BrainIcon,
  Robot: RobotIcon,
  Notebook: NotebookIcon,
  RocketCustom: RocketIcon,
  MessageQuestion: MessageQuestionIcon,
  AiChip1: AiChip1,
  Grid1: Grid1,
};

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon || !(icon in icons)) return;
    return createElement(icons[icon]);
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}
