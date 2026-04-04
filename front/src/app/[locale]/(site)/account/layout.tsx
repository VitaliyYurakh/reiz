import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountSidebar from "@/components/account/AccountSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UtilityBar from "@/components/UtilityBar";
import { Link, defaultLocale, type Locale } from "@/i18n/request";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const t = await getTranslations("account.layout");
  const session = await auth();
  if (!session) redirect(`${localePrefix}/auth/login`);

  return (
    <>
      <Header mode />
      <main className="account-layout">
        <div className="account-layout__topbar">
          <Link href="/" className="account-layout__back">
            {t("back_to_site")}
          </Link>
          <UtilityBar />
        </div>
        <div className="account-layout__container">
          <aside className="account-layout__sidebar">
            <AccountSidebar />
          </aside>
          <div className="account-layout__content">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
