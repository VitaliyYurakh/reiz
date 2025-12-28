"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";
import CurrencySelect from "@/components/CurrencySelect";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UiImage from "@/components/ui/UiImage";
import { Link } from "@/i18n/request";
import Icon from "@/components/Icon";
import AccordionItem from "@/components/AccordionItem";
import { useTranslations } from "next-intl";
import { lockScroll, unlockScroll } from "@/lib/utils/scroll";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/utils/functions";
import { useCatalogFilters } from "@/context/CatalogFiltersContext";
import { useThemeColorOnOpen } from "@/hooks/useThemeColorOnOpen";

type HeaderProps = {
  mode?: boolean;
  className?: string;
  onBeforeMenuOpen?: () => void;
};

export default function Header({
  mode = false,
  className,
  onBeforeMenuOpen,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const lastScrollTop = useRef<number>(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const asideT = useTranslations("aside.nav");
  const headerT = useTranslations("header");
  const pathname = usePathname();
  const catalogFilters = useCatalogFilters();

  const headerInMode = mode || catalogFilters?.filtersOpen || false;

  useThemeColorOnOpen(mobileMenuOpen);

  const isActive = (href: string) =>
    stripLocale(pathname) === stripLocale(href);

  const setMenuOpen = useCallback((open: boolean) => {
    setMobileMenuOpen(open);
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, []);

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      catalogFilters?.setFiltersOpen(false);
      onBeforeMenuOpen?.();
    }
    setMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const SCROLL_THRESHOLD = 5; // Minimum scroll delta to trigger state change
    let isHeaderVisible = true; // Start as visible

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const root = document.documentElement;
      const scrollDelta = scrollTop - lastScrollTop.current;

      if (scrollTop > 40) {
        headerRef.current?.classList.add("sticky");

        // Only change state if scroll delta exceeds threshold
        if (Math.abs(scrollDelta) > SCROLL_THRESHOLD) {
          if (scrollDelta > 0) {
            // Scrolling down - hide header
            if (isHeaderVisible) {
              headerRef.current?.classList.add("sticky-hidden");
              headerRef.current?.classList.remove("sticky-visible");
              root.style.setProperty('--header-offset', '0px');
              isHeaderVisible = false;
            }
          } else {
            // Scrolling up - show header
            if (!isHeaderVisible) {
              headerRef.current?.classList.add("sticky-visible");
              headerRef.current?.classList.remove("sticky-hidden");
              root.style.setProperty('--header-offset', '56px');
              isHeaderVisible = true;
            }
          }
        }
      } else {
        headerRef.current?.classList.remove("sticky");
        headerRef.current?.classList.remove("sticky-visible");
        headerRef.current?.classList.remove("sticky-hidden");
        // At top of page, header is visible in normal position
        root.style.setProperty('--header-offset', '56px');
        isHeaderVisible = true; // Reset to visible at top
      }

      lastScrollTop.current = scrollTop;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   const handleCloseMenu = () => {
  //   }
  //   window.addEventListener('REIZ_CLOSE_MOBILE_MENU_EVENT', handleCloseMenu);
  //   return () => {
  //     window.removeEventListener('REIZ_CLOSE_MOBILE_MENU_EVENT', handleCloseMenu);
  //   };
  // }, []);

  useEffect(
    () => () => {
      unlockScroll();
    },
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 11
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname, setMenuOpen]);

  const links = [
    { href: "/", label: asideT("home") },
    {
      label: asideT("cars_title"),
      subLinks: [
        { href: "/rental/kyiv", label: asideT("cars_link1") },
        { href: "/rental/lviv", label: asideT("cars_link2") },
        { href: "/rental/ternopil", label: asideT("cars_link3") },
        { href: "/rental/odesa", label: asideT("cars_link4") },
        { href: "/rental/dnipro", label: asideT("cars_link5") },
        { href: "/rental/kharkiv", label: asideT("cars_link6") },
        { href: "/rental/bukovel", label: asideT("cars_link7") },
        { href: "/rental/truskavets", label: asideT("cars_link8") },
        { href: "/rental/ivano-frankivsk", label: asideT("cars_link9") },
      ],
    },
    { href: "/insurance", label: asideT("insurance") },
    { href: "/business", label: asideT("business") },
    { href: "/certificate", label: asideT("certificates") },
    { href: "/terms", label: asideT("terms") },
    { href: "/faq", label: asideT("faq") },
    { href: "/invest", label: asideT("invest") },
    { href: "/blog", label: asideT("blog") },
    { href: "/about", label: asideT("about") },
    { href: "/contacts", label: asideT("contacts") },
  ];

  return (
    <>
      <header
        className={cn(
          "header fixed-block",
          headerInMode && "mode",
          className,
          mobileMenuOpen && "open-menu",
        )}
        ref={headerRef}
      >
        <div
          className="container"
          data-aos="fade-down"
          data-aos-duration="700"
          data-aos-delay="700"
        >
          <div className="header__inner">
            <button
              className={cn("burger", mobileMenuOpen && "active")}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? headerT("close_menu") : headerT("open_menu")}
              aria-expanded={mobileMenuOpen}
            >
              <span className="burger__line" />
            </button>

            <Link href="/" className="logo">
              REIZ RENTAL
            </Link>

            <a
              href="tel:+380635471186"
              className="phone-link"
              aria-label={headerT("call")}
            >
              <i className="sprite">
                <Icon id={"phone"} width={30} height={30} />
              </i>
            </a>

            <div className={cn("mobile", mobileMenuOpen && "active")}>
              <div className="mobile__box">
                <div className="header__choice">
                  <LanguageSwitcher />
                  <CurrencySelect />
                </div>

                <div className="header__wrapper">
                  <nav className="main-nav">
                    <ul>
                      {links.map((link, index) =>
                        link.href ? (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className={
                                isActive(link.href) ? "active" : undefined
                              }
                            >
                              {link.label}
                            </Link>
                          </li>
                        ) : (
                          <li key={link.label}>
                            <ul className="main-nav__acc" key={link.label}>
                              <AccordionItem
                                title={link.label}
                                content={link.subLinks?.map((sublink) => (
                                  <Link
                                    className={
                                      isActive(sublink.href)
                                        ? "active"
                                        : undefined
                                    }
                                    key={sublink.label}
                                    href={sublink.href}
                                  >
                                    {sublink.label}
                                  </Link>
                                ))}
                                buttonClassName={"main-nav__acc-btn"}
                                liClassName={"main-nav__acc-item"}
                                contentClassName={"main-nav__acc-content"}
                                i={index}
                              />
                            </ul>
                          </li>
                        ),
                      )}
                    </ul>
                  </nav>

                  <div className="header__links">
                    <a href="tel:+380635471186" className="tel-link">
                      +38 (063) 547 11 86
                    </a>
                    <a
                      href="#"
                      className="header__link"
                      aria-label="REIZ в WhatsApp"
                    >
                      <span className="default">
                        <UiImage
                          width={26}
                          height={26}
                          src="/img/icons/whatsapp.svg"
                          alt="REIZ в WhatsApp"
                        />
                      </span>
                      <span className="hover">
                        <UiImage
                          width={26}
                          height={26}
                          src="/img/icons/whatsapp_hover.svg"
                          alt="REIZ в WhatsApp"
                        />
                      </span>
                    </a>
                    <a
                      href="#"
                      className="header__link"
                      aria-label="REIZ в Telegram"
                    >
                      <span className="default">
                        <UiImage
                          width={26}
                          height={26}
                          src="/img/icons/Telegram_logo.svg"
                          alt="REIZ в Telegram"
                        />
                      </span>
                      <span className="hover">
                        <UiImage
                          width={26}
                          height={26}
                          src="/img/icons/tg_hover.svg"
                          alt="REIZ в Telegram"
                        />
                      </span>
                    </a>
                    <a
                      href="https://www.instagram.com/reiz.rental?igsh=MXY4bmMyMjl0YWNtYg=="
                      className="header__link"
                      aria-label="REIZ в Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="default">
                        <UiImage
                          width={26}
                          height={26}
                          src="/img/icons/ingsta.svg"
                          alt="REIZ в Instagram"
                        />
                      </span>
                      <span className="hover">
                        <UiImage
                          width={26}
                          height={26}
                          src="/img/icons/INST_hover.svg"
                          alt="REIZ в Instagram"
                        />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={cn("overlay fixed-block", mobileMenuOpen && "active")} />
    </>
  );
}
