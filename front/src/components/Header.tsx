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
import { SOCIAL_LINKS } from "@/config/social";

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
    const SCROLL_THRESHOLD = 15; // Larger threshold to prevent flickering
    let isHeaderVisible = true;
    let lastDirection: 'up' | 'down' | null = null;
    let directionChangeScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const root = document.documentElement;
      const scrollDelta = scrollTop - lastScrollTop.current;

      if (scrollTop > 40) {
        headerRef.current?.classList.add("sticky");

        // Determine scroll direction
        const currentDirection = scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : lastDirection;

        // If direction changed, record position
        if (currentDirection !== lastDirection && currentDirection !== null) {
          directionChangeScrollTop = scrollTop;
          lastDirection = currentDirection;
        }

        // Calculate distance scrolled since direction change
        const distanceSinceChange = Math.abs(scrollTop - directionChangeScrollTop);

        // Only change visibility after scrolling threshold distance in same direction
        if (distanceSinceChange > SCROLL_THRESHOLD) {
          if (currentDirection === 'down' && isHeaderVisible) {
            // Hide header
            headerRef.current?.classList.add("sticky-hidden");
            headerRef.current?.classList.remove("sticky-visible");
            root.style.setProperty('--header-offset', '0px');
            isHeaderVisible = false;
          } else if (currentDirection === 'up' && !isHeaderVisible) {
            // Show header
            headerRef.current?.classList.add("sticky-visible");
            headerRef.current?.classList.remove("sticky-hidden");
            root.style.setProperty('--header-offset', '56px');
            isHeaderVisible = true;
          }
        }
      } else {
        // At top of page
        headerRef.current?.classList.remove("sticky");
        headerRef.current?.classList.remove("sticky-visible");
        headerRef.current?.classList.remove("sticky-hidden");
        root.style.setProperty('--header-offset', '56px');
        isHeaderVisible = true;
        lastDirection = null;
        directionChangeScrollTop = scrollTop;
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
        { href: "/rental/odesa", label: asideT("cars_link4") },
        { href: "/rental/kharkiv", label: asideT("cars_link6") },
        { href: "/rental/dnipro", label: asideT("cars_link5") },
        { href: "/rental/zaporizhzhia", label: asideT("cars_link15") },
        { href: "/rental/boryspil", label: asideT("cars_link16") },
        { href: "/rental/bukovel", label: asideT("cars_link7") },
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
              <svg width={80} height={17} viewBox="0 0 662 141" fill="currentColor" role="img" aria-label="REIZ">
                <path d="M117.975 81.6291C117.923 81.6414 117.874 81.6683 117.836 81.7069C117.798 81.7455 117.772 81.7943 117.76 81.8478C117.748 81.9012 117.751 81.9574 117.768 82.01C117.786 82.0626 117.818 82.1096 117.86 82.1457L185.857 139.102C185.937 139.17 185.995 139.261 186.021 139.363C186.048 139.465 186.043 139.573 186.007 139.672C185.971 139.771 185.906 139.856 185.82 139.917C185.733 139.978 185.631 140.011 185.525 140.012H140.297C139.947 140.012 139.601 139.943 139.279 139.809C138.956 139.676 138.662 139.48 138.415 139.233C137.279 138.097 136.177 137.074 135.108 136.164C115.662 119.633 89.3239 97.4686 56.0925 69.6704C54.3191 68.1978 53.6252 67.0489 54.4424 65.0134C54.5317 64.7905 54.6851 64.5995 54.883 64.4648C55.0808 64.3301 55.3141 64.258 55.5527 64.2578C83.0991 64.2526 99.3807 64.2244 104.397 64.173C108.494 64.1318 112.907 63.4173 117.636 62.0295C126.033 59.5699 130.659 54.1727 131.237 45.4986C131.417 42.7948 131.384 40.3018 131.137 38.0196C129.279 20.5943 111.591 18.9906 97.8592 18.9366C80.4493 18.8749 60.2714 18.8698 37.3256 18.9212C37.1436 18.9212 36.969 18.9935 36.8403 19.1222C36.7116 19.2509 36.6393 19.4254 36.6393 19.6074V139.333C36.6393 139.511 36.5687 139.682 36.4429 139.807C36.3171 139.933 36.1464 140.004 35.9685 140.004H0.416339C0.305915 140.004 0.200014 139.96 0.121932 139.882C0.0438504 139.804 6.85119e-09 139.698 6.85128e-09 139.587V0.401025C-9.8511e-06 0.347718 0.0106185 0.294927 0.0312478 0.245774C0.0518772 0.196621 0.0820933 0.152092 0.120144 0.114759C0.158195 0.0774264 0.203316 0.0480466 0.252853 0.0283572C0.30239 0.00866771 0.355325 -0.000951018 0.408622 7.41134e-05C26.783 0.164561 64.4067 0.221127 113.28 0.169725C118.374 0.164585 124.46 0.917619 131.538 2.42884C139.186 4.06342 145.028 5.90617 149.063 7.95711C158.717 12.8609 166.704 22.1287 168.37 33.2315C170.228 45.6066 168.925 59.6779 160.089 68.7375C149.048 80.0485 133.674 81.0585 118.554 81.5365C118.405 81.5417 118.212 81.5725 117.975 81.6291Z" />
                <path d="M354.913 0.146606C354.997 0.146606 355.077 0.179936 355.136 0.23922C355.196 0.298505 355.229 0.378914 355.229 0.462755V18.42C355.229 18.4791 355.217 18.5375 355.194 18.5919C355.171 18.6462 355.137 18.6954 355.095 18.7364C355.053 18.7774 355.002 18.8094 354.947 18.8306C354.892 18.8517 354.833 18.8616 354.774 18.8595C348.832 18.6591 343.188 18.5665 337.842 18.582C336.028 18.5871 306.299 18.6745 248.657 18.8441C248.587 18.8441 248.518 18.8579 248.454 18.8846C248.389 18.9113 248.33 18.9505 248.281 18.9999C248.232 19.0493 248.192 19.108 248.166 19.1725C248.139 19.2371 248.125 19.3062 248.125 19.3761V52.862C248.125 53.1012 248.22 53.3307 248.389 53.4999C248.559 53.669 248.788 53.7641 249.027 53.7641H342.761C342.913 53.7641 343.058 53.8242 343.165 53.9312C343.272 54.0382 343.332 54.1833 343.332 54.3346V72.5232C343.332 72.6173 343.295 72.7075 343.23 72.7741C343.165 72.8406 343.077 72.8779 342.985 72.8779H248.788C248.625 72.8779 248.468 72.9421 248.352 73.0563C248.236 73.1706 248.171 73.3255 248.171 73.487V120.844C248.171 121.044 248.251 121.236 248.393 121.378C248.535 121.52 248.727 121.599 248.927 121.599H359.547C359.672 121.599 359.791 121.649 359.879 121.737C359.968 121.825 360.017 121.945 360.017 122.07V139.348C360.017 139.502 359.956 139.649 359.848 139.757C359.739 139.866 359.592 139.927 359.439 139.927H211.463C211.379 139.927 211.299 139.893 211.239 139.834C211.18 139.775 211.147 139.694 211.147 139.611V0.524404C211.147 0.424204 211.186 0.328144 211.255 0.257291C211.324 0.186439 211.419 0.146606 211.517 0.146606H354.913Z" />
                <path d="M435.702 0.162048H400.08C399.871 0.162048 399.702 0.33119 399.702 0.539846V139.649C399.702 139.858 399.871 140.027 400.08 140.027H435.702C435.91 140.027 436.079 139.858 436.079 139.649V0.539846C436.079 0.33119 435.91 0.162048 435.702 0.162048Z" />
                <path d="M535.049 121.052C535.041 121.116 535.047 121.181 535.067 121.243C535.086 121.304 535.118 121.361 535.161 121.409C535.204 121.457 535.257 121.496 535.316 121.522C535.375 121.548 535.439 121.561 535.504 121.561H659.987C660.06 121.561 660.131 121.59 660.183 121.642C660.235 121.694 660.264 121.765 660.264 121.838V139.888C660.264 139.933 660.245 139.976 660.212 140.008C660.179 140.04 660.134 140.058 660.087 140.058H467.036C466.872 140.059 466.71 140.012 466.572 139.922C466.433 139.833 466.324 139.705 466.257 139.555C466.19 139.404 466.168 139.238 466.194 139.075C466.22 138.912 466.293 138.761 466.404 138.639C468.655 136.146 472.272 132.566 477.252 127.899C484.485 121.129 492.264 114.267 498.887 107.528C502.866 103.488 507.816 99.5556 511.995 95.446C513.116 94.346 521.692 86.4146 537.724 71.652C556.183 54.6507 574.703 36.9171 593.269 19.6383C593.335 19.5782 593.381 19.4997 593.4 19.4131C593.42 19.3266 593.414 19.236 593.381 19.1533C593.349 19.0707 593.292 18.9998 593.218 18.9501C593.144 18.9004 593.057 18.8742 592.969 18.875H485.194C485.022 18.875 484.857 18.8067 484.736 18.6853C484.615 18.5638 484.546 18.399 484.546 18.2273V0.2931C484.546 0.241978 484.566 0.192964 484.601 0.156814C484.635 0.120665 484.682 0.100342 484.731 0.100342H661.22C661.355 0.100162 661.488 0.135059 661.605 0.201568C661.723 0.268078 661.821 0.363915 661.89 0.47974C661.959 0.595565 661.997 0.727407 662 0.86229C662.003 0.997173 661.971 1.13047 661.906 1.24917C661.531 1.95338 660.75 2.90948 659.563 4.11743C658.026 5.68005 652.132 11.288 641.883 20.9413C632.826 29.4689 617.454 43.7227 595.767 63.7026C583.038 75.4223 571.495 86.6639 561.541 95.7235C556.067 100.71 551.665 104.827 548.334 108.075C543.314 112.964 535.126 120.396 535.049 121.052Z" />
              </svg>
            </Link>

            <a
              href="tel:+380635471186"
              className="phone-link"
              aria-label={headerT("call")}
            >
              <i className="sprite">
                <Icon id={"phone"} width={34} height={34} />
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
                      href={SOCIAL_LINKS.whatsapp}
                      className="header__link"
                      aria-label="REIZ в WhatsApp"
                      target="_blank"
                      rel="noopener noreferrer"
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
                      href={SOCIAL_LINKS.telegram}
                      className="header__link"
                      aria-label="REIZ в Telegram"
                      target="_blank"
                      rel="noopener noreferrer"
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
                      href={SOCIAL_LINKS.instagram}
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
