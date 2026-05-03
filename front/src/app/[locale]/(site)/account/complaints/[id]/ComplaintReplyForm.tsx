"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { postComplaintMessage } from "@/lib/api/customer";

export default function ComplaintReplyForm({ complaintId }: { complaintId: number }) {
  const router = useRouter();
  const t = useTranslations("account.complaints");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await postComplaintMessage(complaintId, body.trim());
      if (!res?.message) throw new Error("Send failed");
      setBody("");
      router.refresh();
    } catch (err) {
      setError(t("reply_error"));
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="complaint-reply">
      <h3 className="complaint-reply__title">{t("your_reply_title")}</h3>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder={t("reply_placeholder")}
        className="complaint-reply__textarea"
        disabled={sending}
      />
      {error && <p className="complaint-reply__error">{error}</p>}
      <div className="complaint-reply__actions">
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !body.trim()}
          className="acc-btn acc-btn--primary"
        >
          {sending ? t("reply_sending") : t("reply_send")}
        </button>
      </div>
    </div>
  );
}
