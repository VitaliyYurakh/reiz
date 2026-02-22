import withAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Disable client-side Router Cache in dev for instant updates
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.reiz.com.ua",
          },
        ],
        destination: "https://reiz.com.ua/:path*",
        permanent: true,
      },
      // Legacy /uk/ URLs → root (Ukrainian is default locale at /)
      {
        source: "/uk/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    // Device widths for responsive srcset generation
    // Optimized for performance - removed excessive sizes
    deviceSizes: [640, 750, 1080, 1200, 1920, 2560],
    // Image widths for fixed-size images (icons, thumbnails, cards)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Modern formats with fallback
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reiz.com.ua",
        pathname: "/static/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/static/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/static/**",
      },
    ],
    // Minimize layout shift - cache for 1 year
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  // Cache-Control and security headers
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";

    // Security headers - only strict CSP in production
    const securityHeaders = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-XSS-Protection",
        value: "0",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
    ];

    // Add HSTS and CSP only in production (HTTPS required)
    if (isProduction) {
      securityHeaders.push(
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://connect.facebook.net",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com https://reiz.com.ua",
            "font-src 'self' data:",
            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://grwapi.net https://*.grwapi.net https://reiz.com.ua https://connect.facebook.net https://www.facebook.com",
            "frame-src 'self' https://www.googletagmanager.com https://www.facebook.com https://td.doubleclick.net https://www.google.com",
            "worker-src 'self'",
            "child-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "upgrade-insecure-requests",
          ].join("; "),
        }
      );
    }

    const headers = [
      {
        // Security headers for all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];

    // Cache headers only in production — in dev they block HMR
    if (isProduction) {
      headers.push(
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
      );
    }

    return headers;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "json",
  openAnalyzer: true,
})(withNextIntl(nextConfig));
