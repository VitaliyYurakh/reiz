"use client";

import LanguageSwitcherClient from "./LanguageSwitcher.client";
import { defaultLocale, locales } from "@/i18n/request";
import { LOCALE_LABEL } from "@/i18n/locale-config";

const labels = LOCALE_LABEL;

export default function LanguageSwitcher() {
  return (
    <LanguageSwitcherClient
      locales={locales}
      defaultLocale={defaultLocale}
      labels={labels}
    />
  );
}
