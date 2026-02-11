'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { IosSelect } from '@/components/admin/ios-select';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  DollarSign,
  Package,
  Shield,
  Tag,
  Car,
  Calendar,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

/* ── Types ── */

interface RatePlanCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}

interface RatePlan {
  id: number;
  name: string;
  carId: number;
  minDays: number;
  maxDays: number;
  dailyPrice: number;
  currency: string;
  isActive: boolean;
  car: RatePlanCar;
}

interface AddOn {
  id: number;
  name: string;
  pricingMode: string;
  unitPriceMinor: number;
  currency: string;
  isActive: boolean;
}

interface CoveragePackage {
  id: number;
  name: string;
  depositPercent: number;
  description: string | null;
  isActive: boolean;
}

type TabKey = 'ratePlans' | 'addOns' | 'coveragePackages';

const TABS: { key: TabKey; label: string; icon: typeof DollarSign }[] = [
  { key: 'ratePlans', label: 'Тарифы', icon: Tag },
  { key: 'addOns', label: 'Доп. услуги', icon: Package },
  { key: 'coveragePackages', label: 'Покрытие', icon: Shield },
];

const PRICING_MODES = ['PER_DAY', 'ONE_TIME', 'MANUAL_QTY'] as const;

const PRICING_MODE_LABELS: Record<string, string> = {
  PER_DAY: 'За день',
  ONE_TIME: 'Разово',
  MANUAL_QTY: 'За кол-во',
};

function formatMoney(minor: number, currency: string) {
  return `${(minor / 100).toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ${currency}`;
}

/* ── Shared Horizon UI components ── */

function HInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { H } = useAdminTheme();
  return (
    <input
      {...props}
      style={{
        width: '100%',
        height: 42,
        borderRadius: 16,
        border: 'none',
        background: H.bg,
        padding: '0 16px',
        fontSize: 13,
        fontWeight: 500,
        color: H.navy,
        fontFamily: H.font,
        outline: 'none',
        transition: 'box-shadow 0.15s',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px rgba(67,24,255,0.15)`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

function HTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { H } = useAdminTheme();
  return (
    <textarea
      {...props}
      style={{
        width: '100%',
        minHeight: 70,
        borderRadius: 16,
        border: 'none',
        background: H.bg,
        padding: '12px 16px',
        fontSize: 13,
        fontWeight: 500,
        color: H.navy,
        fontFamily: H.font,
        outline: 'none',
        resize: 'vertical',
        transition: 'box-shadow 0.15s',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px rgba(67,24,255,0.15)`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

function HLabel({ children }: { children: React.ReactNode }) {
  const { H } = useAdminTheme();
  return (
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: H.gray,
        marginBottom: 6,
        fontFamily: H.font,
      }}
    >
      {children}
    </label>
  );
}

function HToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  const { H } = useAdminTheme();
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontFamily: H.font,
      }}
    >
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: checked
            ? `linear-gradient(135deg, ${H.purpleLight}, ${H.purple})`
            : H.grayLight,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: H.white,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            transition: 'left 0.2s',
          }}
        />
      </button>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 500, color: H.navy }}>
          {label}
        </span>
      )}
    </label>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  const { H } = useAdminTheme();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 49,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: H.font,
        background: active ? H.greenBg : H.bg,
        color: active ? H.green : H.gray,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: active ? H.green : H.gray,
        }}
      />
      {active ? 'Активен' : 'Неактивен'}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  onClick,
  title,
  variant = 'default',
  disabled,
}: {
  icon: typeof Pencil;
  onClick: () => void;
  title: string;
  variant?: 'default' | 'danger' | 'success';
  disabled?: boolean;
}) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const colors = {
    default: { bg: H.bg, color: H.navy, hoverBg: isDark ? 'rgba(255,255,255,0.06)' : '#E9EDF7' },
    danger: { bg: H.redBg, color: H.red, hoverBg: isDark ? 'rgba(252,129,129,0.15)' : '#FFE0DE' },
    success: { bg: H.greenBg, color: H.green, hoverBg: isDark ? 'rgba(72,187,120,0.15)' : '#D0FFE8' },
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 10,
        border: 'none',
        background: colors.bg,
        color: colors.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = colors.hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.bg;
      }}
    >
      <Icon style={{ width: 15, height: 15 }} />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   Rate Plans
   ══════════════════════════════════════════════════════════ */

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

