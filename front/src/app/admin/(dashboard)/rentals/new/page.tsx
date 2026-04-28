'use client';

/**
 * Walk-in rental flow.
 * One screen — pick a client, a car, dates, locations, deposit. Done.
 *
 * Replaces the previous 4-screen path:
 *   /admin/requests/new → approve → reservation → pickup
 *
 * For phone-in or walk-in customers Anna does not want to pretend they came
 * via the website. This is the canonical "create rental from scratch" UX.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { EntitySearch } from '@/components/admin/EntitySearch';
import {
  ArrowLeft,
  User,
  Car,
  CalendarDays,
  MapPin,
  Save,
  AlertCircle,
  FileText,
  Loader2,
} from 'lucide-react';
import { IosSelect } from '@/components/admin/IosSelect';
import '../../dashboard/dashboard.css';
import '../../reservations/new/new-reservation.css';

export default function NewRentalPage() {
  const router = useRouter();
  const { t } = useAdminLocale();

  const [clientId, setClientId] = useState('');
  const [carId, setCarId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Львів');
  const [returnLocation, setReturnLocation] = useState('Львів');
  const [pickupOdometer, setPickupOdometer] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositCurrency, setDepositCurrency] = useState('USD');
  const [contractNumber, setContractNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientId || !carId || !pickupDate || !returnDate || !pickupLocation || !returnLocation) {
      setError("Заповніть усі обов'язкові поля");
      return;
    }
    if (new Date(pickupDate) >= new Date(returnDate)) {
      setError('Дата повернення має бути після дати видачі');
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        clientId: Number(clientId),
        carId: Number(carId),
        pickupDate: new Date(pickupDate).toISOString(),
        returnDate: new Date(returnDate).toISOString(),
        pickupLocation,
        returnLocation,
        priceSnapshot: {
          source: 'walk_in',
          createdAt: new Date().toISOString(),
        },
      };
      if (pickupOdometer) body.pickupOdometer = Number(pickupOdometer);
      if (depositAmount) {
        body.depositAmount = Math.round(Number(depositAmount) * 100);
        body.depositCurrency = depositCurrency;
      }
      if (contractNumber.trim()) body.contractNumber = contractNumber.trim();
      if (notes.trim()) body.notes = notes.trim();

      const res = await adminApiClient.post('/rental', body);
      router.push(`/admin/rentals/${res.data.rental.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.msg || err?.response?.data?.message || 'Не вдалося створити оренду';
      setError(msg);
      toastError(err, msg);
      setSubmitting(false);
    }
  };

  const minPickup = new Date().toISOString().slice(0, 16);

  return (
    <div className="dh-root nr-container">
      {/* ── Header ── */}
      <div className="nr-header">
        <Link href="/admin/rentals" className="nr-back" aria-label="Назад">
          <ArrowLeft />
        </Link>
        <div>
          <div className="nr-greeting">Нова оренда (walk-in)</div>
          <div className="nr-subtitle">
            Створення оренди з нуля — для телефонних і офісних клієнтів
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="nr-form">
        {/* ── Client + Car ── */}
        <div className="nr-row-2">
          <section className="dh-card">
            <div className="nr-section-head">
              <div className="nr-section-icon accent">
                <User />
              </div>
              <div className="nr-section-title">
                Клієнт<span className="nr-required">*</span>
              </div>
            </div>
            <div className="nr-entity-wrap">
              <EntitySearch
                entity="client"
                value={clientId}
                onChange={setClientId}
                placeholder="— Знайти клієнта за ім'ям/телефоном/email —"
                required
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--dh-text-dim)', marginTop: 10 }}>
              Якщо клієнта ще нема в базі —{' '}
              <Link
                href="/admin/clients/new"
                style={{ color: 'var(--dh-accent)', textDecoration: 'none', fontWeight: 600 }}
              >
                створити нового
              </Link>
              .
            </p>
          </section>

          <section className="dh-card">
            <div className="nr-section-head">
              <div className="nr-section-icon success">
                <Car />
              </div>
              <div className="nr-section-title">
                Авто<span className="nr-required">*</span>
              </div>
            </div>
            <div className="nr-entity-wrap">
              <EntitySearch
                entity="car"
                value={carId}
                onChange={setCarId}
                placeholder="— Знайти авто за маркою/номером —"
                required
              />
            </div>
          </section>
        </div>

        {/* ── Dates & locations ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon warning">
              <CalendarDays />
            </div>
            <div className="nr-section-title">Дати та локації</div>
          </div>
          <div className="nr-row-2">
            <div>
              <label className="nr-label">
                Видача<span className="nr-required">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={minPickup}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">
                Повернення<span className="nr-required">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || minPickup}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin style={{ width: 11, height: 11 }} /> Місце видачі
                  <span className="nr-required">*</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="напр. Офіс Одеса"
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin style={{ width: 11, height: 11 }} /> Місце повернення
                  <span className="nr-required">*</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                placeholder="напр. Офіс Одеса"
                className="nr-input"
              />
            </div>
          </div>
        </section>

        {/* ── Extra ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon">
              <FileText />
            </div>
            <div className="nr-section-title">Додаткові дані</div>
          </div>

          <div className="nr-row-3">
            <div>
              <label className="nr-label">Сума застави</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="nr-input"
                  style={{ flex: 1, minWidth: 0 }}
                />
                <div className="nr-select-wrap" style={{ width: 100, flexShrink: 0 }}>
                  <IosSelect
                    value={depositCurrency}
                    onChange={setDepositCurrency}
                    options={[
                      { value: 'USD', label: 'USD' },
                      { value: 'UAH', label: 'UAH' },
                      { value: 'EUR', label: 'EUR' },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="nr-label">№ договору</label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="auto-generate якщо порожньо"
                className="nr-input"
                style={{ fontFamily: 'var(--dh-mono)' }}
              />
            </div>
            <div>
              <label className="nr-label">Пробіг при видачі (км)</label>
              <input
                type="number"
                min="0"
                value={pickupOdometer}
                onChange={(e) => setPickupOdometer(e.target.value)}
                placeholder="0"
                className="nr-input"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="nr-label">Нотатки</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="напр. клієнт планує перетин кордону, попросив дитяче крісло…"
              className="nr-textarea"
            />
          </div>
        </section>

        {error && (
          <div className="nr-alert">
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="nr-actions">
          <Link href="/admin/rentals" className="nr-btn nr-btn-ghost">
            Скасувати
          </Link>
          <button type="submit" disabled={submitting} className="nr-btn nr-btn-primary">
            {submitting ? <Loader2 className="animate-spin" /> : <Save />}
            {submitting ? 'Створюємо…' : 'Створити оренду'}
          </button>
        </div>
      </form>
    </div>
  );
}
