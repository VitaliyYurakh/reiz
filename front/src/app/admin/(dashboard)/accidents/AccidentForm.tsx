'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { IosSelect } from '@/components/admin/IosSelect';
import {
  Save,
  AlertTriangle,
  FileText,
  Shield,
  DollarSign,
  StickyNote,
  Loader2,
} from 'lucide-react';
import '../dashboard/dashboard.css';
import '../reservations/new/new-reservation.css';

interface CarLite { id: number; brand: string; model: string; plateNumber: string }
interface ClientLite { id: number; firstName: string; lastName: string; phone: string }
interface RentalLite { id: number; contractNumber: string | null }

interface AccidentPartial {
  carId?: number;
  rentalId?: number | null;
  clientId?: number | null;
  incidentAt?: string;
  location?: string | null;
  description?: string;
  fault?: string;
  status?: string;
  policeReportNumber?: string | null;
  insuranceCompany?: string | null;
  insuranceClaimNumber?: string | null;
  expertVisitAt?: string | null;
  expertNotes?: string | null;
  estimatedDamageMinor?: number | null;
  insurancePayoutMinor?: number | null;
  clientDebtMinor?: number;
  currency?: string;
  blocksCar?: boolean;
  notes?: string | null;
}

interface Props {
  value: AccidentPartial | null;
  onSave: (data: AccidentPartial) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
}

const todayIso = () => new Date().toISOString().slice(0, 16);
const toIso = (s: string | null | undefined) =>
  s ? new Date(s).toISOString().slice(0, 16) : '';

