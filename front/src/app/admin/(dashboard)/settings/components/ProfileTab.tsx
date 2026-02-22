'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { User } from 'lucide-react';
import type { UserProfile } from '@/app/admin/(dashboard)/settings/components/types';

export function ProfileTab() {
  const { t } = useAdminLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiClient
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-shimmer h-shimmer-lg"
          />
        ))}
      </div>
    );
  }

  if (!user) {
    return <p className="h-subtitle">{t('settings.profileLoadError')}</p>;
  }

  return (
    <div className="max-w-[440px]">
      <div className="h-card p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-icon-box h-icon-box-lg h-icon-box-purple shadow-[0_4px_12px_rgba(67,24,255,0.25)]">
            <User size={28} />
          </div>
          <div>
            <p className="text-base font-bold text-[var(--color-h-navy)] m-0">{user.email}</p>
            <p className="h-subtitle mt-0.5 m-0">ID: {user.id}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="h-profile-row">
            <span className="text-sm text-[var(--color-h-gray)]">{t('settings.roleLabel')}</span>
            <span className="h-badge h-badge-purple">
              {user.role}
            </span>
          </div>
          <div className="h-profile-row">
            <span className="text-sm text-[var(--color-h-gray)]">{t('settings.emailLabel')}</span>
            <span className="text-sm font-semibold text-[var(--color-h-navy)]">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
