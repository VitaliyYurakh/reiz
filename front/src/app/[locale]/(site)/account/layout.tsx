import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountSidebar from "@/components/account/AccountSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { defaultLocale, type Locale } from "@/i18n/request";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const session = await auth();
  if (!session) redirect(`${localePrefix}/auth/login`);

  return (
    <>
      <Header mode={false} />
      <main className="account-layout">
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
