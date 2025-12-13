import { Link } from "@/i18n/request";

type Crumb = { name?: string; href: string };
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://reiz.com.ua/";

const abs = (p: string) => new URL(p, siteUrl).toString();

export default function Breadcrumbs({
  items,
  mode = "both",
}: {
  items: Crumb[];
  mode?: "both" | "JsonLd" | "ui";
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.href),
    })),
  };

  if (items.length === 0 || items.some((it) => !it.name)) {
    return null;
  }

  return (
    <>
      {mode === "ui" ||
        (mode === "both" && (
          <ul className="breadcrumbs">
            {items.map((it, i) => (
              <li key={it.name}>
                {i < items.length - 1 ? (
                  <Link href={it.href}>{it.name}</Link>
                ) : (
                  it.name
                )}
              </li>
            ))}
          </ul>
        ))}
      {mode === "JsonLd" ||
        (mode === "both" && (
          <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: schema
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
    </>
  );
}
