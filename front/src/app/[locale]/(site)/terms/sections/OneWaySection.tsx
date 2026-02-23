import { getTranslations } from "next-intl/server";

export default async function OneWaySection() {
  const t = await getTranslations("termsPage.sections.oneWay");

  return (
    <section className="terms-block" id="one-way">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
      </div>
      <p className="terms-block__text">{t("text")}</p>

      <div className="terms-menu">
        <div className="terms-menu__item">
          <div className="terms-menu__row">
            <span className="terms-menu__name">{t("menuName")}</span>
            <span className="terms-menu__dots" />
            <span className="terms-menu__price">{t("menuPrice")}</span>
          </div>
          <p className="terms-menu__desc">{t("menuDesc")}</p>
        </div>
      </div>
    </section>
  );
}
