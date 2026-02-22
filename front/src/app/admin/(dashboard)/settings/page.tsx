'use client';

import { useState } from 'react';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { Settings } from 'lucide-react';
import { TABS } from '@/app/admin/(dashboard)/settings/components/types';
import type { TabKey } from '@/app/admin/(dashboard)/settings/components/types';
import { TemplatesTab } from '@/app/admin/(dashboard)/settings/components/TemplatesTab';
import { AuditTab } from '@/app/admin/(dashboard)/settings/components/AuditTab';
import { TeamTab } from '@/app/admin/(dashboard)/settings/components/TeamTab';
import { ProfileTab } from '@/app/admin/(dashboard)/settings/components/ProfileTab';

export default function SettingsPage() {
  const { t } = useAdminLocale();
  const [activeTab, setActiveTab] = useState<TabKey>('templates');

  return (
    <div className="h-page">
      {/* Header card */}
      <div className="h-header gap-3.5">
        <div className="h-icon-box h-icon-box-gray">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="h-title">{t('settings.title')}</h1>
          <span className="h-subtitle">{t('settings.subtitle')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="h-tabs mb-5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-tab ${isActive ? 'h-tab-active' : ''}`}
            >
              <TabIcon size={16} />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'templates' && <TemplatesTab />}
      {activeTab === 'audit' && <AuditTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'profile' && <ProfileTab />}
    </div>
  );
}
