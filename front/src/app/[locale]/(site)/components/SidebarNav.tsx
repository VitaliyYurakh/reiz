"use client";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/request";
import { useRef, useState } from "react";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { stripLocale } from "@/lib/utils/functions";
import { useSideBarModal } from "@/components/modals";
import UiImage from "@/components/ui/UiImage";

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
        { href: "/rental/odesa", label: t("nav.cars_link4") },
        { href: "/rental/dnipro", label: t("nav.cars_link5") },
        { href: "/rental/kharkiv", label: t("nav.cars_link6") },
        { href: "/rental/zaporizhzhia", label: t("nav.cars_link15") },
        { href: "/rental/boryspil", label: t("nav.cars_link16") },
        { href: "/rental/bukovel", label: t("nav.cars_link7") },
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
        <Link href="/" className="aside__logo">
          <UiImage
            src="/img/icons/reiz-logo.svg"
            alt="REIZ Car Rental"
            width={160}
            height={73}
          />
        </Link>
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
              <li key={link.label}>
                <ul className="main-nav__acc">
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
                        <img
                          src={
                            openAcc
                              ? "/img/icons/minus.svg"
                              : "/img/icons/plus.svg"
                          }
                          alt={
                            openAcc
                              ? t("controls.collapse")
                              : t("controls.expand")
                          }
                          width={16}
                          height={16}
                        />
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
                        overflow: "hidden",
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
              </li>
            ),
          )}
        </ul>
      </nav>

      <button
        type="button"
        className="main-button"
        onClick={() => {
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
      </button>
    </aside>
  );
}
