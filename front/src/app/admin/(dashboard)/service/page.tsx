'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient, getAllCars } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { IosSelect } from '@/components/admin/ios-select';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Wrench,
  ShieldCheck,
  Car,
  Droplets,
  ClipboardCheck,
  Settings2,
  AlertTriangle,
} from 'lucide-react';

/* ── Types ── */

interface ServiceEventCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}

interface ServiceEvent {
  id: number;
  type: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  blocksBooking: boolean;
  costMinor: number | null;
  currency: string | null;
  vendor: string | null;
  notes: string | null;
  car: ServiceEventCar;
}

interface CarOption {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}

interface FormData {
  carId: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  blocksBooking: boolean;
  costMinor: string;
  currency: string;
  vendor: string;
  notes: string;
}

const SERVICE_TYPES = ['MAINTENANCE', 'REPAIR', 'INSURANCE_RENEWAL', 'INSPECTION_GOV', 'WASH', 'OTHER'] as const;
const CURRENCIES = ['UAH', 'USD', 'EUR', 'ILS'] as const;

const TYPE_LABEL_KEYS: Record<string, string> = {
  MAINTENANCE: 'service.typeMaintenance',
  REPAIR: 'service.typeRepair',
  INSURANCE_RENEWAL: 'service.typeInsurance',
  INSPECTION_GOV: 'service.typeGovInspection',
  WASH: 'service.typeWash',
  OTHER: 'service.typeOther',
};

const TYPE_BADGE_CLASS: Record<string, string> = {
  MAINTENANCE: 'h-badge-purple',
  REPAIR: 'h-badge-orange',
  INSURANCE_RENEWAL: 'h-badge-green',
  INSPECTION_GOV: 'h-badge-blue',
  WASH: 'h-badge-cyan',
  OTHER: 'h-badge-gray',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  MAINTENANCE: <Wrench size={14} />,
  REPAIR: <Settings2 size={14} />,
  INSURANCE_RENEWAL: <ShieldCheck size={14} />,
  INSPECTION_GOV: <ClipboardCheck size={14} />,
  WASH: <Droplets size={14} />,
  OTHER: <AlertTriangle size={14} />,
};

const EMPTY_FORM: FormData = {
  carId: '',
  type: 'MAINTENANCE',
  description: '',
  startDate: '',
  endDate: '',
  blocksBooking: true,
  costMinor: '',
  currency: 'ILS',
  vendor: '',
  notes: '',
};

