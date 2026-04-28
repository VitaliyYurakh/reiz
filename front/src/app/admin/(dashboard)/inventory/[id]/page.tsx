'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { ArrowLeft, Trash2 } from 'lucide-react';
import InventoryForm from '../InventoryForm';
import '../../dashboard/dashboard.css';
import '../../reservations/new/new-reservation.css';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  serialNumber: string | null;
  status: string;
  quantity: number;
  purchaseDate: string | null;
  purchasePriceMinor: number | null;
  currentValueMinor: number | null;
  currency: string;
  locationId: number | null;
  responsibleUserId: number | null;
  notes: string | null;
  attachments: string[];
}

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const { t } = useAdminLocale();
  const router = useRouter();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminApiClient.get(`/inventory/${id}`);
      setItem(res.data.item);
    } catch (err) {
      logError(err);
      router.push('/admin/inventory');
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (data: Partial<InventoryItem>) => {
    setSaving(true);
    try {
      const res = await adminApiClient.patch(`/inventory/${id}`, data);
      setItem(res.data.item);
    } catch (err) {
      logError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('inventory.confirmDelete'))) return;
    try {
      await adminApiClient.delete(`/inventory/${id}`);
      router.push('/admin/inventory');
    } catch (err) {
      logError(err);
    }
  };

  if (!item) {
    return (
      <div className="dh-root nr-container" style={{ padding: 32 }}>
        <span style={{ color: 'var(--dh-text-dim)', fontSize: 13 }}>{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="dh-root nr-container">
      <div className="nr-header">
        <Link href="/admin/inventory" className="nr-back" aria-label={t('common.back')}>
          <ArrowLeft />
        </Link>
        <div style={{ flex: 1 }}>
          <div className="nr-greeting">{item.name}</div>
          <div className="nr-subtitle">
            {t('inventory.detailSubtitle') ?? 'Перегляд та редагування одиниці інвентарю'}
          </div>
        </div>
        <button onClick={handleDelete} className="nr-btn nr-btn-danger">
          <Trash2 size={14} /> {t('common.delete')}
        </button>
      </div>

      <InventoryForm value={item} onSave={handleSave} saving={saving} />
    </div>
  );
}
