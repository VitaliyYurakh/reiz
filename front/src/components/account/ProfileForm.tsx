"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/lib/api/customer";
import CustomSelect from "./CustomSelect";

const LANGUAGE_KEYS = [
  "amslen", "brazilian_sign", "british_sign",
  "azerbaijani", "albanian", "english", "arabic",
  "armenian", "afrikaans", "basque", "belarusian",
  "bengali", "burmese", "bulgarian", "bosnian",
  "hungarian", "vietnamese", "galician", "greek",
  "georgian", "gujarati", "danish", "zulu", "hebrew",
  "indonesian", "irish", "icelandic", "spanish",
  "italian", "kannada", "catalan", "kyrgyz",
  "chinese", "korean", "xhosa", "khmer", "lao",
  "latvian", "lithuanian", "macedonian", "malay",
  "maltese", "german", "dutch", "norwegian",
  "punjabi", "persian", "polish", "portuguese",
  "romanian", "russian", "serbian", "slovak",
  "slovenian", "swahili", "tagalog", "thai",
  "tamil", "telugu", "turkish", "ukrainian", "urdu",
  "filipino", "finnish", "french", "hindi",
  "croatian", "czech", "swedish", "estonian", "japanese",
];

const STORAGE_KEY = "reiz_user_languages";

// Migration map: old Ukrainian names → new keys
const LEGACY_NAME_TO_KEY: Record<string, string> = {
  "Амслен": "amslen", "Бразильський жестовий": "brazilian_sign", "Британський жестовий": "british_sign",
  "Азербайджанська": "azerbaijani", "Албанська": "albanian", "Англійська": "english", "Арабська": "arabic",
  "Вірменська": "armenian", "Африкаанс": "afrikaans", "Баскська": "basque", "Білоруська": "belarusian",
  "Бенгальська": "bengali", "Бірманська": "burmese", "Болгарська": "bulgarian", "Боснійська": "bosnian",
  "Угорська": "hungarian", "В'єтнамська": "vietnamese", "Галісійська": "galician", "Грецька": "greek",
  "Грузинська": "georgian", "Гуджараті": "gujarati", "Данська": "danish", "Зулу": "zulu", "Іврит": "hebrew",
  "Індонезійська": "indonesian", "Ірландська": "irish", "Ісландська": "icelandic", "Іспанська": "spanish",
  "Італійська": "italian", "Каннада": "kannada", "Каталонська": "catalan", "Киргизька": "kyrgyz",
  "Китайська": "chinese", "Корейська": "korean", "Коса": "xhosa", "Кхмерська": "khmer", "Лаоська": "lao",
  "Латвійська": "latvian", "Литовська": "lithuanian", "Македонська": "macedonian", "Малайська": "malay",
  "Мальтійська": "maltese", "Німецька": "german", "Нідерландська": "dutch", "Норвезька": "norwegian",
  "Панджабі": "punjabi", "Перська": "persian", "Польська": "polish", "Португальська": "portuguese",
  "Румунська": "romanian", "Російська": "russian", "Сербська": "serbian", "Словацька": "slovak",
  "Словенська": "slovenian", "Суахілі": "swahili", "Тагальська": "tagalog", "Тайська": "thai",
  "Тамільська": "tamil", "Телугу": "telugu", "Турецька": "turkish", "Українська": "ukrainian", "Урду": "urdu",
  "Філіппінська": "filipino", "Фінська": "finnish", "Французька": "french", "Гінді": "hindi",
  "Хорватська": "croatian", "Чеська": "czech", "Шведська": "swedish", "Естонська": "estonian", "Японська": "japanese",
};

function migrateLanguages(langs: string[]): string[] {
  return langs.map((l) => LEGACY_NAME_TO_KEY[l] || l);
}

interface ProfileFormProps {
  profile: any;
  onSaved?: () => void;
}

