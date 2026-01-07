import UiImage from "@/components/ui/UiImage";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/request";
import type { Metadata } from "next";
import { getDefaultPath, getPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";

type Post = {
  title: string;
  excerpt: string;
  date: string;
  cta: string;
  imgAlt: string;
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = (await params).locale;
  return getPageMetadata({
    routeKey: "blog",
    ns: "blogPage",
    locale,
  });
}

export default async function BlogPage() {
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

      {/* 1. Breadcrumb line */}
      <div
        className="cert__breadcrumb"
        data-aos="fade-up"
        data-aos-duration={800}
      >
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("pretitle")}</span>
      </div>

      {/* 2. Hero */}
      <div
        className="cert__hero"
        data-aos="fade-up"
        data-aos-duration={800}
        data-aos-delay={100}
      >
        <h1 className="cert__hero-title">
          {t("hero.title")}
        </h1>
        <p className="cert__hero-subtitle">
          {t("hero.subtitle")}
        </p>
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
              <div className="blog-card__image">
                <UiImage
                  width={474}
                  height={251}
                  src={`/img/blog/img${idx + 1}.png`}
                  alt={post.imgAlt}
                  sizePreset="card"
                />
              </div>

              <div className="blog-card__box">
                <h2 className="blog-card__title">
                  <span>{post.title}</span>
                </h2>

                <p>{post.excerpt}</p>

                <div className="blog-card__bottom">
                  <span className="blog-card__date">{post.date}</span>
                  <a href="#" className="main-button">
                    {post.cta}
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
