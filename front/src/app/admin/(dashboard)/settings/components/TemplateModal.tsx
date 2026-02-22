'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, Save } from 'lucide-react';
import { Toggle } from '@/app/admin/(dashboard)/settings/components/Toggle';
import type { NotificationTemplate } from '@/app/admin/(dashboard)/settings/components/types';

export function TemplateModal({
  template,
  onClose,
  onSaved,
}: {
  template: NotificationTemplate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useAdminLocale();
  const isNew = !template;
  const [code, setCode] = useState(template?.code ?? '');
  const [channel, setChannel] = useState(template?.channel ?? 'TELEGRAM');
  const [subject, setSubject] = useState(template?.subject ?? '');
  const [bodyTemplate, setBodyTemplate] = useState(template?.bodyTemplate ?? '');
  const [isActive, setIsActive] = useState(template?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!code.trim() || !bodyTemplate.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await adminApiClient.post('/notification/template', {
          code: code.trim(),
          channel,
          subject: subject.trim() || undefined,
          bodyTemplate: bodyTemplate.trim(),
          isActive,
        });
      } else {
        await adminApiClient.patch(`/notification/template/${template.id}`, {
          code: code.trim(),
          channel,
          subject: subject.trim() || null,
          bodyTemplate: bodyTemplate.trim(),
          isActive,
        });
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

  return (
    <div className="h-modal-overlay">
      <div className="h-modal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="h-modal-title">
            {isNew ? t('settings.newTemplateTitle') : t('settings.editTemplateTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="h-action-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.codeLabel')}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="new_request"
                className="h-input h-input-mono"
              />
            </div>
            <div>
              <label className="h-label">{t('settings.channelLabel')}</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="h-select"
              >
                <option value="TELEGRAM">Telegram</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
          </div>

          {channel === 'EMAIL' && (
            <div>
              <label className="h-label">{t('settings.emailSubjectLabel')}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('settings.emailSubjectPlaceholder')}
                className="h-input"
              />
            </div>
          )}

          <div>
            <label className="h-label">{t('settings.bodyTemplateLabel')}</label>
            <textarea
              value={bodyTemplate}
              onChange={(e) => setBodyTemplate(e.target.value)}
              placeholder={t('settings.bodyTemplatePlaceholder')}
              rows={6}
              className="h-textarea h-input-mono"
            />
            <p className="h-subtitle mt-1 text-[11px]">
              {t('settings.templateVars')}: {'{{clientName}}'}, {'{{carName}}'}, {'{{pickupDate}}'}, {'{{returnDate}}'}, {'{{contractNumber}}'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
            <span className="text-sm text-[var(--color-h-navy)]">{isActive ? t('settings.activeLabel') : t('settings.inactiveLabel')}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-btn h-btn-outline"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !code.trim() || !bodyTemplate.trim()}
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
