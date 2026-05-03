import { getTranslations } from "next-intl/server";
import { getFavorites } from "@/lib/api/customer";
import FavoritesList from "@/components/account/FavoritesList";

export default async function FavoritesPage() {
  const t = await getTranslations("account");
  const favorites = await getFavorites();
  const count = favorites?.length || 0;

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <div>
          <h1>{t("favorites.title")}</h1>
          {count > 0 && (
            <div className="acc-page-header__sub">
              {count} {t("favorites.count_suffix")}
            </div>
          )}
        </div>
      </div>

      {!favorites || favorites.length === 0 ? (
        <p className="account-page__empty">{t("favorites.empty")}</p>
      ) : (
        <FavoritesList favorites={favorites} />
      )}
    </div>
  );
}
