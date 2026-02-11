'use client';

import { useState, useEffect, useMemo } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  ClipboardList,
  User,
  Car,
  CalendarDays,
  MapPin,
  Plane,
  MessageSquare,
  Phone,
  Mail,
  Loader2,
  Globe,
} from 'lucide-react';
import { IosSelect } from '@/components/admin/ios-select';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface ClientOption { id: number; firstName: string; lastName: string; phone: string }
interface CarOption { id: number; brand: string; model: string; plateNumber: string }

export default function NewRequestPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [mode, setMode] = useState<'existing' | 'manual'>('manual');

  const [form, setForm] = useState({
    source: 'phone',
    clientId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    carId: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Львів',
    returnLocation: 'Львів',
    sourceOther: '',
    flightNumber: '',
    comment: '',
  });

  const SOURCE_OPTIONS = useMemo(() => [
    { value: 'phone', label: t('sources.phone') },
    { value: 'website', label: t('sources.website') },
    { value: 'walk_in', label: t('sources.walk_in') },
    { value: 'referral', label: t('sources.referral') },
    { value: 'other', label: t('sources.other') },
  ], [t]);

  useEffect(() => {
    adminApiClient.get('/client?limit=200').then(r => setClients(r.data.items)).catch(() => {});
    getAllCars().then(r => setCars(r.cars)).catch(() => {});
  }, []);

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        source: form.source === 'other' && form.sourceOther.trim() ? form.sourceOther.trim() : form.source,
        pickupLocation: form.pickupLocation || undefined,
        returnLocation: form.returnLocation || undefined,
        pickupDate: form.pickupDate || undefined,
        returnDate: form.returnDate || undefined,
        flightNumber: form.flightNumber || undefined,
        comment: form.comment || undefined,
      };
      if (form.carId) body.carId = parseInt(form.carId);
      if (mode === 'existing' && form.clientId) {
        body.clientId = parseInt(form.clientId);
      } else {
        body.firstName = form.firstName || undefined;
        body.lastName = form.lastName || undefined;
        body.phone = form.phone || undefined;
        body.email = form.email || undefined;
      }
      const res = await adminApiClient.post('/rental-request', body);
      router.push(`/admin/requests/${res.data.rentalRequest.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.msg || t('newRequest.errorCreating'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* ── Page header ── */}
      <div
        className="mb-6 rounded-2xl px-8 py-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/requests" className="ios-icon-btn">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#651FFF]"
            style={{ boxShadow: '0 4px 12px rgba(124,77,255,0.3)' }}
          >
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newRequest.title')}</h1>
            <p className="mt-0.5 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              {t('newRequest.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 ios-alert-destructive">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Источник ── */}
        <div
          className="rounded-2xl p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(21,101,192,0.15)' : '#E3F2FD' }}
            >
              <Globe className="h-3.5 w-3.5" style={{ color: '#1565C0' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newRequest.sectionSource')}</h2>
          </div>

          <div className="ios-segmented" style={{ display: 'flex', width: '100%' }}>
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('source', opt.value)}
                className={`ios-segment ios-segment-fill ${form.source === opt.value ? 'ios-segment-active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {form.source === 'other' && (
            <input
              value={form.sourceOther}
              onChange={e => set('sourceOther', e.target.value)}
              placeholder={t('newRequest.sourceOtherPlaceholder')}
              className="w-full ios-input text-[13px] mt-3"
            />
          )}
        </div>

        {/* ── Клиент ── */}
        <div
          className="rounded-2xl p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: isDark ? 'rgba(124,77,255,0.15)' : '#EDE7F6' }}
              >
                <User className="h-3.5 w-3.5" style={{ color: '#7C4DFF' }} />
              </div>
              <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newRequest.sectionClient')}</h2>
            </div>
            <button
              type="button"
              onClick={() => setMode(m => m === 'existing' ? 'manual' : 'existing')}
              className="text-[12px] font-semibold transition-colors hover:opacity-80"
              style={{ color: isDark ? '#A78BFA' : '#7C4DFF' }}
            >
              {mode === 'existing' ? t('newRequest.enterManually') : t('newRequest.selectFromDB')}
            </button>
          </div>

          {mode === 'existing' ? (
            <IosSelect
              value={form.clientId}
              onChange={(v) => set('clientId', v)}
              options={[
                { value: '', label: t('newRequest.selectClient') },
                ...clients.map(c => ({ value: String(c.id), label: `${c.lastName} ${c.firstName} (${c.phone})` })),
              ]}
              placeholder={t('newRequest.selectClient')}
              className="w-full text-[13px]"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newRequest.firstName')}</label>
                <input
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder={t('newRequest.firstNamePlaceholder')}
                  className="w-full ios-input text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newRequest.lastName')}</label>
                <input
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder={t('newRequest.lastNamePlaceholder')}
                  className="w-full ios-input text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {t('common.phone')}</span>
                </label>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder={t('newRequest.phonePlaceholder')}
                  className="w-full ios-input text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {t('common.email')}</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder={t('newRequest.emailPlaceholder')}
                  className="w-full ios-input text-[13px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Автомобиль ── */}
        <div
          className="rounded-2xl p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(67,160,71,0.15)' : '#E8F5E9' }}
            >
              <Car className="h-3.5 w-3.5" style={{ color: '#43A047' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newRequest.sectionCar')}</h2>
          </div>
          <IosSelect
            value={form.carId}
            onChange={(v) => set('carId', v)}
            options={[
              { value: '', label: t('newRequest.selectCar') },
              ...cars.map(c => ({ value: String(c.id), label: `${c.brand} ${c.model} (${c.plateNumber})` })),
            ]}
            placeholder={t('newRequest.selectCar')}
            className="w-full text-[13px]"
          />
        </div>

        {/* ── Даты и локации ── */}
        <div
          className="rounded-2xl p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(230,81,0,0.15)' : '#FFF3E0' }}
            >
              <CalendarDays className="h-3.5 w-3.5" style={{ color: '#E65100' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newRequest.sectionDates')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newRequest.pickupDate')}</label>
              <input
                type="datetime-local"
                value={form.pickupDate}
                onChange={e => set('pickupDate', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full ios-input text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newRequest.returnDate')}</label>
              <input
                type="datetime-local"
                value={form.returnDate}
                onChange={e => set('returnDate', e.target.value)}
                min={form.pickupDate || new Date().toISOString().slice(0, 16)}
                className="w-full ios-input text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('newRequest.pickupLocation')}</span>
              </label>
              <input
                value={form.pickupLocation}
                onChange={e => set('pickupLocation', e.target.value)}
                className="w-full ios-input text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('newRequest.returnLocation')}</span>
              </label>
              <input
                value={form.returnLocation}
                onChange={e => set('returnLocation', e.target.value)}
                className="w-full ios-input text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* ── Дополнительно ── */}
        <div
          className="rounded-2xl p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', backgroundColor: isDark ? '#1A2332' : '#FFFFFF' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(144,164,174,0.10)' : '#F7F9FB' }}
            >
              <MessageSquare className="h-3.5 w-3.5" style={{ color: '#90A4AE' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newRequest.sectionExtra')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                <span className="flex items-center gap-1"><Plane className="h-3 w-3" /> {t('newRequest.flightNumber')}</span>
              </label>
              <input
                value={form.flightNumber}
                onChange={e => set('flightNumber', e.target.value)}
                placeholder={t('newRequest.flightPlaceholder')}
                className="w-full ios-input text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('common.comment')}</label>
              <textarea
                value={form.comment}
                onChange={e => set('comment', e.target.value)}
                rows={3}
                placeholder={t('newRequest.commentPlaceholder')}
                className="w-full ios-textarea text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="pt-2 pb-6 flex items-center gap-3">
          <Link
            href="/admin/requests"
            className="h-btn h-btn-outline py-3.5 text-[14px]"
          >
            {t('common.cancel')}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="h-btn h-btn-primary flex-1 py-3.5 text-[15px]"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? t('common.saving') : t('newRequest.submitCreate')}
          </button>
        </div>
      </form>
    </div>
  );
}
