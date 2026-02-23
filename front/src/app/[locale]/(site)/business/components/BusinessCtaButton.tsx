"use client";

import { useBusinessModal } from "@/app/[locale]/(site)/business/components/modals";

export default function BusinessCtaButton({ label }: { label: string }) {
  const { open } = useBusinessModal("offer");

  return (
    <button
      type="button"
      className="business-cta-section__btn"
      onClick={() => open({})}
    >
      {label}
    </button>
  );
}
