import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import AccountSidebar from "@/components/account/AccountSidebar";
import Header from "@/components/Header";
import UtilityBar from "@/components/UtilityBar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/request";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const t = await getTranslations("account.layout");

  return (
    <>
      <Header mode={false} />
      <main className="account-layout">
        <div className="account-layout__topbar">
          <Link href="/" className="account-layout__back">{t("back_to_site")}</Link>
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
