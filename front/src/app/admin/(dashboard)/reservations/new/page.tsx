'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Calculator,
  Loader2,
  Plus,
  Minus,
  User,
  Car,
  CalendarDays,
  MapPin,
  Shield,
  Package,
  Truck,
} from 'lucide-react';
import { IosSelect } from '@/components/admin/ios-select';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface ClientOption { id: number; firstName: string; lastName: string; phone: string }
interface CarOption { id: number; brand: string; model: string; plateNumber: string }
interface CoverageOption { id: number; name: string; depositPercent: number }
interface AddOnOption { id: number; name: string; pricingMode: string; unitPriceMinor: number; currency: string; qtyEditable: boolean }

interface SelectedAddOn { addOnId: number; qty: number }

interface PriceBreakdown {
  totalDays: number;
  ratePlanName: string | null;
  dailyRateMinor: number;
  currency: string;
  rentalTotal: number;
  coveragePackageName: string | null;
  depositPercent: number;
  depositAmount: number;
  addOns: Array<{ addOnId: number; name: string; pricingMode: string; quantity: number; unitPriceMinor: number; currency: string; totalMinor: number }>;
  addOnsTotal: number;
  deliveryFee: number;
  grandTotal: number;
}

function todayLocal() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

function fmtMoney(minor: number, currency: string) {
  return `${(minor / 100).toFixed(2)} ${currency}`;
}

