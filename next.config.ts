import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // /portfolio was the v1 route; the work index replaces it.
      { source: "/portfolio", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
