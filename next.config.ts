import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Serve AVIF first (smallest), fall back to WebP — both far smaller than JPEG
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 30 days in the browser
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Include the thumbnail size so Next.js pre-generates it
    imageSizes: [16, 32, 48, 64, 96, 128, 148, 256, 384],
  },
};

export default nextConfig;