export default function ProfileForm({ profile, onSaved }: ProfileFormProps) {
  const t = useTranslations("account");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  useEffect(() => {
    let langs: string[] = [];
    if (profile?.languages && Array.isArray(profile.languages) && profile.languages.length > 0) {
      langs = migrateLanguages(profile.languages);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) langs = migrateLanguages(JSON.parse(stored));
    }
    setLanguages(langs);
    if (langs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(langs));
    }
  }, [profile]);

  function toggleLang(lang: string) {
    setLanguages((prev) => {
      const next = prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const fd = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    for (const [key, value] of fd.entries()) {
      data[key] = value as string;
    }
    data.languages = languages;

    const result = await updateProfile(data);
    setSaving(false);

    if (result === null) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSaved?.();
    }, 1500);
  }

  // Generate year options for driving since
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="profile-form__row">
        <div className="profile-form__field">
          <label htmlFor="firstName">{t("fields.first_name")}</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            defaultValue={profile?.firstName || ""}
            placeholder={t("fields.first_name_placeholder")}
          />
        </div>
        <div className="profile-form__field">
          <label htmlFor="lastName">{t("fields.last_name")}</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            defaultValue={profile?.lastName || ""}
            placeholder={t("fields.last_name_placeholder")}
          />
        </div>
      </div>

      <div className="profile-form__field">
        <label htmlFor="phone">{t("fields.phone")}</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={profile?.phone || ""}
          placeholder={t("fields.phone_placeholder")}
        />
      </div>

      <div className="profile-form__row">
        <div className="profile-form__field">
          <label htmlFor="city">{t("profile.city")}</label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            defaultValue={profile?.city || ""}
            placeholder={t("profile.city_placeholder")}
          />
        </div>
        <div className="profile-form__field">
          <label htmlFor="country">{t("profile.country")}</label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            defaultValue={profile?.country || ""}
            placeholder="UA"
          />
        </div>
      </div>

      <div className="profile-form__field">
        <label htmlFor="address">{t("profile.address")}</label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          defaultValue={profile?.address || ""}
          placeholder={t("profile.address_placeholder")}
        />
      </div>

      <div className="profile-form__row">
        <CustomSelect
          name="drivingSince"
          label={t("profile.driving_since")}
          placeholder={t("profile.select_year")}
          defaultValue={profile?.drivingSince ? String(profile.drivingSince) : ""}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
        />
        <CustomSelect
          name="dateOfBirth"
          label={t("profile.date_of_birth")}
          placeholder={t("profile.select_year")}
          defaultValue={profile?.dateOfBirth ? String(new Date(profile.dateOfBirth).getFullYear()) : ""}
          options={Array.from({ length: currentYear - 1940 + 1 }, (_, i) => ({
            value: String(currentYear - 18 - i),
            label: String(currentYear - 18 - i),
          }))}
        />
      </div>

      <div className="profile-form__section">
        <label className="profile-form__section-label">{t("profile.languages_label")}</label>
        <div className="profile-form__langs-row">
          <button
            type="button"
            onClick={() => setLangModalOpen(true)}
            className="profile-form__langs-btn"
          >
            {languages.length > 0 ? t("profile.change_languages") : t("profile.add_languages")}
          </button>
          {languages.length > 0 && (
            <span className="profile-form__langs-list">
              {languages.map((key) => t(`languages.${key}` as any)).join(", ")}
            </span>
          )}
        </div>

        {langModalOpen && (
          <div
            className="langs-modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLangModalOpen(false);
            }}
          >
            <div className="langs-modal">
              <div className="langs-modal__header">
                <button
                  type="button"
                  className="langs-modal__close"
                  onClick={() => setLangModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="langs-modal__body">
                <h3 className="langs-modal__title">{t("profile.languages_label")}</h3>
                <div className="langs-modal__search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t("profile.language_search")}
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                  />
                </div>
                <div className="langs-modal__list">
                  {LANGUAGE_KEYS
                    .filter((key) => t(`languages.${key}` as any).toLowerCase().includes(langSearch.toLowerCase()))
                    .sort((a, b) => {
                      const aSelected = languages.includes(a);
                      const bSelected = languages.includes(b);
                      if (aSelected && !bSelected) return -1;
                      if (!aSelected && bSelected) return 1;
                      return t(`languages.${a}` as any).localeCompare(t(`languages.${b}` as any));
                    })
                    .map((key) => (
                      <label key={key} className="langs-modal__item">
                        <span>{t(`languages.${key}` as any)}</span>
                        <input
                          type="checkbox"
                          checked={languages.includes(key)}
                          onChange={() => toggleLang(key)}
                          className="langs-modal__checkbox"
                        />
                      </label>
                    ))}
                </div>
              </div>

              <div className="langs-modal__footer">
                <button
                  type="button"
                  className="langs-modal__save"
                  onClick={() => setLangModalOpen(false)}
                >
                  {t("profile.save_languages")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="profile-form__submit" disabled={saving}>
        {error ? t("profile.error") : saved ? "✓ " + t("profile.saved") : saving ? "..." : t("profile.save")}
      </button>
    </form>
  );
}
