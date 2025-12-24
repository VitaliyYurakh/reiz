import withAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Device widths for responsive srcset generation
    // Covers: mobile, tablet, laptop (1080p), desktop (2K), high-end (4K)
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 3840],
    // Image widths for fixed-size images (icons, thumbnails, cards)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // Modern formats with fallback
    formats: ["image/avif", "image/webp"],
    // Minimize layout shift
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

const withNextIntl = createNextIntlPlugin();

export default withAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "json",
  openAnalyzer: true,
})(withNextIntl(nextConfig));
