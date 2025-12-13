import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [],
    // TODO: UNCOMMENT FOR PROD
    // sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
