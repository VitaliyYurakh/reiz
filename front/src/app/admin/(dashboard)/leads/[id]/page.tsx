'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { toast, toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  ArrowLeft,
  Target,
  Mail,
  Phone,
  Globe,
  MapPin,
  Save,
  Pause,
  Play,
  XCircle,
  Star,
  Send,
  Inbox,
  Sparkles,
  RefreshCcw,
} from 'lucide-react';

interface LeadEmail {
  id: number;
  direction: 'OUTBOUND' | 'INBOUND';
  template: string | null;
  subject: string;
  body: string;
  sentAt: string | null;
  receivedAt: string | null;
  createdAt: string;
}

interface Lead {
  id: number;
  companyName: string;
  country: string;
  city: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  ownerName: string | null;
  language: string;
  status: string;
  pausedReason: string | null;
  source: string;
  notes: string | null;
  websiteContent: string | null;
  contactedAt: string | null;
  repliedAt: string | null;
  followUpCount: number;
  createdAt: string;
  assignedManager: { id: number; name: string; email: string } | null;
  emails: LeadEmail[];
}

const COUNTRY_FLAGS: Record<string, string> = {
  TR: '🇹🇷', ME: '🇲🇪', RS: '🇷🇸', AM: '🇦🇲',
  TH: '🇹🇭', ID: '🇮🇩', KZ: '🇰🇿',
};

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [preview, setPreview] = useState<{ subject: string; body: string; kind: string; usedAi: boolean; failureReason?: string } | null>(null);
  const [previewing, setPreviewing] = useState(false);

  const fetchLead = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApiClient.get<{ lead: Lead }>(`/lead/${params.id}`);
      setLead(res.data.lead);
      setNotes(res.data.lead.notes ?? '');
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  const updateStatus = async (status: string, pausedReason?: string) => {
    try {
      await adminApiClient.patch(`/lead/${params.id}/status`, { status, pausedReason });
      toast.success('Статус обновлён');
      fetchLead();
    } catch (err) {
      toastError(err, 'Не удалось обновить статус');
    }
  };

  const generatePreview = async (kind: 'initial' | 'fu_3d' | 'fu_7d' | 'breakup_14d' = 'initial') => {
    setPreviewing(true);
    try {
      const res = await adminApiClient.get(`/lead/${params.id}/preview-email?kind=${kind}`);
      setPreview(res.data);
    } catch (err) {
      toastError(err, 'Не удалось сгенерировать preview');
    } finally {
      setPreviewing(false);
    }
  };

  const sendNow = async () => {
    if (!confirm('Отправить НАСТОЯЩЕЕ письмо этому лиду прямо сейчас?\nЭто проигнорирует daily cap.')) return;
    setPreviewing(true);
    try {
      const res = await adminApiClient.post(`/lead/${params.id}/send-now`);
      toast.success(`Письмо ушло. Subject: ${res.data.subject}`);
      fetchLead();
    } catch (err) {
      toastError(err, 'Не удалось отправить');
    } finally {
      setPreviewing(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await adminApiClient.patch(`/lead/${params.id}`, { notes });
      toast.success('Заметки сохранены');
      fetchLead();
    } catch (err) {
      toastError(err, 'Не удалось сохранить заметки');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[20px] p-12 text-center" style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-[20px] p-12 text-center" style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}>
        <p className="text-[14px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
          Лид не найден.
        </p>
        <Link href="/admin/leads" className="ios-btn ios-btn-ghost mt-4">К списку</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}
      >
        <Link href="/admin/leads" className="flex items-center gap-2 text-[13px] mb-3 hover:underline" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
          <ArrowLeft className="h-4 w-4" /> К списку
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-icon-box h-icon-box-cyan mt-1">
              <Target size={24} />
            </div>
            <div>
              <h1 className="h-title">{lead.companyName}</h1>
              <div className="flex items-center gap-3 flex-wrap mt-1.5 text-[13px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {COUNTRY_FLAGS[lead.country] ?? ''} {lead.city}
                </span>
                <StatusPill status={lead.status} />
                {lead.repliedAt && (
                  <span style={{ color: 'var(--c-success)', fontWeight: 600 }}>
                    ответил {new Date(lead.repliedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {lead.status !== 'PAUSED' ? (
              <button
                type="button"
                onClick={() => {
                  const reason = prompt('Причина паузы (необязательно):');
                  if (reason !== null) updateStatus('PAUSED', reason);
                }}
                className="ios-btn ios-btn-ghost text-sm"
              >
                <Pause className="h-4 w-4" /> Пауза
              </button>
            ) : (
              <button type="button" onClick={() => updateStatus('READY')} className="ios-btn ios-btn-ghost text-sm">
                <Play className="h-4 w-4" /> Возобновить
              </button>
            )}
            <button
              type="button"
              onClick={() => updateStatus('INTERESTED')}
              className="ios-btn ios-btn-ghost text-sm"
              title="Заинтересован — снять с автоматизации"
            >
              <Star className="h-4 w-4" /> Интерес
            </button>
            <button
              type="button"
              onClick={() => updateStatus('CLIENT')}
              className="ios-btn ios-btn-primary text-sm"
            >
              <Star className="h-4 w-4" /> Клиент
            </button>
            <button
              type="button"
              onClick={() => updateStatus('DISQUALIFIED')}
              className="ios-btn text-sm"
              style={{ background: 'var(--c-error)', color: '#fff' }}
            >
              <XCircle className="h-4 w-4" /> Disq.
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: contact details + notes */}
        <div className="lg:col-span-1 space-y-6">
          <Card isDark={isDark} H={H} title="Контакты">
            <ContactRow icon={<Mail className="h-4 w-4" />} value={lead.email} type="email" />
            <ContactRow icon={<Phone className="h-4 w-4" />} value={lead.phone} type="tel" />
            <ContactRow icon={<Globe className="h-4 w-4" />} value={lead.website} type="url" />
            {lead.ownerName && (
              <div className="text-[13px] pt-2" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                Владелец: <strong>{lead.ownerName}</strong>
              </div>
            )}
            <div className="pt-2 text-[12px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              Язык письма: <strong>{lead.language.toUpperCase()}</strong> · Источник: {lead.source}
            </div>
          </Card>

          <Card isDark={isDark} H={H} title="Заметки">
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Контекст, что обсудили, кто кого рекомендовал…"
              className="w-full rounded-lg px-3 py-2 text-[13px]"
              style={{
                backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)',
                border: isDark ? '1px solid #2D3748' : '1px solid var(--c-surface-border)',
                color: isDark ? '#E2E8F0' : '#263238',
              }}
            />
            <button
              type="button"
              onClick={saveNotes}
              disabled={savingNotes || notes === (lead.notes ?? '')}
              className="ios-btn ios-btn-primary text-sm mt-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {savingNotes ? 'Сохранение…' : 'Сохранить'}
            </button>
          </Card>

          {lead.websiteContent && (
            <Card isDark={isDark} H={H} title="Что нашли на сайте (для AI)">
              <div
                className="text-[12px] max-h-[200px] overflow-auto whitespace-pre-wrap leading-relaxed"
                style={{ color: isDark ? '#90A4AE' : '#607D8B' }}
              >
                {lead.websiteContent}
              </div>
            </Card>
          )}
        </div>

        {/* Right: preview + email thread */}
        <div className="lg:col-span-2 space-y-6">
          <Card isDark={isDark} H={H} title="AI Preview (без отправки)">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <button
                type="button"
                onClick={() => generatePreview('initial')}
                disabled={previewing}
                className="ios-btn ios-btn-primary text-sm disabled:opacity-50"
              >
                {previewing ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Initial (Gemini)
              </button>
              <button type="button" onClick={() => generatePreview('fu_3d')} disabled={previewing} className="ios-btn ios-btn-ghost text-sm">
                Follow-up 3д
              </button>
              <button type="button" onClick={() => generatePreview('fu_7d')} disabled={previewing} className="ios-btn ios-btn-ghost text-sm">
                Follow-up 7д
              </button>
              <button type="button" onClick={() => generatePreview('breakup_14d')} disabled={previewing} className="ios-btn ios-btn-ghost text-sm">
                Break-up
              </button>
              {lead.email && (
                <button
                  type="button"
                  onClick={sendNow}
                  disabled={previewing}
                  className="ios-btn text-sm disabled:opacity-50 ml-auto"
                  style={{ background: 'var(--c-success)', color: '#fff' }}
                  title="Отправить НАСТОЯЩЕЕ письмо прямо сейчас (минуя daily cap)"
                >
                  <Send className="h-4 w-4" /> Отправить сейчас
                </button>
              )}
            </div>

            {preview ? (
              <div className="rounded-xl p-4" style={{
                background: isDark ? '#0F1623' : '#F8FAFC',
                border: isDark ? '1px solid #2D3748' : '1px solid #E2E8F0',
              }}>
                <div className="text-[11px] mb-2" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                  {preview.usedAi ? '✨ Сгенерировано Gemini' : '📋 Локальный шаблон (fallback)'}
                  {' · '}
                  {preview.kind}
                </div>
                {preview.failureReason && (
                  <div className="text-[11px] mb-2 px-2 py-1 rounded" style={{
                    background: isDark ? 'rgba(239,68,68,0.15)' : 'var(--c-error-bg)',
                    color: isDark ? 'var(--c-error-light)' : '#991B1B',
                  }}>
                    ⚠️ AI fail: {preview.failureReason.slice(0, 140)}
                    {preview.failureReason.includes('429') && (
                      <div className="mt-1 opacity-80">Подожди ~60 сек (Gemini free tier: 15 req/min) и нажми ещё раз.</div>
                    )}
                  </div>
                )}
                <div className="text-[14px] font-bold mb-2" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                  Subject: {preview.subject}
                </div>
                <div className="text-[13px] whitespace-pre-wrap leading-relaxed" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
                  {preview.body}
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-center py-6" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                Нажми «Initial» — увидишь как Gemini напишет под этого лида.
                <br />
                <span className="text-[11px] opacity-70">Письмо НЕ отправится. Это только просмотр.</span>
              </div>
            )}
          </Card>

          <Card isDark={isDark} H={H} title={`Переписка (${lead.emails.length})`}>
            {lead.emails.length === 0 ? (
              <div className="text-center py-12 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                Письма ещё не отправлялись.
                <br />
                <span className="text-[11px] opacity-70">
                  Автомат начнёт рассылку, когда лид перейдёт в статус READY и будет настроен Gmail.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {lead.emails.map((email) => (
                  <EmailItem key={email.id} email={email} isDark={isDark} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children, title, isDark, H }: { children: React.ReactNode; title: string; isDark: boolean; H: { shadow: string } }) {
  return (
    <div
      className="rounded-[20px] p-5"
      style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}
    >
      <h2 className="text-[14px] font-bold mb-3" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ContactRow({ icon, value, type }: { icon: React.ReactNode; value: string | null; type: 'email' | 'tel' | 'url' }) {
  if (!value) return null;
  const href = type === 'email' ? `mailto:${value}` : type === 'tel' ? `tel:${value}` : value;
  return (
    <a
      href={href}
      target={type === 'url' ? '_blank' : undefined}
      rel={type === 'url' ? 'noreferrer' : undefined}
      className="flex items-center gap-2 text-[13px] py-1 hover:underline"
    >
      {icon}
      <span className="truncate">{value.replace(/^https?:\/\//, '')}</span>
    </a>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    NEW:           { bg: '#94A3B8', fg: '#fff',    label: 'Новый' },
    ENRICHED:      { bg: 'var(--c-brand-light)', fg: '#fff',    label: 'Enriched' },
    READY:         { bg: 'var(--c-brand)', fg: '#063545', label: 'Готов к рассылке' },
    CONTACTED:     { bg: 'var(--c-brand-light)', fg: '#fff',    label: 'Письмо отправлено' },
    FOLLOWED_UP_1: { bg: 'var(--c-brand)', fg: '#fff',    label: 'Follow-up 3д' },
    FOLLOWED_UP_2: { bg: 'var(--c-brand)', fg: '#fff',    label: 'Follow-up 7д' },
    BREAKUP_SENT:  { bg: 'var(--c-brand)', fg: '#fff',    label: 'Break-up' },
    REPLIED:       { bg: '#FBBF24', fg: '#3F2A06', label: 'Ответил' },
    INTERESTED:    { bg: 'var(--c-warning)', fg: '#fff',    label: 'Интерес' },
    CLIENT:        { bg: 'var(--c-success)', fg: '#fff',    label: 'Клиент' },
    DISQUALIFIED:  { bg: '#64748B', fg: '#fff',    label: 'Disqualified' },
    BOUNCED:       { bg: 'var(--c-error)', fg: '#fff',    label: 'Bounced' },
    UNSUBSCRIBED:  { bg: '#9CA3AF', fg: '#fff',    label: 'Отписался' },
    PAUSED:        { bg: '#475569', fg: '#fff',    label: 'Пауза' },
  };
  const e = map[status] ?? { bg: '#94A3B8', fg: '#fff', label: status };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: e.bg, color: e.fg }}
    >
      {e.label}
    </span>
  );
}

function EmailItem({ email, isDark }: { email: LeadEmail; isDark: boolean }) {
  const isOut = email.direction === 'OUTBOUND';
  const dt = email.sentAt || email.receivedAt || email.createdAt;
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isOut ? (isDark ? '#1E293B' : '#F0F7FF') : (isDark ? '#1A2332' : 'var(--c-success-bg)'),
        border: isDark ? '1px solid #2D3748' : `1px solid ${isOut ? '#BAE6FD' : 'var(--c-success-bg)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-2 text-[11px]" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
        <div className="flex items-center gap-1.5 font-bold">
          {isOut ? <Send className="h-3 w-3" /> : <Inbox className="h-3 w-3" />}
          <span>{isOut ? 'ОТ НАС' : 'ОТ ЛИДА'}</span>
          {email.template && <span className="opacity-60">· {email.template}</span>}
        </div>
        <span>{new Date(dt).toLocaleString()}</span>
      </div>
      <div className="text-[13px] font-semibold mb-1" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
        {email.subject}
      </div>
      <div className="text-[13px] whitespace-pre-wrap leading-relaxed" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
        {email.body}
      </div>
    </div>
  );
}
