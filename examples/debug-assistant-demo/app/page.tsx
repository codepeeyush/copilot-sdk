"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CopilotProvider,
  useAIContext,
  useTool,
} from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { DemoLayout } from "@/components/shared/DemoLayout";
import { ConsoleViewer, type LogEntry } from "@/app/components/ConsoleViewer";
import {
  ScreenshotPreview,
  type Screenshot,
} from "@/app/components/ScreenshotPreview";
import { BugReportForm, type BugReport } from "@/app/components/BugReportForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, Zap, AlertCircle, Terminal, WifiOff } from "lucide-react";
import "@yourgpt/copilot-sdk/ui/themes/posthog.css";

// Mock network errors for demo
interface NetworkError {
  id: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  timestamp: Date;
}

function DebugContent() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [networkErrors, setNetworkErrors] = useState<NetworkError[]>([]);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [bugReport, setBugReport] = useState<BugReport>({
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    severity: "medium",
    browser:
      typeof navigator !== "undefined"
        ? navigator.userAgent.split(" ").pop() || ""
        : "",
    os: typeof navigator !== "undefined" ? navigator.platform : "",
    url: typeof window !== "undefined" ? window.location.href : "",
    consoleLogs: [],
    screenshots: [],
  });

  // Simulate console logs
  const addLog = useCallback(
    (type: LogEntry["type"], message: string, stack?: string) => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date(),
        stack,
      };
      setLogs((prev) => [...prev, newLog]);
    },
    [],
  );

  // Simulate capturing screenshot (using canvas placeholder)
  const captureScreenshot = useCallback(() => {
    // Create a placeholder screenshot (in real app, would use html2canvas or similar)
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 450);
      gradient.addColorStop(0, "#fef3c7");
      gradient.addColorStop(1, "#fde68a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 450);

      // Add some text
      ctx.fillStyle = "#92400e";
      ctx.font = "24px sans-serif";
      ctx.fillText("Screenshot Captured", 280, 220);
      ctx.font = "14px sans-serif";
      ctx.fillText(new Date().toLocaleString(), 320, 250);
    }

    const newScreenshot: Screenshot = {
      id: Date.now().toString(),
      dataUrl: canvas.toDataURL(),
      timestamp: new Date(),
      description: "Captured screenshot",
    };
    setScreenshots((prev) => [...prev, newScreenshot]);
    return newScreenshot;
  }, []);

  // Add network error
  const addNetworkError = useCallback(
    (url: string, method: string, status: number, statusText: string) => {
      const newError: NetworkError = {
        id: Date.now().toString(),
        url,
        method,
        status,
        statusText,
        timestamp: new Date(),
      };
      setNetworkErrors((prev) => [...prev, newError]);
    },
    [],
  );

  // Provide context to AI
  useAIContext({
    key: "console_logs",
    data: {
      total: logs.length,
      errors: logs.filter((l) => l.type === "error").length,
      warnings: logs.filter((l) => l.type === "warn").length,
      recentLogs: logs.slice(-10).map((l) => ({
        type: l.type,
        message: l.message,
        timestamp: l.timestamp.toISOString(),
      })),
    },
    description:
      "Console logs from the application including errors and warnings",
  });

  useAIContext({
    key: "network_errors",
    data: {
      total: networkErrors.length,
      errors: networkErrors.map((e) => ({
        url: e.url,
        method: e.method,
        status: e.status,
        statusText: e.statusText,
      })),
    },
    description: "Network request errors and failed API calls",
  });

  useAIContext({
    key: "screenshots",
    data: {
      count: screenshots.length,
    },
    description: "Captured screenshots for debugging",
  });

  useAIContext({
    key: "bug_report",
    data: bugReport,
    description: "Current bug report form state",
  });

  // Register AI tools
  useTool({
    name: "capture_screenshot",
    description:
      "Capture a screenshot of the current application state for debugging",
    inputSchema: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "Description of what the screenshot captures",
        },
      },
    },
    handler: async ({ description }: { description?: string }) => {
      const screenshot = captureScreenshot();
      if (description) {
        setScreenshots((prev) =>
          prev.map((s) => (s.id === screenshot.id ? { ...s, description } : s)),
        );
      }
      return {
        success: true,
        data: { screenshotId: screenshot.id, description },
      };
    },
  });

  useTool({
    name: "get_console_logs",
    description:
      "Retrieve console logs, especially errors and warnings, for debugging",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "Filter by log type: error, warn, info, log, or all",
        },
        limit: {
          type: "number",
          description: "Maximum number of logs to retrieve",
        },
      },
    },
    handler: async ({
      type = "all",
      limit = 20,
    }: {
      type?: string;
      limit?: number;
    }) => {
      const filtered =
        type === "all" ? logs : logs.filter((l) => l.type === type);
      const limited = filtered.slice(-limit);
      return {
        success: true,
        data: {
          count: limited.length,
          logs: limited.map((l) => ({
            type: l.type,
            message: l.message,
            timestamp: l.timestamp.toISOString(),
            ...(l.stack && { stack: l.stack }),
          })),
        },
      };
    },
  });

  useTool({
    name: "get_network_errors",
    description: "Retrieve failed network requests and API errors",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      return {
        success: true,
        data: {
          count: networkErrors.length,
          errors: networkErrors.map((e) => ({
            url: e.url,
            method: e.method,
            status: e.status,
            statusText: e.statusText,
            timestamp: e.timestamp.toISOString(),
          })),
        },
      };
    },
  });

  useTool({
    name: "create_bug_report",
    description:
      "Fill in the bug report form with the collected debugging information",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Bug report title" },
        description: {
          type: "string",
          description: "Detailed description of the bug",
        },
        stepsToReproduce: {
          type: "string",
          description: "Steps to reproduce the bug",
        },
        expectedBehavior: { type: "string", description: "What should happen" },
        actualBehavior: {
          type: "string",
          description: "What actually happens",
        },
        severity: {
          type: "string",
          description: "Bug severity: low, medium, high, or critical",
        },
      },
      required: ["title", "description"],
    },
    needsApproval: true,
    approvalMessage: (params: Partial<BugReport>) =>
      `Create bug report: "${params.title}"?`,
    handler: async (params: Partial<BugReport>) => {
      setBugReport((prev) => ({
        ...prev,
        ...params,
        consoleLogs: logs.filter(
          (l) => l.type === "error" || l.type === "warn",
        ),
        screenshots: screenshots,
        severity: (params.severity as BugReport["severity"]) || prev.severity,
      }));
      return {
        success: true,
        data: { message: "Bug report created", title: params.title },
      };
    },
    render: ({ status, args }) => {
      if (status === "approval-required" || status === "executing") {
        return (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800 text-sm">
            <p className="font-medium text-yellow-700 dark:text-yellow-300">
              Bug Report Preview
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 mt-1 font-bold">
              {args.title}
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 mt-1 line-clamp-2">
              {args.description}
            </p>
          </div>
        );
      }
      return null;
    },
  });

  useTool({
    name: "simulate_error",
    description:
      "Simulate an error in the console for testing the debug assistant",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "Type of error: console, network, or both",
        },
        message: { type: "string", description: "Error message to simulate" },
      },
    },
    handler: async ({
      type = "console",
      message = "Simulated error",
    }: {
      type?: string;
      message?: string;
    }) => {
      if (type === "console" || type === "both") {
        addLog(
          "error",
          message,
          "    at simulateError (debug-assistant.tsx:123)\n    at handleClick (app.tsx:45)",
        );
      }
      if (type === "network" || type === "both") {
        addNetworkError("/api/data", "GET", 500, "Internal Server Error");
      }
      return {
        success: true,
        data: { simulated: type, message },
      };
    },
  });

  // Add some initial demo logs
  useEffect(() => {
    const timer = setTimeout(() => {
      addLog("info", "Debug Assistant initialized");
      addLog("log", "User session started");
      addLog("warn", "Deprecated API method detected: oldMethod()");
    }, 500);
    return () => clearTimeout(timer);
  }, [addLog]);

  return (
    <DemoLayout title="Debug Assistant" theme="posthog">
      <div className="flex h-[calc(100vh-41px)]">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Actions */}
          <div className="mb-6">
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Simulate Issues (for Demo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addLog(
                        "error",
                        "TypeError: Cannot read property 'undefined' of null",
                        "    at processData (utils.js:42)\n    at async fetchData (api.js:18)",
                      )
                    }
                  >
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Console Error
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addLog("warn", "Memory usage exceeded 80% threshold")
                    }
                  >
                    <Terminal className="h-4 w-4 mr-2 text-yellow-500" />
                    Warning
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addNetworkError("/api/users", "POST", 401, "Unauthorized")
                    }
                  >
                    <WifiOff className="h-4 w-4 mr-2 text-orange-500" />
                    Network Error
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={captureScreenshot}
                  >
                    Capture Screenshot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="logs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="logs">Console Logs</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="report">Bug Report</TabsTrigger>
            </TabsList>

            <TabsContent value="logs">
              <ConsoleViewer logs={logs} onClear={() => setLogs([])} />
            </TabsContent>

            <TabsContent value="network">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <WifiOff className="h-5 w-5" />
                    Network Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {networkErrors.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No network errors
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {networkErrors.map((error) => (
                        <div
                          key={error.id}
                          className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-medium text-red-700 dark:text-red-300">
                              {error.method} {error.url}
                            </span>
                            <span className="text-red-600 dark:text-red-400 text-sm">
                              {error.status} {error.statusText}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {error.timestamp.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screenshots">
              <ScreenshotPreview
                screenshots={screenshots}
                onCapture={captureScreenshot}
                onRemove={(id) =>
                  setScreenshots((prev) => prev.filter((s) => s.id !== id))
                }
              />
            </TabsContent>

            <TabsContent value="report">
              <BugReportForm
                report={{
                  ...bugReport,
                  consoleLogs: logs.filter(
                    (l) => l.type === "error" || l.type === "warn",
                  ),
                  screenshots: screenshots,
                }}
                onUpdate={setBugReport}
                onSubmit={() => setIsReportSubmitted(true)}
                isSubmitted={isReportSubmitted}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Panel */}
        <div
          className="w-96 border-l bg-background flex flex-col"
          data-csdk-theme="posthog"
        >
          <CopilotChat
            placeholder="Describe your issue..."
            className="h-full"
            persistence={true}
            showThreadPicker={true}
            header={{
              name: "Debug Assistant",
            }}
            suggestions={[
              "My app crashed suddenly",
              "API calls are failing",
              "Help me create a bug report",
            ]}
          />
        </div>
      </div>
    </DemoLayout>
  );
}

export default function DebugAssistantPage() {
  return (
    <CopilotProvider
      runtimeUrl="/api/chat"
      systemPrompt={`You are an AI debugging assistant that helps developers identify and report bugs. You have access to:

- Console logs (errors, warnings, info, regular logs)
- Network errors (failed API requests)
- Screenshot capabilities
- Bug report creation

Your capabilities:
1. capture_screenshot - Capture screenshots of the current state
2. get_console_logs - Retrieve console logs, filterable by type
3. get_network_errors - Get failed network requests
4. create_bug_report - Fill in the bug report form with collected info
5. simulate_error - Create test errors for demonstration

When a user reports an issue:
1. First analyze the context (console logs, network errors)
2. Ask clarifying questions if needed
3. Capture screenshots if it's a visual issue
4. Help create a comprehensive bug report

Be proactive in gathering debugging information. If the user mentions an error, check the console logs. If they mention an API issue, check network errors. If it's a UI issue, offer to capture a screenshot.

The debugging context is automatically available to you, so you can see errors and logs in real-time.`}
      debug={process.env.NODE_ENV === "development"}
    >
      <DebugContent />
    </CopilotProvider>
  );
}
