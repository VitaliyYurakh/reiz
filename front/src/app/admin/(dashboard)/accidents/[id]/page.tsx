'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { ArrowLeft, Trash2, Receipt } from 'lucide-react';
import AccidentForm from '../AccidentForm';
import '../../dashboard/dashboard.css';
import '../../reservations/new/new-reservation.css';

export default function AccidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const { t } = useAdminLocale();
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
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

  if (!accident) {
    return (
      <div className="dh-root nr-container-wide" style={{ padding: 32 }}>
        <span style={{ color: 'var(--dh-text-dim)', fontSize: 13 }}>{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="dh-root nr-container-wide">
      <div className="nr-header">
        <Link href="/admin/accidents" className="nr-back" aria-label={t('common.back')}>
          <ArrowLeft />
        </Link>
        <div style={{ flex: 1 }}>
          <div className="nr-greeting">
            {t('accidents.detailTitle', {
              id: String(accident.id),
              car: `${accident.car.brand} ${accident.car.model} (${accident.car.plateNumber})`,
            })}
          </div>
          <div className="nr-subtitle">
            {t('accidents.detailSubtitle') ?? 'Перегляд та редагування пригоди'}
          </div>
        </div>
        <button onClick={handleDelete} className="nr-btn nr-btn-danger">
          <Trash2 size={14} /> {t('common.delete')}
        </button>
      </div>

      {accident.linkedFine && (
        <div className="nr-banner">
          <Receipt />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{t('accidents.autoFineCreated')}</div>
            <Link href={`/admin/rentals/${accident.linkedFine.rentalId}`}>
              {t('accidents.goToFine', { id: String(accident.linkedFine.id) })}
            </Link>
          </div>
        </div>
      )}

      <AccidentForm value={accident} onSave={handleSave} saving={saving} isEdit />
    </div>
  );
}
