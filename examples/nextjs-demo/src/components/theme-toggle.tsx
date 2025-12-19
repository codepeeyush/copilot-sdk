"use client";

import * as React from "react";
import { Moon, Sun, Monitor, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SunIcon = Sun as unknown as LucideIcon;
const MoonIcon = Moon as unknown as LucideIcon;
const MonitorIcon = Monitor as unknown as LucideIcon;

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
      className="size-8"
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon className="size-4" />
      ) : (
        <SunIcon className="size-4" />
      )}
    </Button>
  );
}
