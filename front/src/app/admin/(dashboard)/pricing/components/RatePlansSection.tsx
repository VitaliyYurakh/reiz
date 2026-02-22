'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { IosSelect } from '@/components/admin/IosSelect';
import { Plus, Pencil, Trash2, X, Check, Tag, Car, Calendar } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { RatePlan, RatePlanCar } from './pricing-types';
import { formatMoney } from './pricing-types';
import { HInput, HLabel, HToggle, StatusBadge, ActionButton } from './PricingUI';

interface RatePlanFormData {
  name: string;
  carId: number | '';
  minDays: number | '';
  maxDays: number | '';
  dailyPrice: number | '';
  currency: string;
  isActive: boolean;
}

const emptyRatePlan: RatePlanFormData = {
  name: '',
  carId: '',
  minDays: '',
  maxDays: '',
  dailyPrice: '',
  currency: 'USD',
  isActive: true,
};

export function RatePlansSection({
  items,
  loading,
  onRefresh,
}: {
  items: RatePlan[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<RatePlanFormData>({
    ...emptyRatePlan,
  });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<RatePlanFormData>({
    ...emptyRatePlan,
  });
  const [saving, setSaving] = useState(false);
  const [cars, setCars] = useState<RatePlanCar[]>([]);
  const [carsLoaded, setCarsLoaded] = useState(false);

  const loadCars = useCallback(async () => {
    if (carsLoaded) return;
    try {
      const data = await getAllCars();
      setCars(data.cars as unknown as RatePlanCar[]);
      setCarsLoaded(true);
    } catch {
      /* ignore */
    }
  }, [carsLoaded]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const handleCreate = async () => {
    if (
      !createForm.name ||
      !createForm.carId ||
      !createForm.minDays ||
      !createForm.maxDays ||
      createForm.dailyPrice === ''
    )
      return;
    if (
      Number(createForm.maxDays) !== 0 &&
      Number(createForm.minDays) > Number(createForm.maxDays)
    ) {
      alert('Мін. дні не можуть перевищувати макс. дні (0 = необмежено)');
      return;
    }
    if (Number(createForm.dailyPrice) <= 0) {
      alert('Добова ціна має бути більше 0');
      return;
    }
    setCreating(true);
    try {
      await adminApiClient.post('/pricing/rate-plan', {
        name: createForm.name,
        carId: Number(createForm.carId),
        minDays: Number(createForm.minDays),
        maxDays: Number(createForm.maxDays),
        dailyPrice: Number(createForm.dailyPrice),
        currency: createForm.currency,
        isActive: createForm.isActive,
      });
      setCreateForm({ ...emptyRatePlan });
      setShowCreate(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (rp: RatePlan) => {
    setEditingId(rp.id);
    setEditForm({
      name: rp.name,
      carId: rp.carId,
      minDays: rp.minDays,
      maxDays: rp.maxDays,
      dailyPrice: rp.dailyPrice,
      currency: rp.currency,
      isActive: rp.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: number) => {
    if (
      !editForm.name ||
      !editForm.carId ||
      !editForm.minDays ||
      !editForm.maxDays ||
      editForm.dailyPrice === ''
    )
      return;
    setSaving(true);
    try {
      await adminApiClient.patch(`/pricing/rate-plan/${id}`, {
        name: editForm.name,
        carId: Number(editForm.carId),
        minDays: Number(editForm.minDays),
        maxDays: Number(editForm.maxDays),
        dailyPrice: Number(editForm.dailyPrice),
        currency: editForm.currency,
        isActive: editForm.isActive,
      });
      setEditingId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить тариф?')) return;
    try {
      await adminApiClient.delete(`/pricing/rate-plan/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Create form toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: H.navy,
            fontFamily: H.font,
            margin: 0,
          }}
        >
          Тарифы
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowCreate(!showCreate);
            if (!showCreate) setCreateForm({ ...emptyRatePlan });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 40,
            borderRadius: 49,
            border: 'none',
            padding: '0 22px',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: H.font,
            cursor: 'pointer',
            transition: 'all 0.2s',
            ...(showCreate
              ? {
                  background: H.bg,
                  color: H.gray,
                }
              : {
                  background: `linear-gradient(135deg, ${H.purpleLight}, ${H.purple})`,
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(67,24,255,0.25)',
                }),
          }}
        >
          {showCreate ? (
            <>
              <X style={{ width: 15, height: 15 }} /> Отмена
            </>
          ) : (
            <>
              <Plus style={{ width: 15, height: 15 }} /> Добавить
            </>
          )}
        </button>
      </div>

      {/* Collapsible create card */}
      {showCreate && (
        <div
          style={{
            background: H.white,
            borderRadius: 20,
            padding: 24,
            boxShadow: H.shadow,
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: H.navy,
              fontFamily: H.font,
              marginBottom: 20,
            }}
          >
            Новый тариф
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            <div>
              <HLabel>Название</HLabel>
              <HInput
                type="text"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                placeholder="Название тарифа"
              />
            </div>
            <div>
              <HLabel>Авто</HLabel>
              <IosSelect
                className="w-full text-sm"
                triggerClassName={`h-[42px] rounded-[16px] border-none text-[13px] font-medium ${isDark ? 'bg-[#111827]' : 'bg-[#F4F7FE]'}`}
                value={createForm.carId ? String(createForm.carId) : ''}
                onChange={(v) =>
                  setCreateForm({ ...createForm, carId: v ? Number(v) : '' })
                }
                placeholder="-- Выберите авто --"
                options={cars.map((c) => ({
                  value: String(c.id),
                  label: `${c.brand} ${c.model} (${c.plateNumber})`,
                }))}
              />
            </div>
            <div>
              <HLabel>Мин. дней</HLabel>
              <HInput
                type="number"
                value={createForm.minDays}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    minDays: e.target.value ? Number(e.target.value) : '',
                  })
                }
                placeholder="1"
                min={1}
              />
            </div>
            <div>
              <HLabel>Макс. дней</HLabel>
              <HInput
                type="number"
                value={createForm.maxDays}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    maxDays: e.target.value ? Number(e.target.value) : '',
                  })
                }
                placeholder="30"
                min={1}
              />
            </div>
            <div>
              <HLabel>Цена/день (центы)</HLabel>
              <HInput
                type="number"
                value={createForm.dailyPrice}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    dailyPrice: e.target.value ? Number(e.target.value) : '',
                  })
                }
                placeholder="5000"
                min={0}
              />
            </div>
            <div>
              <HLabel>Валюта</HLabel>
              <HInput
                type="text"
                value={createForm.currency}
                onChange={(e) =>
                  setCreateForm({ ...createForm, currency: e.target.value })
                }
                placeholder="USD"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <HToggle
                checked={createForm.isActive}
                onChange={(v) =>
                  setCreateForm({ ...createForm, isActive: v })
                }
                label="Активен"
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              style={{
                height: 40,
                borderRadius: 49,
                border: 'none',
                padding: '0 28px',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: H.font,
                background: `linear-gradient(135deg, ${H.purpleLight}, ${H.purple})`,
                color: '#fff',
                cursor: creating ? 'not-allowed' : 'pointer',
                opacity: creating ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(67,24,255,0.25)',
              }}
            >
              {creating ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: H.shadow,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
            fontFamily: H.font,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${H.grayLight}`,
              }}
            >
              {['#', 'Название', 'Авто', 'Дни', 'Цена/день', 'Статус', ''].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '14px 20px',
                      textAlign: i === 6 ? 'right' : 'left',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: H.gray,
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${H.grayLight}` }}
                >
                  <td colSpan={7} style={{ padding: '16px 20px' }}>
                    <div
                      style={{
                        height: 16,
                        borderRadius: 8,
                        background: H.bg,
                        animation: 'pulse 1.5s infinite',
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: H.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Tag
                        style={{ width: 22, height: 22, color: H.gray }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: H.gray,
                        fontFamily: H.font,
                        margin: 0,
                      }}
                    >
                      Тарифов не найдено
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((rp) =>
                editingId === rp.id ? (
                  <tr
                    key={rp.id}
                    style={{
                      borderBottom: `1px solid ${H.grayLight}`,
                      background: H.bg,
                    }}
                  >
                    <td
                      style={{
                        padding: '12px 20px',
                        fontWeight: 700,
                        color: H.navy,
                      }}
                    >
                      {rp.id}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <HInput
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        style={{ minWidth: 120, background: H.white }}
                      />
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <IosSelect
                        className="w-full min-w-[140px] text-sm"
                        triggerClassName={`h-[42px] rounded-[16px] border-none text-[13px] font-medium ${isDark ? 'bg-[#1A2332]' : 'bg-white'}`}
                        value={editForm.carId ? String(editForm.carId) : ''}
                        onChange={(v) =>
                          setEditForm({
                            ...editForm,
                            carId: v ? Number(v) : '',
                          })
                        }
                        placeholder="-- Авто --"
                        options={cars.map((c) => ({
                          value: String(c.id),
                          label: `${c.brand} ${c.model} (${c.plateNumber})`,
                        }))}
                      />
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <HInput
                          type="number"
                          value={editForm.minDays}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              minDays: e.target.value
                                ? Number(e.target.value)
                                : '',
                            })
                          }
                          min={1}
                          style={{ width: 65, background: H.white }}
                        />
                        <span
                          style={{
                            color: H.gray,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          –
                        </span>
                        <HInput
                          type="number"
                          value={editForm.maxDays}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              maxDays: e.target.value
                                ? Number(e.target.value)
                                : '',
                            })
                          }
                          min={1}
                          style={{ width: 65, background: H.white }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <HInput
                          type="number"
                          value={editForm.dailyPrice}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              dailyPrice: e.target.value
                                ? Number(e.target.value)
                                : '',
                            })
                          }
                          min={0}
                          style={{ width: 90, background: H.white }}
                        />
                        <HInput
                          type="text"
                          value={editForm.currency}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              currency: e.target.value,
                            })
                          }
                          style={{ width: 65, background: H.white }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <HToggle
                        checked={editForm.isActive}
                        onChange={(v) =>
                          setEditForm({ ...editForm, isActive: v })
                        }
                        label=""
                      />
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 6,
                        }}
                      >
                        <ActionButton
                          icon={Check}
                          onClick={() => handleSave(rp.id)}
                          disabled={saving}
                          title="Сохранить"
                          variant="success"
                        />
                        <ActionButton
                          icon={X}
                          onClick={cancelEdit}
                          title="Отмена"
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={rp.id}
                    style={{
                      borderBottom: `1px solid ${H.grayLight}`,
                      transition: 'background 0.15s',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = H.bg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td
                      style={{
                        padding: '16px 20px',
                        fontWeight: 700,
                        color: H.gray,
                        fontSize: 12,
                      }}
                    >
                      {rp.id}
                    </td>
                    <td
                      style={{
                        padding: '16px 20px',
                        fontWeight: 700,
                        color: H.navy,
                      }}
                    >
                      {rp.name}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {rp.car ? (
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Car
                              style={{
                                width: 14,
                                height: 14,
                                color: H.purple,
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                color: H.navy,
                              }}
                            >
                              {rp.car.brand} {rp.car.model}
                            </span>
                          </div>
                          {rp.car.plateNumber && (
                            <span
                              style={{
                                display: 'inline-block',
                                marginTop: 3,
                                fontSize: 11,
                                fontWeight: 600,
                                color: H.gray,
                                background: H.bg,
                                padding: '2px 8px',
                                borderRadius: 6,
                                fontFamily: 'monospace',
                              }}
                            >
                              {rp.car.plateNumber}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: H.gray }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 12px',
                          borderRadius: 49,
                          background: H.bg,
                          fontWeight: 700,
                          color: H.navy,
                          fontSize: 12,
                        }}
                      >
                        <Calendar
                          style={{ width: 12, height: 12, color: H.gray }}
                        />
                        {rp.minDays}–{rp.maxDays === 0 ? '∞' : rp.maxDays}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '16px 20px',
                        fontWeight: 700,
                        color: H.navy,
                        fontSize: 14,
                      }}
                    >
                      {formatMoney(rp.dailyPrice, rp.currency)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge active={rp.isActive} />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 6,
                        }}
                      >
                        <ActionButton
                          icon={Pencil}
                          onClick={() => startEdit(rp)}
                          title="Редактировать"
                        />
                        <ActionButton
                          icon={Trash2}
                          onClick={() => handleDelete(rp.id)}
                          title="Удалить"
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
