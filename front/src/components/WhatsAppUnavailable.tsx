"use client";

import UiImage from "@/components/ui/UiImage";

export default function WhatsAppUnavailable({
  message,
  size = 22,
  className,
  children,
  hideIcon = false,
}: {
  message: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
  hideIcon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => alert(message)}
      className={className}
      aria-label="WhatsApp"
    >
      {!hideIcon && (
        <UiImage
          width={size}
          height={size}
          src="/img/icons/whatsapp.svg"
          alt="WhatsApp"
        />
      )}
      {children}
    </button>
  );
}
