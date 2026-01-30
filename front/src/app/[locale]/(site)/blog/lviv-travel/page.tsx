import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type Locale, locales, Link } from "@/i18n/request";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import UiImage from "@/components/ui/UiImage";
import CastleGallery from "./CastleGallery";
import RouteSlider from "./RouteSlider";
import PhotoCollage from "./PhotoCollage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogLvivTravel" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      type: "article",
      images: [
        {
          url: "/img/blog/synevir-lake.webp",
          width: 1200,
          height: 630,
          alt: t("meta.og_title"),
        },
      ],
    },
  };
}

export default async function LvivTravelPage() {
  const t = await getTranslations("blogLvivTravel");

  return (
    <article className="article-section__inner" aria-labelledby="article-title">
      {/* Breadcrumbs */}
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: "/blog", name: t("breadcrumbs.blog") },
          { href: "/blog/lviv-travel", name: t("breadcrumbs.current") },
        ]}
      />

      {/* Breadcrumb line */}
      <nav className="article__breadcrumb" aria-label={t("breadcrumbs.nav_label")}>
        <Link href="/" className="article__breadcrumb-home">{t("breadcrumbs.home")}</Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">&mdash;</span>
        <Link href="/blog" className="article__breadcrumb-parent">{t("breadcrumbs.blog")}</Link>
        <span className="article__breadcrumb-sep" aria-hidden="true">&mdash;</span>
        <span className="article__breadcrumb-current" aria-current="page">{t("breadcrumbs.current")}</span>
      </nav>

      {/* Article Title */}
      <h1 id="article-title" className="article__title">{t("title")}</h1>

      {/* Hero Image Container */}
      <figure className="article__hero-image">
        <UiImage
          src="/img/blog/synevir-lake.webp"
          alt={t("hero_alt")}
          width={800}
          height={450}
          priority
        />
      </figure>

      {/* Article Content */}
      <div className="article__content">
        <p>{t("intro.p1")}</p>
        <p>{t("intro.p2")}</p>
        <p>{t("intro.p3")}</p>

        {/* Route 1: Golden Horseshoe */}
        <h2>{t("routes.route1.title")}</h2>
        <p><strong>{t("routes.route1.locations")}</strong> {t("routes.route1.vibe")}</p>
        <p>{t("routes.route1.p1")}</p>

        {/* Castle Gallery */}
        <CastleGallery
          castles={[
            {
              id: "olesky",
              name: t("routes.route1.castles.olesky"),
              images: [
                "/img/blog/olesky-1.webp",
                "/img/blog/olesky-2.webp",
                "/img/blog/olesky-3.webp",
                "/img/blog/olesky-4.webp",
              ],
            },
            {
              id: "pidhirtsi",
              name: t("routes.route1.castles.pidhirtsi"),
              images: [
                "/img/blog/pidhirtsi-1.webp",
                "/img/blog/pidhirtsi-2.webp",
                "/img/blog/pidhirtsi-3.webp",
                "/img/blog/pidhirtsi-4.webp",
              ],
            },
            {
              id: "zolochiv",
              name: t("routes.route1.castles.zolochiv"),
              images: [
                "/img/blog/zolochiv-1.webp",
                "/img/blog/zolochiv-2.webp",
                "/img/blog/zolochiv-3.webp",
                "/img/blog/zolochiv-4.webp",
              ],
            },
          ]}
        />

        {/* Location buttons */}
        <nav className="article__locations" aria-label={t("locations_aria")}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Олеський+замок"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route1.castles.olesky")} — Google Maps`}
          >
            {t("routes.route1.castles.olesky")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Підгорецький+замок"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route1.castles.pidhirtsi")} — Google Maps`}
          >
            {t("routes.route1.castles.pidhirtsi")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Золочівський+замок"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route1.castles.zolochiv")} — Google Maps`}
          >
            {t("routes.route1.castles.zolochiv")}
          </a>
        </nav>

        <h3>{t("routes.route1.insight_title")}</h3>
        <p>{t("routes.route1.insight_time")}</p>
        <p>{t("routes.route1.insight_angle")}</p>
        <p>{t("routes.route1.why_car")}</p>
        <div className="article__rental-box">
          <strong>{t("routes.route1.rental_title")}</strong>
          <p>{t("routes.route1.rental_text")}</p>
        </div>

        {/* Route 2: Tustan */}
        <h2>{t("routes.route2.title")}</h2>
        <div className="article__image">
          <UiImage
            src="/img/blog/tustan-fortress.webp"
            alt={t("routes.route2.image_alt")}
            width={800}
            height={450}
          />
        </div>
        <p><strong>{t("routes.route2.locations")}</strong> {t("routes.route2.vibe")}</p>
        <p>{t("routes.route2.p1")}</p>

        {/* Location buttons */}
        <nav className="article__locations" aria-label={t("locations_aria")}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Тустань+Урич"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route2.locations_btn.tustan")} — Google Maps`}
          >
            {t("routes.route2.locations_btn.tustan")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Водоспад+Кам'янка+Урич"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route2.locations_btn.waterfall")} — Google Maps`}
          >
            {t("routes.route2.locations_btn.waterfall")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Журавлине+озеро+Урич"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route2.locations_btn.lake")} — Google Maps`}
          >
            {t("routes.route2.locations_btn.lake")}
          </a>
        </nav>

        <h3>{t("routes.route2.insight_title")}</h3>
        <p>{t("routes.route2.insight_timing")}</p>
        <p>{t("routes.route2.insight_gastro")}</p>
        <p>{t("routes.route2.why_car")}</p>
        <div className="article__rental-box">
          <strong>{t("routes.route2.rental_title")}</strong>
          <p>{t("routes.route2.rental_turbo")}</p>
          <p>{t("routes.route2.rental_relax")}</p>
        </div>

        {/* Route 3: Tarakaniv Fort */}
        <h2>{t("routes.route3.title")}</h2>
        <p><strong>{t("routes.route3.locations")}</strong> {t("routes.route3.vibe")}</p>
        <p>{t("routes.route3.p1")}</p>

        {/* Tarakaniv Fort Photo Collage */}
        <PhotoCollage
          images={[
            "/img/blog/tarakaniv-1.webp",
            "/img/blog/tarakaniv-2.webp",
            "/img/blog/tarakaniv-3.webp",
            "/img/blog/tarakaniv-4.webp",
            "/img/blog/tarakaniv-5.webp",
            "/img/blog/tarakaniv-6.webp",
          ]}
          alt={t("routes.route3.title")}
        />

        {/* Location buttons */}
        <nav className="article__locations" aria-label={t("locations_aria")}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Тараканівський+форт"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route3.locations_btn.fort")} — Google Maps`}
          >
            {t("routes.route3.locations_btn.fort")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Замок+Любарта+Луцьк"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route3.locations_btn.lubart")} — Google Maps`}
          >
            {t("routes.route3.locations_btn.lubart")}
          </a>
        </nav>

        <h3>{t("routes.route3.insight_title")}</h3>
        <p>{t("routes.route3.insight_time")}</p>
        <p>{t("routes.route3.insight_bring")}</p>
        <p>{t("routes.route3.why_car")}</p>
        <div className="article__rental-box">
          <strong>{t("routes.route3.rental_title")}</strong>
          <p>{t("routes.route3.rental_text")}</p>
        </div>

        {/* Route 4: Carpathians Road-trip */}
        <h2>{t("routes.route4.title")}</h2>
        <p><strong>{t("routes.route4.locations")}</strong> {t("routes.route4.vibe")}</p>
        <p>{t("routes.route4.p1")}</p>

        {/* Carpathians Slider */}
        <RouteSlider
          images={[
            "/img/blog/synevir.webp",
            "/img/blog/shypit.webp",
          ]}
          alt={t("routes.route4.title")}
        />

        {/* Location buttons */}
        <nav className="article__locations" aria-label={t("locations_aria")}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Озеро+Синевир"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route4.locations_btn.synevir")} — Google Maps`}
          >
            {t("routes.route4.locations_btn.synevir")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Водоспад+Шипіт"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route4.locations_btn.shypit")} — Google Maps`}
          >
            {t("routes.route4.locations_btn.shypit")}
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Центр+реабілітації+бурих+ведмедів+Синевир"
            target="_blank"
            rel="noopener noreferrer"
            className="article__location-btn"
            title={`${t("routes.route4.locations_btn.bears")} — Google Maps`}
          >
            {t("routes.route4.locations_btn.bears")}
          </a>
        </nav>

        <h3>{t("routes.route4.insight_title")}</h3>
        <p>{t("routes.route4.insight_fog")}</p>
        <p>{t("routes.route4.why_car")}</p>
        <div className="article__rental-box">
          <strong>{t("routes.route4.rental_title")}</strong>
          <p>{t("routes.route4.rental_text")}</p>
        </div>

        {/* Conclusion */}
        <h2>{t("conclusion.title")}</h2>
        <p>{t("conclusion.p1")}</p>
        <ul className="article__list">
          <li>{t("conclusion.list.item1")}</li>
          <li>{t("conclusion.list.item2")}</li>
          <li>{t("conclusion.list.item3")}</li>
        </ul>
        <p>{t("conclusion.cta")}</p>
      </div>
    </article>
  );
}
