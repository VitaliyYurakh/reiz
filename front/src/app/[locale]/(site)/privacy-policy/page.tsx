import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import { Link, type Locale, locales } from "@/i18n/request";
import SectionNav from "../terms/SectionNav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
const POLICY_PATH = "/privacy-policy";

type NavItem = {
  id: string;
  label: string;
};

type TextGroup = {
  title: string;
  text: string;
};

type LabeledItem = {
  label: string;
  text: string;
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
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
  const canonical = new URL(POLICY_PATH, SITE_URL).toString();

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: { canonical },
    // Ukrainian remains the authoritative edition of this Policy.
    robots:
      locale === "uk"
        ? { index: true, follow: true }
        : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title: t("meta.title"),
      description: t("meta.ogDescription"),
    },
  };
}

export default async function PrivacyPolicyPage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPolicy");

  const navItems = t.raw("nav.items") as NavItem[];
  const generalParagraphs = t.raw("sections.general.paragraphs") as string[];
  const dataGroups = t.raw("sections.data.groups") as TextGroup[];
  const purposeItems = t.raw("sections.purpose.items") as string[];
  const sharingItems = t.raw("sections.sharing.items") as LabeledItem[];
  const cookieItems = t.raw("sections.cookies.items") as LabeledItem[];
  const storageParagraphs = t.raw("sections.storage.paragraphs") as string[];
  const rightsParagraphs = t.raw("sections.rights.paragraphs") as string[];
  const officialNotice = t("hero.officialNotice");

  return (
    <div className="terms-section__inner">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: t("breadcrumbs.home") },
          { href: POLICY_PATH, name: t("breadcrumbs.current") },
        ]}
      />

      <div className="terms-hero-group">
        <div className="terms-hero-top">
          <div className="terms-hero-content">
            <div className="blog-hero terms-hero">
              <h1 className="blog-hero__title">{t("hero.title")}</h1>
              <p className="terms-hero__subtitle">{t("hero.subtitle")}</p>
            </div>
            {officialNotice ? (
              <p className="terms-block__note">{officialNotice}</p>
            ) : null}
          </div>
        </div>
      </div>

      <SectionNav
        ariaLabel={t("nav.ariaLabel")}
        goToSection={t("nav.goToSection")}
        items={navItems}
      />

      <div className="terms-section__content">
        <section className="terms-block" id="general">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.general.title")}
            </h2>
          </div>
          {generalParagraphs.map((paragraph) => (
            <p className="terms-block__text" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <p className="terms-block__note">
            {t("sections.general.note", { updatedAt: t("updatedAt") })}
          </p>
        </section>

        <section className="terms-block" id="data">
          <div className="terms-block__header">
            <h2 className="terms-block__title">{t("sections.data.title")}</h2>
            <p className="terms-block__subtitle">
              {t("sections.data.subtitle")}
            </p>
          </div>
          <div className="terms-block__groups">
            {dataGroups.map((group) => (
              <div className="terms-block__group" key={group.title}>
                <h3 className="terms-block__label">{group.title}</h3>
                <p className="terms-block__text">{group.text}</p>
              </div>
            ))}
          </div>
          <p className="terms-block__note">{t("sections.data.note")}</p>
        </section>

        <section className="terms-block" id="purpose">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.purpose.title")}
            </h2>
          </div>
          <ul className="terms-block__list">
            {purposeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="terms-block__text">{t("sections.purpose.paragraph")}</p>
        </section>

        <section className="terms-block" id="sharing">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.sharing.title")}
            </h2>
          </div>
          <p className="terms-block__text">{t("sections.sharing.intro")}</p>
          <ul className="terms-block__list">
            {sharingItems.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> — {item.text}
              </li>
            ))}
          </ul>
          <p className="terms-block__text">{t("sections.sharing.paragraph")}</p>
        </section>

        <section className="terms-block" id="cookies">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.cookies.title")}
            </h2>
          </div>
          <p className="terms-block__text">{t("sections.cookies.intro")}</p>
          <ul className="terms-block__list">
            {cookieItems.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> — {item.text}
              </li>
            ))}
          </ul>
          <p className="terms-block__text">{t("sections.cookies.paragraph")}</p>
        </section>

        <section className="terms-block" id="storage">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.storage.title")}
            </h2>
          </div>
          {storageParagraphs.map((paragraph) => (
            <p className="terms-block__text" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className="terms-block" id="rights">
          <div className="terms-block__header">
            <h2 className="terms-block__title">{t("sections.rights.title")}</h2>
          </div>
          {rightsParagraphs.map((paragraph) => (
            <p className="terms-block__text" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className="terms-block" id="contact">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.contact.title")}
            </h2>
          </div>
          <p className="terms-block__text">
            {t("sections.contact.beforeEmail")}{" "}
            <a className="terms-block__link" href="mailto:info@reiz.com.ua">
              info@reiz.com.ua
            </a>{" "}
            {t("sections.contact.beforeContacts")}{" "}
            <Link className="terms-block__link" href="/contacts">
              {t("sections.contact.contactsLink")}
            </Link>
            {t("sections.contact.afterContacts")}
          </p>
        </section>

        <section className="terms-block" id="changes">
          <div className="terms-block__header">
            <h2 className="terms-block__title">
              {t("sections.changes.title")}
            </h2>
          </div>
          <p className="terms-block__text">{t("sections.changes.paragraph")}</p>
        </section>
      </div>
    </div>
  );
}
