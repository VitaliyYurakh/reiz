'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Save } from 'lucide-react';

interface PickupLocationLite { id: number; nameUk: string; nameEn: string; }
interface UserLite { id: number; name: string; email: string; }

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
  const { H } = useAdminTheme();
  const [form, setForm] = useState<InventoryItemPartial>(() => ({
    name: '', category: 'TOOL', status: 'AVAILABLE', quantity: 1, currency: 'UAH',
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
      } catch { /* silent */ }
    })();
  }, []);

  const update = <K extends keyof InventoryItemPartial>(k: K, v: InventoryItemPartial[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const fmtMoneyInput = (minor: number | null | undefined) =>
    minor != null ? (minor / 100).toFixed(2) : '';
  const parseMoneyInput = (s: string): number | null =>
    s.trim() === '' ? null : Math.round(parseFloat(s) * 100);

  const inputStyle = { background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14, width: '100%' };
  const labelStyle = { fontSize: 12, color: H.gray, marginBottom: 6, display: 'block', fontWeight: 500 };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('inventory.name')} <span style={{ color: H.red }}>*</span></label>
          <input value={form.name || ''} onChange={(e) => update('name', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>{t('inventory.serialNumber')}</label>
          <input value={form.serialNumber || ''} onChange={(e) => update('serialNumber', e.target.value || null)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('inventory.category')}</label>
          <select value={form.category} onChange={(e) => update('category', e.target.value)} style={inputStyle}>
            <option value="TOOL">{t('inventory.catTool')}</option>
            <option value="EQUIPMENT">{t('inventory.catEquipment')}</option>
            <option value="ACCESSORY">{t('inventory.catAccessory')}</option>
            <option value="KEYS">{t('inventory.catKeys')}</option>
            <option value="OTHER">{t('inventory.catOther')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('inventory.status')}</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)} style={inputStyle}>
            <option value="AVAILABLE">{t('inventory.statusAvailable')}</option>
            <option value="ASSIGNED">{t('inventory.statusAssigned')}</option>
            <option value="MAINTENANCE">{t('inventory.statusMaintenance')}</option>
            <option value="LOST">{t('inventory.statusLost')}</option>
            <option value="WRITTEN_OFF">{t('inventory.statusWrittenOff')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('inventory.quantity')}</label>
          <input type="number" min={0} value={form.quantity ?? 1} onChange={(e) => update('quantity', Number(e.target.value))} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('inventory.purchasePrice')}</label>
          <input type="number" step="0.01" value={fmtMoneyInput(form.purchasePriceMinor)} onChange={(e) => update('purchasePriceMinor', parseMoneyInput(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('inventory.currentValue')}</label>
          <input type="number" step="0.01" value={fmtMoneyInput(form.currentValueMinor)} onChange={(e) => update('currentValueMinor', parseMoneyInput(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('common.currency')}</label>
          <select value={form.currency || 'UAH'} onChange={(e) => update('currency', e.target.value)} style={inputStyle}>
            <option>UAH</option><option>USD</option><option>EUR</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('inventory.location')}</label>
          <select value={form.locationId ?? ''} onChange={(e) => update('locationId', e.target.value ? Number(e.target.value) : null)} style={inputStyle}>
            <option value="">{t('common.notSpecified')}</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.nameUk || l.nameEn}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('inventory.responsibleUser')}</label>
          <select value={form.responsibleUserId ?? ''} onChange={(e) => update('responsibleUserId', e.target.value ? Number(e.target.value) : null)} style={inputStyle}>
            <option value="">{t('common.notAssigned')}</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{t('inventory.notes')}</label>
        <textarea value={form.notes || ''} onChange={(e) => update('notes', e.target.value || null)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={saving || !form.name?.trim()}
        style={{ background: H.purple, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 500, cursor: saving ? 'wait' : 'pointer', opacity: saving || !form.name?.trim() ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: H.font }}
      >
        <Save size={16} /> {saving ? t('common.saving') : t('common.save')}
      </button>
    </div>
  );
}
