import Link from "next/link";
import { getTranslations } from "next-intl/server";

type InsuranceItem = { strong: string; text: string };

export default async function InsuranceSection() {
  const t = await getTranslations("termsPage.sections.insurance");
  const items = t.raw("items") as InsuranceItem[];

  return (
    <section className="terms-block" id="insurance">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
        <p className="terms-block__subtitle">{t("subtitle")}</p>
      </div>

      <ul className="terms-block__list">
        {items.map((item) => (
          <li key={item.strong}>
            <strong>{item.strong}</strong> — {item.text}
          </li>
        ))}
      </ul>

      <Link href="/insurance" className="terms-block__btn">
        {t("btnText")}
      </Link>
    </section>
  );
}
