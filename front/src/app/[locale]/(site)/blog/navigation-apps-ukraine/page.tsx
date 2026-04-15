import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type Locale, locales, defaultLocale, Link } from "@/i18n/request";
import { buildHreflangMap, OG_LOCALE, getOgAlternateLocales } from "@/i18n/locale-config";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import HomeIcon from "@/components/HomeIcon";
import UiImage from "@/components/ui/UiImage";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogNavigationAppsUkraine" });

  const path = "/blog/navigation-apps-ukraine";
  const canonical = `${BASE}${locale === defaultLocale ? "" : `/${locale}`}${path}`;
  const languages = buildHreflangMap(path, (p) => `${BASE}${p}`);
  const ogLocale = OG_LOCALE[locale];
  const ogAlternateLocales = getOgAlternateLocales(locale);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      type: "article",
      url: canonical,
      siteName: "REIZ",
      images: [
        {
          url: "/img/blog/NAV.webp",
          width: 1200,
          height: 630,
          alt: t("meta.og_title"),
        },
      ],
      locale: ogLocale,
      alternateLocale: ogAlternateLocales,
    },
  };
}

export default async function NavigationAppsUkrainePage() {
  const t = await getTranslations("blogNavigationAppsUkraine");

  return (
    <article className="article-section__inner" aria-labelledby="article-title">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: "/blog", name: t("breadcrumbs.blog") },
          { href: "/blog/navigation-apps-ukraine", name: t("breadcrumbs.current") },
        ]}
      />

      <nav className="article__breadcrumb" aria-label={t("breadcrumbs.nav_label")}>
        <Link href="/" className="article__breadcrumb-home"><HomeIcon className="breadcrumbs__home-icon" /><span className="breadcrumbs__home-text">{t("breadcrumbs.home")}</span></Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">&mdash;</span>
        <Link href="/blog" className="article__breadcrumb-parent">{t("breadcrumbs.blog")}</Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">&mdash;</span>
        <span className="article__breadcrumb-current" aria-current="page">{t("breadcrumbs.current")}</span>
      </nav>

      <h1 id="article-title" className="article__title">{t("title")}</h1>

      <figure className="article__hero-image">
        <UiImage
          src="/img/blog/NAV.webp"
          alt={t("hero_alt")}
          width={800}
          height={450}
          priority
        />
      </figure>

      <div className="article__content">
        <p>{t("intro.p1")}</p>
        <p>{t("intro.p2")}</p>

        <h2>{t("apps.google_maps.title")}</h2>
        <p>{t("apps.google_maps.description")}</p>
        <h3>{t("apps.google_maps.pros_title")}</h3>
        <ul className="article__list">
          <li>{t("apps.google_maps.pros.item1")}</li>
          <li>{t("apps.google_maps.pros.item2")}</li>
          <li>{t("apps.google_maps.pros.item3")}</li>
          <li>{t("apps.google_maps.pros.item4")}</li>
          <li>{t("apps.google_maps.pros.item5")}</li>
        </ul>
        <p><strong>{t("apps.google_maps.when")}</strong></p>

        <h2>{t("apps.waze.title")}</h2>
        <p>{t("apps.waze.description")}</p>
        <h3>{t("apps.waze.pros_title")}</h3>
        <ul className="article__list">
          <li>{t("apps.waze.pros.item1")}</li>
          <li>{t("apps.waze.pros.item2")}</li>
          <li>{t("apps.waze.pros.item3")}</li>
          <li>{t("apps.waze.pros.item4")}</li>
          <li>{t("apps.waze.pros.item5")}</li>
        </ul>
        <p><strong>{t("apps.waze.when")}</strong></p>

        <h2>{t("apps.apple_maps.title")}</h2>
        <p>{t("apps.apple_maps.description")}</p>
        <h3>{t("apps.apple_maps.pros_title")}</h3>
        <ul className="article__list">
          <li>{t("apps.apple_maps.pros.item1")}</li>
          <li>{t("apps.apple_maps.pros.item2")}</li>
          <li>{t("apps.apple_maps.pros.item3")}</li>
          <li>{t("apps.apple_maps.pros.item4")}</li>
        </ul>
        <p><strong>{t("apps.apple_maps.when")}</strong></p>

        <h2>{t("apps.two_gis.title")}</h2>
        <p>{t("apps.two_gis.description")}</p>
        <h3>{t("apps.two_gis.pros_title")}</h3>
        <ul className="article__list">
          <li>{t("apps.two_gis.pros.item1")}</li>
          <li>{t("apps.two_gis.pros.item2")}</li>
          <li>{t("apps.two_gis.pros.item3")}</li>
          <li>{t("apps.two_gis.pros.item4")}</li>
        </ul>
        <p><strong>{t("apps.two_gis.when")}</strong></p>

        <h2>{t("apps.osmand.title")}</h2>
        <p>{t("apps.osmand.description")}</p>
        <h3>{t("apps.osmand.pros_title")}</h3>
        <ul className="article__list">
          <li>{t("apps.osmand.pros.item1")}</li>
          <li>{t("apps.osmand.pros.item2")}</li>
          <li>{t("apps.osmand.pros.item3")}</li>
          <li>{t("apps.osmand.pros.item4")}</li>
        </ul>
        <p><strong>{t("apps.osmand.when")}</strong></p>

        <h2>{t("comparison.title")}</h2>
        <p>{t("comparison.intro")}</p>
        <ul className="article__list">
          <li>{t("comparison.list.item1")}</li>
          <li>{t("comparison.list.item2")}</li>
          <li>{t("comparison.list.item3")}</li>
          <li>{t("comparison.list.item4")}</li>
          <li>{t("comparison.list.item5")}</li>
        </ul>

        <h2>{t("tourist_tips.title")}</h2>
        <p>{t("tourist_tips.intro")}</p>
        <ul className="article__list">
          <li>{t("tourist_tips.list.item1")}</li>
          <li>{t("tourist_tips.list.item2")}</li>
          <li>{t("tourist_tips.list.item3")}</li>
          <li>{t("tourist_tips.list.item4")}</li>
          <li>{t("tourist_tips.list.item5")}</li>
        </ul>

        <div className="article__rental-box">
          <strong>{t("rental_box.title")}</strong>
          <p>{t("rental_box.text")}</p>
        </div>

        <h2>{t("conclusion.title")}</h2>
        <p>{t("conclusion.p1")}</p>
        <p>{t("conclusion.p2")}</p>
      </div>
    </article>
  );
}
