import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import HomeIcon from "@/components/HomeIcon";
import JsonLd from "@/components/JsonLd";
import UiImage from "@/components/ui/UiImage";
import {
  buildHreflangMap,
  getOgAlternateLocales,
  OG_LOCALE,
} from "@/i18n/locale-config";
import { defaultLocale, Link, type Locale, locales } from "@/i18n/request";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
const PATH = "/blog/long-term-car-rental-ukraine";
const IMAGE = "/img/blog/parking-payment-clean.webp";

type Section = {
  title: string;
  text: string;
  list?: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "blogLongTermCarRentalUkraine",
  });

  const canonical = `${BASE}${locale === defaultLocale ? "" : `/${locale}`}${PATH}`;
  const languages = buildHreflangMap(PATH, (p) => `${BASE}${p}`);

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
          url: IMAGE,
          width: 1200,
          height: 630,
          alt: t("meta.og_title"),
        },
      ],
      locale: OG_LOCALE[locale],
      alternateLocale: getOgAlternateLocales(locale),
    },
  };
}

export default async function LongTermCarRentalUkrainePage() {
  const t = await getTranslations("blogLongTermCarRentalUkraine");
  const intro = t.raw("intro") as string[];
  const quickItems = t.raw("quick_take.items") as string[];
  const sections = t.raw("sections") as Section[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    description: t("meta.description"),
    image: `${BASE}${IMAGE}`,
    author: {
      "@type": "Organization",
      name: "REIZ",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "REIZ",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/favicon-192.png`,
      },
    },
    mainEntityOfPage: `${BASE}${PATH}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <article className="article-section__inner" aria-labelledby="article-title">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />

      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: "/blog", name: t("breadcrumbs.blog") },
          { href: PATH, name: t("breadcrumbs.current") },
        ]}
      />

      <nav className="article__breadcrumb" aria-label={t("breadcrumbs.nav_label")}>
        <Link href="/" className="article__breadcrumb-home">
          <HomeIcon className="breadcrumbs__home-icon" />
          <span className="breadcrumbs__home-text">{t("breadcrumbs.home")}</span>
        </Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">
          &mdash;
        </span>
        <Link href="/blog" className="article__breadcrumb-parent">
          {t("breadcrumbs.blog")}
        </Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">
          &mdash;
        </span>
        <span className="article__breadcrumb-current" aria-current="page">
          {t("breadcrumbs.current")}
        </span>
      </nav>

      <h1 id="article-title" className="article__title">
        {t("title")}
      </h1>

      <figure className="article__hero-image">
        <UiImage
          src={IMAGE}
          alt={t("hero_alt")}
          width={800}
          height={450}
          priority
        />
      </figure>

      <div className="article__content">
        {intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <div className="article__rental-box">
          <strong>{t("quick_take.title")}</strong>
          <ul className="article__list">
            {quickItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
            {section.list ? (
              <ul className="article__list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <div className="article__rental-box">
          <strong>{t("rental_box.title")}</strong>
          <p>{t("rental_box.text")}</p>
          <Link href="/#catalog" className="main-button">
            {t("rental_box.cta")}
          </Link>
        </div>

        <h2>{t("faq.title")}</h2>
        {faqItems.map((item) => (
          <section key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </section>
        ))}

        <h2>{t("conclusion.title")}</h2>
        <p>{t("conclusion.p1")}</p>
        <p>{t("conclusion.p2")}</p>
      </div>
    </article>
  );
}
