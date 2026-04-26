'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Target, Save } from 'lucide-react';

const COUNTRIES = [
  { code: 'TR', label: '🇹🇷 Турция' },
  { code: 'ME', label: '🇲🇪 Черногория' },
  { code: 'RS', label: '🇷🇸 Сербия' },
  { code: 'AM', label: '🇦🇲 Армения' },
  { code: 'TH', label: '🇹🇭 Таиланд' },
  { code: 'ID', label: '🇮🇩 Индонезия (Бали)' },
  { code: 'KZ', label: '🇰🇿 Казахстан' },
];

export default function NewLeadPage() {
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

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

  const inputStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#1E293B' : '#F7F9FB',
    border: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1',
    color: isDark ? '#E2E8F0' : '#263238',
  };

  return (
    <div>
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <Link href="/admin/leads" className="flex items-center gap-2 text-[13px] mb-3 hover:underline" style={{ color: isDark ? '#90A4AE' : '#607D8B' }}>
          <ArrowLeft className="h-4 w-4" /> К списку
        </Link>
        <div className="flex items-center gap-3.5">
          <div className="h-icon-box h-icon-box-cyan">
            <Target size={24} />
          </div>
          <div>
            <h1 className="h-title">Новый лид</h1>
            <span className="h-subtitle">Добавить компанию вручную для аутрича</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[20px] p-7"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Компания *">
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            />
          </Field>

          <Field label="Страна *">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            >
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </Field>

          <Field label="Город *">
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            />
          </Field>

          <Field label="Сайт">
            <input
              type="url"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            />
          </Field>

          <Field label="Телефон">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            />
          </Field>

          <Field label="Имя владельца">
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            />
          </Field>

          <Field label="Язык письма">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-10 w-full rounded-lg px-3 text-[14px]"
              style={inputStyle}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="sr">Српски</option>
            </select>
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Заметки">
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-[14px]"
              style={inputStyle}
              placeholder="Что-то важное для контекста (откуда нашли, кто рекомендовал, и т.д.)"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="ios-btn ios-btn-primary disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {submitting ? 'Сохранение…' : 'Сохранить'}
          </button>
          <Link href="/admin/leads" className="ios-btn ios-btn-ghost">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[12px] font-semibold opacity-70">{label}</span>
      {children}
    </label>
  );
}
