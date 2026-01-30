import { createMDX } from 'fumadocs-mdx/next';

// Playground deployment URL - update this after deploying the playground
const PLAYGROUND_URL = process.env.PLAYGROUND_URL || 'https://copilot-sdk-playground.vercel.app';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/playground',
        destination: `${PLAYGROUND_URL}/playground`,
      },
      {
        source: '/playground/:path*',
        destination: `${PLAYGROUND_URL}/playground/:path*`,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(config);
