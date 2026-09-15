import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // One quality for the whole site, above the default 75: the work is
    // photographic and the thumbnails are the product.
    qualities: [90],
  },
  async redirects() {
    return [
      // /portfolio was the v1 route; the work index replaces it.
      { source: "/portfolio", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
