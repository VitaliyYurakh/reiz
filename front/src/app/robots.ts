import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Deleted/non-existent car pages
        "/cars/1-bmw-x3-2023",
        "/ru/cars/1-bmw-x3-2023",
        "/en/cars/1-bmw-x3-2023",
        "/cars/5-1111-232323-7777",
        "/ru/cars/5-1111-232323-7777",
        "/en/cars/5-1111-232323-7777",
      ],
    },
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
