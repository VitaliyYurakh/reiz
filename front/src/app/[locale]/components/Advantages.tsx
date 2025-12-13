import { useTranslations } from "next-intl";

export default function Advantages() {
  const t = useTranslations("homePage.advantages");
  return (
    <section className="advantages-section">
      <div className="container">
        <div className="advantages-section__box">
          <ul
            className="advantages-section__list"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="0"
          >
            <li className="advantages-section__item">
              <span className="advantages-section__title">
                {t("item1_title")}
              </span>
              <p>{t("item1_text")}</p>
            </li>
            <li className="advantages-section__item">
              <span className="advantages-section__title">
                {t("item2_title")}
              </span>
              <p> {t("item2_text")}</p>
            </li>
            <li className="advantages-section__item">
              <span className="advantages-section__title">
                {t("item3_title")}
              </span>
              <p> {t("item3_text")}</p>
            </li>
            <li className="advantages-section__item">
              <span className="advantages-section__title">
                {t("item4_title")}
              </span>
              <p> {t("item4_text")}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
