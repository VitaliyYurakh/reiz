import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type Locale, locales, defaultLocale, Link } from "@/i18n/request";
import { buildHreflangMap, OG_LOCALE, getOgAlternateLocales } from "@/i18n/locale-config";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import UiImage from "@/components/ui/UiImage";
import ArticleFaq from "./ArticleFaq";

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
  const t = await getTranslations({ locale, namespace: "blogDtpUkraine" });

  const path = "/blog/dtp-ukraine";
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
          url: "/img/blog/road%20accidentua.webp",
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

export default async function DtpUkrainePage() {
  const t = await getTranslations("blogDtpUkraine");

  const faqItems = [
    { title: t("faq.q1.question"), content: t("faq.q1.answer") },
    { title: t("faq.q2.question"), content: t("faq.q2.answer") },
    { title: t("faq.q3.question"), content: t("faq.q3.answer") },
    { title: t("faq.q4.question"), content: t("faq.q4.answer") },
  ];

  return (
    <article className="article-section__inner" aria-labelledby="article-title">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: "/blog", name: t("breadcrumbs.blog") },
          { href: "/blog/dtp-ukraine", name: t("breadcrumbs.current") },
        ]}
      />

      <nav className="article__breadcrumb" aria-label={t("breadcrumbs.nav_label")}>
        <Link href="/" className="article__breadcrumb-home">{t("breadcrumbs.home")}</Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">&mdash;</span>
        <Link href="/blog" className="article__breadcrumb-parent">{t("breadcrumbs.blog")}</Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">&mdash;</span>
        <span className="article__breadcrumb-current" aria-current="page">{t("breadcrumbs.current")}</span>
      </nav>

      <h1 id="article-title" className="article__title">{t("title")}</h1>

      <figure className="article__hero-image">
        <UiImage
          src="/img/blog/road%20accidentua.webp"
          alt={t("hero_alt")}
          width={800}
          height={450}
          priority
        />
      </figure>

      <div className="article__content">
        <p>{t("intro")}</p>

        {/* 1. Stop the car */}
        <h2>{t("steps.step1.title")}</h2>
        <p>{t("steps.step1.text")}</p>
        <ul className="article__list">
          <li>{t("steps.step1.list.item1")}</li>
          <li>{t("steps.step1.list.item2")}</li>
          <li>{t("steps.step1.list.item3")}</li>
        </ul>
        <p>{t("steps.step1.note")}</p>

        {/* 2. Check for injuries */}
        <h2>{t("steps.step2.title")}</h2>
        <p>{t("steps.step2.text")}</p>
        <p>{t("steps.step2.if_injured")}</p>
        <ul className="article__list">
          <li>{t("steps.step2.list.item1")}</li>
          <li>{t("steps.step2.list.item2")}</li>
          <li>{t("steps.step2.list.item3")}</li>
        </ul>
        <p><strong>{t("steps.step2.remember")}</strong></p>

        {/* 3. Warning triangle */}
        <h2>{t("steps.step3.title")}</h2>
        <p>{t("steps.step3.text")}</p>
        <ul className="article__list">
          <li>{t("steps.step3.list.item1")}</li>
          <li>{t("steps.step3.list.item2")}</li>
        </ul>
        <p>{t("steps.step3.note")}</p>

        {/* 4. Police or European protocol */}
        <h2>{t("steps.step4.title")}</h2>
        <p>{t("steps.step4.text")}</p>

        <h3>{t("steps.step4.police.title")}</h3>
        <p>{t("steps.step4.police.text")}</p>
        <ul className="article__list">
          <li>{t("steps.step4.police.list.item1")}</li>
          <li>{t("steps.step4.police.list.item2")}</li>
          <li>{t("steps.step4.police.list.item3")}</li>
          <li>{t("steps.step4.police.list.item4")}</li>
          <li>{t("steps.step4.police.list.item5")}</li>
        </ul>
        <p>{t("steps.step4.police.phone")}</p>

        <h3>{t("steps.step4.euro.title")}</h3>
        <p>{t("steps.step4.euro.text")}</p>
        <p>{t("steps.step4.euro.conditions")}</p>
        <ul className="article__list">
          <li>{t("steps.step4.euro.list.item1")}</li>
          <li>{t("steps.step4.euro.list.item2")}</li>
          <li>{t("steps.step4.euro.list.item3")}</li>
          <li>{t("steps.step4.euro.list.item4")}</li>
        </ul>
        <p>{t("steps.step4.euro.fill")}</p>
        <ul className="article__list">
          <li>{t("steps.step4.euro.fill_list.item1")}</li>
          <li>{t("steps.step4.euro.fill_list.item2")}</li>
        </ul>

        {/* 5. Document the scene */}
        <h2>{t("steps.step5.title")}</h2>
        <p>{t("steps.step5.text")}</p>
        <p>{t("steps.step5.recommend")}</p>
        <ul className="article__list">
          <li>{t("steps.step5.list.item1")}</li>
          <li>{t("steps.step5.list.item2")}</li>
          <li>{t("steps.step5.list.item3")}</li>
          <li>{t("steps.step5.list.item4")}</li>
          <li>{t("steps.step5.list.item5")}</li>
          <li>{t("steps.step5.list.item6")}</li>
        </ul>
        <p>{t("steps.step5.note")}</p>

        {/* 6. Exchange data */}
        <h2>{t("steps.step6.title")}</h2>
        <p>{t("steps.step6.text")}</p>
        <ul className="article__list">
          <li>{t("steps.step6.list.item1")}</li>
          <li>{t("steps.step6.list.item2")}</li>
          <li>{t("steps.step6.list.item3")}</li>
          <li>{t("steps.step6.list.item4")}</li>
          <li>{t("steps.step6.list.item5")}</li>
        </ul>
        <p>{t("steps.step6.photo_text")}</p>
        <ul className="article__list">
          <li>{t("steps.step6.photo_list.item1")}</li>
          <li>{t("steps.step6.photo_list.item2")}</li>
          <li>{t("steps.step6.photo_list.item3")}</li>
        </ul>

        {/* 7. Notify insurance */}
        <h2>{t("steps.step7.title")}</h2>
        <p>{t("steps.step7.text")}</p>
        <p>{t("steps.step7.prepare")}</p>
        <ul className="article__list">
          <li>{t("steps.step7.list.item1")}</li>
          <li>{t("steps.step7.list.item2")}</li>
          <li>{t("steps.step7.list.item3")}</li>
          <li>{t("steps.step7.list.item4")}</li>
        </ul>

        {/* 8. Rental car */}
        <h2>{t("steps.step8.title")}</h2>
        <p>{t("steps.step8.text")}</p>
        <ul className="article__list">
          <li>{t("steps.step8.list.item1")}</li>
          <li>{t("steps.step8.list.item2")}</li>
          <li>{t("steps.step8.list.item3")}</li>
          <li>{t("steps.step8.list.item4")}</li>
        </ul>
        <div className="article__rental-box">
          <strong>{t("steps.step8.reiz_title")}</strong>
          <p>{t("steps.step8.reiz_text1")}</p>
          <p>{t("steps.step8.reiz_text2")}</p>
          <p>{t("steps.step8.reiz_text3")}</p>
        </div>
        <Link href="/insurance" className="main-button">
          {t("steps.step8.insurance_link")}
        </Link>

        {/* Emergency phones */}
        <h2>{t("phones.title")}</h2>
        <p>{t("phones.text")}</p>
        <ul className="article__list">
          <li>{t("phones.list.item1")}</li>
          <li>{t("phones.list.item2")}</li>
          <li>{t("phones.list.item3")}</li>
          <li>{t("phones.list.item4")}</li>
        </ul>

        {/* Conclusion */}
        <h2>{t("conclusion.title")}</h2>
        <p>{t("conclusion.p1")}</p>
        <p>{t("conclusion.p2")}</p>

        {/* FAQ */}
        <h2>{t("faq.title")}</h2>
        <ArticleFaq items={faqItems} />
      </div>
    </article>
  );
}
