import { getTranslations } from "next-intl/server";
import PrivacyActions from "@/components/account/PrivacyActions";

export default async function PrivacyPage() {
  const t = await getTranslations("account");

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("privacy.title")}</h1>

      <div className="account-page__section">
        <h2 className="account-page__section-title">
          {t("privacy.export_title")}
        </h2>
        <p className="account-page__section-desc">
          {t("privacy.export_desc")}
        </p>
      </div>

      <div className="account-page__section">
        <h2 className="account-page__section-title account-page__section-title--danger">
          {t("privacy.delete_title")}
        </h2>
        <p className="account-page__section-desc">
          {t("privacy.delete_desc")}
        </p>
      </div>

      <PrivacyActions />
    </div>
  );
}
