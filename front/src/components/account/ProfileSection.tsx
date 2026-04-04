"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import ProfileForm from "./ProfileForm";

export function ProfileEditButton() {
  const t = useTranslations("account.profile");
  return (
    <button
      type="button"
      className="account-edit-btn"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-profile-edit"));
      }}
    >
      {t("edit")}
    </button>
  );
}

function AvatarUpload({ profile }: { profile: any }) {
  const t = useTranslations("account.profile");
  const { data: session } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const currentAvatar = preview || session?.user?.image || null;
  const name = profile?.firstName || session?.user?.name?.charAt(0) || "?";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    // TODO: upload to server when backend supports it
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-upload__preview">
        {currentAvatar ? (
          <img src={currentAvatar} alt={name} className="avatar-upload__img" />
        ) : (
          <div className="avatar-upload__placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <button
        type="button"
        className="avatar-upload__btn"
        onClick={() => fileRef.current?.click()}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        {t("change_photo")}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export function ProfileEditWrapper({ profile }: { profile: any }) {
  const t = useTranslations("account");
  const [editing, setEditing] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOpen() {
      setEditing(true);
    }
    window.addEventListener("open-profile-edit", handleOpen);
    return () => window.removeEventListener("open-profile-edit", handleOpen);
  }, []);

  useEffect(() => {
    if (editing && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [editing]);

  if (!editing) return null;

  return (
    <div ref={sectionRef}>
      <hr className="account-divider" />
      <div className="account-edit-section">
        <div className="account-edit-section__header">
          <h2 className="account-edit-section__title">{t("profile.title")}</h2>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="account-edit-section__close"
          >
            ✕
          </button>
        </div>
        <AvatarUpload profile={profile} />
        <ProfileForm profile={profile} onSaved={() => setEditing(false)} />
      </div>
    </div>
  );
}
