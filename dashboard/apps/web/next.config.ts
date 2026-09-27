import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@auto-tags/shared-types'],
};

export default nextConfig;
