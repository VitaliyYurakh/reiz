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
  const t = await getTranslations({ locale, namespace: "blogUkraineRoadTrip" });

  const path = "/blog/ukraine-road-trip";
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
          url: "/img/blog/Ukraineblog.webp",
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

export default async function UkraineRoadTripPage() {
  const t = await getTranslations("blogUkraineRoadTrip");

  const routes = ["route1", "route2", "route3", "route4", "route5"] as const;

  return (
    <article className="article-section__inner" aria-labelledby="article-title">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: "/blog", name: t("breadcrumbs.blog") },
          { href: "/blog/ukraine-road-trip", name: t("breadcrumbs.current") },
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
          src="/img/blog/Ukraineblog.webp"
          alt={t("hero_alt")}
          width={800}
          height={450}
          priority
        />
      </figure>

      <div className="article__content">
        <p>{t("intro.p1")}</p>
        <p>{t("intro.p2")}</p>
        <p>{t("intro.p3")}</p>

        {routes.map((r) => (
          <section key={r}>
            <h2>{t(`routes.${r}.title`)}</h2>
            <p><strong>{t(`routes.${r}.locations`)}</strong> {t(`routes.${r}.vibe`)}</p>
            <p>{t(`routes.${r}.p1`)}</p>

            <h3>{t(`routes.${r}.insight_title`)}</h3>
            <p>{t(`routes.${r}.insight_time`)}</p>
            <p>{t(`routes.${r}.why_car`)}</p>

            <div className="article__rental-box">
              <strong>{t(`routes.${r}.rental_title`)}</strong>
              <p>{t(`routes.${r}.rental_text`)}</p>
            </div>
          </section>
        ))}

        <h2>{t("tips.title")}</h2>
        <p>{t("tips.intro")}</p>
        <ul className="article__list">
          <li>{t("tips.list.item1")}</li>
          <li>{t("tips.list.item2")}</li>
          <li>{t("tips.list.item3")}</li>
          <li>{t("tips.list.item4")}</li>
          <li>{t("tips.list.item5")}</li>
        </ul>

        <div className="article__rental-box">
          <strong>{t("rental_box.title")}</strong>
          <p>{t("rental_box.text")}</p>
        </div>

        <h2>{t("conclusion.title")}</h2>
        <p>{t("conclusion.p1")}</p>
        <p>{t("conclusion.p2")}</p>

        <Link href="/" className="main-button">
          {t("conclusion.cta")}
        </Link>
      </div>
    </article>
  );
}
