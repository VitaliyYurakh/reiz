'use client';

import { useState, useEffect, useMemo } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  User,
  Car,
  CalendarDays,
  MapPin,
  MessageSquare,
  Loader2,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { IosSelect } from '@/components/admin/IosSelect';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import '../../dashboard/dashboard.css';
import '../../reservations/new/new-reservation.css';

interface ClientOption { id: number; firstName: string; lastName: string; phone: string }
interface CarOption { id: number; brand: string | null; model: string | null; plateNumber: string | null }

export default function NewRequestPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
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

  const minPickup = new Date().toISOString().slice(0, 16);

  return (
    <div className="dh-root nr-container">
      {/* ── Header (greeting style) ── */}
      <div className="nr-header">
        <Link href="/admin/requests" className="nr-back" aria-label="Назад">
          <ArrowLeft />
        </Link>
        <div>
          <div className="nr-greeting">{t('newRequest.title')}</div>
          <div className="nr-subtitle">{t('newRequest.subtitle')}</div>
        </div>
      </div>

      {error && (
        <div className="nr-alert" style={{ marginBottom: 16 }}>
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="nr-form">
        {/* ── Source ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon info">
              <Globe />
            </div>
            <div className="nr-section-title">{t('newRequest.sectionSource')}</div>
          </div>

          <div className="nr-segmented">
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('source', opt.value)}
                className={form.source === opt.value ? 'active' : ''}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {form.source === 'other' && (
            <input
              value={form.sourceOther}
              onChange={(e) => set('sourceOther', e.target.value)}
              placeholder={t('newRequest.sourceOtherPlaceholder')}
              className="nr-input"
              style={{ marginTop: 12 }}
            />
          )}
        </section>

        {/* ── Client ── */}
        <section className="dh-card">
          <div className="nr-section-head-row">
            <div className="nr-section-head" style={{ marginBottom: 0 }}>
              <div className="nr-section-icon accent">
                <User />
              </div>
              <div className="nr-section-title">{t('newRequest.sectionClient')}</div>
            </div>
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'existing' ? 'manual' : 'existing'))}
              className="nr-link-btn"
            >
              {mode === 'existing' ? t('newRequest.enterManually') : t('newRequest.selectFromDB')}
            </button>
          </div>

          {mode === 'existing' ? (
            <div className="nr-select-wrap">
              <IosSelect
                value={form.clientId}
                onChange={(v) => set('clientId', v)}
                options={[
                  { value: '', label: t('newRequest.selectClient') },
                  ...clients.map((c) => ({ value: String(c.id), label: `${c.lastName} ${c.firstName} (${c.phone})` })),
                ]}
                placeholder={t('newRequest.selectClient')}
              />
            </div>
          ) : (
            <div className="nr-row-2">
              <div>
                <label className="nr-label">{t('newRequest.firstName')}</label>
                <input
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  placeholder={t('newRequest.firstNamePlaceholder')}
                  className="nr-input"
                />
              </div>
              <div>
                <label className="nr-label">{t('newRequest.lastName')}</label>
                <input
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  placeholder={t('newRequest.lastNamePlaceholder')}
                  className="nr-input"
                />
              </div>
              <div>
                <label className="nr-label">{t('common.phone')}</label>
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder={t('newRequest.phonePlaceholder')}
                  className="nr-input"
                />
              </div>
              <div>
                <label className="nr-label">{t('common.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder={t('newRequest.emailPlaceholder')}
                  className="nr-input"
                />
              </div>
            </div>
          )}
        </section>

        {/* ── Car ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon success">
              <Car />
            </div>
            <div className="nr-section-title">{t('newRequest.sectionCar')}</div>
          </div>
          <div className="nr-select-wrap">
            <IosSelect
              value={form.carId}
              onChange={(v) => set('carId', v)}
              options={[
                { value: '', label: t('newRequest.selectCar') },
                ...cars.map((c) => ({
                  value: String(c.id),
                  label: `${c.brand || ''} ${c.model || ''} (${c.plateNumber || ''})`.trim(),
                })),
              ]}
              placeholder={t('newRequest.selectCar')}
            />
          </div>
        </section>

        {/* ── Dates & locations ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon warning">
              <CalendarDays />
            </div>
            <div className="nr-section-title">{t('newRequest.sectionDates')}</div>
          </div>
          <div className="nr-row-2">
            <div>
              <label className="nr-label">{t('newRequest.pickupDate')}</label>
              <input
                type="datetime-local"
                value={form.pickupDate}
                onChange={(e) => set('pickupDate', e.target.value)}
                min={minPickup}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">{t('newRequest.returnDate')}</label>
              <input
                type="datetime-local"
                value={form.returnDate}
                onChange={(e) => set('returnDate', e.target.value)}
                min={form.pickupDate || minPickup}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin style={{ width: 11, height: 11 }} /> {t('newRequest.pickupLocation')}
                </span>
              </label>
              <input
                value={form.pickupLocation}
                onChange={(e) => set('pickupLocation', e.target.value)}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin style={{ width: 11, height: 11 }} /> {t('newRequest.returnLocation')}
                </span>
              </label>
              <input
                value={form.returnLocation}
                onChange={(e) => set('returnLocation', e.target.value)}
                className="nr-input"
              />
            </div>
          </div>
        </section>

        {/* ── Extra ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon">
              <MessageSquare />
            </div>
            <div className="nr-section-title">{t('newRequest.sectionExtra')}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="nr-label">{t('newRequest.flightNumber')}</label>
              <input
                value={form.flightNumber}
                onChange={(e) => set('flightNumber', e.target.value)}
                placeholder={t('newRequest.flightPlaceholder')}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">{t('common.comment')}</label>
              <textarea
                value={form.comment}
                onChange={(e) => set('comment', e.target.value)}
                rows={3}
                placeholder={t('newRequest.commentPlaceholder')}
                className="nr-textarea"
              />
            </div>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="nr-actions">
          <Link href="/admin/requests" className="nr-btn nr-btn-ghost">
            {t('common.cancel')}
          </Link>
          <button type="submit" disabled={saving} className="nr-btn nr-btn-primary">
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            {saving ? t('common.saving') : t('newRequest.submitCreate')}
          </button>
        </div>
      </form>
    </div>
  );
}
