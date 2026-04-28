'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft } from 'lucide-react';
import TemplateForm from '../TemplateForm';

export default function NewTemplatePage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await adminApiClient.post('/document-template', data);
      router.push(`/admin/document-templates/${res.data.template.id}`);
    } catch (err) {
      logError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>
      <button onClick={() => router.push('/admin/document-templates')} style={{ background: 'transparent', border: 'none', color: H.gray, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, fontFamily: H.font }}>
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '24px 28px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, marginTop: 0, marginBottom: 20 }}>{t('docTemplates.newTemplate')}</h1>
        <TemplateForm value={null} onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
