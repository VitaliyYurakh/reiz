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
import { useAdminTheme } from '@/context/AdminThemeContext';
import { EntitySearch } from '@/components/admin/EntitySearch';
import {
  ArrowLeft,
  Receipt,
  User,
  Car,
  Calendar,
  MapPin,
  Save,
  AlertCircle,
} from 'lucide-react';

export default function NewRentalPage() {
  const router = useRouter();
  const { theme, H } = useAdminTheme();
  const { t } = useAdminLocale();
  const isDark = theme === 'dark';

  const [clientId, setClientId] = useState('');
  const [carId, setCarId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
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
      setError('Заповніть усі обов\'язкові поля');
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

  return (
    <div>
      {/* Header */}
      <div
        className="mb-6 rounded-[20px] px-7 py-5"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: H.shadow }}
      >
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/rentals"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: isDark ? '#1E293B' : '#F7F9FB' }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-icon-box h-icon-box-green">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="h-title">Нова оренда (walk-in)</h1>
            <span className="h-subtitle">
              Створення оренди з нуля — для телефонних і офісних клієнтів
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client + Car */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="ios-card">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Клієнт <span className="text-rose-600">*</span>
            </div>
            <div className="mt-3">
              <EntitySearch
                entity="client"
                value={clientId}
                onChange={setClientId}
                placeholder="— Знайти клієнта за ім'ям/телефоном/email —"
                required
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Якщо клієнта ще нема в базі —{' '}
              <Link href="/admin/clients/new" className="text-primary hover:underline">
                створити нового
              </Link>
              .
            </p>
          </div>

          <div className="ios-card">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Car className="h-3.5 w-3.5" />
              Авто <span className="text-rose-600">*</span>
            </div>
            <div className="mt-3">
              <EntitySearch
                entity="car"
                value={carId}
                onChange={setCarId}
                placeholder="— Знайти авто за маркою/номером —"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates + Locations */}
        <div className="ios-card">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Дати та локації
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs text-muted-foreground">
                Видача <span className="text-rose-600">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">
                Повернення <span className="text-rose-600">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || new Date().toISOString().slice(0, 16)}
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> Місце видачі <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="напр. Офіс Одеса"
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> Місце повернення <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                placeholder="напр. Офіс Одеса"
                className="ios-input text-sm mt-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Deposit + Contract + Odometer + Notes */}
        <div className="ios-card">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Додаткові дані
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs text-muted-foreground">Сума застави</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="ios-input text-sm flex-1"
                />
                <select
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value)}
                  className="ios-select text-sm"
                  style={{ width: 80 }}
                >
                  <option value="USD">USD</option>
                  <option value="UAH">UAH</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">№ договору</label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="auto-generate якщо порожньо"
                className="ios-input text-sm mt-1 w-full font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">Пробіг при видачі (км)</label>
              <input
                type="number"
                min="0"
                value={pickupOdometer}
                onChange={(e) => setPickupOdometer(e.target.value)}
                placeholder="0"
                className="ios-input text-sm mt-1 w-full tabular-nums"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-muted-foreground">Нотатки</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="напр. клієнт планує перетин кордону, попросив дитяче крісло…"
              className="ios-textarea text-sm mt-1 w-full"
            />
          </div>
        </div>

        {error && (
          <div className="ios-card flex items-start gap-2 border-l-4 border-rose-500 text-sm text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Link href="/admin/rentals" className="ios-btn ios-btn-ghost text-sm">
            Скасувати
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="ios-btn ios-btn-primary text-sm"
          >
            <Save className="h-4 w-4" />
            {submitting ? 'Створюємо…' : 'Створити оренду'}
          </button>
        </div>
      </form>
    </div>
  );
}