export default function AccidentForm({ value, onSave, saving, isEdit }: Props) {
  const { t } = useAdminLocale();
  const [form, setForm] = useState<AccidentPartial>(() => ({
    fault: 'UNKNOWN',
    status: 'REPORTED',
    currency: 'UAH',
    blocksCar: true,
    clientDebtMinor: 0,
    incidentAt: todayIso(),
    ...(value || {}),
  }));
  const [cars, setCars] = useState<CarLite[]>([]);
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [rentals, setRentals] = useState<RentalLite[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [carsRes, clientsRes, rentalsRes] = await Promise.all([
          adminApiClient.get('/car'),
          adminApiClient.get('/client?limit=500'),
          adminApiClient.get('/rental?limit=200'),
        ]);
        setCars(carsRes.data.cars || carsRes.data.items || []);
        setClients(clientsRes.data.items || clientsRes.data.clients || []);
        setRentals(rentalsRes.data.items || rentalsRes.data.rentals || []);
      } catch {
        /* silent */
      }
    })();
  }, []);

  const update = <K extends keyof AccidentPartial>(k: K, v: AccidentPartial[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const fmtMoneyInput = (minor: number | null | undefined) =>
    minor != null ? (minor / 100).toFixed(2) : '';
  const parseMoneyInput = (s: string): number | null =>
    s.trim() === '' ? null : Math.round(parseFloat(s) * 100);

  const isInvalid = saving || !form.carId || !form.description?.trim() || !form.incidentAt;

  return (
    <div className="nr-form">
      {/* ── General info ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon warning">
            <AlertTriangle />
          </div>
          <div className="nr-section-title">{t('accidents.sectionGeneral') ?? 'Загальні дані'}</div>
        </div>

        <div className="nr-row-3" style={{ marginBottom: 16 }}>
          <div>
            <label className="nr-label">
              {t('accidents.incidentAt')}<span className="nr-required">*</span>
            </label>
            <input
              type="datetime-local"
              value={toIso(form.incidentAt)}
              onChange={(e) => update('incidentAt', e.target.value)}
              className="nr-input"
            />
          </div>
          <div>
            <label className="nr-label">
              {t('accidents.car')}<span className="nr-required">*</span>
            </label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.carId != null ? String(form.carId) : ''}
                onChange={(v) => update('carId', v ? Number(v) : undefined)}
                options={[
                  { value: '', label: '—' },
                  ...cars.map((c) => ({
                    value: String(c.id),
                    label: `${c.brand} ${c.model} (${c.plateNumber})`,
                  })),
                ]}
                placeholder="—"
                disabled={isEdit}
              />
            </div>
          </div>
          <div>
            <label className="nr-label">{t('accidents.location')}</label>
            <input
              value={form.location || ''}
              onChange={(e) => update('location', e.target.value || null)}
              className="nr-input"
            />
          </div>
        </div>

        <div className="nr-row-2">
          <div>
            <label className="nr-label">{t('accidents.client')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.clientId != null ? String(form.clientId) : ''}
                onChange={(v) => update('clientId', v ? Number(v) : null)}
                options={[
                  { value: '', label: '—' },
                  ...clients.map((c) => ({
                    value: String(c.id),
                    label: `${c.lastName} ${c.firstName} (${c.phone})`,
                  })),
                ]}
                placeholder="—"
              />
            </div>
          </div>
          <div>
            <label className="nr-label">{t('accidents.rental')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.rentalId != null ? String(form.rentalId) : ''}
                onChange={(v) => update('rentalId', v ? Number(v) : null)}
                options={[
                  { value: '', label: '—' },
                  ...rentals.map((r) => ({
                    value: String(r.id),
                    label: r.contractNumber || `R-${r.id}`,
                  })),
                ]}
                placeholder="—"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Description / fault / status ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon accent">
            <FileText />
          </div>
          <div className="nr-section-title">
            {t('accidents.description')}<span className="nr-required">*</span>
          </div>
        </div>

        <textarea
          value={form.description || ''}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="nr-textarea"
        />

        <div className="nr-row-2" style={{ marginTop: 16 }}>
          <div>
            <label className="nr-label">{t('accidents.fault')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.fault ?? 'UNKNOWN'}
                onChange={(v) => update('fault', v)}
                options={[
                  { value: 'UNKNOWN', label: t('accidents.faultUnknown') },
                  { value: 'CLIENT', label: t('accidents.faultClient') },
                  { value: 'COMPANY', label: t('accidents.faultCompany') },
                  { value: 'THIRD_PARTY', label: t('accidents.faultThirdParty') },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="nr-label">{t('accidents.status')}</label>
            <div className="nr-select-wrap">
              <IosSelect
                value={form.status ?? 'REPORTED'}
                onChange={(v) => update('status', v)}
                options={[
                  { value: 'REPORTED', label: t('accidents.statusReported') },
                  { value: 'INVESTIGATING', label: t('accidents.statusInvestigating') },
                  { value: 'AWAITING_PAYOUT', label: t('accidents.statusAwaitingPayout') },
                  { value: 'RESOLVED', label: t('accidents.statusResolved') },
                  { value: 'CLOSED', label: t('accidents.statusClosed') },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Insurance / police ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon info">
            <Shield />
          </div>
          <div className="nr-section-title">{t('accidents.sectionInsurance')}</div>
        </div>

        <div className="nr-row-3" style={{ marginBottom: 16 }}>
          <div>
            <label className="nr-label">{t('accidents.policeReportNumber')}</label>
            <input
              value={form.policeReportNumber || ''}
              onChange={(e) => update('policeReportNumber', e.target.value || null)}
              className="nr-input"
            />
          </div>
          <div>
            <label className="nr-label">{t('accidents.insuranceCompany')}</label>
            <input
              value={form.insuranceCompany || ''}
              onChange={(e) => update('insuranceCompany', e.target.value || null)}
              className="nr-input"
            />
          </div>
          <div>
            <label className="nr-label">{t('accidents.insuranceClaimNumber')}</label>
            <input
              value={form.insuranceClaimNumber || ''}
              onChange={(e) => update('insuranceClaimNumber', e.target.value || null)}
              className="nr-input"
            />
          </div>
        </div>

        <div className="nr-row-2">
          <div>
            <label className="nr-label">{t('accidents.expertVisitAt')}</label>
            <input
              type="datetime-local"
              value={toIso(form.expertVisitAt)}
              onChange={(e) => update('expertVisitAt', e.target.value || null)}
              className="nr-input"
            />
          </div>
          <div>
            <label className="nr-label">{t('accidents.expertNotes')}</label>
            <input
              value={form.expertNotes || ''}
              onChange={(e) => update('expertNotes', e.target.value || null)}
              className="nr-input"
            />
          </div>
        </div>
      </section>

      {/* ── Financial ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon success">
            <DollarSign />
          </div>
          <div className="nr-section-title">{t('accidents.sectionFinancial')}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 110px',
            gap: 16,
          }}
        >
          <div>
            <label className="nr-label">{t('accidents.estimatedDamage')}</label>
            <input
              type="number"
              step="0.01"
              value={fmtMoneyInput(form.estimatedDamageMinor)}
              onChange={(e) => update('estimatedDamageMinor', parseMoneyInput(e.target.value))}
              className="nr-input"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
          <div>
            <label className="nr-label">{t('accidents.insurancePayout')}</label>
            <input
              type="number"
              step="0.01"
              value={fmtMoneyInput(form.insurancePayoutMinor)}
              onChange={(e) => update('insurancePayoutMinor', parseMoneyInput(e.target.value))}
              className="nr-input"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
          <div>
            <label className="nr-label">{t('accidents.clientDebt')}</label>
            <input
              type="number"
              step="0.01"
              value={fmtMoneyInput(form.clientDebtMinor)}
              onChange={(e) =>
                update('clientDebtMinor', parseMoneyInput(e.target.value) ?? 0)
              }
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

        <label className="nr-checkbox-row" style={{ marginTop: 12 }}>
          <input
            type="checkbox"
            checked={form.blocksCar ?? true}
            onChange={(e) => update('blocksCar', e.target.checked)}
          />
          {t('accidents.blocksCar')}
        </label>
      </section>

      {/* ── Internal notes ── */}
      <section className="dh-card">
        <div className="nr-section-head">
          <div className="nr-section-icon">
            <StickyNote />
          </div>
          <div className="nr-section-title">{t('accidents.notes')}</div>
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
