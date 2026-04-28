'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Handshake, Save, Plus, Trash2 } from 'lucide-react';

interface Tier {
  minDays: number;
  maxDays: number;
  percent: number;
}

const DEFAULT_TIERS: Tier[] = [
  { minDays: 1, maxDays: 7, percent: 15 },
  { minDays: 8, maxDays: 29, percent: 12.5 },
  { minDays: 30, maxDays: 0, percent: 10 },
];

export default function NewPartnerPage() {
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const isDark = theme === 'dark';

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [edrpou, setEdrpou] = useState('');
  const [ipn, setIpn] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [iban, setIban] = useState('');
  const [bankName, setBankName] = useState('');
  const [notes, setNotes] = useState('');
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [submitting, setSubmitting] = useState(false);

  const handleTierChange = (idx: number, field: keyof Tier, value: number) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  const addTier = () => {
    const last = tiers[tiers.length - 1];
    setTiers([...tiers, { minDays: (last?.maxDays || 0) + 1, maxDays: 0, percent: 10 }]);
  };

  const removeTier = (idx: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        fullName: fullName.trim(),
        commissionTiers: tiers,
      };
      if (companyName.trim()) body.companyName = companyName.trim();
      if (edrpou.trim()) body.edrpou = edrpou.trim();
      if (ipn.trim()) body.ipn = ipn.trim();
      if (phone.trim()) body.phone = phone.trim();
      if (email.trim()) body.email = email.trim();
      if (iban.trim()) body.iban = iban.trim();
      if (bankName.trim()) body.bankName = bankName.trim();
      if (notes.trim()) body.notes = notes.trim();

      const res = await adminApiClient.post('/partner', body);
      router.push(`/admin/partners/${res.data.partner.id}`);
    } catch (err) {
      toastError(err, 'Не вдалося створити партнера');
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : 'var(--c-surface-card)', boxShadow: H.shadow }}
      >
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/partners"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? '#1E293B' : 'var(--c-surface-muted)' }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-icon-box h-icon-box-cyan">
            <Handshake size={24} />
          </div>
          <div>
            <h1 className="h-title">Новий партнер</h1>
            <span className="h-subtitle">Власник авто, що працює з нами на комісії</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic info */}
        <div className="ios-card">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Контакт
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs text-muted-foreground">
                ПІБ <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Іван Петренко"
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">Назва компанії</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder='напр. ТОВ "АвтоПрайм"'
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">ЄДРПОУ</label>
              <input
                type="text"
                value={edrpou}
                onChange={(e) => setEdrpou(e.target.value)}
                placeholder="12345678"
                className="ios-input text-sm mt-1 w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">ІПН (для фізособи)</label>
              <input
                type="text"
                value={ipn}
                onChange={(e) => setIpn(e.target.value)}
                placeholder="0000000000"
                className="ios-input text-sm mt-1 w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380…"
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">IBAN</label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="UA00 0000 ..."
                className="ios-input text-sm mt-1 w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">Банк</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="напр. ПриватБанк"
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Commission tiers */}
        <div className="ios-card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Тарифи комісії
            </div>
            <button
              type="button"
              onClick={addTier}
              className="ios-btn ios-btn-secondary text-xs !h-7 !px-2"
            >
              <Plus className="h-3 w-3" /> Додати тариф
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Reiz утримує цей % від ціни оренди (після знижки) як комісію за обслуговування.
          </p>
          <div className="space-y-2">
            {tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg bg-muted/40 p-2">
                <div className="flex-1 grid grid-cols-3 gap-2 items-center">
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Від (днів)</label>
                    <input
                      type="number"
                      min="1"
                      value={tier.minDays}
                      onChange={(e) => handleTierChange(idx, 'minDays', Number(e.target.value))}
                      className="ios-input text-sm mt-0.5 w-full tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">До (0 = ∞)</label>
                    <input
                      type="number"
                      min="0"
                      value={tier.maxDays}
                      onChange={(e) => handleTierChange(idx, 'maxDays', Number(e.target.value))}
                      className="ios-input text-sm mt-0.5 w-full tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Комісія, %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={tier.percent}
                      onChange={(e) => handleTierChange(idx, 'percent', Number(e.target.value))}
                      className="ios-input text-sm mt-0.5 w-full tabular-nums"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTier(idx)}
                  className="text-rose-500 hover:text-rose-700 mt-4"
                  disabled={tiers.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="ios-card">
          <label className="block text-xs text-muted-foreground">Нотатки</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Внутрішні нотатки про партнера…"
            className="ios-textarea text-sm mt-1 w-full"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/admin/partners" className="ios-btn ios-btn-ghost text-sm">
            Скасувати
          </Link>
          <button
            type="submit"
            disabled={submitting || !fullName.trim()}
            className="ios-btn ios-btn-primary text-sm"
          >
            <Save className="h-4 w-4" />
            {submitting ? 'Створюємо…' : 'Створити партнера'}
          </button>
        </div>
      </form>
    </div>
  );
}
