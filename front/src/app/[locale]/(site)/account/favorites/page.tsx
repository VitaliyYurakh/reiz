import { getTranslations } from "next-intl/server";
import { getFavorites } from "@/lib/api/customer";
import FavoritesList from "@/components/account/FavoritesList";

export default async function FavoritesPage() {
  const t = await getTranslations("account");
  const favorites = await getFavorites();

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("favorites.title")}</h1>

      {!favorites || favorites.length === 0 ? (
        <p className="account-page__empty">{t("favorites.empty")}</p>
      ) : (
        <FavoritesList favorites={favorites} />
      )}
    </div>
  );
}
