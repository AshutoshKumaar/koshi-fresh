import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Keep optimized remote and local images reusable without making mutable
    // source assets immutable at the CDN layer.
    minimumCacheTTL: 3600,
  },
  turbopack: {
    root: process.cwd(),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
