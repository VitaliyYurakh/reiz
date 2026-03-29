import { getTranslations } from "next-intl/server";
import { CurrencyText } from "@/components/CurrencyPrice";

export default async function TerritorySection() {
  const t = await getTranslations("termsPage.sections.territory");
  const items = t.raw("items") as string[];

  return (
    <section className="terms-block" id="territory">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
      </div>

      <ul className="terms-block__list">
        {items.map((item, i) => (
          <li key={i}>
            <CurrencyText text={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
