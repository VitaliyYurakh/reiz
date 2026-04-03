"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/request";

const BACK_HREF = "/";

const NAV_ITEMS = [
  { key: "profile", href: "/account" },
  { key: "bookings", href: "/account/bookings" },
  { key: "history", href: "/account/history" },
  { key: "favorites", href: "/account/favorites" },
  { key: "notifications", href: "/account/notifications" },
  { key: "privacy", href: "/account/privacy" },
] as const;

export default function AccountSidebar() {
  const t = useTranslations("account.nav");
  const pathname = usePathname();

  const cleanPath = pathname.replace(/^\/(uk|ru|en|pl|ro)/, "") || "/";

  return (
    <nav className="account-sidebar">
      <ul className="account-sidebar__list">
        {NAV_ITEMS.map(({ key, href }) => {
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
                {t(key)}
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
            {t("logout")}
          </button>
        </li>
      </ul>
    </nav>
  );
}
