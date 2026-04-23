'use client';

import { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getFleetUtilization, getSegments, type FleetUtilizationData } from '@/lib/api/admin';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';

interface SegmentOption {
  id: number;
  name: string;
}

function getDateRange(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function FleetUtilizationChart() {
  const { theme } = useAdminTheme();
  const { t } = useAdminLocale();
  const isDark = theme === 'dark';
  const [data, setData] = useState<FleetUtilizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<SegmentOption[]>([]);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  useEffect(() => {
    getSegments()
      .then((segs) => setSegments(segs.map((s: any) => ({ id: s.id, name: s.name }))))
      .catch(() => {});
  }, []);

  const fetchData = useCallback((segmentId?: number) => {
    setLoading(true);
    const range = getDateRange(30);
    getFleetUtilization(range.from, range.to, segmentId || undefined)
      .then(setData)
      .catch((err) => console.error('Fleet utilization fetch failed', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(activeSegment ?? undefined);
  }, [activeSegment, fetchData]);

  const utilization = data?.averageUtilizationPercent ?? 0;
  const pieData = [
    { name: t('dashboard.occupied'), value: utilization },
    { name: t('dashboard.free'), value: 100 - utilization },
  ];
  const topCars = data?.cars.slice(0, 5) ?? [];

  const accentColor = isDark ? '#E5E7EB' : '#1F2937';
  const trackColor = isDark ? '#2D3748' : '#E5E5EA';

  return (
    <div className="ios-card flex h-full flex-col">
      <p className="text-sm font-semibold text-foreground">{t('dashboard.fleetTitle')}</p>

      <div className="ios-segmented mt-3" style={{ display: 'flex', width: '100%' }}>
        {[{ id: null, name: t('dashboard.allSegments') }, ...segments].map((seg) => (
          <button
            key={seg.id ?? 'all'}
            type="button"
            onClick={() => setActiveSegment(seg.id)}
            className={`ios-segment ios-segment-fill ${activeSegment === seg.id ? 'ios-segment-active' : ''}`}
          >
            {seg.name}
          </button>
        ))}
      </div>

      {/* Fixed-height body: stops the card from jumping between segment tabs */}
      <div className="relative mt-4 min-h-[320px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/70 backdrop-blur-[1px]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        )}

        <div className="relative mx-auto h-[120px] w-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={54}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={false}
              >
                <Cell fill={accentColor} />
                <Cell fill={trackColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold text-foreground tabular-nums">{utilization}%</span>
          </div>
        </div>

        {/* Reserved slot for the top-cars list — always ~180px so tabs don't shift layout */}
        <div className="mt-4 min-h-[180px]">
          {topCars.length > 0 ? (
            <div className="space-y-2">
              {topCars.map((car) => (
                <div key={car.carId} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-xs text-muted-foreground">
                        {car.brand} {car.model}
                      </p>
                      <span className="ml-2 shrink-0 text-xs font-semibold text-foreground tabular-nums">
                        {car.utilizationPercent}%
                      </span>
                    </div>
                    <div
                      className="mt-1 h-1 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: trackColor }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${car.utilizationPercent}%`, backgroundColor: accentColor }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted-foreground">{t('dashboard.noDataForSegment')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
