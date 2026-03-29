import { getTranslations } from "next-intl/server";
import CurrencyPrice from "@/components/CurrencyPrice";

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
  const free = t("free");

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
                <AddOnPrice
                  priceShort={item.priceShort}
                  priceLong={item.priceLong}
                  perDay={perDay}
                  free={free}
                />
              </span>
            </div>
            <p className="terms-menu__desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AddOnPrice({
  priceShort,
  priceLong,
  perDay,
  free,
}: { priceShort: string; priceLong: string; perDay: string; free: string }) {
  if (priceShort === free) return <>{free}</>;

  const shortNum = Number.parseInt(priceShort);
  const longNum = Number.parseInt(priceLong);

  if (Number.isNaN(shortNum)) return <>{priceShort}</>;

  if (shortNum === longNum) {
    return (
      <>
        <CurrencyPrice value={`${shortNum} USD`} /> {perDay}
      </>
    );
  }

  return (
    <>
      <CurrencyPrice value={`${shortNum} USD`} /> /{" "}
      <CurrencyPrice value={`${longNum} USD`} /> {perDay}
    </>
  );
}
