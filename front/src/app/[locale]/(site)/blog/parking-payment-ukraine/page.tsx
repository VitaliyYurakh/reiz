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
  const t = await getTranslations({ locale, namespace: "blogParkingPaymentUkraine" });

  const path = "/blog/parking-payment-ukraine";
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
          url: "/img/blog/parking.webp",
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

export default async function ParkingPaymentUkrainePage() {
  const t = await getTranslations("blogParkingPaymentUkraine");

  return (
    <article className="article-section__inner" aria-labelledby="article-title">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: "/blog", name: t("breadcrumbs.blog") },
          { href: "/blog/parking-payment-ukraine", name: t("breadcrumbs.current") },
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
          src="/img/blog/parking.webp"
          alt={t("hero_alt")}
          width={800}
          height={450}
          priority
        />
      </figure>

      <div className="article__content">
        <p>{t("intro.p1")}</p>
        <p>{t("intro.p2")}</p>

        <h2>{t("zones.title")}</h2>
        <p>{t("zones.intro")}</p>

        <h3>{t("zones.paid.title")}</h3>
        <p>{t("zones.paid.text")}</p>

        <h3>{t("zones.free.title")}</h3>
        <p>{t("zones.free.text")}</p>

        <h3>{t("zones.prohibited.title")}</h3>
        <p>{t("zones.prohibited.text")}</p>

        <h2>{t("payment_methods.title")}</h2>
        <p>{t("payment_methods.intro")}</p>

        <h3>{t("payment_methods.cash.title")}</h3>
        <p>{t("payment_methods.cash.text")}</p>
        <p><em>{t("payment_methods.cash.note")}</em></p>

        <h3>{t("payment_methods.sms.title")}</h3>
        <p>{t("payment_methods.sms.text")}</p>
        <p>{t("payment_methods.sms.example")}</p>

        <h3>{t("payment_methods.apps.title")}</h3>
        <p>{t("payment_methods.apps.text")}</p>
        <ul className="article__list">
          <li>{t("payment_methods.apps.list.item1")}</li>
          <li>{t("payment_methods.apps.list.item2")}</li>
          <li>{t("payment_methods.apps.list.item3")}</li>
          <li>{t("payment_methods.apps.list.item4")}</li>
        </ul>

        <h3>{t("payment_methods.parkomats.title")}</h3>
        <p>{t("payment_methods.parkomats.text")}</p>

        <h3>{t("payment_methods.card.title")}</h3>
        <p>{t("payment_methods.card.text")}</p>

        <h2>{t("evacuation.title")}</h2>
        <p>{t("evacuation.text")}</p>
        <ul className="article__list">
          <li>{t("evacuation.steps.step1")}</li>
          <li>{t("evacuation.steps.step2")}</li>
          <li>{t("evacuation.steps.step3")}</li>
          <li>{t("evacuation.steps.step4")}</li>
        </ul>
        <p><strong>{t("evacuation.rental_note")}</strong></p>

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
      </div>
    </article>
  );
}
