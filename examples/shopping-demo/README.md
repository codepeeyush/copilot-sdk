# Shopping Assistant Demo

> E-commerce copilot with product search, cart management, and checkout assistance.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/shopping-demo&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=shopping-copilot-demo)

## Features Showcased

### AI Shopping Tools

- `search_products` - Product discovery with filters and recommendations
- `add_to_cart` - Cart management with quantity handling
- `remove_from_cart` - Item removal with confirmation
- `apply_coupon` - Discount code validation (SAVE10, SAVE20, FLAT50, WELCOME15)
- `fill_shipping_form` - Auto-fill shipping address
- `place_order` - Complete checkout process
- `go_to_checkout` - Navigation to checkout flow

### E-commerce Features

- Product catalog with categories
- Shopping cart with live updates
- Checkout form with validation
- Order confirmation
- Coupon code system

### SDK Patterns Demonstrated

- `useTool` for cart and checkout operations
- State synchronization between AI and UI
- Multi-step checkout workflow
- Product search with AI recommendations

## Quick Start

### Prerequisites

- Node.js 18+
- **pnpm** (required for workspace setup - npm/yarn won't work)
- OpenAI API key

### Installation

```bash
# Clone the repository
https://github.com/YourGPT/copilot-sdk.git
cd copilot-sdk

# Install all dependencies from root (required for workspace)
pnpm install

# Set up environment
cp examples/shopping-demo/.env.example examples/shopping-demo/.env.local
# Add OPENAI_API_KEY to .env.local

# Run development server
cd examples/shopping-demo

# Install dependencies
pnpm install

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourGPT/yourgpt-copilot/tree/main/examples/shopping-demo&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key&project-name=shopping-copilot-demo)

## Environment Variables

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your-api-key-here
```

| Variable         | Description         |
| ---------------- | ------------------- |
| `OPENAI_API_KEY` | Your OpenAI API key |

## Project Structure

```
shopping-demo/
├── app/
│   ├── page.tsx                    # Main shopping page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind styles
│   ├── copilot/
│   │   └── tools.tsx               # Shopping AI tools
│   ├── components/
│   │   ├── ProductCatalog.tsx      # Product grid
│   │   ├── Cart.tsx                # Shopping cart
│   │   ├── CheckoutForm.tsx        # Checkout flow
│   │   └── OrderConfirmation.tsx   # Order success
│   └── api/
│       └── chat/route.ts           # Copilot API endpoint
├── components/
│   ├── ui/                         # shadcn components
│   └── shared/DemoLayout.tsx
├── lib/
│   ├── utils.ts
│   └── mock-data/
│       └── products.ts             # Sample products
└── README.md
```

## Testing the AI Workflow

1. Open the app - you'll see the product catalog
2. Ask the Copilot:
   - "Show me electronics under $100"
   - "Add the wireless headphones to cart"
   - "Apply coupon SAVE10"
   - "Fill my shipping address: 123 Main St, NYC"
   - "Place my order"
3. Watch the cart and checkout update in real-time

## Available Coupon Codes

| Code        | Discount |
| ----------- | -------- |
| `SAVE10`    | 10% off  |
| `SAVE20`    | 20% off  |
| `FLAT50`    | $50 off  |
| `WELCOME15` | 15% off  |

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- @yourgpt/copilot-sdk
- @yourgpt/llm-sdk

## Important Notes

> **Workspace Dependency**: This example uses `workspace:*` dependencies. You must use `pnpm install` from the monorepo root. Regular `npm install` or `yarn install` will not resolve workspace dependencies correctly.
