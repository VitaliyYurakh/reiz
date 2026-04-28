'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { ArrowLeft } from 'lucide-react';
import InventoryForm from '../InventoryForm';
import '../../dashboard/dashboard.css';
import '../../reservations/new/new-reservation.css';

export default function NewInventoryPage() {
  const { t } = useAdminLocale();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await adminApiClient.post('/inventory', data);
      router.push(`/admin/inventory/${res.data.item.id}`);
    } catch (err) {
      logError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dh-root nr-container">
      <div className="nr-header">
        <Link href="/admin/inventory" className="nr-back" aria-label={t('common.back')}>
          <ArrowLeft />
        </Link>
        <div>
          <div className="nr-greeting">{t('inventory.newItem')}</div>
          <div className="nr-subtitle">
            {t('inventory.newSubtitle') ?? 'Реєстрація нової одиниці інвентарю'}
          </div>
        </div>
      </div>

      <InventoryForm value={null} onSave={handleSave} saving={saving} />
    </div>
  );
}
