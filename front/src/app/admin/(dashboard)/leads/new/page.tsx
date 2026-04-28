'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Save, Target } from 'lucide-react';
import { REIZ_LEADS_CSS } from '../_design';

const COUNTRIES = [
  { code: 'TR', label: '🇹🇷 Турция' },
  { code: 'ME', label: '🇲🇪 Черногория' },
  { code: 'RS', label: '🇷🇸 Сербия' },
  { code: 'AM', label: '🇦🇲 Армения' },
  { code: 'TH', label: '🇹🇭 Таиланд' },
  { code: 'ID', label: '🇮🇩 Индонезия (Бали)' },
  { code: 'KZ', label: '🇰🇿 Казахстан' },
];

const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'sr', label: 'Српски' },
];

export default function NewLeadPage() {
  const router = useRouter();
  const { theme } = useAdminTheme();

  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('TR');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [language, setLanguage] = useState('ru');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !city.trim()) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        companyName: companyName.trim(),
        country,
        city: city.trim(),
        language,
        source: 'manual',
      };
      if (website.trim()) body.website = website.trim();
      if (phone.trim()) body.phone = phone.trim();
      if (email.trim()) body.email = email.trim();
      if (ownerName.trim()) body.ownerName = ownerName.trim();
      if (notes.trim()) body.notes = notes.trim();

      const res = await adminApiClient.post('/lead', body);
      router.push(`/admin/leads/${res.data.lead.id}`);
    } catch (err) {
      toastError(err, 'Не удалось создать лид');
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{REIZ_LEADS_CSS}</style>
      <div className={`reiz-leads theme-${theme === 'dark' ? 'dark' : 'light'}`} style={{ fontSize: 13 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* ─── Top bar ─── */}
          <div>
            <Link
              href="/admin/leads"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: 'var(--text-2)',
                textDecoration: 'none', marginBottom: 12,
                padding: '6px 10px', borderRadius: 8,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              <ArrowLeft size={14} strokeWidth={2} />
              К списку
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'color-mix(in oklab, var(--reiz-indigo) 14%, transparent)',
                color: 'var(--reiz-indigo)',
                display: 'grid', placeItems: 'center',
              }}>
                <Target size={22} strokeWidth={1.8} />
              </div>
              <div>
                <h1 style={{
                  margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em',
                  color: 'var(--text-1)',
                }}>Новый лид</h1>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-2)' }}>
                  Добавить компанию вручную для аутрича
                </p>
              </div>
            </div>
          </div>

          {/* ─── Form card ─── */}
          <form onSubmit={handleSubmit} className="r-card" style={{ padding: 28 }}>
            <SectionTitle>Информация о компании</SectionTitle>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '18px 20px', marginBottom: 24,
            }}>
              <Field label="Компания" required span={2}>
                <input
                  className="r-field-input"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Например, Mega Drive Antalya"
                />
              </Field>

              <Field label="Страна" required>
                <select
                  className="r-field-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </Field>

              <Field label="Город" required>
                <input
                  className="r-field-input"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Antalya"
                />
              </Field>

              <Field label="Сайт" span={2}>
                <input
                  className="r-field-input"
                  type="url"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </Field>
            </div>

            <SectionTitle>Контакты</SectionTitle>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '18px 20px', marginBottom: 24,
            }}>
              <Field label="Email">
                <input
                  className="r-field-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@company.com"
                />
              </Field>

              <Field label="Телефон">
                <input
                  className="r-field-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 555 123 45 67"
                />
              </Field>

              <Field label="Имя владельца">
                <input
                  className="r-field-input"
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Mehmet D."
                />
              </Field>

              <Field label="Язык письма">
                <select
                  className="r-field-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </Field>
            </div>

            <SectionTitle>Дополнительно</SectionTitle>
            <div style={{ marginBottom: 28 }}>
              <Field label="Заметки">
                <textarea
                  className="r-field-textarea"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Что-то важное для контекста (откуда нашли, кто рекомендовал, и т.д.)"
                />
              </Field>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
              paddingTop: 20, borderTop: '1px solid var(--border)',
            }}>
              <Link
                href="/admin/leads"
                style={{
                  padding: '10px 18px', borderRadius: 12,
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                  fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                Отмена
              </Link>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 18px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #6a7bff 0%, #6a7bff 100%)',
                  color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                  boxShadow: '0 6px 16px rgba(106, 123, 255, 0.32)',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <Save size={14} strokeWidth={2} />
                {submitting ? 'Сохранение…' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      color: 'var(--text-3)', textTransform: 'uppercase',
      marginBottom: 14, paddingBottom: 8,
      borderBottom: '1px solid var(--border)',
    }}>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  span = 1,
  children,
}: {
  label: string;
  required?: boolean;
  span?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <label style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      gridColumn: span === 2 ? 'span 2' : undefined,
      minWidth: 0,
    }}>
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: 'var(--text-2)',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}>
        {label}
        {required && <span style={{ color: 'var(--reiz-rose)' }}>*</span>}
      </span>
      {children}
    </label>
  );
}
