import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy blog & sitemap from store.kizento.com for pre-launch SEO
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "https://store.kizento.com/blog",
      },
      {
        source: "/blog/:path*",
        destination: "https://store.kizento.com/blog/:path*",
      },
    ]
  },
};

export default nextConfig;
