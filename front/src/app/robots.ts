import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
  return {
    rules: [
      {
        userAgent: ["AdsBot-Google", "AdsBot-Google-Mobile"],
        allow: "/",
      },
      // Explicit allow for AI search/answer engines so they can cite us
      // in ChatGPT, Claude, Perplexity, Gemini, Copilot answers.
      // Source: ai-seo skill (Princeton GEO study, KDD 2024).
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "Claude-Web",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bytespider",
          "Amazonbot",
          "DuckAssistBot",
        ],
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/auth", "/auth/login", "/auth/register"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Private areas
          "/admin",
          "/dashboard",
          "/api/auth",
          // Auth flow (login/register) — not useful in search
          "/auth/login",
          "/auth/register",
          "/ru/auth/login",
          "/ru/auth/register",
          "/en/auth/login",
          "/en/auth/register",
          "/pl/auth/login",
          "/pl/auth/register",
          "/ro/auth/login",
          "/ro/auth/register",
        ],
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
