"use client";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { Link } from "@/i18n/request";
import { useRef, useState } from "react";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { stripLocale } from "@/lib/utils/functions";
import { useSideBarModal } from "@/components/modals";

export default function SidebarNav() {
  const pathname = usePathname();
  const [openAcc, setOpenAcc] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("aside");
  const { open: openRequestModal } = useSideBarModal("requestCall");
  const { open: openManagerModal } = useSideBarModal(
    "managerWillContactYouModal",
  );

  const isActive = (href: string) =>
    stripLocale(pathname) === stripLocale(href);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    {
      label: t("nav.cars_title"),
      subLinks: [
        { href: "/rental/kyiv", label: t("nav.cars_link1") },
        { href: "/rental/lviv", label: t("nav.cars_link2") },
        { href: "/rental/ternopil", label: t("nav.cars_link3") },
        { href: "/rental/odesa", label: t("nav.cars_link4") },
        { href: "/rental/dnipro", label: t("nav.cars_link5") },
        { href: "/rental/kharkiv", label: t("nav.cars_link6") },
        { href: "/rental/bukovel", label: t("nav.cars_link7") },
        { href: "/rental/truskavets", label: t("nav.cars_link8") },
        { href: "/rental/ivano-frankivsk", label: t("nav.cars_link9") },
        { href: "/rental/uzhhorod", label: t("nav.cars_link10") },
        { href: "/rental/vinnytsia", label: t("nav.cars_link11") },
        { href: "/rental/mukachevo", label: t("nav.cars_link12") },
        { href: "/rental/chernivtsi", label: t("nav.cars_link13") },
        { href: "/rental/poltava", label: t("nav.cars_link14") },
        { href: "/rental/zaporizhzhia", label: t("nav.cars_link15") },
        { href: "/rental/boryspil", label: t("nav.cars_link16") },
      ],
    },
    { href: "/insurance", label: t("nav.insurance") },
    { href: "/business", label: t("nav.business") },
    { href: "/certificate", label: t("nav.certificates") },
    { href: "/terms", label: t("nav.terms") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/invest", label: t("nav.invest") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about", label: t("nav.about") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  return (
    <aside
      className="aside"
      data-aos="fade-right"
      data-aos-duration={900}
      data-aos-delay={400}
    >
      <div className="aside__top">
        <Link href="/" className="aside__title">
          REIZ
        </Link>
        <p>{t("subtitle")}</p>
      </div>

      <nav className="main-nav">
        <ul>
          {navLinks.map((link) =>
            link.href ? (
              <li key={link.href}>
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? "active" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              <ul className="main-nav__acc" key={link.label}>
                <li
                  className={cn("main-nav__acc-item", openAcc ? "active" : "")}
                >
                  <button
                    className={cn("main-nav__acc-btn", openAcc ? "active" : "")}
                    onClick={() => setOpenAcc(!openAcc)}
                    data-id="1"
                  >
                    {link.label}
                    <i className="sprite">
                      <Icon id="arrow-d" width={11} height={8} />
                    </i>
                  </button>
                  <div
                    ref={ref}
                    className={cn(
                      "main-nav__acc-content",
                      openAcc ? "active" : "",
                    )}
                    style={{
                      maxHeight: openAcc
                        ? `${ref.current?.scrollHeight ?? 500}px`
                        : "0px",
                      overflow: openAcc ? "visible" : "hidden",
                    }}
                    data-content="1"
                  >
                    {link.subLinks?.map((sublink) => (
                      <Link href={sublink.href} key={sublink.label}>
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                </li>
              </ul>
            ),
          )}
        </ul>
      </nav>

      <a
        href="#"
        className="main-button"
        onClick={(e) => {
          e.preventDefault();
          openRequestModal({}, (phone: string) => {
            setTimeout(() => {
              openManagerModal({
                type: "call_request",
                phone,
                showCloseButton: true,
              });
            }, 500);
          });
        }}
      >
        {t("cta_button")}
      </a>
    </aside>
  );
}
