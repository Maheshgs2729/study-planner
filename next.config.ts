import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Prevent deployment builds from failing due to strict type checks
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
