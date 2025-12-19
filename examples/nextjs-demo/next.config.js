/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@yourgpt/core',
    '@yourgpt/react',
    '@yourgpt/ui',
    '@yourgpt/runtime',
    '@yourgpt/knowledge',
  ],
};

module.exports = nextConfig;
