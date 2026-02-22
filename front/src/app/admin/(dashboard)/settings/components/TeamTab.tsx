'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUsers, deleteUser } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { Users, Plus, Pencil, Trash2, Key } from 'lucide-react';
import { UserModal } from '@/app/admin/(dashboard)/settings/components/UserModal';
import { PasswordModal } from '@/app/admin/(dashboard)/settings/components/PasswordModal';
import type { TeamUser } from '@/app/admin/(dashboard)/settings/components/types';

export function TeamTab() {
  const { t } = useAdminLocale();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<TeamUser | null | undefined>(undefined);
  const [passwordTarget, setPasswordTarget] = useState<TeamUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || 'Error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="h-subtitle">{users.length} {t('settings.tabTeam').toLowerCase()}</span>
        <button
          type="button"
          onClick={() => setEditTarget(null)}
          className="h-btn h-btn-sm h-btn-primary"
        >
          <Plus size={16} />
          {t('settings.addUser')}
        </button>
      </div>

      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                <th className="h-th">ID</th>
                <th className="h-th">{t('settings.nameLabel')}</th>
                <th className="h-th">{t('settings.emailLabel')}</th>
                <th className="h-th">{t('settings.roleLabel')}</th>
                <th className="h-th">{t('settings.thStatus')}</th>
                <th className="h-th h-th-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td colSpan={6} className="h-td">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-empty">
                    <Users size={40} className="h-empty-icon" />
                    <div>{t('settings.noUsers')}</div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="h-tr">
                    <td className="h-td h-td-id">{u.id}</td>
                    <td className="h-td h-td-navy font-medium">{u.name || '—'}</td>
                    <td className="h-td h-td-navy">{u.email}</td>
                    <td className="h-td">
                      <span className={`h-badge ${u.role === 'admin' ? 'h-badge-purple' : 'h-badge-blue'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="h-td">
                      <span className={`h-badge ${u.isActive ? 'h-badge-green' : 'h-badge-gray'}`}>
                        {u.isActive ? t('settings.statusActive') : t('settings.statusInactive')}
                      </span>
                    </td>
                    <td className="h-td text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditTarget(u)}
                          className="h-action-btn"
                          title={t('settings.editUser')}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasswordTarget(u)}
                          className="h-action-btn"
                          title={t('settings.changePasswordBtn')}
                        >
                          <Key size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(u)}
                          className="h-action-btn h-action-btn-delete"
                          title={t('common.delete')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create modal */}
      {editTarget !== undefined && (
        <UserModal user={editTarget} onClose={() => setEditTarget(undefined)} onSaved={fetchUsers} />
      )}

      {/* Change password modal */}
      {passwordTarget && (
        <PasswordModal user={passwordTarget} onClose={() => setPasswordTarget(null)} />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="h-modal-overlay">
          <div className="h-modal" style={{ maxWidth: 400 }}>
            <h3 className="h-modal-title mb-4">
              {t('settings.confirmDeleteUser', { name: deleteTarget.name || deleteTarget.email })}
            </h3>
            <div className="flex justify-end gap-2.5">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-btn h-btn-outline">
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-btn h-btn-danger"
              >
                <Trash2 size={16} />
                {deleting ? '...' : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
