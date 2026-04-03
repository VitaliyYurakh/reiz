import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Link, type Locale, locales } from "@/i18n/request";
import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return {
    title: t("register.title"),
    robots: { index: false },
  };
}

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/account");

  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("account");

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{t("register.title")}</h1>
        <p className="auth-page__subtitle">{t("register.subtitle")}</p>

        <RegisterForm />

        <p className="auth-page__footer">
          {t("register.have_account")}{" "}
          <Link href="/auth/login" className="auth-page__link">
            {t("register.login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
