"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DemoCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  theme: string;
  features: string[];
  className?: string;
  iconClassName?: string;
}

export function DemoCard({
  title,
  description,
  href,
  icon: Icon,
  theme,
  features,
  className,
  iconClassName,
}: DemoCardProps) {
  return (
    <Link href={href} className="block group">
      <Card
        className={cn(
          "h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          className,
        )}
      >
        <CardHeader>
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              iconClassName,
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="flex items-center gap-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <Badge variant="outline" className="text-xs">
            Theme: {theme}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
