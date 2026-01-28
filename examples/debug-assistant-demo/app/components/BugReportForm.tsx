"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bug, Send, Paperclip, CheckCircle2 } from "lucide-react";
import { type LogEntry } from "./ConsoleViewer";
import { type Screenshot } from "./ScreenshotPreview";

export interface BugReport {
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  severity: "low" | "medium" | "high" | "critical";
  browser: string;
  os: string;
  url: string;
  consoleLogs: LogEntry[];
  screenshots: Screenshot[];
}

interface BugReportFormProps {
  report: BugReport;
  onUpdate: (report: BugReport) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

const severityColors = {
  low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function BugReportForm({
  report,
  onUpdate,
  onSubmit,
  isSubmitted,
}: BugReportFormProps) {
  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Bug Report Submitted!</h3>
          <p className="text-muted-foreground">
            Thank you for reporting this issue. Our team will review it shortly.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Report ID: BUG-{Date.now().toString(36).toUpperCase()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Bug Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={report.title}
            onChange={(e) => onUpdate({ ...report, title: e.target.value })}
            placeholder="Brief description of the bug"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={report.description}
            onChange={(e) =>
              onUpdate({ ...report, description: e.target.value })
            }
            placeholder="Detailed description of the issue"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="steps">Steps to Reproduce</Label>
          <textarea
            id="steps"
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={report.stepsToReproduce}
            onChange={(e) =>
              onUpdate({ ...report, stepsToReproduce: e.target.value })
            }
            placeholder="1. Go to... &#10;2. Click on... &#10;3. See error"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expected">Expected Behavior</Label>
            <Input
              id="expected"
              value={report.expectedBehavior}
              onChange={(e) =>
                onUpdate({ ...report, expectedBehavior: e.target.value })
              }
              placeholder="What should happen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actual">Actual Behavior</Label>
            <Input
              id="actual"
              value={report.actualBehavior}
              onChange={(e) =>
                onUpdate({ ...report, actualBehavior: e.target.value })
              }
              placeholder="What actually happens"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Severity</Label>
          <div className="flex gap-2">
            {(["low", "medium", "high", "critical"] as const).map((s) => (
              <Button
                key={s}
                variant={report.severity === s ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ ...report, severity: s })}
                className={report.severity === s ? severityColors[s] : ""}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Environment</Label>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 rounded bg-muted">
              <span className="text-muted-foreground">Browser:</span>
              <p className="font-medium truncate">
                {report.browser || "Unknown"}
              </p>
            </div>
            <div className="p-2 rounded bg-muted">
              <span className="text-muted-foreground">OS:</span>
              <p className="font-medium truncate">{report.os || "Unknown"}</p>
            </div>
            <div className="p-2 rounded bg-muted">
              <span className="text-muted-foreground">URL:</span>
              <p className="font-medium truncate">{report.url || "N/A"}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {report.consoleLogs.length} console logs
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {report.screenshots.length} screenshots
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={!report.title || !report.description}
        >
          <Send className="h-4 w-4 mr-2" />
          Submit Bug Report
        </Button>
      </CardFooter>
    </Card>
  );
}
