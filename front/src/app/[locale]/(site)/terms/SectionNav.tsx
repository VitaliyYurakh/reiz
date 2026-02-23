"use client";

import { useEffect, useRef, useState } from "react";
import cn from "classnames";

type NavItem = { id: string; label: string };

interface SectionNavProps {
  items: NavItem[];
  ariaLabel: string;
  goToSection: string;
}

export default function SectionNav({
  items,
  ariaLabel,
  goToSection,
}: SectionNavProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = items.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  /* keep the active chip visible (horizontal only, no page scroll) */
  useEffect(() => {
    const list = navRef.current?.querySelector(
      ".terms-anchors__list",
    ) as HTMLElement | null;
    const btn = navRef.current?.querySelector(
      `[data-anchor="${active}"]`,
    ) as HTMLElement | null;
    if (!list || !btn) return;
    const left = btn.offsetLeft - list.offsetWidth / 2 + btn.offsetWidth / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <div className="terms-anchors" ref={navRef}>
      <nav className="terms-anchors__list" aria-label={ariaLabel}>
        {items.map((s) => (
          <button
            key={s.id}
            type="button"
            data-anchor={s.id}
            className={cn("terms-anchors__chip", active === s.id && "active")}
            onClick={() => scrollTo(s.id)}
            aria-label={`${goToSection} ${s.label}`}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
