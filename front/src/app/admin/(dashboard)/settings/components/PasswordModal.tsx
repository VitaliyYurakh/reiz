'use client';

import { useState } from 'react';
import { changeUserPassword } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, Save } from 'lucide-react';
import type { TeamUser } from '@/app/admin/(dashboard)/settings/components/types';

export function PasswordModal({
  user,
  onClose,
}: {
  user: TeamUser;
  onClose: () => void;
}) {
  const { t } = useAdminLocale();
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!password.trim()) return;
    setSaving(true);
    try {
      await changeUserPassword(user.id, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-modal-overlay">
      <div className="h-modal" style={{ maxWidth: 400 }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="h-modal-title">{t('settings.changePasswordBtn')}</h3>
          <button type="button" onClick={onClose} className="h-action-btn">
            <X size={18} />
          </button>
        </div>
        <div>
          <label className="h-label">{t('settings.newPasswordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-input"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button type="button" onClick={onClose} className="h-btn h-btn-outline">
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !password.trim()}
            className="h-btn h-btn-primary"
          >
            <Save size={16} />
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
