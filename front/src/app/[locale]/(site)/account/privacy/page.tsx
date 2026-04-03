import { getTranslations } from "next-intl/server";
import PrivacyActions from "@/components/account/PrivacyActions";

export default async function PrivacyPage() {
  const t = await getTranslations("account");

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("privacy.title")}</h1>

      <div className="privacy-cards">
        <div className="privacy-card">
          <div className="privacy-card__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div className="privacy-card__content">
            <h2 className="privacy-card__title">{t("privacy.export_title")}</h2>
            <p className="privacy-card__desc">{t("privacy.export_desc")}</p>
          </div>
        </div>

        <div className="privacy-card privacy-card--danger">
          <div className="privacy-card__icon privacy-card__icon--danger">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="privacy-card__content">
            <h2 className="privacy-card__title">{t("privacy.delete_title")}</h2>
            <p className="privacy-card__desc">{t("privacy.delete_desc")}</p>
          </div>
        </div>
      </div>

      <PrivacyActions />
    </div>
  );
}
