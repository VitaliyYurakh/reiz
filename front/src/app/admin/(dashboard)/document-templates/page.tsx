'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { FileText, Plus } from 'lucide-react';

interface DocumentTemplate {
  id: number;
  name: string;
  kind: string;
  language: string;
  isActive: boolean;
  isDefault: boolean;
  createdBy: { id: number; name: string; email: string } | null;
}

export default function DocumentTemplatesPage() {
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();

  const [items, setItems] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [kindFilter, setKindFilter] = useState<string>('');
  const [langFilter, setLangFilter] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (kindFilter) params.set('kind', kindFilter);
      if (langFilter) params.set('language', langFilter);
      const res = await adminApiClient.get(`/document-template?${params}`);
      setItems(res.data.items);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [kindFilter, langFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const kindLabel = (k: string) => t(`docTemplates.kind${k.charAt(0)}${k.slice(1).toLowerCase().replace(/_./, m => m[1].toUpperCase())}` as any) || k;

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px' }}>
      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '20px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: H.blueBg, color: H.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, margin: 0 }}>{t('docTemplates.title')}</h1>
              <div style={{ fontSize: 13, color: H.gray, marginTop: 2 }}>{t('docTemplates.subtitle')}</div>
            </div>
          </div>
          <Link
            href="/admin/document-templates/new"
            style={{ background: H.purple, color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} /> {t('docTemplates.newTemplate')}
          </Link>
        </div>
      </div>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14 }}>
          <option value="">{t('common.all')} — {t('docTemplates.kind')}</option>
          {['RENTAL_AGREEMENT','ACT_TRANSFER','ACT_RETURN','INVOICE','INSURANCE_CLAIM','OTHER'].map(k =>
            <option key={k} value={k}>{kindLabel(k)}</option>)}
        </select>
        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} style={{ background: H.bg, border: `1px solid ${H.grayLight}`, borderRadius: 10, padding: '10px 14px', color: H.navyDark, fontFamily: H.font, fontSize: 14 }}>
          <option value="">{t('common.all')} — {t('docTemplates.language')}</option>
          <option value="uk">UK</option><option value="ru">RU</option><option value="en">EN</option><option value="pl">PL</option><option value="ro">RO</option>
        </select>
      </div>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: H.gray }}>{t('docTemplates.noResults')}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: H.bg }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('docTemplates.name')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('docTemplates.kind')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('docTemplates.language')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('docTemplates.isDefault')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: H.gray, fontWeight: 600 }}>{t('docTemplates.isActive')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} onClick={() => router.push(`/admin/document-templates/${it.id}`)} style={{ borderTop: `1px solid ${H.grayLight}`, cursor: 'pointer' }}>
                  <td style={{ padding: '14px 16px', color: H.navyDark, fontWeight: 500 }}>{it.name}</td>
                  <td style={{ padding: '14px 16px', color: H.gray, fontSize: 13 }}>{kindLabel(it.kind)}</td>
                  <td style={{ padding: '14px 16px', color: H.gray, fontSize: 13, textTransform: 'uppercase' }}>{it.language}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    {it.isDefault && <span style={{ background: H.greenBg, color: H.green, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>★ {t('common.yes')}</span>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: it.isActive ? H.green : H.gray }}>
                    {it.isActive ? '●' : '○'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