function RatePlansSection({
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

/* ══════════════════════════════════════════════════════════
   Add-Ons
   ══════════════════════════════════════════════════════════ */

interface AddOnFormData {
  name: string;
  pricingMode: string;
  unitPriceMinor: number | '';
  currency: string;
  isActive: boolean;
}

const emptyAddOn: AddOnFormData = {
  name: '',
  pricingMode: 'PER_DAY',
  unitPriceMinor: '',
  currency: 'USD',
  isActive: true,
};

function AddOnsSection({
  items,
  loading,
  onRefresh,
}: {
  items: AddOn[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<AddOnFormData>({
    ...emptyAddOn,
  });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AddOnFormData>({ ...emptyAddOn });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!createForm.name || createForm.unitPriceMinor === '') return;
    setCreating(true);
    try {
      await adminApiClient.post('/pricing/add-on', {
        name: createForm.name,
        pricingMode: createForm.pricingMode,
        unitPriceMinor: Number(createForm.unitPriceMinor),
        currency: createForm.currency,
        isActive: createForm.isActive,
      });
      setCreateForm({ ...emptyAddOn });
      setShowCreate(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (ao: AddOn) => {
    setEditingId(ao.id);
    setEditForm({
      name: ao.name,
      pricingMode: ao.pricingMode,
      unitPriceMinor: ao.unitPriceMinor,
      currency: ao.currency,
      isActive: ao.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: number) => {
    if (!editForm.name || editForm.unitPriceMinor === '') return;
    setSaving(true);
    try {
      await adminApiClient.patch(`/pricing/add-on/${id}`, {
        name: editForm.name,
        pricingMode: editForm.pricingMode,
        unitPriceMinor: Number(editForm.unitPriceMinor),
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
    if (!confirm('Удалить доп. услугу?')) return;
    try {
      await adminApiClient.delete(`/pricing/add-on/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
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
          Доп. услуги
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowCreate(!showCreate);
            if (!showCreate) setCreateForm({ ...emptyAddOn });
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
              ? { background: H.bg, color: H.gray }
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

      {/* Create card */}
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
            Новая доп. услуга
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
                placeholder="Название услуги"
              />
            </div>
            <div>
              <HLabel>Режим</HLabel>
              <IosSelect
                className="w-full text-sm"
                triggerClassName={`h-[42px] rounded-[16px] border-none text-[13px] font-medium ${isDark ? 'bg-[#111827]' : 'bg-[#F4F7FE]'}`}
                value={createForm.pricingMode}
                onChange={(v) =>
                  setCreateForm({ ...createForm, pricingMode: v })
                }
                options={PRICING_MODES.map((m) => ({
                  value: m,
                  label: PRICING_MODE_LABELS[m] || m,
                }))}
              />
            </div>
            <div>
              <HLabel>Цена (центы)</HLabel>
              <HInput
                type="number"
                value={createForm.unitPriceMinor}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    unitPriceMinor: e.target.value
                      ? Number(e.target.value)
                      : '',
                  })
                }
                placeholder="500"
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
                label="Активна"
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
            <tr style={{ borderBottom: `1px solid ${H.grayLight}` }}>
              {['#', 'Название', 'Режим', 'Цена', 'Статус', ''].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '14px 20px',
                      textAlign: i === 5 ? 'right' : 'left',
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
                  <td colSpan={6} style={{ padding: '16px 20px' }}>
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
                  colSpan={6}
                  style={{ padding: '48px 20px', textAlign: 'center' }}
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
                      <Package
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
                      Доп. услуг не найдено
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((ao) =>
                editingId === ao.id ? (
                  <tr
                    key={ao.id}
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
                      {ao.id}
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
                        className="w-full min-w-[120px] text-sm"
                        triggerClassName={`h-[42px] rounded-[16px] border-none text-[13px] font-medium ${isDark ? 'bg-[#1A2332]' : 'bg-white'}`}
                        value={editForm.pricingMode}
                        onChange={(v) =>
                          setEditForm({ ...editForm, pricingMode: v })
                        }
                        options={PRICING_MODES.map((m) => ({
                          value: m,
                          label: PRICING_MODE_LABELS[m] || m,
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
                          value={editForm.unitPriceMinor}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              unitPriceMinor: e.target.value
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
                          onClick={() => handleSave(ao.id)}
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
                    key={ao.id}
                    style={{
                      borderBottom: `1px solid ${H.grayLight}`,
                      transition: 'background 0.15s',
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
                      {ao.id}
                    </td>
                    <td
                      style={{
                        padding: '16px 20px',
                        fontWeight: 700,
                        color: H.navy,
                      }}
                    >
                      {ao.name}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: 49,
                          fontSize: 11,
                          fontWeight: 700,
                          background: `linear-gradient(135deg, rgba(134,140,255,0.12), rgba(67,24,255,0.12))`,
                          color: H.purple,
                        }}
                      >
                        {PRICING_MODE_LABELS[ao.pricingMode] || ao.pricingMode}
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
                      {formatMoney(ao.unitPriceMinor, ao.currency)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge active={ao.isActive} />
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
                          onClick={() => startEdit(ao)}
                          title="Редактировать"
                        />
                        <ActionButton
                          icon={Trash2}
                          onClick={() => handleDelete(ao.id)}
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

/* ══════════════════════════════════════════════════════════
   Coverage Packages
   ══════════════════════════════════════════════════════════ */

interface CoverageFormData {
  name: string;
  depositPercent: number | '';
  description: string;
  isActive: boolean;
}

const emptyCoverage: CoverageFormData = {
  name: '',
  depositPercent: '',
  description: '',
  isActive: true,
};

function CoverageSection({
  items,
  loading,
  onRefresh,
}: {
  items: CoveragePackage[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CoverageFormData>({
    ...emptyCoverage,
  });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CoverageFormData>({
    ...emptyCoverage,
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!createForm.name || createForm.depositPercent === '') return;
    setCreating(true);
    try {
      await adminApiClient.post('/pricing/coverage-package', {
        name: createForm.name,
        depositPercent: Number(createForm.depositPercent),
        description: createForm.description || null,
        isActive: createForm.isActive,
      });
      setCreateForm({ ...emptyCoverage });
      setShowCreate(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cp: CoveragePackage) => {
    setEditingId(cp.id);
    setEditForm({
      name: cp.name,
      depositPercent: cp.depositPercent,
      description: cp.description || '',
      isActive: cp.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: number) => {
    if (!editForm.name || editForm.depositPercent === '') return;
    setSaving(true);
    try {
      await adminApiClient.patch(`/pricing/coverage-package/${id}`, {
        name: editForm.name,
        depositPercent: Number(editForm.depositPercent),
        description: editForm.description || null,
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
    if (!confirm('Удалить пакет покрытия?')) return;
    try {
      await adminApiClient.delete(`/pricing/coverage-package/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
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
          Покрытие
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowCreate(!showCreate);
            if (!showCreate) setCreateForm({ ...emptyCoverage });
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
              ? { background: H.bg, color: H.gray }
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

      {/* Create card */}
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
            Новый пакет покрытия
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
                placeholder="Название пакета"
              />
            </div>
            <div>
              <HLabel>Залог (%)</HLabel>
              <HInput
                type="number"
                value={createForm.depositPercent}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    depositPercent: e.target.value
                      ? Number(e.target.value)
                      : '',
                  })
                }
                placeholder="10"
                min={0}
                max={100}
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
          <div style={{ marginTop: 16 }}>
            <HLabel>Описание</HLabel>
            <HTextarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  description: e.target.value,
                })
              }
              placeholder="Описание пакета покрытия"
              rows={2}
            />
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

      {/* Cards grid instead of table for coverage */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: H.white,
                borderRadius: 20,
                padding: 24,
                boxShadow: H.shadow,
                height: 140,
              }}
            >
              <div
                style={{
                  height: 16,
                  width: '60%',
                  borderRadius: 8,
                  background: H.bg,
                  animation: 'pulse 1.5s infinite',
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  height: 12,
                  width: '40%',
                  borderRadius: 8,
                  background: H.bg,
                  animation: 'pulse 1.5s infinite',
                }}
              />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            background: H.white,
            borderRadius: 20,
            padding: 48,
            boxShadow: H.shadow,
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
              <Shield style={{ width: 22, height: 22, color: H.gray }} />
            </div>
            <p
              style={{
                fontSize: 14,
                color: H.gray,
                fontFamily: H.font,
                margin: 0,
              }}
            >
              Пакетов покрытия не найдено
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {items.map((cp) =>
            editingId === cp.id ? (
              <div
                key={cp.id}
                style={{
                  background: H.white,
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: H.shadow,
                  border: `2px solid ${H.purple}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div>
                    <HLabel>Название</HLabel>
                    <HInput
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <HLabel>Залог (%)</HLabel>
                    <HInput
                      type="number"
                      value={editForm.depositPercent}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          depositPercent: e.target.value
                            ? Number(e.target.value)
                            : '',
                        })
                      }
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <HLabel>Описание</HLabel>
                    <HTextarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Описание"
                    />
                  </div>
                  <HToggle
                    checked={editForm.isActive}
                    onChange={(v) =>
                      setEditForm({ ...editForm, isActive: v })
                    }
                    label="Активен"
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={cancelEdit}
                      style={{
                        height: 36,
                        borderRadius: 49,
                        border: 'none',
                        padding: '0 20px',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: H.font,
                        background: H.bg,
                        color: H.gray,
                        cursor: 'pointer',
                      }}
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(cp.id)}
                      disabled={saving}
                      style={{
                        height: 36,
                        borderRadius: 49,
                        border: 'none',
                        padding: '0 20px',
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: H.font,
                        background: `linear-gradient(135deg, ${H.purpleLight}, ${H.purple})`,
                        color: '#fff',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={cp.id}
                style={{
                  background: H.white,
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: H.shadow,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = H.shadowMd;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = H.shadow;
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, rgba(134,140,255,0.15), rgba(67,24,255,0.15))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Shield
                        style={{
                          width: 20,
                          height: 20,
                          color: H.purple,
                        }}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: H.navy,
                          fontFamily: H.font,
                          margin: '0 0 4px',
                        }}
                      >
                        {cp.name}
                      </h3>
                      <StatusBadge active={cp.isActive} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <ActionButton
                      icon={Pencil}
                      onClick={() => startEdit(cp)}
                      title="Редактировать"
                    />
                    <ActionButton
                      icon={Trash2}
                      onClick={() => handleDelete(cp.id)}
                      title="Удалить"
                      variant="danger"
                    />
                  </div>
                </div>

                {/* Deposit badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 49,
                    background: H.orangeBg,
                    marginBottom: cp.description ? 12 : 0,
                  }}
                >
                  <DollarSign
                    style={{ width: 14, height: 14, color: H.orange }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isDark ? '#F6AD55' : '#C87800',
                      fontFamily: H.font,
                    }}
                  >
                    Залог: {cp.depositPercent}%
                  </span>
                </div>

                {/* Description */}
                {cp.description && (
                  <p
                    style={{
                      fontSize: 13,
                      color: H.gray,
                      fontFamily: H.font,
                      margin: '12px 0 0',
                      lineHeight: 1.5,
                    }}
                  >
                    {cp.description}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════════════════════ */

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
