import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enforce React's strict mode (optional but recommended)
  swcMinify: true, // Enable SWC for faster builds
  images: {
    domains: ["images.unsplash.com"], // Allow external images from unsplash
  },
  // Add additional configuration options as needed
};

export default nextConfig;
