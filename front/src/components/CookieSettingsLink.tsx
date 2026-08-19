"use client";

import { useTranslations } from "next-intl";
import { OPEN_COOKIE_CONSENT_EVENT } from "@/lib/consent/constants";

export default function CookieSettingsLink() {
  const t = useTranslations("cookieConsent");

  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_COOKIE_CONSENT_EVENT))
      }
    >
      {t("settingsLink")}
    </button>
  );
}
