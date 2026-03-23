"use client";

import { useState } from "react";

type FooterSubscribeProps = {
  placeholder: string;
};

export default function FooterSubscribe({ placeholder }: FooterSubscribeProps) {
  const [email, setEmail] = useState("");

  return (
    <form
      className="footer__subscribe-form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        type="email"
        className="footer__subscribe-input"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="footer__subscribe-btn" aria-label="Subscribe">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
