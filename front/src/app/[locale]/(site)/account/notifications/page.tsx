import { getTranslations } from "next-intl/server";
import { getNotificationPreferences } from "@/lib/api/customer";
import NotificationSettings from "@/components/account/NotificationSettings";

export default async function NotificationsPage() {
  const t = await getTranslations("account");
  const prefs = await getNotificationPreferences();

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("notifications.title")}</h1>
      <NotificationSettings preferences={prefs} />
    </div>
  );
}
