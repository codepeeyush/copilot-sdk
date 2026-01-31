import { createMDX } from "fumadocs-mdx/next";

// Playground deployment URL - update this after deploying the playground
const PLAYGROUND_URL = process.env.PLAYGROUND_URL || "https://copilot-playground-git-delta4-infotech.vercel.app";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Playground proxy
      {
        source: "/playground",
        destination: `${PLAYGROUND_URL}/playground`,
      },
      {
        source: "/playground/:path*",
        destination: `${PLAYGROUND_URL}/playground/:path*`,
      },
      // MDX route for LLM features (e.g., /docs/quickstart.mdx -> /llms.mdx/docs/quickstart)
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(config);
