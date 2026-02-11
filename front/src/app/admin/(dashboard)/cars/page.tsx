'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCar, deleteCar, getAllCars } from '@/lib/api/admin';
import { Car } from '@/types/cars';
import { BASE_URL } from '@/config/environment';
import {
  Plus,
  Trash2,
  Pencil,
  Car as CarIcon,
  Sparkles,
  Tag,
  X,
  Search,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export default function CarListPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const fetchCars = async () => {
    try {
      const data = await getAllCars();
      setCars(data.cars);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddCar = async () => {
    try {
      const newCar = await createCar({});
      router.push(`/admin/cars/${newCar.id}`);
    } catch (e) {
      alert('Ошибка при создании авто');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCar(id);
      setCars((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      alert('Ошибка удаления');
    }
  };

  const filtered = cars.filter((car) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (car.brand || '').toLowerCase().includes(q) ||
      (car.model || '').toLowerCase().includes(q) ||
      (car.plateNumber || '').toLowerCase().includes(q)
    );
  });

  const availableCount = cars.filter((c) => c.isAvailable).length;

  return (
    <div style={{ fontFamily: H.font }}>
      {/* ═══ Header Card ═══ */}
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
              <CarIcon style={{ width: 20, height: 20, color: '#fff' }} />
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
                Автомобили
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: H.gray,
                  margin: 0,
                  marginTop: 2,
                }}
              >
                Управление автопарком
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
              <CarIcon style={{ width: 14, height: 14, color: H.purple }} />
              {cars.length}
            </div>

            {/* Available badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 49,
                background: H.greenBg,
                fontSize: 13,
                fontWeight: 700,
                color: H.green,
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: H.green }} />
              {availableCount} доступно
            </div>

            {/* Create */}
            <button
              type="button"
              onClick={handleAddCar}
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
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              Добавить
            </button>
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
              type="text"
              placeholder="Поиск по марке, модели, номеру..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          {search && (
            <span style={{ fontSize: 13, fontWeight: 500, color: H.gray }}>
              {filtered.length} из {cars.length}
            </span>
          )}
        </div>
      </div>

      {/* ═══ Car Grid ═══ */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{ borderRadius: 20, background: H.white, boxShadow: H.shadow, overflow: 'hidden' }}
              >
                <div className="aspect-[16/10]" style={{ background: H.bg }} />
                <div style={{ padding: 20 }} className="space-y-3">
                  <div style={{ height: 18, width: '70%', borderRadius: 8, background: H.bg }} />
                  <div style={{ height: 14, width: '40%', borderRadius: 8, background: H.bg }} />
                  <div style={{ height: 14, width: '30%', borderRadius: 8, background: H.bg }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '64px 0',
              background: H.white,
              borderRadius: 20,
              boxShadow: H.shadow,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: H.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CarIcon style={{ width: 28, height: 28, color: H.grayLight }} />
            </div>
            <p style={{ marginTop: 16, fontSize: 15, fontWeight: 500, color: H.gray }}>
              {search ? 'Ничего не найдено' : 'Автомобили не добавлены'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((car) => {
              const segment = car.segment?.[0];
              const minTariff = car.rentalTariff?.length
                ? Math.min(...car.rentalTariff.map((t) => t.dailyPrice))
                : null;
              const displayName = `${car.brand || ''} ${car.model || ''}`.trim();

              return (
                <div
                  key={car.id}
                  className="group"
                  style={{
                    borderRadius: 20,
                    background: H.white,
                    boxShadow: H.shadow,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => router.push(`/admin/cars/${car.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = H.shadowMd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = H.shadow;
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden" style={{ background: H.bg }}>
                    {car.previewUrl ? (
                      <img
                        src={`${BASE_URL}static/${car.previewUrl}`}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CarIcon style={{ width: 40, height: 40, color: H.grayLight }} />
                      </div>
                    )}

                    {/* Top-left badges */}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                      {car.isNew && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            borderRadius: 49,
                            padding: '4px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
                            color: '#fff',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <Sparkles style={{ width: 11, height: 11 }} /> NEW
                        </span>
                      )}
                      {car.discount != null && car.discount > 0 && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            borderRadius: 49,
                            padding: '4px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #FFB547 0%, #FF9100 100%)',
                            color: '#fff',
                          }}
                        >
                          <Tag style={{ width: 11, height: 11 }} /> -{car.discount}%
                        </span>
                      )}
                    </div>

                    {/* Availability */}
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          borderRadius: 49,
                          padding: '4px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          background: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.92)',
                          backdropFilter: 'blur(8px)',
                          color: car.isAvailable ? H.green : H.red,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: car.isAvailable ? H.green : H.red,
                          }}
                        />
                        {car.isAvailable ? 'Доступно' : 'Недоступно'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px 20px 20px' }}>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: H.navyDark,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayName || `Авто #${car.id}`}
                    </h3>

                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {car.plateNumber && (
                        <span
                          style={{
                            display: 'inline-block',
                            background: H.bg,
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: H.navy,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {car.plateNumber}
                        </span>
                      )}
                      {car.yearOfManufacture && (
                        <span style={{ fontSize: 12, fontWeight: 500, color: H.gray }}>
                          {car.yearOfManufacture} г.
                        </span>
                      )}
                    </div>

                    {/* Details chips */}
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {segment && (
                        <span
                          style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, rgba(134,140,255,0.1) 0%, rgba(67,24,255,0.1) 100%)',
                            borderRadius: 49,
                            padding: '3px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            color: H.purple,
                          }}
                        >
                          {segment.name}
                        </span>
                      )}
                      {car.seats && (
                        <span style={{ fontSize: 12, fontWeight: 500, color: H.gray }}>
                          {car.seats} мест
                        </span>
                      )}
                      {car.color && (
                        <span style={{ fontSize: 12, fontWeight: 500, color: H.gray }}>
                          {car.color}
                        </span>
                      )}
                    </div>

                    {/* Price + actions */}
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: `1px solid ${H.bg}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {minTariff ? (
                        <div>
                          <span style={{ fontSize: 18, fontWeight: 700, color: H.navyDark }}>
                            ${minTariff}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: H.gray, marginLeft: 4 }}>
                            / сутки
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, fontWeight: 500, color: H.gray }}>Цена не указана</span>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/cars/${car.id}`);
                          }}
                          title="Редактировать"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            border: 'none',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: H.gray,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = H.bg;
                            e.currentTarget.style.color = H.navy;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = H.gray;
                          }}
                        >
                          <Pencil style={{ width: 15, height: 15 }} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(car.id);
                          }}
                          title="Удалить"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            border: 'none',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: H.gray,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = H.redBg;
                            e.currentTarget.style.color = H.red;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = H.gray;
                          }}
                        >
                          <Trash2 style={{ width: 15, height: 15 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ Delete Confirm Modal ═══ */}
      {deleteConfirm !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(27, 37, 89, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 20,
              background: H.white,
              padding: 32,
              boxShadow: H.shadowMd,
              fontFamily: H.font,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: H.navyDark, margin: 0 }}>
                Удалить автомобиль?
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: 'none',
                  background: H.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: H.gray,
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: H.gray, lineHeight: 1.5, margin: 0 }}>
              Это действие нельзя отменить. Все связанные фото и данные будут удалены.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                style={{
                  borderRadius: 49,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  background: H.bg,
                  color: H.navy,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  borderRadius: 49,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  background: `linear-gradient(135deg, #FF6B6B 0%, ${H.red} 100%)`,
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(238, 93, 80, 0.25)',
                  transition: 'all 0.15s',
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input::placeholder { color: ${H.gray} !important; }
      `}</style>
    </div>
  );
}
