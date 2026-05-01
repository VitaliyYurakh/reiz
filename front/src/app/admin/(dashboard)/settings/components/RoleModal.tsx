'use client';

import { useState } from 'react';
import { createRole, updateRole } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, Save } from 'lucide-react';
import { PERMISSION_MODULES } from '@/app/admin/(dashboard)/settings/components/types';
import type { Role, PermLevel, Permissions } from '@/app/admin/(dashboard)/settings/components/types';

// Edits a single Role row. System roles are still editable on permissions
// but the name input is locked (renaming "Admin" would break the seed
// bootstrap on a fresh DB which looks the row up by name).

const ALL_LEVELS: PermLevel[] = ['full', 'view', 'none'];

function buildDefaults(): Permissions {
  const out: Permissions = {};
  for (const m of PERMISSION_MODULES) out[m.key] = 'none';
  return out;
}

export function RoleModal({
  role,
  onClose,
  onSaved,
}: {
  role: Role | null; // null = create new
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useAdminLocale();
  const isNew = !role;
  const [name, setName] = useState(role?.name ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [permissions, setPermissions] = useState<Permissions>(() => {
    if (role?.permissions) {
      // Start with defaults, overlay role's actual permissions. This way
      // a module added since the role was created shows as "none" rather
      // than missing from the grid entirely.
      return { ...buildDefaults(), ...(role.permissions as Permissions) };
    }
    return buildDefaults();
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setPerm = (moduleKey: string, level: PermLevel) => {
    setPermissions((prev) => ({ ...prev, [moduleKey]: level }));
  };

  const setAll = (level: PermLevel) => {
    const next: Permissions = {};
    for (const m of PERMISSION_MODULES) next[m.key] = level;
    setPermissions(next);
  };

  const handleSave = async () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg(t('settings.nameRequired') ?? 'Name is required');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createRole({
          name: name.trim(),
          description: description.trim() || null,
          permissions,
        });
      } else {
        await updateRole(role.id, {
          name: name.trim(),
          description: description.trim() || null,
          permissions,
        });
      }
      onSaved();
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

  const isSystem = role?.isSystem ?? false;

  return (
    <div className="h-modal-overlay" style={{ alignItems: 'flex-start', paddingTop: 40, paddingBottom: 40 }}>
      <div className="h-modal" style={{ maxWidth: 720, maxHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="h-modal-title">
            {isNew ? (t('settings.addRole') ?? 'Add role') : (t('settings.editRole') ?? 'Edit role')}
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
                disabled={isSystem}
                title={isSystem ? (t('settings.cannotRenameSystemRole') ?? 'System role cannot be renamed') : undefined}
              />
              {isSystem && (
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-h-gray, #90A4AE)' }}>
                  {t('settings.cannotRenameSystemRole') ?? 'System role cannot be renamed'}
                </p>
              )}
            </div>
            <div>
              <label className="h-label">{t('settings.descriptionLabel') ?? 'Description'}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-input"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="h-label" style={{ marginBottom: 0 }}>{t('settings.permissionsLabel')}</label>
              <div className="inline-flex gap-1">
                <button type="button" onClick={() => setAll('full')} className="h-btn h-btn-xs h-btn-outline">
                  {t('settings.allFull') ?? 'All full'}
                </button>
                <button type="button" onClick={() => setAll('view')} className="h-btn h-btn-xs h-btn-outline">
                  {t('settings.allView') ?? 'All view'}
                </button>
                <button type="button" onClick={() => setAll('none')} className="h-btn h-btn-xs h-btn-outline">
                  {t('settings.allNone') ?? 'All none'}
                </button>
              </div>
            </div>
            <div className="h-card p-0 overflow-hidden">
              <table className="h-table" style={{ marginBottom: 0 }}>
                <thead>
                  <tr className="h-tr">
                    <th className="h-th" style={{ minWidth: 140 }}></th>
                    <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessFull')}</th>
                    <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessView')}</th>
                    <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessNone')}</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_MODULES.map((mod) => {
                    const val = (permissions[mod.key] as PermLevel) || 'none';
                    return (
                      <tr key={mod.key} className="h-tr">
                        <td className="h-td h-td-navy text-[13px] font-medium">{t(mod.labelKey)}</td>
                        {ALL_LEVELS.map((level) => (
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
          </div>
        </div>

        {errorMsg && (
          <div
            className="mt-3 rounded-lg px-3 py-2 text-[13px] shrink-0"
            style={{ backgroundColor: 'rgba(239,83,80,0.1)', color: 'var(--c-warning-light)', whiteSpace: 'pre-line' }}
          >
            {errorMsg}
          </div>
        )}

        <div
          className="mt-4 flex justify-end gap-2.5 shrink-0 pt-3"
          style={{ borderTop: '1px solid var(--color-h-border, #eee)' }}
        >
          <button type="button" onClick={onClose} className="h-btn h-btn-outline">
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim()}
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
