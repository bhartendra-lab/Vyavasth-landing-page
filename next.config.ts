import type { NextConfig } from "next";

// Blog pages and the sitemap render per request (so posts go live on their
// date), but the edge may serve a cached copy for an hour.
const BLOG_CACHE_CONTROL =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    const headers = [{ key: "Cache-Control", value: BLOG_CACHE_CONTROL }];
    return [
      { source: "/blog", headers },
      { source: "/blog/:path*", headers },
      { source: "/sitemap.xml", headers },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
