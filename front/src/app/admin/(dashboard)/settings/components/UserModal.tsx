'use client';

import { useState } from 'react';
import { createUser, updateUser } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, Save } from 'lucide-react';
import { Toggle } from '@/app/admin/(dashboard)/settings/components/Toggle';
import { PERMISSION_MODULES } from '@/app/admin/(dashboard)/settings/components/types';
import type { TeamUser, PermLevel, Permissions } from '@/app/admin/(dashboard)/settings/components/types';

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
  const [role, setRole] = useState(user?.role ?? 'manager');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [permissions, setPermissions] = useState<Permissions>(() => {
    if (user?.permissions && typeof user.permissions === 'object') {
      return user.permissions as Permissions;
    }
    const defaults: Permissions = {};
    for (const m of PERMISSION_MODULES) defaults[m.key] = 'full';
    return defaults;
  });
  const [saving, setSaving] = useState(false);

  const setPerm = (module: string, level: PermLevel) => {
    setPermissions((prev) => ({ ...prev, [module]: level }));
  };

  const handleSave = async () => {
    if (!email.trim()) return;
    if (isNew && !password.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await createUser({ email: email.trim(), password, name: name.trim(), role, permissions });
      } else {
        await updateUser(user.id, { name: name.trim(), role, permissions, isActive });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = role === 'admin';

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
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.roleLabel')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-select"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
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

          {/* Permissions grid */}
          <div>
            <label className="h-label mb-2">{t('settings.permissionsLabel')}</label>
            {isAdmin ? (
              <p className="h-subtitle text-[13px]">{t('settings.adminFullAccess')}</p>
            ) : (
              <div className="h-card p-0 overflow-hidden">
                <table className="h-table" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr className="h-tr">
                      <th className="h-th" style={{ minWidth: 120 }}></th>
                      <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessFull')}</th>
                      <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessView')}</th>
                      <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessNone')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSION_MODULES.map((mod) => {
                      const val = permissions[mod.key] || 'none';
                      return (
                        <tr key={mod.key} className="h-tr">
                          <td className="h-td h-td-navy text-[13px] font-medium">{t(mod.labelKey)}</td>
                          {(['full', 'view', 'none'] as PermLevel[]).map((level) => (
                            <td key={level} className="h-td text-center">
                              <input
                                type="radio"
                                name={`perm-${mod.key}`}
                                checked={val === level}
                                onChange={() => setPerm(mod.key, level)}
                                className="accent-[var(--color-h-purple)]"
                                style={{ width: 16, height: 16 }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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
