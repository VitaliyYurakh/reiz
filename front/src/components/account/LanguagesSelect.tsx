"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "reiz_user_languages";

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

interface LanguagesSelectProps {
  languages?: unknown;
}

export default function LanguagesSelect({ languages }: LanguagesSelectProps) {
  const t = useTranslations("account.profile");
  const tLang = useTranslations("account.languages");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    let langs: string[] = [];
    if (languages && Array.isArray(languages) && languages.length > 0) {
      langs = migrateLanguages(languages);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) langs = migrateLanguages(JSON.parse(saved));
    }
    setSelected(langs);
    if (langs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(langs));
    }
  }, [languages]);

  if (selected.length === 0) return null;

  return (
    <div className="account-profile-info__item">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{t("languages_display")} {selected.map((key) => tLang(key as any)).join(", ")}</span>
    </div>
  );
}
