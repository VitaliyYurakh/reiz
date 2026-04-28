'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Trash2, Receipt } from 'lucide-react';
import AccidentForm from '../AccidentForm';

export default function AccidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const { t } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();
  const [accident, setAccident] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApiClient.get(`/accident/${id}`);
      setAccident(res.data.accident);
    } catch (err) {
      logError(err);
      router.push('/admin/accidents');
    }
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      // Strip carId/rentalId/clientId — those are immutable on update
      const { carId, rentalId, clientId, ...updatable } = data;
      const res = await adminApiClient.patch(`/accident/${id}`, updatable);
      setAccident(res.data.accident);
    } catch (err) {
      logError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('accidents.confirmDelete'))) return;
    try {
      await adminApiClient.delete(`/accident/${id}`);
      router.push('/admin/accidents');
    } catch (err) {
      logError(err);
    }
  };

  if (!accident) return <div style={{ padding: 32, color: H.gray, fontFamily: H.font }}>{t('common.loading')}</div>;

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={() => router.push('/admin/accidents')} style={{ background: 'transparent', border: 'none', color: H.gray, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: H.font }}>
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        <button onClick={handleDelete} style={{ background: H.redBg, color: H.red, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: H.font }}>
          <Trash2 size={14} /> {t('common.delete')}
        </button>
      </div>

      {accident.linkedFine && (
        <div style={{ background: H.orangeBg, color: H.orange, borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Receipt size={18} />
          <div>
            <div style={{ fontWeight: 600 }}>{t('accidents.autoFineCreated')}</div>
            <Link href={`/admin/rentals/${accident.linkedFine.rentalId}`} style={{ color: H.orange, fontSize: 13, textDecoration: 'underline' }}>
              {t('accidents.goToFine', { id: String(accident.linkedFine.id) })}
            </Link>
          </div>
        </div>
      )}

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '24px 28px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, marginTop: 0, marginBottom: 20 }}>
          {t('accidents.detailTitle', { id: String(accident.id), car: `${accident.car.brand} ${accident.car.model} (${accident.car.plateNumber})` })}
        </h1>
        <AccidentForm value={accident} onSave={handleSave} saving={saving} isEdit />
      </div>
    </div>
  );
}
