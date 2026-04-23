"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postComplaintMessage } from "@/lib/api/customer";

export default function ComplaintReplyForm({ complaintId }: { complaintId: number }) {
  const router = useRouter();
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
      setError("Не вдалося надіслати. Спробуйте ще раз.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-[#eee] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Ваша відповідь</h3>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Напишіть повідомлення менеджеру…"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        disabled={sending}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !body.trim()}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-50"
        >
          {sending ? "Надсилаємо…" : "Надіслати"}
        </button>
      </div>
    </div>
  );
}
