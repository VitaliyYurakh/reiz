'use client';

import { useState } from 'react';
import { createCity } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCityPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: `1px solid ${H.grayLight}`,
    fontSize: 14,
    outline: 'none',
    fontFamily: H.font,
    background: H.white,
    color: H.navy,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600 as const,
    color: H.navy,
    marginBottom: 6,
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    slug: '',
    nameUk: '',
    nameRu: '',
    nameEn: '',
    nameLocativeUk: '',
    nameLocativeRu: '',
    nameLocativeEn: '',
    latitude: '',
    longitude: '',
    postalCode: '',
    region: '',
    isPopular: false,
    isActive: true,
    sortOrder: 0,
  });

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.slug || !form.nameUk) {
      setError(t('common.required'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const city = await createCity(form);
      router.push(`/admin/locations/${city.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.msg || t('common.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: H.font, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link
          href="/admin/locations"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 10,
            background: H.white,
            boxShadow: H.shadow,
            color: H.navy,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: H.navy, margin: 0 }}>
          {t('locations.addCity')}
        </h1>
      </div>

      {/* Form */}
      <div style={{ background: H.white, borderRadius: 16, boxShadow: H.shadow, padding: 32 }}>
        {error && (
          <div style={{ padding: '10px 16px', borderRadius: 10, background: '#FFF0EF', color: H.red, fontSize: 14, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Slug & Region */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.slug')} *</label>
            <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="kyiv" />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.region')}</label>
            <input style={inputStyle} value={form.region} onChange={(e) => set('region', e.target.value)} />
          </div>
        </div>

        {/* Names */}
        <p style={{ fontSize: 14, fontWeight: 700, color: H.navy, marginBottom: 12 }}>{t('locations.cityName')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.nameUk')} *</label>
            <input style={inputStyle} value={form.nameUk} onChange={(e) => set('nameUk', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameRu')}</label>
            <input style={inputStyle} value={form.nameRu} onChange={(e) => set('nameRu', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameEn')}</label>
            <input style={inputStyle} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
          </div>
        </div>

        {/* Locative names */}
        <p style={{ fontSize: 14, fontWeight: 700, color: H.navy, marginBottom: 12 }}>{t('locations.nameLocativeUk').replace(' (укр)', '')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.nameLocativeUk')}</label>
            <input style={inputStyle} value={form.nameLocativeUk} onChange={(e) => set('nameLocativeUk', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameLocativeRu')}</label>
            <input style={inputStyle} value={form.nameLocativeRu} onChange={(e) => set('nameLocativeRu', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameLocativeEn')}</label>
            <input style={inputStyle} value={form.nameLocativeEn} onChange={(e) => set('nameLocativeEn', e.target.value)} />
          </div>
        </div>

        {/* Geo + Postal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.latitude')}</label>
            <input style={inputStyle} value={form.latitude} onChange={(e) => set('latitude', e.target.value)} placeholder="49.8397" />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.longitude')}</label>
            <input style={inputStyle} value={form.longitude} onChange={(e) => set('longitude', e.target.value)} placeholder="24.0297" />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.postalCode')}</label>
            <input style={inputStyle} value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="79000" />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: H.navy }}>
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => set('isPopular', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: H.purple }}
            />
            {t('locations.isPopular')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: H.navy }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: H.green }}
            />
            {t('locations.isActive')}
          </label>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            borderRadius: 12,
            border: 'none',
            background: `linear-gradient(135deg, ${H.purple}, #7551FF)`,
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: saving ? 'wait' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Save size={16} />
          {saving ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </div>
  );
}
