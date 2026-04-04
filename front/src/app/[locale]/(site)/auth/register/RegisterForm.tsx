"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { defaultLocale, useRouter } from "@/i18n/request";
import { registerUser } from "../actions";

export default function RegisterForm() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const accountHref =
    locale === defaultLocale ? "/account" : `/${locale}/account`;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  function getErrorMessage(errorCode: string) {
    switch (errorCode) {
      case "all_fields_required":
        return t("errors.all_fields_required");
      case "password_too_short":
        return t("errors.password_too_short");
      case "password_too_weak":
        return t("errors.password_too_weak");
      case "email_exists":
        return t("errors.email_exists");
      case "registration_failed":
        return t("errors.registration_failed");
      case "too_many_requests":
        return t("errors.too_many_requests");
      case "captcha_required":
        return t("errors.captcha_required");
      case "captcha_failed":
        return t("errors.captcha_failed");
      case "consent_required":
        return t("errors.consent_required");
      default:
        return t("errors.registration_failed");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(getErrorMessage(result.error));
      setLoading(false);
      turnstileRef.current?.reset();
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: accountHref });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="login-modal__form login-modal__form--register login-modal__form--register-clean"
      >
        {/* Honeypot field - hidden from real users, bots fill it */}
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        />

        <div className="login-modal__row login-modal__row--register">
          <div className="login-modal__field">
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              placeholder={t("fields.first_name_placeholder")}
            />
          </div>

          <div className="login-modal__field">
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              placeholder={t("fields.last_name_placeholder")}
            />
          </div>
        </div>

        <div className="login-modal__field">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t("fields.email_placeholder")}
          />
        </div>

        <div className="login-modal__field">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder={t("fields.phone_placeholder")}
          />
        </div>

        <div className="login-modal__field">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder={t("fields.password_placeholder")}
          />
          <small className="login-modal__hint">
            {t("fields.password_hint")}
          </small>
        </div>

        <label className="login-modal__consent login-modal__consent--register-clean">
          <input type="checkbox" name="consent" required />
          <span>{t("register.consent")}</span>
        </label>

        <div className="login-modal__captcha">
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            options={{ theme: "light", size: "normal" }}
          />
        </div>

        {error && (
          <p className="login-modal__error login-modal__error--register">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="login-modal__submit"
          disabled={loading}
        >
          {loading ? t("register.loading") : t("register.submit")}
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
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {t("register.google")}
      </button>
    </>
  );
}
