import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import HomeIcon from "@/components/HomeIcon";
import UiImage from "@/components/ui/UiImage";
import { Link, type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";

type Post = {
  title: string;
  excerpt: string;
  date: string;
  imgAlt: string;
  image?: string;
  slug?: string;
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
  return getStaticPageMetadata("blogPage", locale);
}

export default async function BlogPage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("blogPage");
  const posts = t.raw("posts") as Post[];

  return (
    <div className="blog-section__inner">
      {/* JSON-LD Breadcrumbs */}
      <Breadcrumbs
        mode={"JsonLd"}
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("blog"), name: t("breadcrumbs.current") },
        ]}
      />

      <div className="blog-hero-group">
        <div className="blog-hero-top">
          <div className="blog-hero-content">
            <nav
              className="blog-mobile-breadcrumbs"
              aria-label={t("breadcrumbs.current")}
            >
              <Link
                href={getDefaultPath("home")}
                className="blog-mobile-breadcrumbs__link blog-mobile-breadcrumbs__home"
              >
                <HomeIcon />
              </Link>
              <span className="blog-mobile-breadcrumbs__dot" />
              <span className="blog-mobile-breadcrumbs__current">
                {t("breadcrumbs.current")}
              </span>
            </nav>

            {/* Hero */}
            <div
              className="blog-hero"
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-delay={100}
            >
              <h1 className="blog-hero__title">{t("hero.title")}</h1>
              <p className="blog-hero__subtitle">{t("hero.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Blog posts list */}
      <ul
        className="blog-list"
        data-aos="fade-up"
        data-aos-duration={800}
        data-aos-delay={200}
      >
        {posts.map((post, idx) => (
          <li className="blog-list__item" key={post.title}>
            <div className="blog-card">
              {post.slug ? (
                <Link href={`/blog/${post.slug}`} className="blog-card__image">
                  <UiImage
                    width={474}
                    height={251}
                    src={post.image || `/img/blog/img${idx + 1}.png`}
                    alt={post.imgAlt}
                    sizePreset="card"
                  />
                </Link>
              ) : (
                <div className="blog-card__image">
                  <UiImage
                    width={474}
                    height={251}
                    src={post.image || `/img/blog/img${idx + 1}.png`}
                    alt={post.imgAlt}
                    sizePreset="card"
                  />
                </div>
              )}

              <div className="blog-card__box">
                <h2 className="blog-card__title">
                  {post.slug ? (
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  ) : (
                    <span>{post.title}</span>
                  )}
                </h2>

                <p>{post.excerpt}</p>

                <div className="blog-card__bottom">
                  <span className="blog-card__date">{post.date}</span>
                  {post.slug ? (
                    <Link href={`/blog/${post.slug}`} className="main-button">
                      {t("cta.readArticle")}
                    </Link>
                  ) : (
                    <button type="button" className="main-button" disabled>
                      {t("cta.readArticle")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
