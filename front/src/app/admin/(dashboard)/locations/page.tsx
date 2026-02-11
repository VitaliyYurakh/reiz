'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCities, deleteCity, type CityListItem } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  Search,
  Plus,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TYPE_COLORS: Record<string, string> = {
  railway: '#4318FF',
  bus: '#01B574',
  airport: '#3965FF',
  mall: '#FFB547',
  center: '#EE5D50',
  other: '#8B97C0',
};

export default function LocationsPage() {
  const { t, locale } = useAdminLocale();
  const { H } = useAdminTheme();
  const router = useRouter();

  const [cities, setCities] = useState<CityListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const nameKey = locale === 'uk' ? 'nameUk' : locale === 'ru' ? 'nameRu' : 'nameEn';

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCities({ page, limit: 50, search: search || undefined });
      setCities(data.cities);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCity(id);
      setDeleteConfirm(null);
      fetchCities();
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ fontFamily: H.font }}>
      {/* Header Card */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          boxShadow: H.shadow,
          padding: '20px 24px',
          marginBottom: 20,
        }}
      >
        {/* Row 1: Title + actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              <MapPin style={{ width: 20, height: 20, color: '#fff' }} />
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
                {t('locations.title')}
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: H.gray,
                  margin: 0,
                  marginTop: 2,
                }}
              >
                {t('locations.subtitle')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Total badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 49,
                background: H.bg,
                fontSize: 13,
                fontWeight: 700,
                color: H.navy,
              }}
            >
              <MapPin style={{ width: 14, height: 14, color: H.purple }} />
              {total}
            </div>

            {/* Create */}
            <Link
              href="/admin/locations/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                height: 40,
                padding: '0 20px',
                borderRadius: 49,
                background: `linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%)`,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: H.font,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              {t('locations.addCity')}
            </Link>
          </div>
        </div>

        {/* Row 2: Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${H.grayLight}40`,
          }}
        >
          <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
            <Search
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 14,
                height: 14,
                color: H.gray,
                pointerEvents: 'none',
              }}
            />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('common.search') + '...'}
              style={{
                width: '100%',
                height: 40,
                paddingLeft: 38,
                paddingRight: 14,
                borderRadius: 49,
                border: 'none',
                background: H.bg,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: H.font,
                color: H.navy,
                outline: 'none',
                transition: 'box-shadow 0.2s',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 0 2px ${H.purpleLight}50`)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: H.white,
          borderRadius: 16,
          boxShadow: H.shadow,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: H.gray }}>
            {t('common.loading')}
          </div>
        ) : cities.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: H.gray }}>
            {t('locations.noCities')}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${H.grayLight}` }}>
                {['', t('locations.cityName'), t('locations.slug'), t('locations.region'), t('locations.locationCount'), t('locations.isPopular'), t('locations.isActive'), t('common.actions')].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: H.gray,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr
                  key={city.id}
                  onClick={() => router.push(`/admin/locations/${city.id}`)}
                  style={{
                    borderBottom: `1px solid ${H.grayLight}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = H.bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', width: 40 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: city.isActive ? `${H.purple}12` : H.grayLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MapPin size={14} color={city.isActive ? H.purple : H.gray} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: H.navy }}>
                    {city[nameKey]}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: H.gray }}>
                    {city.slug}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: H.gray }}>
                    {city.region}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: H.bg,
                        fontSize: 13,
                        fontWeight: 600,
                        color: H.navy,
                      }}
                    >
                      {city._count.pickupLocations}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {city.isPopular && (
                      <Star size={16} fill="#FFB547" color="#FFB547" />
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: city.isActive ? H.green : H.red,
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteConfirm(city.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: 8,
                        color: H.gray,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = H.red)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = H.gray)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '16px 24px',
              borderTop: `1px solid ${H.grayLight}`,
            }}
          >
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                background: 'none',
                border: 'none',
                cursor: page === 1 ? 'default' : 'pointer',
                opacity: page === 1 ? 0.3 : 1,
                padding: 4,
              }}
            >
              <ChevronLeft size={18} color={H.navy} />
            </button>
            <span style={{ fontSize: 14, color: H.navy, fontWeight: 600 }}>
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              style={{
                background: 'none',
                border: 'none',
                cursor: page === pages ? 'default' : 'pointer',
                opacity: page === pages ? 0.3 : 1,
                padding: 4,
              }}
            >
              <ChevronRight size={18} color={H.navy} />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: H.white,
              borderRadius: 16,
              padding: 32,
              maxWidth: 400,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 600, color: H.navy, marginBottom: 16 }}>
              {t('locations.confirmDeleteCity')}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: `1px solid ${H.grayLight}`,
                  background: H.white,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: H.red,
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
