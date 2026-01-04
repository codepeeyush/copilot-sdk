import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";
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
  title: {
    template: "%s | Copilot SDK",
    default: "Build AI Copilots for Your Product",
  },
  description:
    "Production-ready AI Copilots for any product. Connect any LLM, deploy on your infrastructure, own your data. Built for speed and control.",
  metadataBase: new URL("https://copilot-sdk.yourgpt.ai"),
  openGraph: {
    title: "Build AI Copilots for Your Product",
    description:
      "Production-ready AI Copilots for any product. Connect any LLM, deploy on your infrastructure, own your data. Built for speed and control.",
    siteName: "Copilot SDK",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build AI Copilots for Your Product",
    description:
      "Production-ready AI Copilots for any product. Connect any LLM, deploy on your infrastructure, own your data. Built for speed and control.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