export default function NewReservationPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [packages, setPackages] = useState<CoverageOption[]>([]);
  const [availableAddOns, setAvailableAddOns] = useState<AddOnOption[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);

  const [price, setPrice] = useState<PriceBreakdown | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState('');

  const [form, setForm] = useState({
    clientId: '',
    carId: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Львів',
    returnLocation: 'Львів',
    coveragePackageId: '',
    deliveryFee: '0',
    deliveryCurrency: 'UAH',
  });

  const PRICING_MODE_LABEL: Record<string, string> = {
    PER_DAY: t('reservationDetail.perDay'),
    ONE_TIME: t('reservationDetail.oneTime'),
    MANUAL_QTY: t('reservationDetail.perUnit'),
  };

  useEffect(() => {
    adminApiClient.get('/client?limit=200').then(r => setClients(r.data.items)).catch(() => {});
    getAllCars().then(r => setCars(r.cars)).catch(() => {});
    adminApiClient.get('/pricing/coverage-package').then(r => setPackages(r.data.coveragePackages)).catch(() => {});
    adminApiClient.get('/pricing/add-on').then(r => setAvailableAddOns(r.data.addOns)).catch(() => {});
  }, []);

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const toggleAddOn = (addOnId: number) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.addOnId === addOnId);
      if (exists) return prev.filter(a => a.addOnId !== addOnId);
      return [...prev, { addOnId, qty: 1 }];
    });
  };

  const setAddOnQty = (addOnId: number, qty: number) => {
    if (qty < 1) return;
    setSelectedAddOns(prev => prev.map(a => a.addOnId === addOnId ? { ...a, qty } : a));
  };

  const calculatePrice = useCallback(async (
    carId: string, pickupDate: string, returnDate: string,
    coveragePackageId: string, deliveryFee: string, addOns: SelectedAddOn[]
  ) => {
    if (!carId || !pickupDate || !returnDate) { setPrice(null); return; }
    if (new Date(returnDate) <= new Date(pickupDate)) { setPrice(null); return; }
    setPriceLoading(true);
    setPriceError('');
    try {
      const body: Record<string, unknown> = {
        carId: parseInt(carId),
        startDate: pickupDate,
        endDate: returnDate,
      };
      if (coveragePackageId) body.coveragePackageId = parseInt(coveragePackageId);
      if (parseInt(deliveryFee)) body.deliveryFee = parseInt(deliveryFee);
      if (addOns.length > 0) body.addOns = addOns.map(a => ({ addOnId: a.addOnId, qty: a.qty }));
      const res = await adminApiClient.post('/pricing/calculate', body);
      setPrice(res.data);
    } catch {
      setPriceError(t('newReservation.noTariff'));
      setPrice(null);
    } finally {
      setPriceLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePrice(form.carId, form.pickupDate, form.returnDate, form.coveragePackageId, form.deliveryFee, selectedAddOns);
    }, 300);
    return () => clearTimeout(timer);
  }, [form.carId, form.pickupDate, form.returnDate, form.coveragePackageId, form.deliveryFee, selectedAddOns, calculatePrice]);

  const handlePickupChange = (val: string) => {
    set('pickupDate', val);
    if (form.returnDate && new Date(form.returnDate) <= new Date(val)) {
      set('returnDate', '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.carId || !form.pickupDate || !form.returnDate) {
      setError(t('newReservation.fillRequired'));
      return;
    }
    if (new Date(form.returnDate) <= new Date(form.pickupDate)) {
      setError(t('newReservation.returnAfterPickup'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        clientId: parseInt(form.clientId),
        carId: parseInt(form.carId),
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        pickupLocation: form.pickupLocation,
        returnLocation: form.returnLocation,
        deliveryFee: parseInt(form.deliveryFee) || 0,
        deliveryCurrency: form.deliveryCurrency,
      };
      if (form.coveragePackageId) body.coveragePackageId = parseInt(form.coveragePackageId);
      if (price) body.priceSnapshot = price;

      const res = await adminApiClient.post('/reservation', body);
      const reservationId = res.data.reservation.id;

      for (const sa of selectedAddOns) {
        const addOn = availableAddOns.find(a => a.id === sa.addOnId);
        if (!addOn) continue;
        await adminApiClient.post(`/reservation/${reservationId}/add-on`, {
          addOnId: sa.addOnId,
          quantity: sa.qty,
          unitPriceMinor: addOn.unitPriceMinor,
          currency: addOn.currency,
        });
      }

      router.push(`/admin/reservations/${reservationId}`);
    } catch (err: any) {
      setError(err?.response?.data?.msg || t('newReservation.errorCreating'));
    } finally {
      setSaving(false);
    }
  };

  const minPickup = todayLocal();
  const minReturn = form.pickupDate || minPickup;

  return (
    <div className="max-w-3xl">
      {/* ── Header ── */}
      <div
        className="mb-6 rounded-2xl px-8 py-6"
        style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/reservations" className="ios-icon-btn">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #43A047, #2E7D32)',
              boxShadow: '0 4px 12px rgba(67,160,71,0.3)',
            }}
          >
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newReservation.title')}</h1>
            <p className="mt-0.5 text-[13px]" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              {t('newReservation.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {error && <div className="mb-5 ios-alert-destructive">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Client ── */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(124,77,255,0.15)' : '#EDE7F6' }}
            >
              <User className="h-3.5 w-3.5" style={{ color: '#7C4DFF' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
              {t('newReservation.sectionClient')}
            </h2>
          </div>
          <IosSelect
            value={form.clientId}
            onChange={(v) => set('clientId', v)}
            options={[
              { value: '', label: t('newReservation.selectClient') },
              ...clients.map(c => ({ value: String(c.id), label: `${c.lastName} ${c.firstName} (${c.phone})` })),
            ]}
            placeholder={t('newReservation.selectClient')}
            className="w-full text-[13px]"
            required
          />
        </div>

        {/* ── Car ── */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(67,160,71,0.15)' : '#E8F5E9' }}
            >
              <Car className="h-3.5 w-3.5" style={{ color: '#43A047' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
              {t('newReservation.sectionCar')}
            </h2>
          </div>
          <IosSelect
            value={form.carId}
            onChange={(v) => set('carId', v)}
            options={[
              { value: '', label: t('newReservation.selectCar') },
              ...cars.map(c => ({ value: String(c.id), label: `${c.brand} ${c.model} (${c.plateNumber})` })),
            ]}
            placeholder={t('newReservation.selectCar')}
            className="w-full text-[13px]"
            required
          />
        </div>

        {/* ── Dates ── */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(230,81,0,0.15)' : '#FFF3E0' }}
            >
              <CalendarDays className="h-3.5 w-3.5" style={{ color: '#E65100' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
              {t('newReservation.sectionDates')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.pickupDate')}</label>
              <input type="datetime-local" value={form.pickupDate} onChange={e => handlePickupChange(e.target.value)}
                min={minPickup}
                className="w-full ios-input text-[13px]" required />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.returnDate')}</label>
              <input type="datetime-local" value={form.returnDate} onChange={e => set('returnDate', e.target.value)}
                min={minReturn}
                className="w-full ios-input text-[13px]" required />
            </div>
          </div>
        </div>

        {/* ── Locations ── */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(21,101,192,0.15)' : '#E3F2FD' }}
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: '#1565C0' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newReservation.sectionLocations')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.pickupLocation')}</label>
              <input value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)}
                className="w-full ios-input text-[13px]" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.returnLocation')}</label>
              <input value={form.returnLocation} onChange={e => set('returnLocation', e.target.value)}
                className="w-full ios-input text-[13px]" />
            </div>
          </div>
        </div>

        {/* ── Coverage & delivery ── */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(198,40,40,0.15)' : '#FCE4EC' }}
            >
              <Shield className="h-3.5 w-3.5" style={{ color: '#C62828' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newReservation.sectionCoverage')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.coverageLabel')}</label>
              <IosSelect
                value={form.coveragePackageId}
                onChange={(v) => set('coveragePackageId', v)}
                options={[
                  { value: '', label: t('newReservation.noCoverage') },
                  ...packages.map(p => ({ value: String(p.id), label: `${p.name} (${t('newReservation.deposit')} ${p.depositPercent}%)` })),
                ]}
                placeholder={t('newReservation.noCoverage')}
                className="w-full text-[13px]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
                  <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {t('newReservation.deliveryCost')}</span>
                </label>
                <input type="number" value={form.deliveryFee} onChange={e => set('deliveryFee', e.target.value)}
                  className="w-full ios-input text-[13px]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.deliveryCurrency')}</label>
                <IosSelect
                  value={form.deliveryCurrency}
                  onChange={(v) => set('deliveryCurrency', v)}
                  options={[
                    { value: 'UAH', label: 'UAH' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                  ]}
                  className="w-full text-[13px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Add-ons ── */}
        {availableAddOns.length > 0 && (
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: isDark ? 'rgba(142,36,170,0.15)' : '#F3E5F5' }}
              >
                <Package className="h-3.5 w-3.5" style={{ color: '#8E24AA' }} />
              </div>
              <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newReservation.sectionAddOns')}</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {availableAddOns.map(addon => {
                const selected = selectedAddOns.find(a => a.addOnId === addon.id);
                const isSelected = !!selected;
                const showQty = isSelected && (addon.pricingMode === 'MANUAL_QTY' || addon.qtyEditable);
                const qty = selected?.qty || 1;
                const pricingLabel = PRICING_MODE_LABEL[addon.pricingMode] || addon.pricingMode;
                return (
                  <div
                    key={addon.id}
                    className={cn(
                      'group rounded-2xl border p-3.5 transition-all cursor-pointer',
                      isSelected
                        ? (isDark ? 'bg-[#2D1B45] border-[#6A1B9A]' : 'bg-[#F3E5F5] border-[#E1BEE7]') + ' shadow-[0_10px_22px_rgba(142,36,170,0.12)]'
                        : (isDark ? 'bg-[#1E293B] border-[#2D3748] hover:bg-[#1A2332]' : 'bg-[#F7F9FB] border-[#ECEFF1] hover:bg-white') + ' hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]',
                    )}
                    onClick={() => toggleAddOn(addon.id)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAddOn(addon.id)}
                        onClick={e => e.stopPropagation()}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#8E24AA]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold truncate" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                              {addon.name}
                            </div>
                          </div>
                          <div className="flex w-full flex-wrap items-center justify-end gap-1.5 sm:w-auto">
                            <span
                              className="whitespace-nowrap rounded-full border bg-white dark:bg-card px-2.5 py-1 text-[12px] font-bold"
                              style={{ borderColor: isDark ? '#2D3748' : '#ECEFF1', color: isDark ? '#E2E8F0' : '#263238' }}
                            >
                              {fmtMoney(addon.unitPriceMinor, addon.currency)}
                            </span>
                            <span
                              className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold"
                              style={{ backgroundColor: isDark ? 'rgba(206,147,216,0.15)' : '#E1BEE7', color: isDark ? '#CE93D8' : '#6A1B9A' }}
                            >
                              {pricingLabel}
                            </span>
                          </div>
                        </div>

                        {showQty && (
                          <div className="mt-3 flex justify-end" onClick={e => e.stopPropagation()}>
                            <div
                              className="flex items-center rounded-full border bg-white dark:bg-card"
                              style={{ borderColor: isDark ? 'rgba(206,147,216,0.3)' : '#E1BEE7' }}
                            >
                              <button
                                type="button"
                                disabled={qty <= 1}
                                onClick={() => setAddOnQty(addon.id, qty - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-40"
                                style={{ backgroundColor: 'transparent' }}
                              >
                                <Minus className="h-3 w-3" style={{ color: '#6A1B9A' }} />
                              </button>
                              <span className="w-10 text-center text-[13px] font-semibold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setAddOnQty(addon.id, qty + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                                style={{ backgroundColor: 'transparent' }}
                              >
                                <Plus className="h-3 w-3" style={{ color: '#6A1B9A' }} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cost calculation ── */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: isDark ? '#1A2332' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(67,160,71,0.15)' : '#E8F5E9' }}
            >
              <Calculator className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />
            </div>
            <h2 className="text-[13px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newReservation.sectionCost')}</h2>
            {priceLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: isDark ? '#718096' : '#90A4AE' }} />}
          </div>

          {priceLoading ? (
            <div className="flex items-center gap-2 py-3" style={{ color: isDark ? '#718096' : '#90A4AE' }}>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[13px]">{t('newReservation.calculating')}</span>
            </div>
          ) : priceError ? (
            <p className="text-[13px]" style={{ color: '#EF5350' }}>{priceError}</p>
          ) : price ? (
            <div className="space-y-2.5">
              <div className="flex justify-between text-[13px]">
                <span style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.tariff')}</span>
                <span className="font-medium" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{price.ratePlanName || t('newReservation.standard')}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.rentalDays')}</span>
                <span className="font-medium" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{price.totalDays}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.pricePerDay')}</span>
                <span className="font-medium" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{fmtMoney(price.dailyRateMinor, price.currency)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.rentalCost')}</span>
                <span className="font-medium" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{fmtMoney(price.rentalTotal, price.currency)}</span>
              </div>
              {price.addOns.length > 0 && price.addOns.map((a, i) => (
                <div key={i} className="flex justify-between text-[13px]">
                  <span style={{ color: isDark ? '#718096' : '#90A4AE' }}>{a.name} (x{a.quantity})</span>
                  <span className="font-medium" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{fmtMoney(a.totalMinor, a.currency)}</span>
                </div>
              ))}
              {price.deliveryFee > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: isDark ? '#718096' : '#90A4AE' }}>{t('newReservation.deliveryLabel')}</span>
                  <span className="font-medium" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{fmtMoney(price.deliveryFee, price.currency)}</span>
                </div>
              )}
              <div
                className="flex justify-between pt-3 mt-1"
                style={{ borderTop: isDark ? '1px solid #2D3748' : '1px solid #ECEFF1' }}
              >
                <span className="text-[14px] font-bold" style={{ color: isDark ? '#E2E8F0' : '#263238' }}>{t('newReservation.totalCost')}</span>
                <span className="text-[18px] font-bold" style={{ color: isDark ? '#4ADE80' : '#2E7D32' }}>{fmtMoney(price.grandTotal, price.currency)}</span>
              </div>
              {price.depositAmount > 0 && (
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: isDark ? '#4A5568' : '#B0BEC5' }}>{t('newReservation.deposit')} ({price.depositPercent}%)</span>
                  <span style={{ color: isDark ? '#4A5568' : '#B0BEC5' }}>{fmtMoney(price.depositAmount, price.currency)}</span>
                </div>
              )}
              {price.dailyRateMinor === 0 && (
                <p className="text-[12px] mt-1" style={{ color: '#E65100' }}>
                  {t('newReservation.noTariff')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[13px] py-2" style={{ color: isDark ? '#4A5568' : '#B0BEC5' }}>
              {t('newReservation.selectCarAndDates')}
            </p>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="pt-2 pb-6 space-y-3">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-3 rounded-2xl text-[16px] font-bold text-white tracking-wide transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              padding: '16px 0',
              background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
              boxShadow: '0 6px 20px rgba(67,160,71,0.35), 0 2px 6px rgba(0,0,0,0.08)',
            }}
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? t('common.saving') : t('newReservation.submit')}
          </button>
          <Link
            href="/admin/reservations"
            className="w-full flex items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold transition-all active:scale-[0.97]"
            style={{ padding: '14px 0', color: isDark ? '#718096' : '#90A4AE' }}
          >
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
