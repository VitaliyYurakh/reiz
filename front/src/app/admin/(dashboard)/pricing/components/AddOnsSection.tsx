'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { IosSelect } from '@/components/admin/IosSelect';
import { Plus, Pencil, Trash2, X, Check, Package } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { AddOn } from './pricing-types';
import { PRICING_MODES, PRICING_MODE_LABELS, formatMoney } from './pricing-types';
import { HInput, HLabel, HToggle, StatusBadge, ActionButton } from './PricingUI';

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

export function AddOnsSection({
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
