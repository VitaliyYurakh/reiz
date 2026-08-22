"use client";

import { useSideBarModal } from "@/components/modals";
import { trackEvent } from "@/lib/analytics";

export default function HeroBookButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSideBarModal("bookingContact");

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackEvent("booking_contact_open", { source: "hero" });
        open();
      }}
    >
      {children}
    </button>
  );
}
