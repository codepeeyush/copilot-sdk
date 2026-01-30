import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen, Github, Play } from "lucide-react";
import CopilotSDKLogo from "@/components/logos/copilot-sdk-logo";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="pb-2">
          <CopilotSDKLogo />
        </div>
      ),
    },
    links: [
      {
        type: "icon",
        icon: <BookOpen />,
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        type: "icon",
        icon: <Play />,
        text: "Playground",
        url: "/playground",
      },
      {
        type: "icon",
        icon: <Github />,
        text: "GitHub",
        url: "https://github.com/YourGPT/copilot-sdk",
        external: true,
      },
    ],
  };
}
