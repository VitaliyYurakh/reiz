import { NextIntlClientProvider } from "next-intl";
import { locales, type Locale, defaultLocale, isLocale } from "@/i18n/request";
import type { ReactNode } from "react";
import SideBarClientProvider from "@/components/modals/SideBarClientProvider";

export function generateStaticParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <NextIntlClientProvider locale={isLocale(locale) ? locale : defaultLocale}>
      <SideBarClientProvider>{children}</SideBarClientProvider>
    </NextIntlClientProvider>
  );
}
