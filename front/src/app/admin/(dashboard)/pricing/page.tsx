'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { DollarSign } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { TabKey, RatePlan, AddOn, CoveragePackage } from './components/pricing-types';
import { TABS } from './components/pricing-types';
import { RatePlansSection } from './components/RatePlansSection';
import { AddOnsSection } from './components/AddOnsSection';
import { CoverageSection } from './components/CoverageSection';

export default function PricingPage() {
  const { H } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('ratePlans');
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [coveragePackages, setCoveragePackages] = useState<CoveragePackage[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTab = useCallback(async (tab: TabKey) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'ratePlans') {
        const res = await adminApiClient.get('/pricing/rate-plan');
        setRatePlans(res.data.ratePlans);
      } else if (tab === 'addOns') {
        const res = await adminApiClient.get('/pricing/add-on');
        setAddOns(res.data.addOns);
      } else {
        const res = await adminApiClient.get('/pricing/coverage-package');
        setCoveragePackages(res.data.coveragePackages);
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab, fetchTab]);

  const handleRefresh = useCallback(() => {
    fetchTab(activeTab);
  }, [activeTab, fetchTab]);

  return (
    <div style={{ fontFamily: H.font }}>
      {/* Header card */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          padding: '20px 24px',
          boxShadow: H.shadow,
          marginBottom: 20,
        }}
      >
        {/* Row 1: Title + tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)',
              }}
            >
              <DollarSign style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: H.navy,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Ценообразование
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: H.gray,
                  margin: 0,
                  marginTop: 2,
                }}
              >
                Управление тарифами, доп. услугами и покрытием
              </p>
            </div>
          </div>

          {/* Segmented control */}
          <div
            style={{
              display: 'inline-flex',
              background: H.bg,
              borderRadius: 49,
              padding: 4,
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    borderRadius: 49,
                    padding: '9px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: H.font,
                    ...(isActive
                      ? {
                          background: H.navy,
                          color: '#fff',
                          boxShadow:
                            '0 4px 12px rgba(43, 54, 116, 0.2)',
                        }
                      : {
                          background: 'transparent',
                          color: H.gray,
                        }),
                  }}
                >
                  <TabIcon style={{ width: 15, height: 15 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: H.redBg,
            borderRadius: 16,
            padding: '14px 20px',
            color: H.red,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* Tab content */}
      <div>
        {activeTab === 'ratePlans' && (
          <RatePlansSection
            items={ratePlans}
            loading={loading}
            onRefresh={handleRefresh}
          />
        )}
        {activeTab === 'addOns' && (
          <AddOnsSection
            items={addOns}
            loading={loading}
            onRefresh={handleRefresh}
          />
        )}
        {activeTab === 'coveragePackages' && (
          <CoverageSection
            items={coveragePackages}
            loading={loading}
            onRefresh={handleRefresh}
          />
        )}
      </div>

      {/* Pulse animation for skeletons */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
