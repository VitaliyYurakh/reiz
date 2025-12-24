"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import UiImage from "@/components/ui/UiImage";
import { lockScroll, unlockScroll } from "@/lib/utils/scroll";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CertificatePreviewModal({ isOpen, onClose }: Props) {
  // Track visibility separately for animation
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isScrollLocked = useRef(false);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Handle scroll lock/unlock separately
  useEffect(() => {
    if (isOpen && !isScrollLocked.current) {
      lockScroll();
      isScrollLocked.current = true;
    } else if (!isOpen && isScrollLocked.current) {
      unlockScroll();
      isScrollLocked.current = false;
    }
  }, [isOpen]);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      // Opening: mount first, then animate
      setIsVisible(true);
      window.addEventListener("keydown", handleKeyDown);
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible) {
      // Closing: animate first, then unmount
      setIsAnimating(false);
      window.removeEventListener("keydown", handleKeyDown);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 400); // Match CSS transition duration
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isVisible, handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`cert-preview-modal-overlay ${isAnimating ? "is-open" : ""}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`cert-preview-modal ${isAnimating ? "is-open" : ""}`}>
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
          <UiImage
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
