"use client";

import { type MouseEvent, useEffect, useState } from "react";

type ShareButtonProps = {
  className?: string;
  shareLabel: string;
  copiedLabel: string;
  tooltipLabel: string;
  copiedTooltipLabel: string;
};

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
};

export default function ShareButton({
  className = "",
  shareLabel,
  copiedLabel,
  tooltipLabel,
  copiedTooltipLabel,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const currentUrl = new URL(window.location.href);
    const shareUrl = `${currentUrl.origin}${currentUrl.pathname}`;

    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const label = copied ? copiedLabel : shareLabel;
  const tooltipText = copied ? copiedTooltipLabel : tooltipLabel;
  const classes = [
    "single-section__action-button",
    "single-section__share",
    copied ? "single-section__share--copied" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      aria-label={label}
      data-state={copied ? "copied" : "idle"}
    >
      <span className="visually-hidden" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
      <span className="single-section__action-tooltip" aria-hidden="true">
        {tooltipText}
      </span>
      <span className="share-icon" aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.68439 10.6578L15.3124 7.34378M15.3156 16.6578L8.69379 13.3469M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </span>
    </button>
  );
}
