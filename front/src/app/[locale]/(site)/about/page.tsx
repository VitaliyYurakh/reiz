import type { Metadata } from "next";
import UiImage from "@/components/ui/UiImage";
// import TeamSlider from "@/app/[locale]/(site)/about/components/TeamSlider"; // тимчасово закоментовано
import { getTranslations } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";

type TeamItem = { name: string; position: string; imgAlt: string };
type StatItem = { value: string; label: string };


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return getStaticPageMetadata("aboutPage", params.locale);
}

export default async function AboutPage() {
  const t = await getTranslations("aboutPage");
  // const team = t.raw("team.items") as TeamItem[]; // тимчасово закоментовано
  const stats = t.raw("stats.items") as StatItem[];

  return (
    <div
      className="about-section__inner"
      data-aos="fade-left"
      data-aos-duration={900}
      data-aos-delay={600}
    >
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("about"), name: t("breadcrumbs.current") },
        ]}
      />

      <div className="cert__breadcrumb">
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("pretitle")}</span>
      </div>

      <div className="blog-hero">
        <h1 className="blog-hero__title">{t("mainTitle")}</h1>
      </div>

      <div className="about-section__content">
        <div className="about-section__wrapp">
          <div className="about-section__card">
            <span className="about-section__title">{t("mission.title")}</span>
            <p>{t("mission.text")}</p>
          </div>

          <div className="about-section__card mode">
            <div className="about-section__bg">
              <UiImage
                width={490}
                height={300}
                src="/img/reiz.png"
                alt={t("brand.imageAlt")}
                sizePreset="card"
              />
            </div>
            <span className="about-section__title">{t("brand.title")}</span>
          </div>
        </div>

{/* TeamSlider з фото та карткою Мар'яна - тимчасово закоментовано
        <TeamSlider
          slides={team.map((member, idx) => ({
            id: String(idx + 1),
            title: member.name,
            text: member.position,
          }))}
        />
*/}

        <ul className="about-section__list">
          {stats.map((s) => (
            <li className="about-section__item" key={s.label}>
              <span className="about-section__title">{s.value}</span>

              {/** biome-ignore lint/security/noDangerouslySetInnerHtml: i18n */}
              <p dangerouslySetInnerHTML={{ __html: s.label }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
