"use client";

import { useTool } from "@yourgpt/copilot-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
  request_id: string;
}

/**
 * Custom Gen UI tool for generating payment links.
 * Shows a skeleton loading state while executing, then displays a payment card on completion.
 */
export function usePaymentLinkTool(errorData: ApiError | null) {
  useTool({
    name: "generate_payment_link",
    description:
      "Generate a payment link for the user to pay their overdue invoice",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const invoiceData = errorData?.details || {
        invoice_id: "inv_unknown",
        amount_due: 4900,
      };

      return {
        success: true,
        data: {
          invoiceId: invoiceData.invoice_id,
          amount: (invoiceData.amount_due as number) / 100,
          currency: "USD",
          paymentUrl:
            "https://billing.example.com/pay/inv_1NqRxJ2eZvKYlo2C8YZ5xR3f",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      };
    },
    render: ({ status, result }) => {
      // Skeleton loading state
      if (status === "executing") {
        return (
          <Card className="w-full max-w-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                  <div className="h-3 bg-muted rounded animate-pulse w-32" />
                </div>
              </div>
              <div className="h-8 bg-muted rounded animate-pulse w-20" />
              <div className="h-9 bg-muted rounded animate-pulse w-full" />
            </CardContent>
          </Card>
        );
      }

      // Completed state - show payment card
      if (status === "completed" && result?.data) {
        const data = result.data as {
          invoiceId: string;
          amount: number;
          currency: string;
          paymentUrl: string;
        };
        return (
          <Card className="w-full max-w-sm border-primary/20 py-0">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Overdue Invoice</p>
                  <p className="text-xs text-muted-foreground">
                    {data.invoiceId}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold">
                ${data.amount.toFixed(2)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {data.currency}
                </span>
              </div>
              <Button className="w-full" size="sm" asChild>
                <a
                  href={data.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pay Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe
              </p>
            </CardContent>
          </Card>
        );
      }

      return null;
    },
  });
}
