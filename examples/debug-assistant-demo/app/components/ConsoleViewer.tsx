"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  AlertCircle,
  AlertTriangle,
  Info,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogEntry {
  id: string;
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: Date;
  stack?: string;
}

interface ConsoleViewerProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function ConsoleViewer({ logs, onClear }: ConsoleViewerProps) {
  const [filter, setFilter] = useState<
    "all" | "error" | "warn" | "info" | "log"
  >("all");

  const filteredLogs = logs.filter(
    (log) => filter === "all" || log.type === filter,
  );

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLogStyle = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      case "warn":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
      default:
        return "bg-muted/50 border-border";
    }
  };

  const errorCount = logs.filter((l) => l.type === "error").length;
  const warnCount = logs.filter((l) => l.type === "warn").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Terminal className="h-5 w-5" />
            Console
          </CardTitle>
          <div className="flex items-center gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} errors
              </Badge>
            )}
            {warnCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              >
                {warnCount} warnings
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          {(["all", "error", "warn", "info", "log"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No console logs
            </p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={cn("p-2 rounded border", getLogStyle(log.type))}
              >
                <div className="flex items-start gap-2">
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <p className="break-all">{log.message}</p>
                    {log.stack && (
                      <pre className="mt-1 text-[10px] text-muted-foreground overflow-x-auto">
                        {log.stack}
                      </pre>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
