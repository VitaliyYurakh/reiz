import { getTranslations } from "next-intl/server";

type Tier = { rentals: string; discount: string; label: string };

export default async function LoyaltySection() {
  const t = await getTranslations("termsPage.sections.loyalty");
  const tiers = t.raw("tiers") as Tier[];

  return (
    <section className="terms-block" id="loyalty">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
        <p className="terms-block__subtitle">{t("subtitle")}</p>
      </div>

      <div className="terms-menu">
        {tiers.map((tier) => (
          <div className="terms-menu__item" key={tier.rentals}>
            <div className="terms-menu__row">
              <span className="terms-menu__name">
                {tier.rentals} {tier.label}
              </span>
              <span className="terms-menu__dots" />
              <span className="terms-menu__price">{tier.discount}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="terms-block__note">
        {t("note")
          .split("\n")
          .map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
      </p>
    </section>
  );
}
