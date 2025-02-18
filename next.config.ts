import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

