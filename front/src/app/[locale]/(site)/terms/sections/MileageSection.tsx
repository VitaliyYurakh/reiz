import { getTranslations } from "next-intl/server";
import CurrencyPrice from "@/components/CurrencyPrice";

type Rate = { segment: string; price: string };

export default async function MileageSection() {
  const t = await getTranslations("termsPage.sections.mileage");
  const rates = t.raw("rates") as Rate[];
  const unlimitedRates = t.raw("unlimitedRates") as Rate[];
  const free = t("free");

  return (
    <section className="terms-block" id="mileage">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
        <p className="terms-block__subtitle">
          {t("subtitle")
            .split("\n")
            .map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </p>
      </div>

      <div className="mileage-banner">
        <span className="mileage-banner__value">{t("bannerValue")}</span>
        <span className="mileage-banner__label">{t("bannerLabel")}</span>
      </div>

      <div>
        <h3 className="terms-block__label">{t("overageTitle")}</h3>
        <div className="terms-menu" style={{ marginTop: 12 }}>
          {rates.map((row) => (
            <div className="terms-menu__item" key={row.segment}>
              <div className="terms-menu__row">
                <span className="terms-menu__name">{row.segment}</span>
                <span className="terms-menu__dots" />
                <span className="terms-menu__price">
                  <CurrencyPrice value={row.price} free={free} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="terms-block__label">{t("unlimitedTitle")}</h3>
        <div className="terms-menu" style={{ marginTop: 12 }}>
          {unlimitedRates.map((row) => (
            <div className="terms-menu__item" key={row.segment}>
              <div className="terms-menu__row">
                <span className="terms-menu__name">{row.segment}</span>
                <span className="terms-menu__dots" />
                <span className="terms-menu__price">
                  <CurrencyPrice value={row.price} free={free} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="terms-block__note">{t("note")}</p>
    </section>
  );
}
