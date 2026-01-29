"use client";

import { useState, useCallback, useEffect } from "react";
import { CopilotProvider, useTools } from "@yourgpt/copilot-sdk/react";
import { CopilotChat } from "@yourgpt/copilot-sdk/ui";
import { builtinTools } from "@yourgpt/copilot-sdk/core";
import { DemoLayout } from "@/components/shared/DemoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CreditCard,
  Calendar,
  RefreshCw,
  Loader2,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { Sidebar, type DashboardView } from "./components/Sidebar";
import { AcmeSupportHome } from "./copilot/components";
import { usePaymentLinkTool } from "./copilot/tools";

interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
  request_id: string;
}

function DashboardContent() {
  const [currentView, setCurrentView] = useState<DashboardView>("billing");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorData, setErrorData] = useState<ApiError | null>(null);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    console.info("Fetching subscription data from /api/subscription...");

    try {
      const response = await fetch("/api/subscription");
      const data = await response.json();

      if (!response.ok) {
        setHasError(true);
        setErrorData(data.error);

        console.error(
          `API Error: ${data.error.message}`,
          `\nError Code: ${data.error.code}\nRequest ID: ${data.error.request_id}\nStatus: ${response.status} Payment Required`,
        );

        if (data.error.details) {
          console.error(
            `Payment Details - Invoice: ${data.error.details.invoice_id}, Amount Due: $${(data.error.details.amount_due / 100).toFixed(2)}, Days Overdue: ${data.error.details.days_overdue}`,
            `\nLast Payment Attempt: ${data.error.details.last_payment_attempt}\nLast Error: ${data.error.details.last_payment_error}`,
          );
        }

        console.warn(
          "Subscription features may be limited until payment is resolved",
        );
      } else {
        console.info("Subscription data loaded successfully");
        setHasError(false);
        setErrorData(null);
      }
    } catch (err) {
      setHasError(true);
      console.error(
        `Network error while fetching subscription: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.info("Dashboard page loaded");
    console.log("Initializing services...");

    const timer = setTimeout(() => {
      fetchSubscription();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchSubscription]);

  // Register built-in tools (screenshot & console with approval)
  useTools({
    capture_screenshot: builtinTools.capture_screenshot,
    get_console_logs: builtinTools.get_console_logs,
  });

  // Custom tool: Generate payment link with Gen UI
  usePaymentLinkTool(errorData);

  const viewTitles: Record<DashboardView, string> = {
    dashboard: "Dashboard",
    billing: "Billing & Subscription",
    usage: "Usage",
    invoices: "Invoices",
    team: "Team",
    settings: "Settings",
  };

  return (
    <DemoLayout>
      <div className="flex h-screen bg-muted/30 overflow-visible">
        {/* Collapsible Sidebar */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-14 border-b bg-card flex items-center justify-between px-6 flex-shrink-0">
            <h1 className="font-semibold">{viewTitles[currentView]}</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Error Overlay */}
              {hasError && (
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-destructive">
                          Something went wrong
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Unable to load subscription data. Please try again or
                          contact support.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSubscription}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {isLoading && !hasError && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Subscription Content (disabled when error) */}
              {!isLoading && (
                <div
                  className={hasError ? "opacity-50 pointer-events-none" : ""}
                >
                  {/* Plan Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Current Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">Team Pro</span>
                          <Button variant="outline" size="sm">
                            Upgrade
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Team Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">5 / 10</span>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Next Invoice
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">$245.00</span>
                          <span className="text-sm text-muted-foreground">
                            Feb 15
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment Method */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-bold">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/2025
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">Update</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Billing History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            date: "Jan 15, 2026",
                            amount: "$245.00",
                            status: "Paid",
                          },
                          {
                            date: "Dec 15, 2025",
                            amount: "$245.00",
                            status: "Paid",
                          },
                          {
                            date: "Nov 15, 2025",
                            amount: "$245.00",
                            status: "Paid",
                          },
                        ].map((invoice, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div>
                              <p className="font-medium">{invoice.date}</p>
                              <p className="text-sm text-muted-foreground">
                                Team Pro - Monthly
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{invoice.amount}</p>
                              <p className="text-sm text-muted-foreground">
                                {invoice.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copilot Panel */}
        <div className="w-[400px] border-l border-border/50 flex flex-col bg-background">
          <CopilotChat.Root
            persistence={true}
            className="h-full"
            showPoweredBy={false}
          >
            {/* Custom Home View */}
            <CopilotChat.HomeView className="!gap-0 !p-0">
              <AcmeSupportHome
                input={
                  <CopilotChat.Input placeholder="Describe your issue..." />
                }
              />
            </CopilotChat.HomeView>

            {/* Custom Chat View */}
            <CopilotChat.ChatView>
              <CopilotChat.Header className="flex items-center gap-3 px-4 py-3 border-b bg-card/50">
                <CopilotChat.BackButton className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </CopilotChat.BackButton>
                <div className="flex items-center gap-2.5 flex-1">
                  {/* Logo */}
                  <div className="w-8 h-8 rounded-lg bg-muted border border-border/50 flex items-center justify-center">
                    <img src="/logo.svg" alt="Acme" className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">
                      Acme AI
                    </span>
                    <CopilotChat.ThreadPicker size="sm" />
                  </div>
                </div>
              </CopilotChat.Header>
            </CopilotChat.ChatView>
          </CopilotChat.Root>
        </div>
      </div>
    </DemoLayout>
  );
}

export default function SubscriptionPage() {
  return (
    <CopilotProvider
      runtimeUrl="/api/chat"
      systemPrompt={`You are a friendly support assistant for Acme Inc dashboard.

When a user reports an issue, follow these steps IN ORDER (one tool at a time):

STEP 1: First, use capture_screenshot tool to see what the user sees.
- After getting the screenshot, describe what you see
- If you see an error like "Something went wrong", tell the user you need to investigate further

STEP 2: Then, use get_console_logs tool to check for technical errors.
- Analyze the console output to find the root cause
- Look for error codes, API failures, or payment issues

STEP 3: Based on your findings, explain the issue clearly to the user.
- If it's a billing/payment issue, offer to generate a payment link using generate_payment_link tool

IMPORTANT: Call tools one at a time, not together. Wait for each result before proceeding.`}
      debug={process.env.NODE_ENV === "development"}
    >
      <DashboardContent />
    </CopilotProvider>
  );
}
