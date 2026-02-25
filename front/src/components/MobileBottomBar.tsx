"use client";

import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import UiImage from "@/components/ui/UiImage";
import { SOCIAL_LINKS } from "@/config/social";
import { Link } from "@/i18n/request";
import { useTranslations } from "next-intl";

export default function MobileBottomBar() {
  const [visible, setVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const lastDirection = useRef<"up" | "down" | null>(null);
  const directionChangeScrollTop = useRef(0);
  const t = useTranslations("mobileBar");

  useEffect(() => {
    const SCROLL_THRESHOLD = 15;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollDelta = scrollTop - lastScrollTop.current;
      const currentDirection =
        scrollDelta > 0 ? "down" : scrollDelta < 0 ? "up" : lastDirection.current;

      if (currentDirection !== lastDirection.current && currentDirection !== null) {
        directionChangeScrollTop.current = scrollTop;
        lastDirection.current = currentDirection;
      }

      const distance = Math.abs(scrollTop - directionChangeScrollTop.current);

      if (distance > SCROLL_THRESHOLD) {
        if (currentDirection === "down" && visible) {
          setVisible(false);
        } else if (currentDirection === "up" && !visible) {
          setVisible(true);
        }
      }

      if (scrollTop <= 40) {
        setVisible(true);
      }

      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <nav
      className={cn("mobile-bar", !visible && "mobile-bar--hidden")}
      aria-label={t("aria_label")}
    >
      <a href="tel:+380635471186" className="mobile-bar__item">
        <UiImage
          width={22}
          height={22}
          src="/img/icons/phone-receiver.svg"
          alt=""
        />
        <span>{t("call")}</span>
      </a>

      <Link href="/#catalog" className="mobile-bar__item">
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>{t("cars")}</span>
      </Link>

      <a
        href={SOCIAL_LINKS.telegram}
        className="mobile-bar__item"
        target="_blank"
        rel="noopener noreferrer"
      >
        <UiImage
          width={22}
          height={22}
          src="/img/icons/telegram.svg"
          alt=""
        />
        <span>Telegram</span>
      </a>

      <a
        href={SOCIAL_LINKS.whatsapp}
        className="mobile-bar__item"
        target="_blank"
        rel="noopener noreferrer"
      >
        <UiImage
          width={22}
          height={22}
          src="/img/icons/whatsapp.svg"
          alt=""
        />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
