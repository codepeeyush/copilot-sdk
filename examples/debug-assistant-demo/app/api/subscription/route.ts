// Dummy subscription API that simulates a payment error
export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return a realistic payment error
  return Response.json(
    {
      error: {
        code: "PAYMENT_PAST_DUE",
        message: "Unable to load subscription data. Payment is past due.",
        details: {
          invoice_id: "inv_1NqRxJ2eZvKYlo2C8YZ5xR3f",
          amount_due: 4900, // $49.00
          currency: "usd",
          due_date: "2025-12-15T00:00:00Z",
          days_overdue: 44,
          last_payment_attempt: "2026-01-10T14:32:18Z",
          last_payment_error:
            "Your card was declined. Please update your payment method.",
          subscription_id: "sub_1NqRwA2eZvKYlo2CXH8WPxLm",
          customer_id: "cus_OA8dcmBGJT0lQq",
        },
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now().toString(36)}`,
      },
    },
    { status: 402 }, // Payment Required
  );
}

export async function POST() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Return error when trying to update subscription
  return Response.json(
    {
      error: {
        code: "SUBSCRIPTION_UPDATE_BLOCKED",
        message: "Cannot modify subscription while payment is past due.",
        details: {
          action_required: "Update payment method",
          support_url: "https://billing.example.com/update-payment",
        },
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now().toString(36)}`,
      },
    },
    { status: 402 },
  );
}
