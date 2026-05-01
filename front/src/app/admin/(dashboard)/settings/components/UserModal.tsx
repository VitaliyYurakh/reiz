'use client';

import { useEffect, useState } from 'react';
import { createUser, updateUser, listRoles } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, Save } from 'lucide-react';
import { Toggle } from '@/app/admin/(dashboard)/settings/components/Toggle';
import type { TeamUser } from '@/app/admin/(dashboard)/settings/components/types';

// Post-RBAC: per-user permissions are gone. The admin picks a role from the
// `Role` table; the role carries the permission map. Editing what a role
// can do happens in the dedicated /admin/roles section (Phase 2 — coming
// in a follow-up commit). For now this modal exists in a reduced state:
// just role assignment + activation toggle.

interface RoleOption {
  id: number;
  name: string;
  isSystem: boolean;
}

export function UserModal({
  user,
  onClose,
  onSaved,
}: {
  user: TeamUser | null; // null = create new
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useAdminLocale();
  const isNew = !user;
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number | ''>(user?.role?.id ?? '');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    listRoles()
      .then((rs) => setRoles(rs))
      .catch((err) => logError(err));
  }, []);

  const handleSave = async () => {
    setErrorMsg('');
    if (!email.trim()) return;
    if (isNew && !password.trim()) return;
    if (!roleId) {
      setErrorMsg(t('settings.roleRequired') || 'Role is required');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createUser({ email: email.trim(), password, name: name.trim(), roleId: Number(roleId) });
      } else {
        await updateUser(user.id, { name: name.trim(), roleId: Number(roleId), isActive });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      logError(err);
      const data = err?.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setErrorMsg(data.errors.join('\n'));
      } else {
        setErrorMsg(data?.msg || t('settings.saveError'));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-modal-overlay" style={{ alignItems: 'flex-start', paddingTop: 40, paddingBottom: 40 }}>
      <div className="h-modal" style={{ maxWidth: 560, maxHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="h-modal-title">
            {isNew ? t('settings.addUser') : t('settings.editUser')}
          </h3>
          <button type="button" onClick={onClose} className="h-action-btn">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.nameLabel')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-input"
              />
            </div>
            <div>
              <label className="h-label">{t('settings.emailLabel')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-input"
                disabled={!isNew}
              />
            </div>
          </div>

          {isNew && (
            <div>
              <label className="h-label">{t('settings.passwordLabel')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-input"
              />
              <p className="text-[11px] mt-1" style={{ color: 'var(--color-h-gray, #90A4AE)' }}>
                {t('settings.passwordHint')}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.roleLabel')}</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : '')}
                className="h-select"
              >
                <option value="">—</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.isSystem ? ' ★' : ''}
                  </option>
                ))}
              </select>
            </div>
            {!isNew && (
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-2.5">
                  <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
                  <span className="text-sm text-[var(--color-h-navy)]">
                    {isActive ? t('settings.statusActive') : t('settings.statusInactive')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <p className="h-subtitle text-[13px]">
            {t('settings.permissionsManagedViaRoles') ||
              'Дозволи керуються через ролі. Щоб змінити права — відредагуйте відповідну роль у розділі «Ролі».'}
          </p>
        </div>

        {errorMsg && (
          <div className="mt-3 rounded-lg px-3 py-2 text-[13px] shrink-0" style={{ backgroundColor: 'rgba(239,83,80,0.1)', color: 'var(--c-warning-light)', whiteSpace: 'pre-line' }}>
            {errorMsg}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2.5 shrink-0 pt-3" style={{ borderTop: '1px solid var(--color-h-border, #eee)' }}>
          <button type="button" onClick={onClose} className="h-btn h-btn-outline">
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !email.trim() || (isNew && !password.trim())}
            className="h-btn h-btn-primary"
          >
            <Save size={16} />
            {saving ? t('common.saving') : isNew ? t('common.create') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
