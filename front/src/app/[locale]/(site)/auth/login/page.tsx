import Image from "next/image";
import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Link, defaultLocale, type Locale, locales } from "@/i18n/request";
import LoginForm from "./LoginForm";
import type { Metadata } from "next";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return {
    title: t("login.modal_title"),
    robots: { index: false },
  };
}

export default async function LoginPage() {
  const locale = (await getLocale()) as Locale;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const session = await auth();
  if (session) redirect(`${localePrefix}/account`);

  setRequestLocale(locale);
  const t = await getTranslations("account");

  return (
    <div className="auth-page auth-page--login">
      <div className="login-modal login-modal--page">
        <Link href="/" className="login-modal__close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <div className="login-modal__logo login-modal__logo--page">
          <Image
            src="/img/icons/reiz-logo.svg"
            alt="Reiz Car Rental"
            width={973}
            height={443}
            priority
          />
        </div>
        <h1 className="login-modal__title login-modal__title--page">
          {t("login.modal_title")}
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
