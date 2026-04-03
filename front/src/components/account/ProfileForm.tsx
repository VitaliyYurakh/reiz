"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/lib/api/customer";
import CustomSelect from "./CustomSelect";

const ALL_LANGUAGES = [
  "Амслен", "Бразильський жестовий", "Британський жестовий",
  "Азербайджанська", "Албанська", "Англійська", "Арабська",
  "Вірменська", "Африкаанс", "Баскська", "Білоруська",
  "Бенгальська", "Бірманська", "Болгарська", "Боснійська",
  "Угорська", "В'єтнамська", "Галісійська", "Грецька",
  "Грузинська", "Гуджараті", "Данська", "Зулу", "Іврит",
  "Індонезійська", "Ірландська", "Ісландська", "Іспанська",
  "Італійська", "Каннада", "Каталонська", "Киргизька",
  "Китайська", "Корейська", "Коса", "Кхмерська", "Лаоська",
  "Латвійська", "Литовська", "Македонська", "Малайська",
  "Мальтійська", "Німецька", "Нідерландська", "Норвезька",
  "Панджабі", "Перська", "Польська", "Португальська",
  "Румунська", "Російська", "Сербська", "Словацька",
  "Словенська", "Суахілі", "Тагальська", "Тайська",
  "Тамільська", "Телугу", "Турецька", "Українська", "Урду",
  "Філіппінська", "Фінська", "Французька", "Гінді",
  "Хорватська", "Чеська", "Шведська", "Естонська", "Японська",
];

const STORAGE_KEY = "reiz_user_languages";

interface ProfileFormProps {
  profile: any;
  onSaved?: () => void;
}

export default function ProfileForm({ profile, onSaved }: ProfileFormProps) {
  const t = useTranslations("account");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLanguages(JSON.parse(saved));
  }, []);

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
    const data: Record<string, string> = {};
    for (const [key, value] of fd.entries()) {
      data[key] = value as string;
    }

    await updateProfile(data);
    setSaving(false);
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
          <label htmlFor="city">Місто</label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            defaultValue={profile?.city || ""}
            placeholder="Київ"
          />
        </div>
        <div className="profile-form__field">
          <label htmlFor="country">Країна</label>
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
        <label htmlFor="address">Адреса</label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          defaultValue={profile?.address || ""}
          placeholder="Вулиця, будинок, квартира"
        />
      </div>

      <div className="profile-form__row">
        <CustomSelect
          name="drivingSince"
          label="Рік отримання водійських прав"
          placeholder="Оберіть рік"
          defaultValue={profile?.drivingSince || ""}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
        />
        <CustomSelect
          name="dateOfBirth"
          label="Рік народження водія"
          placeholder="Оберіть рік"
          defaultValue={profile?.dateOfBirth ? String(new Date(profile.dateOfBirth).getFullYear()) : ""}
          options={Array.from({ length: currentYear - 1940 + 1 }, (_, i) => ({
            value: String(currentYear - 18 - i),
            label: String(currentYear - 18 - i),
          }))}
        />
      </div>

      <div className="profile-form__section">
        <label className="profile-form__section-label">Мови, на яких ви розмовляєте</label>
        <div className="profile-form__langs-row">
          <button
            type="button"
            onClick={() => setLangModalOpen(true)}
            className="profile-form__langs-btn"
          >
            {languages.length > 0 ? "Змінити мови" : "Додати мови"}
          </button>
          {languages.length > 0 && (
            <span className="profile-form__langs-list">
              {languages.join(", ")}
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
                <h3 className="langs-modal__title">Мови, на яких ви розмовляєте</h3>
                <div className="langs-modal__search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Пошук мови"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                  />
                </div>
                <div className="langs-modal__list">
                  {ALL_LANGUAGES
                    .filter((l) => l.toLowerCase().includes(langSearch.toLowerCase()))
                    .sort((a, b) => {
                      const aSelected = languages.includes(a);
                      const bSelected = languages.includes(b);
                      if (aSelected && !bSelected) return -1;
                      if (!aSelected && bSelected) return 1;
                      return 0;
                    })
                    .map((lang) => (
                      <label key={lang} className="langs-modal__item">
                        <span>{lang}</span>
                        <input
                          type="checkbox"
                          checked={languages.includes(lang)}
                          onChange={() => toggleLang(lang)}
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
                  Зберегти
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="profile-form__submit" disabled={saving}>
        {saved ? "✓ " + t("profile.saved") : saving ? "..." : t("profile.save")}
      </button>
    </form>
  );
}
