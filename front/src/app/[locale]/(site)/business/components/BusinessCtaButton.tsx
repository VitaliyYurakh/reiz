"use client";

import { useBusinessModal } from "@/app/[locale]/(site)/business/components/modals";

export default function BusinessCtaButton({
  label,
  className = "business-cta-section__btn",
}: {
  label: string;
  className?: string;
}) {
  const { open } = useBusinessModal("offer");

  return (
    <button
      type="button"
      className={className}
      onClick={() => open({})}
    >
      {label}
    </button>
  );
}
