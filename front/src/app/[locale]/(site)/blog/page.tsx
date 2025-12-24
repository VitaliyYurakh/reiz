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
    <div
      className="blog-section__inner"
      data-aos="fade-left"
      data-aos-duration={900}
      data-aos-delay={600}
    >
      <h2 className="pretitle">{t("pretitle")}</h2>

      <Breadcrumbs
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("blog"), name: t("breadcrumbs.current") },
        ]}
      />

      <h1 className="main-title">{t("mainTitle")}</h1>

      <ul className="blog-list">
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
