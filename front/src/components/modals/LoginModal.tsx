"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/request";

interface LoginModalProps {
  isClosing: boolean;
  onClose: () => void;
}

export default function LoginModal({ isClosing, onClose }: LoginModalProps) {
  const t = useTranslations("account");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).toLowerCase().trim();
    const password = fd.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("errors.invalid_credentials" as any));
      setLoading(false);
      return;
    }

    onClose();
    router.push("/account");
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const email = (fd.get("email") as string).toLowerCase().trim();
    const phone = fd.get("phone") as string;
    const password = fd.get("password") as string;

    if (password.length < 8) {
      setError(t("errors.password_too_short" as any));
      setLoading(false);
      return;
    }

    // Register via server action
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "email_exists"
        ? t("errors.email_exists" as any)
        : t("errors.all_fields_required" as any));
      setLoading(false);
      return;
    }

    // Auto sign-in
    await signIn("credentials", { email, password, redirect: false });
    onClose();
    router.push("/account");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/account" });
  }

  return (
    <div
      className={`login-modal-overlay ${isClosing ? "login-modal-overlay--closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="login-modal">
        <button
          type="button"
          className="login-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="login-modal__title">
          {mode === "login" ? t("login.title") : t("register.title")}
        </h2>
        <p className="login-modal__subtitle">
          {mode === "login" ? t("login.subtitle") : t("register.subtitle")}
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="login-modal__google"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {mode === "login" ? t("login.google") : t("register.google")}
        </button>

        <div className="login-modal__divider">
          <span>{t("login.or")}</span>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="login-modal__form">
            <div className="login-modal__field">
              <label htmlFor="login-email">{t("fields.email")}</label>
              <input id="login-email" name="email" type="email" autoComplete="email" required placeholder={t("fields.email_placeholder")} />
            </div>
            <div className="login-modal__field">
              <label htmlFor="login-password">{t("fields.password")}</label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" required placeholder={t("fields.password_placeholder")} />
            </div>
            {error && <p className="login-modal__error">{error}</p>}
            <button type="submit" className="login-modal__submit" disabled={loading}>
              {loading ? t("login.loading") : t("login.submit")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-modal__form">
            <div className="login-modal__row">
              <div className="login-modal__field">
                <label htmlFor="reg-first">{t("fields.first_name")}</label>
                <input id="reg-first" name="firstName" type="text" autoComplete="given-name" required placeholder={t("fields.first_name_placeholder")} />
              </div>
              <div className="login-modal__field">
                <label htmlFor="reg-last">{t("fields.last_name")}</label>
                <input id="reg-last" name="lastName" type="text" autoComplete="family-name" required placeholder={t("fields.last_name_placeholder")} />
              </div>
            </div>
            <div className="login-modal__field">
              <label htmlFor="reg-email">{t("fields.email")}</label>
              <input id="reg-email" name="email" type="email" autoComplete="email" required placeholder={t("fields.email_placeholder")} />
            </div>
            <div className="login-modal__field">
              <label htmlFor="reg-phone">{t("fields.phone")}</label>
              <input id="reg-phone" name="phone" type="tel" autoComplete="tel" required placeholder={t("fields.phone_placeholder")} />
            </div>
            <div className="login-modal__field">
              <label htmlFor="reg-password">{t("fields.password")}</label>
              <input id="reg-password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder={t("fields.password_placeholder")} />
            </div>
            <label className="login-modal__consent">
              <input type="checkbox" name="consent" required />
              <span>{t("register.consent")}</span>
            </label>
            {error && <p className="login-modal__error">{error}</p>}
            <button type="submit" className="login-modal__submit" disabled={loading}>
              {loading ? t("register.loading") : t("register.submit")}
            </button>
          </form>
        )}

        <p className="login-modal__footer">
          {mode === "login" ? (
            <>
              {t("login.no_account")}{" "}
              <button type="button" className="login-modal__switch" onClick={() => { setMode("register"); setError(""); }}>
                {t("login.register_link")}
              </button>
            </>
          ) : (
            <>
              {t("register.have_account")}{" "}
              <button type="button" className="login-modal__switch" onClick={() => { setMode("login"); setError(""); }}>
                {t("register.login_link")}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
