"use client";

import CurrencySelect from "@/components/CurrencySelect";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UiImage from "@/components/ui/UiImage";
import { useTranslations } from "next-intl";
import { SOCIAL_LINKS } from "@/config/social";

export default function UtilityBar() {
  const headerT = useTranslations("header");

  return (
    <div className="utility-bar">
      <div className="utility-bar__links">
        <button
          type="button"
          className="utility-bar__link"
          aria-label="WhatsApp"
          onClick={() => alert(headerT("whatsapp_unavailable"))}
        >
          <span className="default">
            <UiImage
              width={26}
              height={26}
              src="/img/icons/whatsapp.svg"
              alt="WhatsApp"
            />
          </span>
        </button>
        <a
          href={SOCIAL_LINKS.telegram}
          className="utility-bar__link"
          aria-label="REIZ в Telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="default">
            <UiImage
              width={26}
              height={26}
              src="/img/icons/telegram.svg"
              alt="REIZ в Telegram"
            />
          </span>
          <span className="hover">
            <UiImage
              width={26}
              height={26}
              src="/img/icons/telegram-hover.svg"
              alt="REIZ в Telegram"
            />
          </span>
        </a>
        <a
          href={SOCIAL_LINKS.instagram}
          className="utility-bar__link"
          aria-label="REIZ в Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="default">
            <UiImage
              width={26}
              height={26}
              src="/img/icons/instagram-color.svg"
              alt="REIZ в Instagram"
            />
          </span>
          <span className="hover">
            <UiImage
              width={26}
              height={26}
              src="/img/icons/instagram-hover.svg"
              alt="REIZ в Instagram"
            />
          </span>
        </a>
      </div>

      <div className="utility-bar__controls">
        <LanguageSwitcher />
        <CurrencySelect />
      </div>

      <button
        type="button"
        className="utility-bar__profile"
        aria-label="Profile"
      >
        <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15.5" stroke="currentColor" />
          <circle cx="16" cy="13" r="4.5" stroke="currentColor" />
          <path d="M8 25.5C8 25.5 10 21 16 21C22 21 24 25.5 24 25.5" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
