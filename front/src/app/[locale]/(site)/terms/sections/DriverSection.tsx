import { getTranslations } from "next-intl/server";

export default async function DriverSection() {
  const t = await getTranslations("termsPage.sections.driver");
  const items = t.raw("items") as string[];

  return (
    <section className="terms-block" id="driver">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
      </div>

      <ul className="terms-block__list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
