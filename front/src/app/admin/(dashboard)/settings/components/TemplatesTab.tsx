'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { Bell, Plus, Pencil, MessageSquare } from 'lucide-react';
import { Toggle } from '@/app/admin/(dashboard)/settings/components/Toggle';
import { TemplateModal } from '@/app/admin/(dashboard)/settings/components/TemplateModal';
import { fmtDateTime } from '@/app/admin/(dashboard)/settings/components/utils';
import { CHANNEL_MAP } from '@/app/admin/(dashboard)/settings/components/types';
import type { NotificationTemplate } from '@/app/admin/(dashboard)/settings/components/types';

export function TemplatesTab() {
  const { t } = useAdminLocale();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<NotificationTemplate | null | undefined>(undefined);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await adminApiClient.get('/notification/template');
      setTemplates(res.data.templates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleToggleActive = async (tpl: NotificationTemplate) => {
    try {
      await adminApiClient.patch(`/notification/template/${tpl.id}`, { isActive: !tpl.isActive });
      await fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="h-subtitle">{t('settings.templatesCount', { n: String(templates.length) })}</span>
        <button
          type="button"
          onClick={() => setEditTarget(null)}
          className="h-btn h-btn-sm h-btn-primary"
        >
          <Plus size={16} />
          {t('settings.newTemplate')}
        </button>
      </div>

      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                {[
                  { key: 'code', label: t('settings.thCode') },
                  { key: 'channel', label: t('settings.thChannel') },
                  { key: 'subject', label: t('settings.thSubject') },
                  { key: 'template', label: t('settings.thTemplate') },
                  { key: 'status', label: t('settings.thStatus') },
                  { key: 'updated', label: t('settings.thUpdated') },
                  { key: 'actions', label: t('settings.thActions'), right: true },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`h-th ${col.right ? 'h-th-right' : ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td colSpan={7} className="h-td">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-empty">
                    <Bell size={40} className="h-empty-icon" />
                    <div>{t('settings.noTemplates')}</div>
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => {
                  const ch = CHANNEL_MAP[tpl.channel] || { label: tpl.channel, badgeClass: 'h-badge h-badge-gray', icon: MessageSquare };
                  const ChIcon = ch.icon;
                  return (
                    <tr
                      key={tpl.id}
                      className="h-tr"
                    >
                      <td className="h-td h-td-mono h-td-navy font-medium">
                        {tpl.code}
                      </td>
                      <td className="h-td">
                        <span className={ch.badgeClass}>
                          <ChIcon size={12} />
                          {ch.label}
                        </span>
                      </td>
                      <td className="h-td h-td-navy">{tpl.subject || '—'}</td>
                      <td className="h-td h-td-gray h-td-mono h-td-truncate max-w-[300px]">
                        {tpl.bodyTemplate}
                      </td>
                      <td className="h-td">
                        <Toggle checked={tpl.isActive} onChange={() => handleToggleActive(tpl)} size="sm" />
                      </td>
                      <td className="h-td h-td-gray whitespace-nowrap text-[13px]">
                        {fmtDateTime(tpl.updatedAt)}
                      </td>
                      <td className="h-td text-right">
                        <button
                          type="button"
                          onClick={() => setEditTarget(tpl)}
                          className="h-edit-btn"
                        >
                          <Pencil size={13} />
                          {t('settings.editBtn')}
                        </button>
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
        <TemplateModal template={editTarget} onClose={() => setEditTarget(undefined)} onSaved={fetchTemplates} />
      )}
    </div>
  );
}
