import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Necesar pentru GitHub Pages
  images: {
    unoptimized: true, // Necesar pentru export static
    domains: ['localhost'],
  },
  basePath: process.env.NODE_ENV === 'production' 
    ? '/form-tma'    // Numele repository-ului tău
    : '',
  assetPrefix: process.env.NODE_ENV === 'production'
    ? '/form-tma/'   // Numele repository-ului tău
    : '',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;