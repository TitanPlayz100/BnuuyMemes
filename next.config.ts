import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://red-snowflake-00b4.cloudflarehost1.workers.dev/*')]
  }
};

export default nextConfig;
