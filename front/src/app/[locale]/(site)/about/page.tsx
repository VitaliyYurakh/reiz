import type { Metadata } from "next";
import Image from "next/image";
import TeamSlider from "@/app/[locale]/(site)/about/components/TeamSlider";
import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/request";
import { getDefaultPath, getPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";

type TeamItem = { name: string; position: string; imgAlt: string };
type StatItem = { value: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = (await params).locale;
  return getPageMetadata({
    routeKey: "about",
    ns: "aboutPage",
    locale,
  });
}

export default async function AboutPage() {
  const t = await getTranslations("aboutPage");
  const team = t.raw("team.items") as TeamItem[];
  const stats = t.raw("stats.items") as StatItem[];

  return (
    <div
      className="about-section__inner"
      data-aos="fade-left"
      data-aos-duration={900}
      data-aos-delay={600}
    >
      <h2 className="pretitle">{t("pretitle")}</h2>

      <Breadcrumbs
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("about"), name: t("breadcrumbs.current") },
        ]}
      />

      <h1 className="main-title">{t("mainTitle")}</h1>

      <div className="about-section__content">
        <div className="about-section__wrapp">
          <div className="about-section__card">
            <span className="about-section__title">{t("mission.title")}</span>
            <p>{t("mission.text")}</p>
          </div>

          <div className="about-section__card mode">
            <div className="about-section__bg">
              <picture>
                <Image
                  width={490}
                  height={300}
                  src="/img/reiz.png"
                  alt={t("brand.imageAlt")}
                />
              </picture>
            </div>
            <span className="about-section__title">{t("brand.title")}</span>
          </div>
        </div>

        <TeamSlider
          slides={team.map((member, idx) => ({
            id: String(idx + 1),
            title: member.name,
            text: member.position,
          }))}
        />

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
