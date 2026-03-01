"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  href: string;
};

export default function StickyInvestCta({ label, href }: Props) {
  const [visible, setVisible] = useState(false);
  const heroVisible = useRef(true);
  const formVisible = useRef(false);

  useEffect(() => {
    const hero = document.querySelector(".invest-page__hero");
    const form = document.getElementById("invest-form");
    if (!hero || !form) return;

    const update = () => {
      setVisible(!heroVisible.current && !formVisible.current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) {
            heroVisible.current = entry.isIntersecting;
          } else if (entry.target === form) {
            formVisible.current = entry.isIntersecting;
          }
        }
        update();
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    observer.observe(form);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`invest-page__sticky-cta ${visible ? "" : "invest-page__sticky-cta--hidden"}`}
    >
      <a href={href} className="main-button main-button--black">
        {label}
      </a>
    </div>
  );
}
