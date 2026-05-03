import { getTranslations } from "next-intl/server";
import { getNotificationPreferences } from "@/lib/api/customer";
import NotificationSettings from "@/components/account/NotificationSettings";

export default async function NotificationsPage() {
  const t = await getTranslations("account");
  const prefs = await getNotificationPreferences();

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <div>
          <h1>{t("notifications.title")}</h1>
          <div className="acc-page-header__sub">{t("notifications.subtitle")}</div>
        </div>
      </div>
      <NotificationSettings preferences={prefs} />
    </div>
  );
}
