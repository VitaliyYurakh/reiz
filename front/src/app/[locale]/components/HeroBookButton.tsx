"use client";

import { useSideBarModal } from "@/components/modals";

export default function HeroBookButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSideBarModal("bookingContact");

  return (
    <button type="button" className={className} onClick={() => open()}>
      {children}
    </button>
  );
}
