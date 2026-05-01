'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient, deleteRole } from '@/lib/api/admin';
import { toast, toastError } from '@/lib/toast';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { ShieldCheck, Plus, Pencil, Trash2, Lock } from 'lucide-react';
import { RoleModal } from '@/app/admin/(dashboard)/settings/components/RoleModal';
import { PERMISSION_MODULES } from '@/app/admin/(dashboard)/settings/components/types';
import type { Role, PermLevel } from '@/app/admin/(dashboard)/settings/components/types';

// "Roles" tab in /admin/settings — Phase 2 of the RBAC rollout (Phase 1
// added the Role table + /api/role CRUD; this surfaces it in the UI).
//
// The migration created one "Custom (<email>)" role per existing user to
// preserve their pre-RBAC permissions. The expected workflow here is:
//   1. Admin creates clean shared roles (e.g. "Office Manager")
//   2. Reassigns users to them on the Team tab
//   3. Deletes the now-empty Custom roles
// Backend forbids deleting system roles (Admin) and roles that still
// have users — both come back as actionable HTTP errors.

export function RolesTab() {
  const { t } = useAdminLocale();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Role | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      // Use raw client so we can pull the user count via _count include
      // server-side. Falls back to the simpler list shape if backend
      // doesn't include the count yet (older deploys).
      const res = await adminApiClient.get<Role[]>('/role');
      setRoles(res.data);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRole(deleteTarget.id);
      setDeleteTarget(null);
      fetchRoles();
      toast.success(t('common.deleted') ?? 'Deleted');
    } catch (err) {
      toastError(err, t('settings.saveError') ?? 'Error');
    } finally {
      setDeleting(false);
    }
  };

  // Compact permission summary: count of `full` / `view` / `none` so the
  // table row stays short. Detailed grid lives in the edit modal.
  const summarize = (perms: Role['permissions']) => {
    let full = 0, view = 0, none = 0;
    for (const m of PERMISSION_MODULES) {
      const lvl = (perms?.[m.key] ?? 'none') as PermLevel;
      if (lvl === 'full') full++;
      else if (lvl === 'view') view++;
      else none++;
    }
    return { full, view, none };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="h-subtitle">
          {roles.length} {t('settings.tabRoles').toLowerCase()}
        </span>
        <button
          type="button"
          onClick={() => setEditTarget(null)}
          className="h-btn h-btn-sm h-btn-primary"
        >
          <Plus size={16} />
          {t('settings.addRole') ?? 'Add role'}
        </button>
      </div>

      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                <th className="h-th">ID</th>
                <th className="h-th">{t('settings.nameLabel')}</th>
                <th className="h-th">{t('settings.descriptionLabel') ?? 'Description'}</th>
                <th className="h-th">{t('settings.permissionsLabel')}</th>
                <th className="h-th h-th-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td className="h-td" colSpan={5}>
                      <div className="h-skel" style={{ height: 18 }} />
                    </td>
                  </tr>
                ))
              ) : roles.length === 0 ? (
                <tr className="h-tr">
                  <td className="h-td h-empty" colSpan={5}>
                    <ShieldCheck size={40} className="h-empty-icon" />
                    <div>{t('settings.noRoles') ?? 'No roles'}</div>
                  </td>
                </tr>
              ) : (
                roles.map((r) => {
                  const s = summarize(r.permissions);
                  const blocked = r.isSystem || (r._count?.users ?? 0) > 0;
                  return (
                    <tr key={r.id} className="h-tr">
                      <td className="h-td h-td-id">{r.id}</td>
                      <td className="h-td h-td-navy font-medium">
                        <div className="inline-flex items-center gap-1.5">
                          {r.isSystem && (
                            <Lock size={12} className="text-[var(--color-h-purple)]" aria-label="system" />
                          )}
                          {r.name}
                        </div>
                      </td>
                      <td className="h-td">
                        <span className="text-[13px]" style={{ color: 'var(--color-h-gray, #90A4AE)' }}>
                          {r.description || '—'}
                        </span>
                      </td>
                      <td className="h-td">
                        <span className="h-badge h-badge-green">{s.full} full</span>{' '}
                        <span className="h-badge h-badge-blue">{s.view} view</span>{' '}
                        <span className="h-badge h-badge-gray">{s.none} none</span>
                      </td>
                      <td className="h-td text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditTarget(r)}
                            className="h-action-btn"
                            aria-label={t('common.edit') ?? 'Edit'}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(r)}
                            className="h-action-btn h-action-btn-danger"
                            disabled={blocked}
                            title={
                              r.isSystem
                                ? (t('settings.cannotDeleteSystemRole') ?? 'System role')
                                : (r._count?.users ?? 0) > 0
                                  ? (t('settings.cannotDeleteAssignedRole') ?? 'Reassign users first')
                                  : undefined
                            }
                            aria-label={t('common.delete') ?? 'Delete'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editTarget !== undefined && (
        <RoleModal
          role={editTarget}
          onClose={() => setEditTarget(undefined)}
          onSaved={() => {
            setEditTarget(undefined);
            fetchRoles();
          }}
        />
      )}

      {deleteTarget && (
        <div className="h-modal-overlay">
          <div className="h-modal" style={{ maxWidth: 420 }}>
            <h3 className="h-modal-title">{t('common.confirmDelete') ?? 'Delete?'}</h3>
            <p className="h-subtitle mt-2">
              {t('settings.confirmDeleteRole') ?? 'Are you sure you want to delete this role?'}
              <br />
              <strong>{deleteTarget.name}</strong>
            </p>
            <div className="mt-4 flex justify-end gap-2.5">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-btn h-btn-outline">
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-btn h-btn-danger"
              >
                {deleting ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
