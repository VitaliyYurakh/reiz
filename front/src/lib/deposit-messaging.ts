import type { Locale } from "@/i18n/request";

/**
 * Public wording for the rental deposit policy.
 *
 * The standard tariff includes a damage deposit. A paid protection package
 * can remove the damage deposit, but a separate refundable security hold may
 * still apply for fines, fuel shortages, or smoking in the cabin.
 */
const FAQ_ANSWERS: Record<Locale, string> = {
  uk: "Стандартно застосовується депозит за пошкодження. Для окремих авто за додаткову плату доступний пакет без депозиту за пошкодження або зі зменшеною відповідальністю. Окрема гарантійна сума стосується лише штрафів, недоливу пального та куріння в салоні. Вона не покриває пошкодження автомобіля.",
  ru: "Стандартно применяется депозит за повреждения. Для отдельных автомобилей за дополнительную плату доступен пакет без депозита за повреждения или со сниженной ответственностью. Отдельная гарантийная сумма касается только штрафов, нехватки топлива и курения в салоне. Она не покрывает повреждения автомобиля.",
  en: "The standard rental terms include a damage deposit. For selected cars, an extra fee provides a package with no damage deposit or reduced liability. A separate security hold applies only to fines, fuel shortages and smoking in the cabin. It does not cover vehicle damage.",
  pl: "Standardowe warunki wynajmu obejmują kaucję za szkody. W przypadku wybranych aut za dodatkową opłatą dostępny jest pakiet bez kaucji za szkody lub ze zmniejszoną odpowiedzialnością. Osobna kwota zabezpieczająca dotyczy tylko mandatów, braku paliwa i palenia w kabinie. Nie pokrywa ona uszkodzeń samochodu.",
  ro: "Condițiile standard de închiriere includ un depozit pentru daune. Pentru anumite mașini, contra cost, este disponibil un pachet fără depozit pentru daune sau cu răspundere redusă. O garanție separată se aplică doar pentru amenzi, lipsa combustibilului și fumatul în habitaclu. Aceasta nu acoperă daunele mașinii.",
};

const NO_DAMAGE_DEPOSIT_LABEL: Record<Locale, string> = {
  uk: "Без депозиту за пошкодження (за доплату)",
  ru: "Без депозита за повреждения (за доплату)",
  en: "No damage deposit (extra fee)",
  pl: "Bez kaucji za szkody (za dodatkową opłatą)",
  ro: "Fără depozit pentru daune (contra cost)",
};

const replaceNoDepositClaims = (value: string, locale: Locale): string => {
  let result = value;

  if (locale === "uk") {
    result = result
      .replace(
        /без\s+застави(?!\s+за\s+пошкодження)/gi,
        "без депозиту за пошкодження за додаткову оплату",
      )
      .replace(
        /без\s+заставу(?!\s+за\s+пошкодження)/gi,
        "без депозиту за пошкодження за додаткову оплату",
      )
      .replace(
        /без\s+депозиту(?!\s+за\s+пошкодження)/gi,
        "без депозиту за пошкодження за додаткову оплату",
      )
      .replace(
        /або\s+без\s+нього/gi,
        "або без депозиту за пошкодження за додаткову оплату",
      );
  }

  if (locale === "ru") {
    result = result
      .replace(
        /без\s+залога(?!\s+за\s+повреждения)/gi,
        "без депозита за повреждения за дополнительную плату",
      )
      .replace(
        /без\s+залог\b(?!\s+за\s+повреждения)/gi,
        "без депозита за повреждения за дополнительную плату",
      )
      .replace(
        /без\s+депозита(?!\s+за\s+повреждения)/gi,
        "без депозита за повреждения за дополнительную плату",
      )
      .replace(
        /или\s+без\s+него/gi,
        "или без депозита за повреждения за дополнительную плату",
      );
  }

  if (locale === "en") {
    result = result
      .replace(
        /no[-\s]deposit\s+options?/gi,
        "no damage deposit options available for an additional fee",
      )
      .replace(
        /no[-\s]deposit\s+rental/gi,
        "rental without a damage deposit for an additional fee",
      )
      .replace(
        /no\s+deposit\s+at\s+all/gi,
        "no damage deposit for an additional fee",
      )
      .replace(
        /without\s+(?:a\s+)?deposit(?!\s+for\s+damage)/gi,
        "without a damage deposit for an additional fee",
      )
      .replace(/no[-\s]deposit/gi, "no damage deposit for an additional fee");
  }

  if (locale === "pl") {
    result = result.replace(
      /bez\s+kaucji(?!\s+za\s+szkody)/gi,
      "bez kaucji za szkody za dodatkową opłatą",
    );
  }

  if (locale === "ro") {
    result = result
      .replace(/fără\s+depozit(?!\s+pentru\s+daune)/gi, "fără depozit pentru daune, contra cost")
      .replace(/fără\s+garanție(?!\s+pentru\s+daune)/gi, "fără depozit pentru daune, contra cost");
  }

  return result;
};

export function normalizeDepositMessaging(
  value: string,
  locale: Locale,
): string {
  // Replace the old binary FAQ answer with the complete, policy-accurate
  // explanation. This also covers the localized copies in city FAQs.
  if (
    /без\s+застави\s+неможливо|без\s+залога\s+невозможна|without\s+a?\s*deposit\s+is\s+not\s+possible|bez\s+kaucji\s+nie\s+jest\s+możliw|fără\s+(depozit|garanție)\s+nu\s+este\s+posibil/i.test(
      value,
    )
  ) {
    return FAQ_ANSWERS[locale];
  }

  // Keep the refundable hold limited to the policy confirmed by the business.
  const holdItems = [
    [
      /штрафів\s+і\s+платних\s+доріг,\s*(?:<[^>]*>\s*)+недоливу\s+пального,\s*(?:<[^>]*>\s*)+мийки\/салону,\s*(?:<[^>]*>\s*)+втрати\s+ключів/gi,
      "штрафів, нестачі пального або куріння в салоні",
    ],
    [
      /штрафов\s+и\s+платных\s+дорог,\s*(?:<[^>]*>\s*)+недолива\s+топлива,\s*(?:<[^>]*>\s*)+мойки\/салона,\s*(?:<[^>]*>\s*)+утери\s+ключей/gi,
      "штрафов, нехватки топлива или курения в салоне",
    ],
    [
      /fines\s+and\s+tolls,\s*(?:<[^>]*>\s*)+missing\s+fuel,\s*(?:<[^>]*>\s*)+car\s+wash\/interior\s+cleaning,\s*(?:<[^>]*>\s*)+lost\s+keys/gi,
      "fines, fuel shortages, or smoking in the cabin",
    ],
  ] as const;

  let result = replaceNoDepositClaims(value, locale);
  for (const [pattern, replacement] of holdItems) {
    result = result.replace(pattern, replacement);
  }

  if (
    result === "Без депозиту" ||
    result === "Без застави" ||
    result === "Без депозита" ||
    result === "Без залога" ||
    result === "No deposit" ||
    result === "No Deposit" ||
    result === "Bez kaucji" ||
    result === "Fără depozit"
  ) {
    return NO_DAMAGE_DEPOSIT_LABEL[locale];
  }

  return result;
}

export function normalizeDepositMessages<T>(value: T, locale: Locale): T {
  if (typeof value === "string") {
    return normalizeDepositMessaging(value, locale) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeDepositMessages(item, locale)) as T;
  }

  if (value && typeof value === "object") {
    const normalized = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeDepositMessages(item, locale),
      ]),
    );
    return normalized as T;
  }

  return value;
}
