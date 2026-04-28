'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Save } from 'lucide-react';

interface CarLite { id: number; brand: string; model: string; plateNumber: string; }
interface ClientLite { id: number; firstName: string; lastName: string; phone: string; }
interface RentalLite { id: number; contractNumber: string | null; }

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
  const { H } = useAdminTheme();
  const [form, setForm] = useState<AccidentPartial>(() => ({
    fault: 'UNKNOWN', status: 'REPORTED', currency: 'UAH', blocksCar: true, clientDebtMinor: 0,
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
      } catch { /* silent */ }
    })();
  }, []);

  const update = <K extends keyof AccidentPartial>(k: K, v: AccidentPartial[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const fmtMoneyInput = (minor: number | null | undefined) =>
    minor != null ? (minor / 100).toFixed(2) : '';
  const parseMoneyInput = (s: string): number | null =>
    s.trim() === '' ? null : Math.round(parseFloat(s) * 100);

  const inputStyle = { background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14, width: '100%' };
  const labelStyle = { fontSize: 12, color: H.gray, marginBottom: 6, display: 'block', fontWeight: 500 };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('accidents.incidentAt')} <span style={{ color: H.red }}>*</span></label>
          <input type="datetime-local" value={toIso(form.incidentAt)} onChange={(e) => update('incidentAt', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.car')} <span style={{ color: H.red }}>*</span></label>
          <select value={form.carId ?? ''} onChange={(e) => update('carId', Number(e.target.value))} style={inputStyle} disabled={isEdit}>
            <option value="">—</option>
            {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.plateNumber})</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.location')}</label>
          <input value={form.location || ''} onChange={(e) => update('location', e.target.value || null)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('accidents.client')}</label>
          <select value={form.clientId ?? ''} onChange={(e) => update('clientId', e.target.value ? Number(e.target.value) : null)} style={inputStyle}>
            <option value="">—</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.lastName} {c.firstName} ({c.phone})</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.rental')}</label>
          <select value={form.rentalId ?? ''} onChange={(e) => update('rentalId', e.target.value ? Number(e.target.value) : null)} style={inputStyle}>
            <option value="">—</option>
            {rentals.map(r => <option key={r.id} value={r.id}>{r.contractNumber || `R-${r.id}`}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{t('accidents.description')} <span style={{ color: H.red }}>*</span></label>
        <textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('accidents.fault')}</label>
          <select value={form.fault} onChange={(e) => update('fault', e.target.value)} style={inputStyle}>
            <option value="UNKNOWN">{t('accidents.faultUnknown')}</option>
            <option value="CLIENT">{t('accidents.faultClient')}</option>
            <option value="COMPANY">{t('accidents.faultCompany')}</option>
            <option value="THIRD_PARTY">{t('accidents.faultThirdParty')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.status')}</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)} style={inputStyle}>
            <option value="REPORTED">{t('accidents.statusReported')}</option>
            <option value="INVESTIGATING">{t('accidents.statusInvestigating')}</option>
            <option value="AWAITING_PAYOUT">{t('accidents.statusAwaitingPayout')}</option>
            <option value="RESOLVED">{t('accidents.statusResolved')}</option>
            <option value="CLOSED">{t('accidents.statusClosed')}</option>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: H.navyDark, marginTop: 24, marginBottom: 12, fontWeight: 600 }}>{t('accidents.sectionInsurance')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('accidents.policeReportNumber')}</label>
          <input value={form.policeReportNumber || ''} onChange={(e) => update('policeReportNumber', e.target.value || null)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.insuranceCompany')}</label>
          <input value={form.insuranceCompany || ''} onChange={(e) => update('insuranceCompany', e.target.value || null)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.insuranceClaimNumber')}</label>
          <input value={form.insuranceClaimNumber || ''} onChange={(e) => update('insuranceClaimNumber', e.target.value || null)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('accidents.expertVisitAt')}</label>
          <input type="datetime-local" value={toIso(form.expertVisitAt)} onChange={(e) => update('expertVisitAt', e.target.value || null)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.expertNotes')}</label>
          <input value={form.expertNotes || ''} onChange={(e) => update('expertNotes', e.target.value || null)} style={inputStyle} />
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: H.navyDark, marginTop: 24, marginBottom: 12, fontWeight: 600 }}>{t('accidents.sectionFinancial')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('accidents.estimatedDamage')}</label>
          <input type="number" step="0.01" value={fmtMoneyInput(form.estimatedDamageMinor)} onChange={(e) => update('estimatedDamageMinor', parseMoneyInput(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.insurancePayout')}</label>
          <input type="number" step="0.01" value={fmtMoneyInput(form.insurancePayoutMinor)} onChange={(e) => update('insurancePayoutMinor', parseMoneyInput(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('accidents.clientDebt')}</label>
          <input type="number" step="0.01" value={fmtMoneyInput(form.clientDebtMinor)} onChange={(e) => update('clientDebtMinor', parseMoneyInput(e.target.value) ?? 0)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('common.currency')}</label>
          <select value={form.currency} onChange={(e) => update('currency', e.target.value)} style={inputStyle}>
            <option>UAH</option><option>USD</option><option>EUR</option>
          </select>
        </div>
      </div>

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: H.navyDark, fontSize: 14, marginBottom: 16, cursor: 'pointer' }}>
        <input type="checkbox" checked={form.blocksCar ?? true} onChange={(e) => update('blocksCar', e.target.checked)} />
        {t('accidents.blocksCar')}
      </label>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{t('accidents.notes')}</label>
        <textarea value={form.notes || ''} onChange={(e) => update('notes', e.target.value || null)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={saving || !form.carId || !form.description?.trim() || !form.incidentAt}
        style={{ background: H.purple, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 500, cursor: saving ? 'wait' : 'pointer', opacity: saving || !form.carId || !form.description?.trim() ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: H.font }}
      >
        <Save size={16} /> {saving ? t('common.saving') : t('common.save')}
      </button>
    </div>
  );
}
