'use client';

import { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Car } from 'lucide-react';
import { getFleetUtilization, getSegments, type FleetUtilizationData } from '@/lib/api/admin';
import { useAdminTheme } from '@/context/AdminThemeContext';

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
  const isDark = theme === 'dark';
  const [data, setData] = useState<FleetUtilizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<SegmentOption[]>([]);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  // Load segments once
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
    { name: 'Зайняті', value: utilization },
    { name: 'Вільні', value: 100 - utilization },
  ];
  const topCars = data?.cars.slice(0, 5) ?? [];

  function handleSegment(id: number | null) {
    setActiveSegment(id);
  }

  return (
    <div className="ios-card !py-3 flex h-full flex-col">
      <p className="mb-2 text-sm font-semibold text-card-foreground">Загрузка автопарка</p>

      {/* Segment filter — segmented control */}
      <div
        className="ios-segmented mb-2"
        style={{ display: 'flex', width: '100%' }}
      >
        {[{ id: null, name: 'Все' }, ...segments].map((seg) => (
          <button
            key={seg.id ?? 'all'}
            type="button"
            onClick={() => handleSegment(seg.id)}
            className={`ios-segment ios-segment-fill ${activeSegment === seg.id ? 'ios-segment-active' : ''}`}
          >
            {seg.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <>
          {/* Donut */}
          <div className="relative mx-auto h-[130px] w-[130px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={56}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#26C6DA" />
                  <Cell fill={isDark ? '#2D3748' : '#E5E5EA'} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-card-foreground">{utilization}%</span>
              <span className="text-[11px] text-muted-foreground">загрузка</span>
            </div>
          </div>

          {/* Top cars */}
          {topCars.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {topCars.map((car) => (
                <div key={car.carId} className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: isDark ? 'rgba(38,198,218,0.15)' : '#E0F7FA' }}
                  >
                    <Car className="h-3.5 w-3.5" style={{ color: '#26C6DA' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-xs font-medium text-card-foreground">
                        {car.brand} {car.model}
                      </p>
                      <span className="ml-2 shrink-0 text-xs font-semibold text-muted-foreground">
                        {car.utilizationPercent}%
                      </span>
                    </div>
                    <div
                      className="mt-1 h-1.5 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: isDark ? '#2D3748' : '#ECEFF1' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${car.utilizationPercent}%`, backgroundColor: '#26C6DA' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-1 items-center justify-center">
              <p className="text-xs text-muted-foreground">Нет данных для этого сегмента</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
