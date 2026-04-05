"use client";

import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/request";
import { defaultLocale } from "@/i18n/request";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { loginWithCredentials } from "@/app/[locale]/(site)/auth/actions";
import { Link } from "@/i18n/request";
import clsx from "classnames";

export default function LoginRequiredModal({
  close,
  isClosing,
}: {
  id: string;
  data?: {};
  close: () => void;
  isClosing: boolean;
  runCallback: () => void;
}) {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const callbackUrl = pathname || (locale === defaultLocale ? "/" : `/${locale}`);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginWithCredentials(formData);

    if (result.error) {
      setError(t(`errors.${result.error}` as any));
      setLoading(false);
      turnstileRef.current?.reset();
      return;
    }

    close();
    router.refresh();
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl });
  }

  return (
    <div className={clsx("login-required-modal", isClosing && "login-required-modal--closing")}>
      <button type="button" className="login-required-modal__close" onClick={close} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="login-required-modal__header">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="login-required-modal__icon">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2 className="login-required-modal__title">{t("login.favorites_modal_title")}</h2>
        <p className="login-required-modal__subtitle">{t("login.favorites_modal_subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="login-modal__form">
        <div className="login-modal__field">
          <input
            id="login-modal-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t("fields.email_placeholder")}
          />
        </div>

        <div className="login-modal__field">
          <input
            id="login-modal-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            placeholder={t("fields.password_placeholder")}
          />
        </div>

        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ theme: "light", size: "normal" }}
        />

        {error && <p className="login-modal__error">{error}</p>}

        <button
          type="submit"
          className="login-modal__submit"
          disabled={loading}
        >
          {loading ? t("login.loading") : t("login.submit")}
        </button>
      </form>

      <div className="login-modal__divider">
        <span>{t("login.or")}</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="login-modal__google"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {t("login.google")}
      </button>

      <p className="login-modal__footer">
        {t("login.no_account")}{" "}
        <Link href="/auth/register" className="login-modal__switch" onClick={close}>
          {t("login.register_link")}
        </Link>
      </p>
    </div>
  );
}
