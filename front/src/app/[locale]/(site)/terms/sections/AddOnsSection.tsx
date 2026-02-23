import { getTranslations } from "next-intl/server";

type AddOn = {
  name: string;
  description: string;
  priceShort: string;
  priceLong: string;
};

export default async function AddOnsSection() {
  const t = await getTranslations("termsPage.sections.addOns");
  const items = t.raw("items") as AddOn[];
  const perDay = t("perDay");
  const byFact = t("byFact");

  function formatPrice(short: string, long: string) {
    if (short === byFact) return byFact;
    if (short === long) return `${short} ${perDay}`;
    return `${short} / ${long} ${perDay}`;
  }

  return (
    <section className="terms-block" id="services">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
        <p className="terms-block__subtitle">{t("subtitle")}</p>
      </div>

      <div className="terms-menu">
        {items.map((item) => (
          <div className="terms-menu__item" key={item.name}>
            <div className="terms-menu__row">
              <span className="terms-menu__name">{item.name}</span>
              <span className="terms-menu__dots" />
              <span className="terms-menu__price">
                {formatPrice(item.priceShort, item.priceLong)}
              </span>
            </div>
            <p className="terms-menu__desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
