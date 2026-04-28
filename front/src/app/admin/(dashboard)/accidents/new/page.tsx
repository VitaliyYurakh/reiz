'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { ArrowLeft } from 'lucide-react';
import AccidentForm from '../AccidentForm';
import '../../dashboard/dashboard.css';
import '../../reservations/new/new-reservation.css';

export default function NewAccidentPage() {
  const { t } = useAdminLocale();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await adminApiClient.post('/accident', data);
      router.push(`/admin/accidents/${res.data.accident.id}`);
    } catch (err) {
      logError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dh-root nr-container-wide">
      <div className="nr-header">
        <Link href="/admin/accidents" className="nr-back" aria-label={t('common.back')}>
          <ArrowLeft />
        </Link>
        <div>
          <div className="nr-greeting">{t('accidents.newAccident')}</div>
          <div className="nr-subtitle">
            {t('accidents.newSubtitle') ?? 'Реєстрація нової пригоди'}
          </div>
        </div>
      </div>

      <AccidentForm value={null} onSave={handleSave} saving={saving} />
    </div>
  );
}
