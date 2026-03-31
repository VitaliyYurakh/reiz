"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link } from "@/i18n/request";

const CATALOG_SECTION_ID = "catalog";
const SCROLL_STORAGE_KEY = "scrollToCatalog";

const scrollToCatalog = (section: HTMLElement) => {
  const targetPosition = section.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 600;
  let startTime: number | null = null;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

    if (elapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

type CatalogLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: "/#catalog";
};

export default function CatalogLink({
  href = "/#catalog",
  onClick,
  ...props
}: CatalogLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const section = document.getElementById(CATALOG_SECTION_ID);
    if (section) {
      event.preventDefault();
      scrollToCatalog(section);
      return;
    }

    sessionStorage.setItem(SCROLL_STORAGE_KEY, "1");
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
