"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/request";
import {
  CONSENT_COOKIE_MAX_AGE_SECONDS,
  CONSENT_COOKIE_NAME,
  OPEN_COOKIE_CONSENT_EVENT,
} from "@/lib/consent/constants";
import { loadGtm, updateGtmConsent } from "@/lib/consent/loadGtm";
import {
  ALL_OPTIONAL_CONSENT,
  type ConsentPreferences,
  hasOptionalConsent,
  NO_OPTIONAL_CONSENT,
  serializeConsentPreferences,
} from "@/lib/consent/preferences";
import styles from "./CookieConsentBanner.module.scss";

type Props = {
  // True only for a first-time visitor in a jurisdiction that requires
  // opt-in consent. The component remains mounted so the footer control can
  // reopen it after a choice was saved.
  initialVisible: boolean;
  initialPreferences: ConsentPreferences | null;
};

function setConsentCookie(preferences: ConsentPreferences) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${serializeConsentPreferences(preferences)}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export default function CookieConsentBanner({
  initialVisible,
  initialPreferences,
}: Props) {
  const [visible, setVisible] = useState(initialVisible);
  const [savedPreferences, setSavedPreferences] = useState<ConsentPreferences>(
    initialPreferences ?? NO_OPTIONAL_CONSENT,
  );
  const [preferences, setPreferences] = useState<ConsentPreferences>(
    initialPreferences ?? NO_OPTIONAL_CONSENT,
  );
  const t = useTranslations("cookieConsent");

  useEffect(() => {
    const handleReopen = () => {
      setPreferences(savedPreferences);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_CONSENT_EVENT, handleReopen);
    return () =>
      window.removeEventListener(OPEN_COOKIE_CONSENT_EVENT, handleReopen);
  }, [savedPreferences]);

  const savePreferences = (nextPreferences: ConsentPreferences) => {
    setConsentCookie(nextPreferences);
    setSavedPreferences(nextPreferences);
    setPreferences(nextPreferences);

    if (hasOptionalConsent(nextPreferences)) {
      loadGtm(nextPreferences);
    } else {
      updateGtmConsent(nextPreferences);
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={styles.wrapper}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className={styles.card}>
        <div className={styles.content}>
          <h2 id="cookie-consent-title" className={styles.title}>
            {t("title")}
          </h2>
          <p className={styles.text}>
            {t("message")}{" "}
            <Link href="/privacy-policy" className={styles.link}>
              {t("learnMore")}
            </Link>
          </p>

          <fieldset className={styles.categories}>
            <legend className={styles.legend}>{t("preferencesTitle")}</legend>
            <label className={styles.category}>
              <span>
                <strong>{t("necessaryTitle")}</strong>
                <small>{t("necessaryDescription")}</small>
              </span>
              <span className={styles.alwaysOn}>{t("alwaysOn")}</span>
            </label>
            <label className={styles.category}>
              <span>
                <strong>{t("analyticsTitle")}</strong>
                <small>{t("analyticsDescription")}</small>
              </span>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    analytics: event.target.checked,
                  }))
                }
                aria-label={t("analyticsTitle")}
              />
            </label>
            <label className={styles.category}>
              <span>
                <strong>{t("marketingTitle")}</strong>
                <small>{t("marketingDescription")}</small>
              </span>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    marketing: event.target.checked,
                  }))
                }
                aria-label={t("marketingTitle")}
              />
            </label>
          </fieldset>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.reject}
            onClick={() => savePreferences(NO_OPTIONAL_CONSENT)}
          >
            {t("rejectAll")}
          </button>
          <button
            type="button"
            className={styles.accept}
            onClick={() => savePreferences(ALL_OPTIONAL_CONSENT)}
          >
            {t("acceptAll")}
          </button>
          <button
            type="button"
            className={styles.save}
            onClick={() => savePreferences(preferences)}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
