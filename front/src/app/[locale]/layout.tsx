import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

// Server Components read translations via getTranslations() and never ship
// messages to the client. Only namespaces read with useTranslations() inside
// a "use client" component need to be listed here — otherwise
// NextIntlClientProvider serializes the *entire* per-locale message tree
// (~150KB minified, all ~34 namespaces incl. every blog post and admin page)
// into every route's RSC payload instead of just what that route needs.
// Regenerate with:
//   grep -rl '^"use client"' src | xargs grep -ohE 'useTranslations\("[^."]+' | sort -u
const CLIENT_MESSAGE_NAMESPACES = [
  "account",
  "applyModal",
  "aside",
  "bookingContactModal",
  "businessOfferModal",
  "carAside",
  "carRentModal",
  "carRentPage",
  "certificatePage",
  "contactsPage",
  "header",
  "homePage",
  "managerWillContactYouModal",
  "mobileBar",
  "rangeDateTimePicker",
  "rentalPolicyModal",
  "requestCallModal",
] as const;

function pickClientMessages(messages: Awaited<ReturnType<typeof getMessages>>) {
  const picked: Record<string, unknown> = {};
  for (const ns of CLIENT_MESSAGE_NAMESPACES) {
    if (ns in messages) picked[ns] = messages[ns];
  }
  return picked;
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

  const [session, messages] = await Promise.all([auth(), getMessages()]);
  const isAuthenticated = !!session?.user?.clientId;

  let favoriteIds: number[] = [];
  if (isAuthenticated) {
    const favorites = await getFavorites();
    favoriteIds = (favorites || []).map((f: any) => f.car?.id ?? f.carId).filter(Boolean);
  }

  return (
    <SessionProvider>
      <NextIntlClientProvider
        locale={resolvedLocale}
        messages={pickClientMessages(messages)}
      >
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
