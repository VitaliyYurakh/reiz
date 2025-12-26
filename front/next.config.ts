import withAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Device widths for responsive srcset generation
    // Optimized for performance - removed excessive sizes
    deviceSizes: [640, 750, 1080, 1200, 1920, 2560],
    // Image widths for fixed-size images (icons, thumbnails, cards)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Modern formats with fallback
    formats: ["image/avif", "image/webp"],
    // Minimize layout shift - cache for 1 year
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  // Cache-Control headers for static assets
  async headers() {
    return [
      {
        // Images - cache for 1 year
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Fonts - cache for 1 year
        source: "/:all*(woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // JS/CSS chunks - cache for 1 year (they have hashes)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "json",
  openAnalyzer: true,
})(withNextIntl(nextConfig));
