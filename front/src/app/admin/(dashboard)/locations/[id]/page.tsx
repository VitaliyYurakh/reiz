'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getCity,
  updateCity,
  createPickupLocation,
  updatePickupLocation,
  deletePickupLocation,
  type CityDetail,
  type PickupLocationItem,
} from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme, LIGHT } from '@/context/AdminThemeContext';
import { ArrowLeft, Save, Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const HL = LIGHT;

const LOCATION_TYPES = ['railway', 'bus', 'airport', 'mall', 'center', 'other'] as const;

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  railway: { bg: `${HL.purple}15`, color: HL.purple },
  bus: { bg: HL.greenBg, color: HL.green },
  airport: { bg: '#EBF0FF', color: HL.blue },
  mall: { bg: '#FFF6E6', color: HL.orange },
  center: { bg: HL.redBg, color: HL.red },
  other: { bg: HL.bg, color: HL.gray },
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: `1px solid ${HL.grayLight}`,
  fontSize: 14,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: HL.navy,
  marginBottom: 6,
};

const emptyLocation = {
  slug: '',
  nameUk: '',
  nameRu: '',
  nameEn: '',
  type: 'center' as string,
  sortOrder: 0,
  isActive: true,
};

export default function CityDetailPage() {
  const { t, locale } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();
  const params = useParams();
  const cityId = parseInt(params.id as string);

  const [city, setCity] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Location modal
  const [locModal, setLocModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState<PickupLocationItem | null>(null);
  const [locForm, setLocForm] = useState(emptyLocation);
  const [locSaving, setLocSaving] = useState(false);
  const [deleteLocConfirm, setDeleteLocConfirm] = useState<number | null>(null);

  const nameKey = locale === 'uk' ? 'nameUk' : locale === 'ru' ? 'nameRu' : 'nameEn';

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      railway: t('locations.typeRailway'),
      bus: t('locations.typeBus'),
      airport: t('locations.typeAirport'),
      mall: t('locations.typeMall'),
      center: t('locations.typeCenter'),
      other: t('locations.typeOther'),
    };
    return map[type] || type;
  };

  const fetchCity = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCity(cityId);
      setCity(data);
    } catch {
      router.push('/admin/locations');
    } finally {
      setLoading(false);
    }
  }, [cityId, router]);

  useEffect(() => {
    fetchCity();
  }, [fetchCity]);

  const handleSaveCity = async () => {
    if (!city) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { pickupLocations, id, ...data } = city;
      const updated = await updateCity(cityId, data);
      setCity({ ...updated, pickupLocations });
      setSuccess(t('locations.citySaved'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.msg || t('common.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  const openAddLocation = () => {
    setEditingLoc(null);
    setLocForm(emptyLocation);
    setLocModal(true);
  };

  const openEditLocation = (loc: PickupLocationItem) => {
    setEditingLoc(loc);
    setLocForm({
      slug: loc.slug,
      nameUk: loc.nameUk,
      nameRu: loc.nameRu,
      nameEn: loc.nameEn,
      type: loc.type,
      sortOrder: loc.sortOrder,
      isActive: loc.isActive,
    });
    setLocModal(true);
  };

  const handleSaveLocation = async () => {
    setLocSaving(true);
    try {
      if (editingLoc) {
        await updatePickupLocation(cityId, editingLoc.id, locForm);
      } else {
        await createPickupLocation(cityId, locForm);
      }
      setLocModal(false);
      fetchCity();
    } catch {
      // ignore
    } finally {
      setLocSaving(false);
    }
  };

  const handleDeleteLocation = async (locId: number) => {
    try {
      await deletePickupLocation(cityId, locId);
      setDeleteLocConfirm(null);
      fetchCity();
    } catch {
      // ignore
    }
  };

  const setField = (key: string, val: any) => {
    if (!city) return;
    setCity({ ...city, [key]: val });
  };

  const setLocField = (key: string, val: any) => {
    setLocForm((f) => ({ ...f, [key]: val }));
  };

  if (loading || !city) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: H.gray, fontFamily: H.font }}>
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: H.font, maxWidth: 900 }}>
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
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: H.navy, margin: 0 }}>
            {city[nameKey]}
          </h1>
          <p style={{ fontSize: 13, color: H.gray, margin: '2px 0 0' }}>{city.slug} — {city.region}</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ padding: '10px 16px', borderRadius: 10, background: H.redBg, color: H.red, fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '10px 16px', borderRadius: 10, background: H.greenBg, color: H.green, fontSize: 14, marginBottom: 16 }}>
          {success}
        </div>
      )}

      {/* City Form */}
      <div style={{ background: H.white, borderRadius: 16, boxShadow: H.shadow, padding: 32, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: H.navy, marginBottom: 20 }}>
          {t('locations.general')}
        </h2>

        {/* Slug & Region */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.slug')}</label>
            <input style={{ ...inputStyle, background: H.bg }} value={city.slug} readOnly />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.region')}</label>
            <input style={inputStyle} value={city.region} onChange={(e) => setField('region', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.sortOrder')}</label>
            <input
              type="number"
              style={inputStyle}
              value={city.sortOrder}
              onChange={(e) => setField('sortOrder', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.nameUk')}</label>
            <input style={inputStyle} value={city.nameUk} onChange={(e) => setField('nameUk', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameRu')}</label>
            <input style={inputStyle} value={city.nameRu} onChange={(e) => setField('nameRu', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameEn')}</label>
            <input style={inputStyle} value={city.nameEn} onChange={(e) => setField('nameEn', e.target.value)} />
          </div>
        </div>

        {/* Locative */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.nameLocativeUk')}</label>
            <input style={inputStyle} value={city.nameLocativeUk} onChange={(e) => setField('nameLocativeUk', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameLocativeRu')}</label>
            <input style={inputStyle} value={city.nameLocativeRu} onChange={(e) => setField('nameLocativeRu', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.nameLocativeEn')}</label>
            <input style={inputStyle} value={city.nameLocativeEn} onChange={(e) => setField('nameLocativeEn', e.target.value)} />
          </div>
        </div>

        {/* Geo + Postal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>{t('locations.latitude')}</label>
            <input style={inputStyle} value={city.latitude} onChange={(e) => setField('latitude', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.longitude')}</label>
            <input style={inputStyle} value={city.longitude} onChange={(e) => setField('longitude', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t('locations.postalCode')}</label>
            <input style={inputStyle} value={city.postalCode} onChange={(e) => setField('postalCode', e.target.value)} />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: H.navy }}>
            <input
              type="checkbox"
              checked={city.isPopular}
              onChange={(e) => setField('isPopular', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: H.purple }}
            />
            {t('locations.isPopular')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: H.navy }}>
            <input
              type="checkbox"
              checked={city.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: H.green }}
            />
            {t('locations.isActive')}
          </label>
        </div>

        <button
          onClick={handleSaveCity}
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

      {/* Pickup Locations */}
      <div style={{ background: H.white, borderRadius: 16, boxShadow: H.shadow, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: H.navy, margin: 0 }}>
            {t('locations.cityLocations')} ({city.pickupLocations.length})
          </h2>
          <button
            onClick={openAddLocation}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 10,
              border: `1px solid ${H.purple}`,
              background: 'transparent',
              color: H.purple,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            {t('locations.addLocation')}
          </button>
        </div>

        {city.pickupLocations.length === 0 ? (
          <p style={{ color: H.gray, fontSize: 14 }}>{t('locations.noLocations')}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${H.grayLight}` }}>
                {[t('locations.locationName'), t('locations.slug'), t('locations.locationType'), t('locations.sortOrder'), t('locations.isActive'), t('common.actions')].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: H.gray,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {city.pickupLocations.map((loc) => {
                const tc = TYPE_COLORS[loc.type] || TYPE_COLORS.other;
                return (
                  <tr key={loc.id} style={{ borderBottom: `1px solid ${H.grayLight}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: H.navy }}>
                      {loc[nameKey]}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: H.gray }}>{loc.slug}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: tc.bg,
                          color: tc.color,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {typeLabel(loc.type)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: H.gray }}>{loc.sortOrder}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: loc.isActive ? H.green : H.red,
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => openEditLocation(loc)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 6,
                            color: H.gray,
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteLocConfirm(loc.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 6,
                            color: H.gray,
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Location Modal */}
      {locModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setLocModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: H.white,
              borderRadius: 16,
              padding: 32,
              maxWidth: 560,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: H.navy, margin: 0 }}>
                {editingLoc ? t('locations.editLocation') : t('locations.addLocation')}
              </h3>
              <button onClick={() => setLocModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={18} color={H.gray} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{t('locations.slug')}</label>
              <input style={inputStyle} value={locForm.slug} onChange={(e) => setLocField('slug', e.target.value)} placeholder="kyiv-railway" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{t('locations.nameUk')}</label>
                <input style={inputStyle} value={locForm.nameUk} onChange={(e) => setLocField('nameUk', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>{t('locations.nameRu')}</label>
                <input style={inputStyle} value={locForm.nameRu} onChange={(e) => setLocField('nameRu', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>{t('locations.nameEn')}</label>
                <input style={inputStyle} value={locForm.nameEn} onChange={(e) => setLocField('nameEn', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{t('locations.locationType')}</label>
                <select
                  value={locForm.type}
                  onChange={(e) => setLocField('type', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {LOCATION_TYPES.map((t_) => (
                    <option key={t_} value={t_}>{typeLabel(t_)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('locations.sortOrder')}</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={locForm.sortOrder}
                  onChange={(e) => setLocField('sortOrder', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: H.navy, marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={locForm.isActive}
                onChange={(e) => setLocField('isActive', e.target.checked)}
                style={{ width: 18, height: 18, accentColor: H.green }}
              />
              {t('locations.isActive')}
            </label>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setLocModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: `1px solid ${H.grayLight}`,
                  background: H.white,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSaveLocation}
                disabled={locSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: `linear-gradient(135deg, ${H.purple}, #7551FF)`,
                  color: '#fff',
                  fontSize: 14,
                  cursor: locSaving ? 'wait' : 'pointer',
                  fontWeight: 600,
                  opacity: locSaving ? 0.6 : 1,
                }}
              >
                <Check size={14} />
                {locSaving ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete location confirmation */}
      {deleteLocConfirm !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setDeleteLocConfirm(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: H.white,
              borderRadius: 16,
              padding: 32,
              maxWidth: 400,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 600, color: H.navy, marginBottom: 16 }}>
              {t('locations.confirmDeleteLocation')}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteLocConfirm(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: `1px solid ${H.grayLight}`,
                  background: H.white,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDeleteLocation(deleteLocConfirm)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: H.red,
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
