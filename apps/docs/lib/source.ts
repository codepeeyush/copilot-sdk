import { docs } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
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
} from "lucide-react";

const icons: Record<string, React.ComponentType> = {
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
};

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon || !(icon in icons)) return;
    return createElement(icons[icon]);
  },
});
