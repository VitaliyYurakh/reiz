import { getTranslations } from "next-intl/server";

export default async function DepositSection() {
  const t = await getTranslations("termsPage.sections.deposit");
  const items = t.raw("items") as string[];

  return (
    <section className="terms-block" id="deposit">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
        <p className="terms-block__subtitle">{t("subtitle")}</p>
      </div>

      <ul className="terms-block__list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
