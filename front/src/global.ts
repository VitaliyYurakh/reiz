import type { Locale } from "@/i18n/request";
import type en from "./i18n/translations/en/index.json";
import type ru from "./i18n/translations/ru/index.json";

type MessagesAll = typeof en & typeof ru;

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: MessagesAll;
  }
}
