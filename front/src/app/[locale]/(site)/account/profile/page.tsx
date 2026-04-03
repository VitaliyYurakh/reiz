import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/api/customer";
import ProfileForm from "@/components/account/ProfileForm";

export default async function ProfilePage() {
  const t = await getTranslations("account");
  const profile = await getProfile();

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("profile.title")}</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
