'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { IosSelect } from '@/components/admin/IosSelect';
import {
  Save,
  Loader2,
  PackageOpen,
  Tag,
  DollarSign,
  MapPin,
  StickyNote,
} from 'lucide-react';
import '../dashboard/dashboard.css';
import '../reservations/new/new-reservation.css';

interface PickupLocationLite { id: number; nameUk: string; nameEn: string }
interface UserLite { id: number; name: string; email: string }

interface InventoryItemPartial {
  name?: string;
  category?: string;
  serialNumber?: string | null;
  status?: string;
  quantity?: number;
  purchaseDate?: string | null;
  purchasePriceMinor?: number | null;
  currentValueMinor?: number | null;
  currency?: string;
  locationId?: number | null;
  responsibleUserId?: number | null;
  notes?: string | null;
}

interface Props {
  value: InventoryItemPartial | null;
  onSave: (data: InventoryItemPartial) => Promise<void>;
  saving: boolean;
}

export default function InventoryForm({ value, onSave, saving }: Props) {
  const { t } = useAdminLocale();
  const [form, setForm] = useState<InventoryItemPartial>(() => ({
    name: '',
    category: 'TOOL',
    status: 'AVAILABLE',
    quantity: 1,
    currency: 'UAH',
    ...(value || {}),
  }));
  const [locations, setLocations] = useState<PickupLocationLite[]>([]);
  const [users, setUsers] = useState<UserLite[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [locRes, userRes] = await Promise.all([
          adminApiClient.get('/city/locations'),
          adminApiClient.get('/user'),
        ]);
        setLocations(locRes.data.items || locRes.data.locations || []);
        setUsers(userRes.data.items || userRes.data.users || []);
      } catch {
        /* silent */
      }
    })();
  }, []);

  const update = <K extends keyof InventoryItemPartial>(k: K, v: InventoryItemPartial[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const fmtMoneyInput = (minor: number | null | undefined) =>
    minor != null ? (minor / 100).toFixed(2) : '';
  const parseMoneyInput = (s: string): number | null =>
    s.trim() === '' ? null : Math.round(parseFloat(s) * 100);

  const isInvalid = saving || !form.name?.trim();

  return (
    <div className="nr-form">
      {/* ── Basics ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon accent">
            <PackageOpen />
          </div>
          <div className="nr-section-title">{t('inventory.sectionBasics') ?? 'Основні дані'}</div>
        </div>
        <div className="nr-row-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div>
            <label className="nr-label">
              {t('inventory.name')}<span className="nr-required">*</span>
            </label>
            <input
              value={form.name || ''}
              onChange={(e) => update('name', e.target.value)}
              className="nr-input"
              required
            />
          </div>
          <div>
            <label className="nr-label">{t('inventory.serialNumber')}</label>
            <input
              value={form.serialNumber || ''}
              onChange={(e) => update('serialNumber', e.target.value || null)}
              className="nr-input"
              style={{ fontFamily: 'var(--dh-mono)' }}
            />
          </div>
        </div>
      </section>

      {/* ── Classification ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon info">
            <Tag />
          </div>
          <div className="nr-section-title">
            {t('inventory.sectionClassification') ?? 'Класифікація'}
          </div>
        </div>
        <div className="nr-row-3">
          <div>
            <label className="nr-label">{t('inventory.category')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.category ?? 'TOOL'}
                onChange={(v) => update('category', v)}
                options={[
                  { value: 'TOOL', label: t('inventory.catTool') },
                  { value: 'EQUIPMENT', label: t('inventory.catEquipment') },
                  { value: 'ACCESSORY', label: t('inventory.catAccessory') },
                  { value: 'KEYS', label: t('inventory.catKeys') },
                  { value: 'OTHER', label: t('inventory.catOther') },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="nr-label">{t('inventory.status')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.status ?? 'AVAILABLE'}
                onChange={(v) => update('status', v)}
                options={[
                  { value: 'AVAILABLE', label: t('inventory.statusAvailable') },
                  { value: 'ASSIGNED', label: t('inventory.statusAssigned') },
                  { value: 'MAINTENANCE', label: t('inventory.statusMaintenance') },
                  { value: 'LOST', label: t('inventory.statusLost') },
                  { value: 'WRITTEN_OFF', label: t('inventory.statusWrittenOff') },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="nr-label">{t('inventory.quantity')}</label>
            <input
              type="number"
              min={0}
              value={form.quantity ?? 1}
              onChange={(e) => update('quantity', Number(e.target.value))}
              className="nr-input"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
        </div>
      </section>

      {/* ── Cost ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon success">
            <DollarSign />
          </div>
          <div className="nr-section-title">{t('inventory.sectionCost') ?? 'Вартість'}</div>
        </div>
        <div className="nr-row-3">
          <div>
            <label className="nr-label">{t('inventory.purchasePrice')}</label>
            <input
              type="number"
              step="0.01"
              value={fmtMoneyInput(form.purchasePriceMinor)}
              onChange={(e) => update('purchasePriceMinor', parseMoneyInput(e.target.value))}
              className="nr-input"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
          <div>
            <label className="nr-label">{t('inventory.currentValue')}</label>
            <input
              type="number"
              step="0.01"
              value={fmtMoneyInput(form.currentValueMinor)}
              onChange={(e) => update('currentValueMinor', parseMoneyInput(e.target.value))}
              className="nr-input"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
          <div>
            <label className="nr-label">{t('common.currency')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.currency ?? 'UAH'}
                onChange={(v) => update('currency', v)}
                options={[
                  { value: 'UAH', label: 'UAH' },
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Assignment ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon warning">
            <MapPin />
          </div>
          <div className="nr-section-title">
            {t('inventory.sectionAssignment') ?? 'Призначення'}
          </div>
        </div>
        <div className="nr-row-2">
          <div>
            <label className="nr-label">{t('inventory.location')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.locationId != null ? String(form.locationId) : ''}
                onChange={(v) => update('locationId', v ? Number(v) : null)}
                options={[
                  { value: '', label: t('common.notSpecified') },
                  ...locations.map((l) => ({
                    value: String(l.id),
                    label: l.nameUk || l.nameEn,
                  })),
                ]}
                placeholder={t('common.notSpecified')}
              />
            </div>
          </div>
          <div>
            <label className="nr-label">{t('inventory.responsibleUser')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.responsibleUserId != null ? String(form.responsibleUserId) : ''}
                onChange={(v) => update('responsibleUserId', v ? Number(v) : null)}
                options={[
                  { value: '', label: t('common.notAssigned') },
                  ...users.map((u) => ({ value: String(u.id), label: u.name || u.email })),
                ]}
                placeholder={t('common.notAssigned')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Notes ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon">
            <StickyNote />
          </div>
          <div className="nr-section-title">{t('inventory.notes')}</div>
        </div>
        <textarea
          value={form.notes || ''}
          onChange={(e) => update('notes', e.target.value || null)}
          rows={3}
          className="nr-textarea"
        />
      </section>

      {/* ── Save ── */}
      <div className="nr-actions">
        <button
          type="button"
          onClick={() => onSave(form)}
          disabled={isInvalid}
          className="nr-btn nr-btn-primary"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {saving ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </div>
  );
}
