"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/request";

const NAV_ITEMS = [
  { key: "profile", href: "/account", icon: "user" },
  { key: "bookings", href: "/account/bookings", icon: "calendar" },
  { key: "history", href: "/account/history", icon: "history" },
  { key: "complaints", href: "/account/complaints", icon: "message" },
  { key: "favorites", href: "/account/favorites", icon: "heart" },
  { key: "notifications", href: "/account/notifications", icon: "bell" },
  { key: "privacy", href: "/account/privacy", icon: "shield" },
] as const;

type IconName = (typeof NAV_ITEMS)[number]["icon"] | "logout";

function NavIcon({ name }: { name: IconName }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "account-sidebar__icon",
  };
  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.07L12 21.23l7.78-7.78 1.06-1.07a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AccountSidebar() {
  const t = useTranslations("account.nav");
  const pathname = usePathname();

  const cleanPath = pathname.replace(/^\/(uk|ru|en|pl|ro)/, "") || "/";

  return (
    <nav className="account-sidebar">
      <ul className="account-sidebar__list">
        {NAV_ITEMS.map(({ key, href, icon }) => {
          const isActive =
            href === "/account"
              ? cleanPath === "/account"
              : cleanPath.startsWith(href);

          return (
            <li key={key}>
              <Link
                href={href}
                className={`account-sidebar__link${isActive ? " account-sidebar__link--active" : ""}`}
              >
                <NavIcon name={icon} />
                <span>{t(key)}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="account-sidebar__link account-sidebar__link--logout"
          >
            <NavIcon name="logout" />
            <span>{t("logout")}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
