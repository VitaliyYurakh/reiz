'use client';

import { useState, useCallback, useRef } from 'react';
import { adminApiClient, checkClientDuplicates, type DuplicateClient } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertTriangle, Users, ExternalLink } from 'lucide-react';
import { IosSelect } from '@/components/admin/ios-select';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  driverLicenseNo: string;
  driverLicenseExpiry: string;
  passportNo: string;
  nationalId: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  source: string;
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  driverLicenseNo: '',
  driverLicenseExpiry: '',
  passportNo: '',
  nationalId: '',
  address: '',
  city: '',
  country: 'UA',
  notes: '',
  source: '',
};

export default function NewClientPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateClient[]>([]);
  const [forceCreate, setForceCreate] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // Auto-check duplicates when phone or email changes
    if (key === 'phone' || key === 'email') {
      setForceCreate(false);
      const newForm = { ...form, [key]: value };
      debouncedDupCheck(newForm.phone, newForm.email);
    }
  };

  const debouncedDupCheck = useCallback((phone: string, email: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!phone && !email) {
        setDuplicates([]);
        return;
      }
      // Only check if phone has at least 6 digits or email looks valid
      const phoneDigits = phone.replace(/\D/g, '');
      const emailValid = email.includes('@') && email.includes('.');
      if (phoneDigits.length < 6 && !emailValid) {
        setDuplicates([]);
        return;
      }
      setCheckingDuplicates(true);
      try {
        const dups = await checkClientDuplicates(
          phoneDigits.length >= 6 ? phone : undefined,
          emailValid ? email : undefined,
        );
        setDuplicates(dups);
      } catch {
        // ignore errors during dup check
      } finally {
        setCheckingDuplicates(false);
      }
    }, 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, string | undefined> = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      };

      if (form.middleName) payload.middleName = form.middleName;
      if (form.email) payload.email = form.email;
      if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;
      if (form.driverLicenseNo) payload.driverLicenseNo = form.driverLicenseNo;
      if (form.driverLicenseExpiry) payload.driverLicenseExpiry = form.driverLicenseExpiry;
      if (form.passportNo) payload.passportNo = form.passportNo;
      if (form.nationalId) payload.nationalId = form.nationalId;
      if (form.address) payload.address = form.address;
      if (form.city) payload.city = form.city;
      if (form.country) payload.country = form.country;
      if (form.notes) payload.notes = form.notes;
      if (form.source) payload.source = form.source;

      const url = forceCreate ? '/client?force=true' : '/client';
      const res = await adminApiClient.post(url, payload);

      // If backend returned 409 CONFLICT with duplicates
      if (res.status === 409 && res.data.duplicates) {
        setDuplicates(res.data.duplicates);
        return;
      }

      const newId = res.data.client.id;
      router.push(`/admin/clients/${newId}`);
    } catch (err: any) {
      // Axios throws on non-2xx status
      if (err?.response?.status === 409 && err?.response?.data?.duplicates) {
        setDuplicates(err.response.data.duplicates);
        setError(err.response.data.msg);
        return;
      }
      console.error(err);
      const message =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        t('newClient.errorCreating');
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 12,
    border: `1px solid ${H.grayLight}`,
    background: H.bg,
    fontSize: 14,
    fontFamily: H.font,
    color: H.navy,
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: H.navy,
    marginBottom: 4,
    fontFamily: H.font,
  };

  const sectionStyle: React.CSSProperties = {
    background: H.white,
    borderRadius: 20,
    padding: '20px 24px',
    boxShadow: H.shadow,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: H.gray,
    marginBottom: 16,
    fontFamily: H.font,
  };

  return (
    <div style={{ fontFamily: H.font, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          href="/admin/clients"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: H.bg,
            color: H.navy,
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navy, margin: 0 }}>{t('newClient.title')}</h1>
          <p style={{ fontSize: 13, color: H.gray, margin: 0 }}>{t('newClient.subtitle')}</p>
        </div>
      </div>

      {/* Error */}
      {error && !duplicates.length && (
        <div style={{
          background: H.redBg,
          border: `1px solid ${H.red}40`,
          borderRadius: 12,
          padding: '12px 16px',
          color: H.red,
          fontSize: 14,
          fontWeight: 500,
        }}>
          {error}
        </div>
      )}

      {/* Duplicate warning */}
      {duplicates.length > 0 && (
        <div style={{
          background: H.orangeBg,
          border: `1px solid ${H.orange}60`,
          borderRadius: 16,
          padding: '16px 20px',
          boxShadow: H.shadow,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${H.orange}20`,
            }}>
              <AlertTriangle size={18} color={H.orange} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: H.navy, margin: 0 }}>
                {t('newClient.duplicatesFound', { n: String(duplicates.length) })}
              </p>
              <p style={{ fontSize: 12, color: H.gray, margin: 0 }}>
                {t('newClient.duplicatesHint')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {duplicates.map((dup) => (
              <Link
                key={dup.id}
                href={`/admin/clients/${dup.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: H.white,
                  borderRadius: 12,
                  border: `1px solid ${H.grayLight}`,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${H.purple}, ${H.purpleLight})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {(dup.firstName?.[0] || '').toUpperCase()}{(dup.lastName?.[0] || '').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: H.navy, margin: 0 }}>
                    {dup.firstName} {dup.lastName}
                  </p>
                  <p style={{ fontSize: 12, color: H.gray, margin: 0 }}>
                    {dup.phone || '—'} · {dup.email || '—'} · {dup.source || '—'}
                  </p>
                </div>
                <ExternalLink size={16} color={H.gray} />
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setForceCreate(true);
                setDuplicates([]);
                setError(null);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: `1px solid ${H.orange}`,
                background: 'transparent',
                color: H.orange,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: H.font,
              }}
            >
              {t('newClient.createAnyway')}
            </button>
            {duplicates.length === 1 && (
              <Link
                href={`/admin/clients/${duplicates[0].id}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: `linear-gradient(135deg, ${H.purple}, ${H.purpleLight})`,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: H.font,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Users size={14} />
                {t('newClient.openExisting')}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Force-create notice */}
      {forceCreate && (
        <div style={{
          background: `${H.green}10`,
          border: `1px solid ${H.green}40`,
          borderRadius: 12,
          padding: '10px 14px',
          fontSize: 13,
          color: H.green,
          fontWeight: 500,
        }}>
          {t('newClient.duplicatesForced')}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Основные данные */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>{t('newClient.sectionMain')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('newClient.firstName')}</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.lastName')}</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.middleName')}</label>
              <input
                type="text"
                value={form.middleName}
                onChange={(e) => updateField('middleName', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>{t('newClient.phone')}</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: duplicates.length > 0 && !forceCreate ? H.orange : H.grayLight,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = duplicates.length > 0 && !forceCreate ? H.orange : H.grayLight;
                }}
              />
              {checkingDuplicates && (
                <span style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(2px)',
                  fontSize: 11,
                  color: H.gray,
                }}>
                  {t('newClient.checking')}
                </span>
              )}
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: duplicates.length > 0 && !forceCreate ? H.orange : H.grayLight,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = duplicates.length > 0 && !forceCreate ? H.orange : H.grayLight;
                }}
              />
            </div>
          </div>
        </div>

        {/* Документы */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>{t('newClient.sectionDocs')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('newClient.driverLicense')}</label>
              <input
                type="text"
                value={form.driverLicenseNo}
                onChange={(e) => updateField('driverLicenseNo', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.driverLicenseExpiry')}</label>
              <input
                type="date"
                value={form.driverLicenseExpiry}
                onChange={(e) => updateField('driverLicenseExpiry', e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.passport')}</label>
              <input
                type="text"
                value={form.passportNo}
                onChange={(e) => updateField('passportNo', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.nationalId')}</label>
              <input
                type="text"
                value={form.nationalId}
                onChange={(e) => updateField('nationalId', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
          </div>
        </div>

        {/* Адрес */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>{t('newClient.sectionAddress')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('newClient.address')}</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.city')}</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.country')}</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
          </div>
        </div>

        {/* Другое */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>{t('newClient.sectionOther')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>{t('newClient.source')}</label>
              <IosSelect
                value={form.source}
                onChange={(v) => updateField('source', v)}
                options={[
                  { value: '', label: t('common.notSpecified') },
                  { value: 'website', label: t('sources.website') },
                  { value: 'phone', label: t('sources.phone') },
                  { value: 'walk_in', label: t('sources.walk_in') },
                  { value: 'referral', label: t('sources.referral') },
                  { value: 'other', label: t('sources.other') },
                ]}
                placeholder={t('common.notSpecified')}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label style={labelStyle}>{t('newClient.birthDate')}</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>{t('newClient.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' as const }}
                onFocus={(e) => { e.currentTarget.style.borderColor = H.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = H.grayLight; }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 12,
              border: 'none',
              background: `linear-gradient(135deg, ${H.purple}, ${H.purpleLight})`,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              fontFamily: H.font,
              boxShadow: '0 4px 14px rgba(67, 24, 255, 0.25)',
              transition: 'opacity 0.15s',
            }}
          >
            <Save size={16} />
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
