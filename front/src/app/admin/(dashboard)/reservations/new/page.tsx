'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Calculator,
  Loader2,
  Plus,
  Minus,
  Check,
  AlertCircle,
  User,
  Car,
  CalendarDays,
  MapPin,
  Shield,
  Package,
} from 'lucide-react';
import { IosSelect } from '@/components/admin/IosSelect';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { fmtMoney } from '@/app/admin/lib/format';
import '../../dashboard/dashboard.css';
import './new-reservation.css';

interface ClientOption { id: number; firstName: string; lastName: string; phone: string }
interface CarOption { id: number; brand: string | null; model: string | null; plateNumber: string | null }
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

export default function NewReservationPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
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
    <div className="dh-root nr-container">
      {/* ── Header (greeting style) ── */}
      <div className="nr-header">
        <Link href="/admin/reservations" className="nr-back" aria-label="Назад">
          <ArrowLeft />
        </Link>
        <div>
          <div className="nr-greeting">{t('newReservation.title')}</div>
          <div className="nr-subtitle">{t('newReservation.subtitle')}</div>
        </div>
      </div>

      {error && (
        <div className="nr-alert" style={{ marginBottom: 16 }}>
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="nr-form">
        {/* ── Client + Car ── */}
        <div className="nr-row-2">
          <section className="dh-card">
            <div className="nr-section-head">
              <div className="nr-section-icon accent">
                <User />
              </div>
              <div className="nr-section-title">
                {t('newReservation.sectionClient')}
                <span className="nr-required">*</span>
              </div>
            </div>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.clientId}
                onChange={(v) => set('clientId', v)}
                options={[
                  { value: '', label: t('newReservation.selectClient') },
                  ...clients.map(c => ({ value: String(c.id), label: `${c.lastName} ${c.firstName} (${c.phone})` })),
                ]}
                placeholder={t('newReservation.selectClient')}
                required
              />
            </div>
          </section>

          <section className="dh-card">
            <div className="nr-section-head">
              <div className="nr-section-icon success">
                <Car />
              </div>
              <div className="nr-section-title">
                {t('newReservation.sectionCar')}
                <span className="nr-required">*</span>
              </div>
            </div>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.carId}
                onChange={(v) => set('carId', v)}
                options={[
                  { value: '', label: t('newReservation.selectCar') },
                  ...cars.map(c => ({ value: String(c.id), label: `${c.brand || ''} ${c.model || ''} (${c.plateNumber || ''})`.trim() })),
                ]}
                placeholder={t('newReservation.selectCar')}
                required
              />
            </div>
          </section>
        </div>

        {/* ── Dates ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon warning">
              <CalendarDays />
            </div>
            <div className="nr-section-title">
              {t('newReservation.sectionDates')}
              <span className="nr-required">*</span>
            </div>
          </div>
          <div className="nr-row-2">
            <div>
              <label className="nr-label">{t('newReservation.pickupDate')}</label>
              <input
                type="datetime-local"
                value={form.pickupDate}
                onChange={(e) => handlePickupChange(e.target.value)}
                min={minPickup}
                className="nr-input"
                required
              />
            </div>
            <div>
              <label className="nr-label">{t('newReservation.returnDate')}</label>
              <input
                type="datetime-local"
                value={form.returnDate}
                onChange={(e) => set('returnDate', e.target.value)}
                min={minReturn}
                className="nr-input"
                required
              />
            </div>
          </div>
        </section>

        {/* ── Locations ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon info">
              <MapPin />
            </div>
            <div className="nr-section-title">{t('newReservation.sectionLocations')}</div>
          </div>
          <div className="nr-row-2">
            <div>
              <label className="nr-label">{t('newReservation.pickupLocation')}</label>
              <input
                value={form.pickupLocation}
                onChange={(e) => set('pickupLocation', e.target.value)}
                className="nr-input"
              />
            </div>
            <div>
              <label className="nr-label">{t('newReservation.returnLocation')}</label>
              <input
                value={form.returnLocation}
                onChange={(e) => set('returnLocation', e.target.value)}
                className="nr-input"
              />
            </div>
          </div>
        </section>

        {/* ── Coverage & delivery ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon danger">
              <Shield />
            </div>
            <div className="nr-section-title">{t('newReservation.sectionCoverage')}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="nr-label">{t('newReservation.coverageLabel')}</label>
              <div className="nr-select-wrap">
                <IosSelect
                  value={form.coveragePackageId}
                  onChange={(v) => set('coveragePackageId', v)}
                  options={[
                    { value: '', label: t('newReservation.noCoverage') },
                    ...packages.map(p => ({ value: String(p.id), label: p.name })),
                  ]}
                  placeholder={t('newReservation.noCoverage')}
                />
              </div>
            </div>
            <div className="nr-row-2">
              <div>
                <label className="nr-label">{t('newReservation.deliveryCost')}</label>
                <input
                  type="number"
                  value={form.deliveryFee}
                  onChange={(e) => set('deliveryFee', e.target.value)}
                  className="nr-input"
                />
              </div>
              <div>
                <label className="nr-label">{t('newReservation.deliveryCurrency')}</label>
                <div className="nr-select-wrap">
                  <IosSelect
                    value={form.deliveryCurrency}
                    onChange={(v) => set('deliveryCurrency', v)}
                    options={[
                      { value: 'UAH', label: 'UAH' },
                      { value: 'USD', label: 'USD' },
                      { value: 'EUR', label: 'EUR' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Add-ons ── */}
        {availableAddOns.length > 0 && (
          <section className="dh-card">
            <div className="nr-section-head">
              <div className="nr-section-icon accent">
                <Package />
              </div>
              <div className="nr-section-title">{t('newReservation.sectionAddOns')}</div>
            </div>
            <div className="nr-addons-grid">
              {availableAddOns.map((addon) => {
                const selected = selectedAddOns.find((a) => a.addOnId === addon.id);
                const isSelected = !!selected;
                const showQty = isSelected && (addon.pricingMode === 'MANUAL_QTY' || addon.qtyEditable);
                const qty = selected?.qty || 1;
                const pricingLabel = PRICING_MODE_LABEL[addon.pricingMode] || addon.pricingMode;
                return (
                  <div
                    key={addon.id}
                    className={`nr-addon ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleAddOn(addon.id)}
                  >
                    <div className="nr-addon-top">
                      <span className="nr-addon-name">{addon.name}</span>
                      <div className="nr-addon-check">
                        <Check />
                      </div>
                    </div>
                    <div className="nr-addon-meta">
                      <span className="nr-addon-price">{fmtMoney(addon.unitPriceMinor, addon.currency)}</span>
                      <span className="nr-addon-mode">{pricingLabel}</span>
                      {showQty && (
                        <div className="nr-qty-stepper" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="nr-qty-btn"
                            disabled={qty <= 1}
                            onClick={() => setAddOnQty(addon.id, qty - 1)}
                          >
                            <Minus />
                          </button>
                          <span className="nr-qty-val">{qty}</span>
                          <button
                            type="button"
                            className="nr-qty-btn"
                            onClick={() => setAddOnQty(addon.id, qty + 1)}
                          >
                            <Plus />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Cost calculation ── */}
        <section className="dh-card">
          <div className="nr-section-head">
            <div className="nr-section-icon success">
              <Calculator />
            </div>
            <div className="nr-section-title">{t('newReservation.sectionCost')}</div>
          </div>

          {priceLoading ? (
            <div className="nr-summary-loading">
              <Loader2 />
              <span>{t('newReservation.calculating')}</span>
            </div>
          ) : priceError ? (
            <p style={{ fontSize: 13, color: 'var(--dh-warning)' }}>{priceError}</p>
          ) : price ? (
            <div className="nr-summary">
              <div className="nr-summary-row">
                <span className="label">{t('newReservation.tariff')}</span>
                <span className="value">{price.ratePlanName || t('newReservation.standard')}</span>
              </div>
              <div className="nr-summary-row">
                <span className="label">{t('newReservation.rentalDays')}</span>
                <span className="value">{price.totalDays}</span>
              </div>
              <div className="nr-summary-row">
                <span className="label">{t('newReservation.pricePerDay')}</span>
                <span className="value">{fmtMoney(price.dailyRateMinor, price.currency)}</span>
              </div>
              <div className="nr-summary-row">
                <span className="label">{t('newReservation.rentalCost')}</span>
                <span className="value">{fmtMoney(price.rentalTotal, price.currency)}</span>
              </div>
              {price.addOns.length > 0 &&
                price.addOns.map((a, i) => (
                  <div key={i} className="nr-summary-row">
                    <span className="label">{a.name} (x{a.quantity})</span>
                    <span className="value">{fmtMoney(a.totalMinor, a.currency)}</span>
                  </div>
                ))}
              {price.deliveryFee > 0 && (
                <div className="nr-summary-row">
                  <span className="label">{t('newReservation.deliveryLabel')}</span>
                  <span className="value">{fmtMoney(price.deliveryFee, price.currency)}</span>
                </div>
              )}
              <div className="nr-summary-divider" />
              <div className="nr-summary-total">
                <span className="label">{t('newReservation.totalCost')}</span>
                <span className="value">{fmtMoney(price.grandTotal, price.currency)}</span>
              </div>
              {price.depositAmount > 0 && (
                <div className="nr-summary-deposit">
                  <span>{t('newReservation.deposit')}</span>
                  <span>{fmtMoney(price.depositAmount, price.currency)}</span>
                </div>
              )}
              {price.dailyRateMinor === 0 && (
                <p style={{ fontSize: 12, color: 'var(--dh-warning)', marginTop: 4 }}>
                  {t('newReservation.noTariff')}
                </p>
              )}
            </div>
          ) : (
            <p className="nr-summary-empty">{t('newReservation.selectCarAndDates')}</p>
          )}
        </section>

        {/* ── Actions ── */}
        <div className="nr-actions">
          <Link href="/admin/reservations" className="nr-btn nr-btn-ghost">
            {t('common.cancel')}
          </Link>
          <button type="submit" disabled={saving} className="nr-btn nr-btn-primary">
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            {saving ? t('common.saving') : t('newReservation.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
