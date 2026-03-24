"use client";

import UiImage from "@/components/ui/UiImage";

export default function WhatsAppUnavailable({
  message,
  size = 22,
  className,
  children,
}: {
  message: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => alert(message)}
      className={className}
      aria-label="WhatsApp"
    >
      <UiImage width={size} height={size} src="/img/icons/whatsapp.svg" alt="WhatsApp" />
      {children}
    </button>
  );
}
