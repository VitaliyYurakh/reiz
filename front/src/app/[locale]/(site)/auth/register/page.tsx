import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { defaultLocale, Link, type Locale, locales } from "@/i18n/request";
import RegisterForm from "./RegisterForm";

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
  const locale = (await getLocale()) as Locale;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const session = await auth();
  if (session) redirect(`${localePrefix}/account`);

  setRequestLocale(locale);
  const t = await getTranslations("account");

  return (
    <div className="auth-page auth-page--login">
      <div className="login-modal login-modal--page login-modal--register">
        <Link href="/" className="login-modal__close" aria-label="Close">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <div className="login-modal__hero">
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
            {t("register.title")}
          </h1>
          <p className="login-modal__subtitle login-modal__subtitle--page login-modal__subtitle--register">
            {t("register.subtitle")}
          </p>
        </div>

        <RegisterForm />

        <p className="login-modal__footer login-modal__footer--page">
          {t("register.have_account")}{" "}
          <Link href="/auth/login" className="login-modal__switch">
            {t("register.login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
