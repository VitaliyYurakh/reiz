"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/Icon";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lviv+International+Airport+LWO";
const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Lviv%20International%20Airport%20LWO&output=embed";
const DESKTOP_BREAKPOINT = 1025;

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
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDesktop) {
        e.preventDefault();
        setIsOpen(true);
      }
    },
    [isDesktop],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  return (
    <>
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>

      {isOpen && (
        <div
          className={`map-modal-overlay ${isClosing ? "closing" : ""}`}
          onClick={handleOverlayClick}
        >
          <div className={`map-modal ${isClosing ? "closing" : ""}`}>
            <div className="map-modal__header">
              <span className="map-modal__title">{title}</span>
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
      )}
    </>
  );
}
