'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { Plus, Pencil, Trash2, X, Shield, DollarSign } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { CoveragePackage } from './pricing-types';
import { HInput, HTextarea, HLabel, HToggle, StatusBadge, ActionButton } from './PricingUI';

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

export function CoverageSection({
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
