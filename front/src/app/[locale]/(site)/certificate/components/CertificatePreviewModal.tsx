"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { lockScroll, unlockScroll } from "@/lib/utils/scroll";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CertificatePreviewModal({ isOpen, onClose }: Props) {
  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Lock/unlock scroll and add keyboard listener
  useEffect(() => {
    if (isOpen) {
      lockScroll();
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (isOpen) {
        unlockScroll();
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isOpen, handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`cert-preview-modal-overlay ${isOpen ? "is-open" : ""}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`cert-preview-modal ${isOpen ? "is-open" : ""}`}>
        {/* Close button */}
        <button
          type="button"
          className="cert-preview-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Certificate image */}
        <div className="cert-preview-modal__image">
          <Image
            src="/img/certificate.png"
            alt="Certificate preview"
            width={800}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  );
}
