'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Trash2, Eye } from 'lucide-react';
import TemplateForm from '../TemplateForm';

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();
  const [tpl, setTpl] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewRentalId, setPreviewRentalId] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApiClient.get(`/document-template/${id}`);
      setTpl(res.data.template);
    } catch (err) {
      logError(err);
      router.push('/admin/document-templates');
    }
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await adminApiClient.patch(`/document-template/${id}`, data);
      setTpl(res.data.template);
    } catch (err) {
      logError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('docTemplates.confirmDelete'))) return;
    try {
      await adminApiClient.delete(`/document-template/${id}`);
      router.push('/admin/document-templates');
    } catch (err) {
      logError(err);
    }
  };

  const handleRender = async () => {
    setPreviewLoading(true);
    try {
      const body: any = {};
      if (previewRentalId.trim()) body.rentalId = Number(previewRentalId);
      const res = await adminApiClient.post(`/document-template/${id}/render`, body);
      setPreviewHtml(res.data.html);
    } catch (err) {
      logError(err);
    } finally {
      setPreviewLoading(false);
    }
  };

  if (!tpl) return <div style={{ padding: 32, color: H.gray, fontFamily: H.font }}>{t('common.loading')}</div>;

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={() => router.push('/admin/document-templates')} style={{ background: 'transparent', border: 'none', color: H.gray, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: H.font }}>
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        <button onClick={handleDelete} style={{ background: H.redBg, color: H.red, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: H.font }}>
          <Trash2 size={14} /> {t('common.delete')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
        <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '24px 28px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, marginTop: 0, marginBottom: 20 }}>{tpl.name}</h1>
          <TemplateForm value={tpl} onSave={handleSave} saving={saving} />
        </div>

        <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '24px 28px', position: 'sticky', top: 20, alignSelf: 'start' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: H.navyDark, marginTop: 0, marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Eye size={18} /> {t('docTemplates.preview')}
          </h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="number"
              value={previewRentalId}
              onChange={(e) => setPreviewRentalId(e.target.value)}
              placeholder={t('docTemplates.rentalIdPlaceholder')}
              style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '8px 12px', color: H.navyDark, fontFamily: H.font, fontSize: 13, flex: 1 }}
            />
            <button onClick={handleRender} disabled={previewLoading} style={{ background: H.purple, color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: H.font }}>
              {previewLoading ? '...' : t('docTemplates.render')}
            </button>
          </div>
          <div
            style={{ background: '#fff', color: '#222', minHeight: 400, maxHeight: '70vh', overflow: 'auto', border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '16px 20px', fontSize: 13, lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: previewHtml || `<i style="color:#999">${t('docTemplates.previewEmpty')}</i>` }}
          />
        </div>
      </div>
    </div>
  );
}
