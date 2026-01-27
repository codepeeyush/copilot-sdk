"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToHome() {
  return (
    <Link href="/">
      <Button variant="ghost" size="sm" className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Showcase
      </Button>
    </Link>
  );
}
