import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale, defaultLocale, isLocale } from "@/i18n/request";
import type { ReactNode } from "react";
import SideBarClientProvider from "@/components/modals/SideBarClientProvider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RentalSearchProvider } from "@/context/RentalSearchContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { getFavorites } from "@/lib/api/customer";


export function generateStaticParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;

  // Enable static rendering for pages under [locale]
  setRequestLocale(resolvedLocale);

  const session = await auth();
  const isAuthenticated = !!session?.user?.clientId;

  let favoriteIds: number[] = [];
  if (isAuthenticated) {
    const favorites = await getFavorites();
    favoriteIds = (favorites || []).map((f: any) => f.car?.id ?? f.carId).filter(Boolean);
  }

  return (
    <SessionProvider>
      <NextIntlClientProvider locale={resolvedLocale}>
        <CurrencyProvider>
          <RentalSearchProvider>
            <FavoritesProvider initialFavoriteIds={favoriteIds} isAuthenticated={isAuthenticated}>
              <SideBarClientProvider>{children}</SideBarClientProvider>
            </FavoritesProvider>
          </RentalSearchProvider>
        </CurrencyProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
