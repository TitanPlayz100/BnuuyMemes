import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://r2-videos.cloudflarebnuuy.workers.dev/*')]
  }
};

export default nextConfig;
