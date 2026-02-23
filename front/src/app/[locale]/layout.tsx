import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale, defaultLocale, isLocale } from "@/i18n/request";
import type { ReactNode } from "react";
import SideBarClientProvider from "@/components/modals/SideBarClientProvider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RentalSearchProvider } from "@/context/RentalSearchContext";

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

  return (
    <NextIntlClientProvider locale={resolvedLocale}>
      <CurrencyProvider>
        <RentalSearchProvider>
          <SideBarClientProvider>{children}</SideBarClientProvider>
        </RentalSearchProvider>
      </CurrencyProvider>
    </NextIntlClientProvider>
  );
}
