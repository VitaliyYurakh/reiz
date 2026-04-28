'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import InventoryForm from '../InventoryForm';

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
  const { H } = useAdminTheme();
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

  useEffect(() => { fetchData(); }, [fetchData]);

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

  if (!item) return <div style={{ padding: 32, color: H.gray, fontFamily: H.font }}>{t('common.loading')}</div>;

  return (
    <div style={{ fontFamily: H.font, padding: '24px 28px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={() => router.push('/admin/inventory')}
          style={{ background: 'transparent', border: 'none', color: H.gray, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: H.font }}
        >
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        <button
          onClick={handleDelete}
          style={{ background: H.redBg, color: H.red, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: H.font }}
        >
          <Trash2 size={14} /> {t('common.delete')}
        </button>
      </div>

      <div style={{ background: H.white, borderRadius: 20, boxShadow: H.shadow, padding: '24px 28px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: H.navyDark, marginTop: 0, marginBottom: 20 }}>{item.name}</h1>
        <InventoryForm value={item} onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
