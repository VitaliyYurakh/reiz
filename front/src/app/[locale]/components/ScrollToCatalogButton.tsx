"use client";

import type { ReactNode } from "react";

export default function ScrollToCatalogButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const section = document.getElementById("catalog");
    if (!section) return;

    const targetPosition =
      section.getBoundingClientRect().top + window.scrollY;
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
      if (elapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
