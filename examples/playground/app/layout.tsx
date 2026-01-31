import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Copilot SDK Playground",
  description:
    "Interactive playground to explore the Copilot SDK. Test AI providers, themes, tools, and generative UI components.",
  keywords: [
    "AI",
    "Copilot",
    "SDK",
    "Playground",
    "OpenAI",
    "Anthropic",
    "Google AI",
    "Generative UI",
    "Chat UI",
  ],
  authors: [{ name: "YourGPT" }],
  openGraph: {
    title: "Copilot SDK Playground",
    description:
      "Interactive playground to explore the Copilot SDK. Test AI providers, themes, tools, and generative UI components.",
    type: "website",
    siteName: "Copilot SDK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copilot SDK Playground",
    description:
      "Interactive playground to explore the Copilot SDK. Test AI providers, themes, tools, and generative UI components.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