function formatMoney(minor: number, currency: string) {
  return `${(minor / 100).toLocaleString('he-IL', { minimumFractionDigits: 2 })} ${currency}`;
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  const dt = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

/* ── Component ── */

export default function ServicePage() {
  const { t } = useAdminLocale();
  const [items, setItems] = useState<ServiceEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const limit = 20;

  const [cars, setCars] = useState<CarOption[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<FormData>({ ...EMPTY_FORM });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormData>({ ...EMPTY_FORM });

  /* Fetch cars list */
  useEffect(() => {
    getAllCars()
      .then((data) =>
        setCars(
          data.cars.map((c: any) => ({
            id: c.id,
            brand: c.brand,
            model: c.model,
            plateNumber: c.plateNumber,
          }))
        )
      )
      .catch((err) => console.error('Failed to load cars', err));
  }, []);

  /* Fetch service events */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      const res = await adminApiClient.get(`/service-event?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  /* ── Create ── */

  const handleCreateChange = (field: keyof FormData, value: string | boolean) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!createForm.description.trim() || !createForm.startDate || !createForm.carId) return;
    setSaving(true);
    try {
      const body: Record<string, any> = {
        carId: Number(createForm.carId),
        type: createForm.type,
        description: createForm.description.trim(),
        startDate: new Date(createForm.startDate).toISOString(),
        blocksBooking: createForm.blocksBooking,
      };
      if (createForm.endDate) body.endDate = new Date(createForm.endDate).toISOString();
      if (createForm.costMinor) body.costMinor = Math.round(parseFloat(createForm.costMinor) * 100);
      if (createForm.currency) body.currency = createForm.currency;
      if (createForm.vendor.trim()) body.vendor = createForm.vendor.trim();
      if (createForm.notes.trim()) body.notes = createForm.notes.trim();

      await adminApiClient.post('/service-event', body);
      setCreateForm({ ...EMPTY_FORM });
      setShowCreate(false);
      await fetchData();
    } catch (err) {
      console.error('Create failed', err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit ── */

  const startEditing = (ev: ServiceEvent) => {
    setEditingId(ev.id);
    setEditForm({
      carId: String(ev.car?.id ?? ''),
      type: ev.type,
      description: ev.description ?? '',
      startDate: toDatetimeLocal(ev.startDate),
      endDate: toDatetimeLocal(ev.endDate),
      blocksBooking: ev.blocksBooking,
      costMinor: ev.costMinor != null ? (ev.costMinor / 100).toFixed(2) : '',
      currency: ev.currency ?? 'ILS',
      vendor: ev.vendor ?? '',
      notes: ev.notes ?? '',
    });
  };

  const cancelEditing = () => setEditingId(null);

  const handleEditChange = (field: keyof FormData, value: string | boolean) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    if (!editForm.description.trim() || !editForm.startDate || !editForm.carId) return;
    setSaving(true);
    try {
      const body: Record<string, any> = {
        carId: Number(editForm.carId),
        type: editForm.type,
        description: editForm.description.trim(),
        startDate: new Date(editForm.startDate).toISOString(),
        blocksBooking: editForm.blocksBooking,
      };
      if (editForm.endDate) {
        body.endDate = new Date(editForm.endDate).toISOString();
      } else {
        body.endDate = null;
      }
      if (editForm.costMinor) {
        body.costMinor = Math.round(parseFloat(editForm.costMinor) * 100);
      } else {
        body.costMinor = null;
      }
      body.currency = editForm.currency || null;
      body.vendor = editForm.vendor.trim() || null;
      body.notes = editForm.notes.trim() || null;

      await adminApiClient.patch(`/service-event/${editingId}`, body);
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error('Edit failed', err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */

  const handleDelete = async (id: number) => {
    if (!confirm(t('service.deleteConfirm'))) return;
    try {
      await adminApiClient.delete(`/service-event/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  /* ── Pagination helpers ── */

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  /* ── Render ── */

  const colSpan = 10;

  return (
    <div className="h-page">
      {/* Header card */}
      <div className="h-header justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-icon-box h-icon-box-orange">
            <Wrench size={24} />
          </div>
          <div>
            <h1 className="h-title">{t('service.pageTitle')}</h1>
            <span className="h-subtitle">{t('service.pageSubtitle')}</span>
          </div>
          <div className="h-count ml-3">
            {total} {t('service.records')}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreate((v) => !v);
            if (showCreate) setCreateForm({ ...EMPTY_FORM });
          }}
          className={`h-btn ${showCreate ? 'h-btn-danger' : 'h-btn-primary'}`}
        >
          {showCreate ? <X size={18} /> : <Plus size={18} />}
          {showCreate ? t('service.cancelBtn') : t('service.eventBtn')}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="h-card p-7 mb-6">
          <h2 className="text-[17px] font-bold text-h-navy mb-5">
            {t('service.newEventTitle')}
          </h2>
          <div className="h-form-grid">
            {/* Car */}
            <div>
              <label className="h-label">{t('service.carLabel')}</label>
              <IosSelect
                className="w-full text-sm"
                value={createForm.carId}
                onChange={(v) => handleCreateChange('carId', v)}
                placeholder={t('service.selectCar')}
                options={[
                  { value: '', label: t('service.selectCar') },
                  ...cars.map((c) => ({
                    value: String(c.id),
                    label: `${c.brand} ${c.model} — ${c.plateNumber}`,
                  })),
                ]}
              />
            </div>

            {/* Type */}
            <div>
              <label className="h-label">{t('service.typeLabel')}</label>
              <IosSelect
                className="w-full text-sm"
                value={createForm.type}
                onChange={(v) => handleCreateChange('type', v)}
                options={SERVICE_TYPES.map((tp) => ({
                  value: tp,
                  label: t(TYPE_LABEL_KEYS[tp]) || tp,
                }))}
              />
            </div>

            {/* Description */}
            <div>
              <label className="h-label">{t('service.descriptionLabel')}</label>
              <input
                type="text"
                className="h-input"
                placeholder={t('service.descriptionPlaceholder')}
                value={createForm.description}
                onChange={(e) => handleCreateChange('description', e.target.value)}
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="h-label">{t('service.startLabel')}</label>
              <input
                type="datetime-local"
                className="h-input"
                value={createForm.startDate}
                onChange={(e) => handleCreateChange('startDate', e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="h-label">{t('service.endLabel')}</label>
              <input
                type="datetime-local"
                className="h-input"
                value={createForm.endDate}
                onChange={(e) => handleCreateChange('endDate', e.target.value)}
                min={createForm.startDate || undefined}
              />
            </div>

            {/* Blocks booking */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 text-sm text-h-navy cursor-pointer">
                <div
                  className={`h-toggle ${createForm.blocksBooking ? 'h-toggle-on' : 'h-toggle-off'}`}
                  onClick={() => handleCreateChange('blocksBooking', !createForm.blocksBooking)}
                >
                  <div
                    className="h-toggle-dot"
                    style={{ left: createForm.blocksBooking ? 22 : 2 }}
                  />
                </div>
                {t('service.blocksBooking')}
              </label>
            </div>

            {/* Cost */}
            <div>
              <label className="h-label">{t('service.costLabel2')}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="h-input"
                placeholder="0.00"
                value={createForm.costMinor}
                onChange={(e) => handleCreateChange('costMinor', e.target.value)}
              />
            </div>

            {/* Currency */}
            <div>
              <label className="h-label">{t('service.currencyLabel')}</label>
              <IosSelect
                className="w-full text-sm"
                value={createForm.currency}
                onChange={(v) => handleCreateChange('currency', v)}
                options={CURRENCIES.map((c) => ({
                  value: c,
                  label: c,
                }))}
              />
            </div>

            {/* Vendor */}
            <div>
              <label className="h-label">{t('service.vendorLabel')}</label>
              <input
                type="text"
                className="h-input"
                placeholder={t('service.vendorPlaceholder')}
                value={createForm.vendor}
                onChange={(e) => handleCreateChange('vendor', e.target.value)}
              />
            </div>
          </div>

          {/* Notes (full width) */}
          <div className="mt-4">
            <label className="h-label">{t('service.notesLabel')}</label>
            <textarea
              className="h-textarea"
              placeholder={t('service.notesPlaceholder')}
              value={createForm.notes}
              onChange={(e) => handleCreateChange('notes', e.target.value)}
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              disabled={saving || !createForm.carId || !createForm.description.trim() || !createForm.startDate}
              onClick={handleCreate}
              className="h-btn h-btn-primary"
            >
              {saving ? t('common.saving') : t('common.create')}
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                {[t('service.thId'), t('service.thType'), t('service.thDescription'), t('service.thCar'), t('service.thStart'), t('service.thEnd'), t('service.thBlocks'), t('service.thCost'), t('service.thVendor'), t('service.thActions')].map(
                  (col, idx) => (
                    <th key={idx} className="h-th">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td colSpan={colSpan} className="h-td">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="h-empty">
                    <Wrench size={40} className="h-empty-icon" />
                    <div>{t('service.emptyTitle')}</div>
                  </td>
                </tr>
              ) : (
                items.map((ev) => {
                  const isEditing = editingId === ev.id;
                  const badgeClass = TYPE_BADGE_CLASS[ev.type] || TYPE_BADGE_CLASS.OTHER;

                  if (isEditing) {
                    return (
                      <tr key={ev.id} className="h-tr-edit">
                        <td className="h-td-edit h-td-id">
                          {ev.id}
                        </td>
                        <td className="h-td-edit">
                          <IosSelect
                            className="w-full text-sm"
                            value={editForm.type}
                            onChange={(v) => handleEditChange('type', v)}
                            options={SERVICE_TYPES.map((tp) => ({
                              value: tp,
                              label: t(TYPE_LABEL_KEYS[tp]) || tp,
                            }))}
                          />
                        </td>
                        <td className="h-td-edit">
                          <input
                            type="text"
                            className="h-input min-w-[140px]"
                            value={editForm.description}
                            onChange={(e) => handleEditChange('description', e.target.value)}
                          />
                        </td>
                        <td className="h-td-edit">
                          <IosSelect
                            className="w-full text-sm"
                            value={editForm.carId}
                            onChange={(v) => handleEditChange('carId', v)}
                            placeholder={t('finance.selectPlaceholder')}
                            options={[
                              { value: '', label: t('finance.selectPlaceholder') },
                              ...cars.map((c) => ({
                                value: String(c.id),
                                label: `${c.brand} ${c.model} — ${c.plateNumber}`,
                              })),
                            ]}
                          />
                        </td>
                        <td className="h-td-edit">
                          <input
                            type="datetime-local"
                            className="h-input min-w-[170px]"
                            value={editForm.startDate}
                            onChange={(e) => handleEditChange('startDate', e.target.value)}
                          />
                        </td>
                        <td className="h-td-edit">
                          <input
                            type="datetime-local"
                            className="h-input min-w-[170px]"
                            value={editForm.endDate}
                            onChange={(e) => handleEditChange('endDate', e.target.value)}
                            min={editForm.startDate || undefined}
                          />
                        </td>
                        <td className="h-td-edit">
                          <div
                            className={`h-toggle mt-1.5 ${editForm.blocksBooking ? 'h-toggle-on' : 'h-toggle-off'}`}
                            onClick={() => handleEditChange('blocksBooking', !editForm.blocksBooking)}
                          >
                            <div
                              className="h-toggle-dot"
                              style={{ left: editForm.blocksBooking ? 22 : 2 }}
                            />
                          </div>
                        </td>
                        <td className="h-td-edit">
                          <div className="flex gap-1">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="h-input min-w-[80px] w-[90px]"
                              placeholder="0.00"
                              value={editForm.costMinor}
                              onChange={(e) => handleEditChange('costMinor', e.target.value)}
                            />
                            <IosSelect
                              className="text-sm"
                              value={editForm.currency}
                              onChange={(v) => handleEditChange('currency', v)}
                              options={CURRENCIES.map((c) => ({
                                value: c,
                                label: c,
                              }))}
                            />
                          </div>
                        </td>
                        <td className="h-td-edit">
                          <input
                            type="text"
                            className="h-input min-w-[100px]"
                            placeholder={t('service.vendorLabel')}
                            value={editForm.vendor}
                            onChange={(e) => handleEditChange('vendor', e.target.value)}
                          />
                        </td>
                        <td className="h-td-edit">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              title={t('service.saveTitle')}
                              disabled={saving || !editForm.carId || !editForm.description.trim() || !editForm.startDate}
                              onClick={handleEditSave}
                              className="h-action-btn h-action-btn-save"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              title={t('service.cancelTitle')}
                              onClick={cancelEditing}
                              className="h-action-btn"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  const car = ev.car ? `${ev.car.brand} ${ev.car.model}` : '—';

                  return (
                    <tr key={ev.id} className="h-tr cursor-default">
                      <td className="h-td h-td-id">{ev.id}</td>
                      <td className="h-td">
                        <span className={`h-badge ${badgeClass}`}>
                          {TYPE_ICONS[ev.type]}
                          {t(TYPE_LABEL_KEYS[ev.type]) || ev.type}
                        </span>
                      </td>
                      <td className="h-td h-td-navy h-td-truncate">
                        {ev.description || '—'}
                      </td>
                      <td className="h-td">
                        <div className="flex items-center gap-2">
                          <div className="h-icon-box h-icon-box-sm bg-h-bg! text-h-gray!">
                            <Car size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-h-navy text-[13px] whitespace-nowrap">
                              {car}
                            </div>
                            {ev.car?.plateNumber && (
                              <div className="text-[11px] text-h-gray">{ev.car.plateNumber}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="h-td h-td-gray whitespace-nowrap">
                        {fmtDate(ev.startDate)}
                      </td>
                      <td className="h-td h-td-gray whitespace-nowrap">
                        {fmtDate(ev.endDate)}
                      </td>
                      <td className="h-td">
                        {ev.blocksBooking ? (
                          <span className="h-badge h-badge-sm h-badge-red">
                            {t('common.yes')}
                          </span>
                        ) : (
                          <span className="h-badge h-badge-sm h-badge-gray">
                            {t('common.no')}
                          </span>
                        )}
                      </td>
                      <td className="h-td font-medium text-h-navy whitespace-nowrap">
                        {ev.costMinor != null && ev.currency ? formatMoney(ev.costMinor, ev.currency) : '—'}
                      </td>
                      <td className="h-td h-td-gray">{ev.vendor || '—'}</td>
                      <td className="h-td">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            title={t('service.editTitle')}
                            onClick={() => startEditing(ev)}
                            className="h-action-btn"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            title={t('service.deleteTitle')}
                            onClick={() => handleDelete(ev.id)}
                            className="h-action-btn h-action-btn-delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="h-pagination">
            <span className="h-page-info">
              {t('service.pagination', { page: String(page), pages: String(totalPages) })}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-page-nav"
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`e${i}`} className="h-page-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`h-page-num ${page === p ? 'h-page-num-active' : ''}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-page-nav"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
