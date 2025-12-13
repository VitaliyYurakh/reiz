import withAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
};

const withNextIntl = createNextIntlPlugin();

export default withAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "json",
  openAnalyzer: true,
})(withNextIntl(nextConfig));
