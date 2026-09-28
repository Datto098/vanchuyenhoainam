import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@auto-tags/shared-types'],
  experimental: {
    // Use the compiler API directly; the CLI output parser is unreliable in
    // non-interactive/containerized production builds.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
