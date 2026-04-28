'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  ArrowLeft,
  AlertOctagon,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface ComplaintMessage {
  id: number;
  authorType: 'client' | 'staff' | 'system';
  authorUser: { id: number; email: string; name: string } | null;
  body: string;
  attachments: string[];
  createdAt: string;
}

interface Complaint {
  id: number;
  ticketNumber: string;
  category: string;
  priority: string;
  status: string;
  subject: string;
  initialMessage: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  attachments: string[];
  slaDeadline: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  createdAt: string;
  client: { id: number; firstName: string; lastName: string; phone: string; email: string | null } | null;
  rental: { id: number; contractNumber: string } | null;
  assignedManager: { id: number; email: string; name: string } | null;
  messages: ComplaintMessage[];
}

const CATEGORY_LABEL: Record<string, string> = {
  DEPOSIT: 'Застава',
  DAMAGE: 'Пошкодження',
  FINE: 'Штраф',
  SERVICE: 'Сервіс',
  GDPR: 'GDPR',
  OTHER: 'Інше',
};

const STATUS_OPTIONS = [
  { value: 'open', label: 'Відкрита' },
  { value: 'in_review', label: 'В роботі' },
  { value: 'awaiting_client', label: 'Чекає клієнта' },
  { value: 'resolved', label: 'Вирішена' },
  { value: 'rejected', label: 'Відхилена' },
];

export default function ComplaintDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApiClient.get(`/complaint/${id}`);
      setComplaint(res.data.complaint);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await adminApiClient.post(`/complaint/${id}/message`, { body: reply.trim() });
      setReply('');
      await fetch();
    } catch (err) {
      toastError(err, 'Не вдалося надіслати відповідь');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await adminApiClient.patch(`/complaint/${id}`, { status: newStatus });
      await fetch();
    } catch (err) {
      toastError(err, 'Не вдалося змінити статус');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Завантаження…</div>;
  }
  if (!complaint) {
    return <div className="p-8 text-center text-muted-foreground">Скаргу не знайдено</div>;
  }

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <Link href="/admin/complaints" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: isDark ? '#1E293B' : '#F7F9FB' }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-icon-box h-icon-box-red">
              <AlertOctagon size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="h-title">{complaint.subject}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{complaint.ticketNumber}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{CATEGORY_LABEL[complaint.category] || complaint.category}</span>
                {complaint.rental && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Link href={`/admin/rentals/${complaint.rental.id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      {complaint.rental.contractNumber} <ExternalLink className="h-3 w-3" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={complaint.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="ios-select text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {complaint.status !== 'resolved' && (
              <button
                type="button"
                onClick={() => handleStatusChange('resolved')}
                disabled={updatingStatus}
                className="ios-btn ios-btn-success text-sm"
              >
                <CheckCircle2 className="h-4 w-4" /> Вирішити
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Thread */}
        <div className="space-y-3">
          {complaint.messages.map((msg) => (
            <div
              key={msg.id}
              className="ios-card"
              style={{
                borderLeft: `3px solid ${
                  msg.authorType === 'staff'
                    ? '#6a7bff'
                    : msg.authorType === 'system'
                      ? '#90A4AE'
                      : '#FFB547'
                }`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{
                      background: msg.authorType === 'staff' ? '#6a7bff' : '#FFB547',
                    }}
                  >
                    {msg.authorType === 'staff' ? 'S' : 'C'}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {msg.authorType === 'staff'
                      ? msg.authorUser?.name || msg.authorUser?.email || 'Менеджер'
                      : msg.authorType === 'system'
                        ? 'Система'
                        : complaint.client
                          ? `${complaint.client.firstName} ${complaint.client.lastName}`
                          : complaint.contactName || 'Клієнт'}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {new Date(msg.createdAt).toLocaleString('uk', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">{msg.body}</p>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.attachments.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      📎 attachment {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Reply form */}
          {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
            <div className="ios-card">
              <h3 className="text-sm font-semibold text-foreground mb-2">Відповісти клієнту</h3>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="Ваша відповідь…"
                className="ios-textarea text-sm w-full"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={sending || !reply.trim()}
                  className="ios-btn ios-btn-primary text-sm"
                >
                  <Send className="h-4 w-4" />
                  {sending ? 'Надсилаємо…' : 'Надіслати'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="ios-card">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Контакт</p>
            {complaint.client ? (
              <Link href={`/admin/clients/${complaint.client.id}`} className="text-sm font-semibold hover:underline inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {complaint.client.firstName} {complaint.client.lastName}
                <ExternalLink className="h-3 w-3" />
              </Link>
            ) : (
              <p className="text-sm font-medium">{complaint.contactName || 'Анонімно'}</p>
            )}
            {(complaint.client?.phone || complaint.contactPhone) && (
              <p className="text-xs mt-2 inline-flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <a href={`tel:${complaint.client?.phone || complaint.contactPhone}`} className="hover:text-primary hover:underline">
                  {complaint.client?.phone || complaint.contactPhone}
                </a>
              </p>
            )}
            {(complaint.client?.email || complaint.contactEmail) && (
              <p className="text-xs mt-1 inline-flex items-center gap-1 text-muted-foreground">
                <Mail className="h-3 w-3" />
                {complaint.client?.email || complaint.contactEmail}
              </p>
            )}
          </div>

          <div className="ios-card">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">SLA</p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {complaint.slaDeadline
                  ? new Date(complaint.slaDeadline).toLocaleString('uk', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Створено: {new Date(complaint.createdAt).toLocaleString('uk', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            {complaint.resolvedAt && (
              <div className="mt-1 text-xs text-muted-foreground">
                Закрито: {new Date(complaint.resolvedAt).toLocaleString('uk', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="ios-card">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Початкові файли ({complaint.attachments.length})
              </p>
              <ul className="space-y-1">
                {complaint.attachments.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      📎 file {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
