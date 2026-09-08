import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.GITHUB_PAGES_BUILD === '1'
  ? { output: 'export' }
  : {};

export default nextConfig;
