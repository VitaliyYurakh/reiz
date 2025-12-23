"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lviv+International+Airport+LWO";
const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Lviv%20International%20Airport%20LWO&output=embed";
const DESKTOP_BREAKPOINT = 1025;
const ANIMATION_DURATION = 600;

type LocationMapLinkProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function LocationMapLink({
  children,
  className,
  title = "Lviv International Airport",
}: LocationMapLinkProps) {
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  // Check desktop breakpoint
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted]);

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setOriginRect(rect);
    setIsMounted(true);

    // Simple scroll lock without affecting fixed elements
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Trigger animation after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    // Recalculate origin for closing animation
    if (triggerRef.current) {
      setOriginRect(triggerRef.current.getBoundingClientRect());
    }
    setIsAnimating(false);

    setTimeout(() => {
      setIsMounted(false);
      // Restore scroll
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    }, ANIMATION_DURATION);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDesktop) {
        e.preventDefault();
        handleOpen();
      }
    },
    [isDesktop, handleOpen],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  // Calculate CSS custom properties for animation
  const getModalCSSVars = (): React.CSSProperties => {
    if (!originRect) return {};

    const triggerCenterX = originRect.left + originRect.width / 2;
    const triggerCenterY = originRect.top + originRect.height / 2;
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    return {
      "--origin-x": `${triggerCenterX - screenCenterX}px`,
      "--origin-y": `${triggerCenterY - screenCenterY}px`,
    } as React.CSSProperties;
  };

  const modalContent = isMounted ? (
    <div
      className={`map-modal-overlay ${isAnimating ? "is-open" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
    >
      <div
        className={`map-modal ${isAnimating ? "is-open" : ""}`}
        style={getModalCSSVars()}
      >
        <div className="map-modal__header">
          <span id="map-modal-title" className="map-modal__title">{title}</span>
          <button
            type="button"
            className="map-modal__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <Icon id="cross" width={14} height={14} />
          </button>
        </div>
        <div className="map-modal__body">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            className="map-modal__iframe"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Lviv International Airport"
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <a
        ref={triggerRef}
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>

      {typeof document !== "undefined" &&
        modalContent &&
        createPortal(modalContent, document.body)}
    </>
  );
}
