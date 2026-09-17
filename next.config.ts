import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Embed CSS into HTML so iPad/Safari still styles when /_next/static/*.css is blocked.
    inlineCss: true,
  },
};

export default nextConfig;
