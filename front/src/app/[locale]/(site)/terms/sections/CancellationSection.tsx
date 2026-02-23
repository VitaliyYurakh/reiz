import { getTranslations } from "next-intl/server";

export default async function CancellationSection() {
  const t = await getTranslations("termsPage.sections.cancellation");
  const items = t.raw("items") as string[];

  return (
    <section className="terms-block" id="cancellation">
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
