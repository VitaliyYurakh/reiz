"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "reiz_user_languages";

export default function LanguagesSelect() {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  if (selected.length === 0) return null;

  return (
    <div className="account-profile-info__item">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>На яких мовах розмовляю: {selected.join(", ")}</span>
    </div>
  );
}
