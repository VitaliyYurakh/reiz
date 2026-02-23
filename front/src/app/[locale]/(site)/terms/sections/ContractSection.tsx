import Icon from "@/components/Icon";
import { getTranslations } from "next-intl/server";

export default async function ContractSection() {
  const t = await getTranslations("termsPage.sections.contract");

  return (
    <section className="terms-block" id="contract">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
      </div>

      <p className="terms-block__text">{t("text")}</p>

      <a
        href="#"
        className="download"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("downloadAriaLabel")}
      >
        <span className="download__icon">
          <Icon id="load" width={14} height={26} />
        </span>
        <span className="download__info">
          <span className="download__title">{t("downloadTitle")}</span>
          <span className="download__meta">{t("downloadMeta")}</span>
        </span>
      </a>
    </section>
  );
}
