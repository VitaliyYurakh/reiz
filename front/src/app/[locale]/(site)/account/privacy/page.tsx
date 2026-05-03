import { getTranslations } from "next-intl/server";
import PrivacyActions from "@/components/account/PrivacyActions";

export default async function PrivacyPage() {
  const t = await getTranslations("account");

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <h1>{t("privacy.title")}</h1>
      </div>

      <PrivacyActions />
    </div>
  );
}
