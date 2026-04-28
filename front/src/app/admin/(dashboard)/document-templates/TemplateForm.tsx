'use client';

import { useState } from 'react';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Save } from 'lucide-react';

interface TemplatePartial {
  name?: string;
  kind?: string;
  language?: string;
  bodyHtml?: string;
  bodyText?: string | null;
  placeholders?: string[];
  isActive?: boolean;
  isDefault?: boolean;
}

interface Props {
  value: TemplatePartial | null;
  onSave: (data: TemplatePartial) => Promise<void>;
  saving: boolean;
}

export default function TemplateForm({ value, onSave, saving }: Props) {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const [form, setForm] = useState<TemplatePartial>(() => ({
    name: '', kind: 'RENTAL_AGREEMENT', language: 'uk', bodyHtml: '', placeholders: [],
    isActive: true, isDefault: false,
    ...(value || {}),
  }));

  const update = <K extends keyof TemplatePartial>(k: K, v: TemplatePartial[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const inputStyle = { background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14, width: '100%' };
  const labelStyle = { fontSize: 12, color: H.gray, marginBottom: 6, display: 'block', fontWeight: 500 };

  const placeholdersText = (form.placeholders || []).join('\n');

  const kindLabel = (k: string) => t(`docTemplates.kind${k.charAt(0)}${k.slice(1).toLowerCase().replace(/_./, m => m[1].toUpperCase())}` as any) || k;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('docTemplates.name')} <span style={{ color: H.red }}>*</span></label>
          <input value={form.name || ''} onChange={(e) => update('name', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>{t('docTemplates.kind')}</label>
          <select value={form.kind} onChange={(e) => update('kind', e.target.value)} style={inputStyle}>
            {['RENTAL_AGREEMENT','ACT_TRANSFER','ACT_RETURN','INVOICE','INSURANCE_CLAIM','OTHER'].map(k =>
              <option key={k} value={k}>{kindLabel(k)}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('docTemplates.language')}</label>
          <select value={form.language} onChange={(e) => update('language', e.target.value)} style={inputStyle}>
            <option value="uk">UK</option><option value="ru">RU</option><option value="en">EN</option>
            <option value="pl">PL</option><option value="ro">RO</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: H.navyDark, fontSize: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => update('isActive', e.target.checked)} />
          {t('docTemplates.isActive')}
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: H.navyDark, fontSize: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isDefault ?? false} onChange={(e) => update('isDefault', e.target.checked)} />
          {t('docTemplates.isDefault')}
        </label>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{t('docTemplates.bodyHtml')} <span style={{ color: H.red }}>*</span></label>
        <textarea
          value={form.bodyHtml || ''}
          onChange={(e) => update('bodyHtml', e.target.value)}
          rows={18}
          style={{ ...inputStyle, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, resize: 'vertical' }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{t('docTemplates.placeholders')}</label>
        <textarea
          value={placeholdersText}
          onChange={(e) => update('placeholders', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
          rows={4}
          placeholder={t('docTemplates.placeholdersHint')}
          style={{ ...inputStyle, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, resize: 'vertical' }}
        />
      </div>

      <div style={{ background: H.bg, borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: H.gray }}>
        <div style={{ fontWeight: 600, color: H.navy, marginBottom: 6 }}>{t('docTemplates.placeholderReference')}</div>
        <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', lineHeight: 1.7 }}>
          <div>• {t('docTemplates.refClient')}</div>
          <div>• {t('docTemplates.refCar')}</div>
          <div>• {t('docTemplates.refRental')}</div>
          <div>• {t('docTemplates.refCompany')}</div>
          <div>• {t('docTemplates.refConditional')}</div>
        </div>
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={saving || !form.name?.trim() || !form.bodyHtml?.trim()}
        style={{ background: H.purple, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 500, cursor: saving ? 'wait' : 'pointer', opacity: saving || !form.name?.trim() || !form.bodyHtml?.trim() ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: H.font }}
      >
        <Save size={16} /> {saving ? t('common.saving') : t('common.save')}
      </button>
    </div>
  );
}
