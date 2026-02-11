'use client';

import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { adminApiClient, getUsers, createUser, updateUser, changeUserPassword, deleteUser } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
  Users,
  Bell,
  Shield,
  Plus,
  Pencil,
  X,
  Save,
  Filter,
  Settings,
  MessageSquare,
  Mail,
  Trash2,
  Key,
} from 'lucide-react';

/* ── Types ── */

interface NotificationTemplate {
  id: number;
  code: string;
  channel: string;
  subject: string | null;
  bodyTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuditEntry {
  id: number;
  actorId: number | null;
  actor: { id: number; name: string; email: string } | null;
  entityType: string;
  entityId: number;
  action: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
}

interface UserProfile {
  id: number;
  email: string;
  role: string;
}

type TabKey = 'templates' | 'audit' | 'profile' | 'team';

const TABS: { key: TabKey; labelKey: string; icon: typeof Bell }[] = [
  { key: 'templates', labelKey: 'settings.tabTemplates', icon: Bell },
  { key: 'audit', labelKey: 'settings.tabAuditLog', icon: Shield },
  { key: 'team', labelKey: 'settings.tabTeam', icon: Users },
  { key: 'profile', labelKey: 'settings.tabProfile', icon: User },
];

const PERMISSION_MODULES = [
  { key: 'dashboard', labelKey: 'settings.modDashboard' },
  { key: 'requests', labelKey: 'settings.modRequests' },
  { key: 'reservations', labelKey: 'settings.modReservations' },
  { key: 'rentals', labelKey: 'settings.modRentals' },
  { key: 'calendar', labelKey: 'settings.modCalendar' },
  { key: 'clients', labelKey: 'settings.modClients' },
  { key: 'cars', labelKey: 'settings.modCars' },
  { key: 'locations', labelKey: 'settings.modLocations' },
  { key: 'pricing', labelKey: 'settings.modPricing' },
  { key: 'finance', labelKey: 'settings.modFinance' },
  { key: 'service', labelKey: 'settings.modService' },
  { key: 'reports', labelKey: 'settings.modReports' },
  { key: 'settings', labelKey: 'settings.modSettings' },
] as const;

type PermLevel = 'full' | 'view' | 'none';
type Permissions = Record<string, PermLevel>;

interface TeamUser {
  id: number;
  email: string;
  name: string;
  role: string;
  permissions: Permissions;
  isActive: boolean;
  createdAt: string;
}

const CHANNEL_MAP: Record<string, { label: string; badgeClass: string; icon: typeof MessageSquare }> = {
  TELEGRAM: { label: 'Telegram', badgeClass: 'h-badge h-badge-blue', icon: MessageSquare },
  EMAIL: { label: 'Email', badgeClass: 'h-badge h-badge-purple', icon: Mail },
};

const ACTION_MAP: Record<string, { labelKey: string; badgeClass: string }> = {
  CREATE: { labelKey: 'settings.actionCreate', badgeClass: 'h-badge h-badge-green' },
  UPDATE: { labelKey: 'settings.actionUpdate', badgeClass: 'h-badge h-badge-orange' },
  DELETE: { labelKey: 'settings.actionDelete', badgeClass: 'h-badge h-badge-red-solid' },
  STATUS_CHANGE: { labelKey: 'settings.actionStatusChange', badgeClass: 'h-badge h-badge-blue' },
};

const ENTITY_TYPES = [
  'Client', 'Rental', 'Reservation', 'RentalRequest', 'Car',
  'Transaction', 'Fine', 'Inspection', 'ServiceEvent', 'Document',
];

function fmtDateTime(d: string | null) {
  if (!d) return '—';
  const dt = new Date(d);
  return `${dt.toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${dt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}`;
}

/* ── Toggle Switch ── */

function Toggle({
  checked,
  onChange,
  size = 'md',
}: {
  checked: boolean;
  onChange: () => void;
  size?: 'sm' | 'md';
}) {
  const isSm = size === 'sm';
  const dotLeft = isSm
    ? (checked ? 18 : 2)
    : (checked ? 22 : 2);

  return (
    <div
      onClick={onChange}
      className={`h-toggle ${isSm ? 'h-toggle-sm' : ''} ${checked ? 'h-toggle-on' : 'h-toggle-off'}`}
    >
      <div
        className="h-toggle-dot"
        style={{ left: dotLeft }}
      />
    </div>
  );
}

/* ── Template Edit Modal ── */

function TemplateModal({
  template,
  onClose,
  onSaved,
}: {
  template: NotificationTemplate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useAdminLocale();
  const isNew = !template;
  const [code, setCode] = useState(template?.code ?? '');
  const [channel, setChannel] = useState(template?.channel ?? 'TELEGRAM');
  const [subject, setSubject] = useState(template?.subject ?? '');
  const [bodyTemplate, setBodyTemplate] = useState(template?.bodyTemplate ?? '');
  const [isActive, setIsActive] = useState(template?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!code.trim() || !bodyTemplate.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await adminApiClient.post('/notification/template', {
          code: code.trim(),
          channel,
          subject: subject.trim() || undefined,
          bodyTemplate: bodyTemplate.trim(),
          isActive,
        });
      } else {
        await adminApiClient.patch(`/notification/template/${template.id}`, {
          code: code.trim(),
          channel,
          subject: subject.trim() || null,
          bodyTemplate: bodyTemplate.trim(),
          isActive,
        });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-modal-overlay">
      <div className="h-modal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="h-modal-title">
            {isNew ? t('settings.newTemplateTitle') : t('settings.editTemplateTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="h-action-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.codeLabel')}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="new_request"
                className="h-input h-input-mono"
              />
            </div>
            <div>
              <label className="h-label">{t('settings.channelLabel')}</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="h-select"
              >
                <option value="TELEGRAM">Telegram</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
          </div>

          {channel === 'EMAIL' && (
            <div>
              <label className="h-label">{t('settings.emailSubjectLabel')}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('settings.emailSubjectPlaceholder')}
                className="h-input"
              />
            </div>
          )}

          <div>
            <label className="h-label">{t('settings.bodyTemplateLabel')}</label>
            <textarea
              value={bodyTemplate}
              onChange={(e) => setBodyTemplate(e.target.value)}
              placeholder={t('settings.bodyTemplatePlaceholder')}
              rows={6}
              className="h-textarea h-input-mono"
            />
            <p className="h-subtitle mt-1 text-[11px]">
              {t('settings.templateVars')}: {'{{clientName}}'}, {'{{carName}}'}, {'{{pickupDate}}'}, {'{{returnDate}}'}, {'{{contractNumber}}'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
            <span className="text-sm text-[var(--color-h-navy)]">{isActive ? t('settings.activeLabel') : t('settings.inactiveLabel')}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-btn h-btn-outline"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !code.trim() || !bodyTemplate.trim()}
            className="h-btn h-btn-primary"
          >
            <Save size={16} />
            {saving ? t('common.saving') : isNew ? t('common.create') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Notification Templates Tab ── */

function TemplatesTab() {
  const { t } = useAdminLocale();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<NotificationTemplate | null | undefined>(undefined);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await adminApiClient.get('/notification/template');
      setTemplates(res.data.templates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleToggleActive = async (tpl: NotificationTemplate) => {
    try {
      await adminApiClient.patch(`/notification/template/${tpl.id}`, { isActive: !tpl.isActive });
      await fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="h-subtitle">{t('settings.templatesCount', { n: String(templates.length) })}</span>
        <button
          type="button"
          onClick={() => setEditTarget(null)}
          className="h-btn h-btn-sm h-btn-primary"
        >
          <Plus size={16} />
          {t('settings.newTemplate')}
        </button>
      </div>

      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                {[
                  { key: 'code', label: t('settings.thCode') },
                  { key: 'channel', label: t('settings.thChannel') },
                  { key: 'subject', label: t('settings.thSubject') },
                  { key: 'template', label: t('settings.thTemplate') },
                  { key: 'status', label: t('settings.thStatus') },
                  { key: 'updated', label: t('settings.thUpdated') },
                  { key: 'actions', label: t('settings.thActions'), right: true },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`h-th ${col.right ? 'h-th-right' : ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td colSpan={7} className="h-td">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-empty">
                    <Bell size={40} className="h-empty-icon" />
                    <div>{t('settings.noTemplates')}</div>
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => {
                  const ch = CHANNEL_MAP[tpl.channel] || { label: tpl.channel, badgeClass: 'h-badge h-badge-gray', icon: MessageSquare };
                  const ChIcon = ch.icon;
                  return (
                    <tr
                      key={tpl.id}
                      className="h-tr"
                    >
                      <td className="h-td h-td-mono h-td-navy font-medium">
                        {tpl.code}
                      </td>
                      <td className="h-td">
                        <span className={ch.badgeClass}>
                          <ChIcon size={12} />
                          {ch.label}
                        </span>
                      </td>
                      <td className="h-td h-td-navy">{tpl.subject || '—'}</td>
                      <td className="h-td h-td-gray h-td-mono h-td-truncate max-w-[300px]">
                        {tpl.bodyTemplate}
                      </td>
                      <td className="h-td">
                        <Toggle checked={tpl.isActive} onChange={() => handleToggleActive(tpl)} size="sm" />
                      </td>
                      <td className="h-td h-td-gray whitespace-nowrap text-[13px]">
                        {fmtDateTime(tpl.updatedAt)}
                      </td>
                      <td className="h-td text-right">
                        <button
                          type="button"
                          onClick={() => setEditTarget(tpl)}
                          className="h-edit-btn"
                        >
                          <Pencil size={13} />
                          {t('settings.editBtn')}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editTarget !== undefined && (
        <TemplateModal template={editTarget} onClose={() => setEditTarget(undefined)} onSaved={fetchTemplates} />
      )}
    </div>
  );
}

/* ── Audit Log Tab ── */

function AuditTab() {
  const { t } = useAdminLocale();
  const [items, setItems] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const limit = 20;

  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filterAction) params.set('action', filterAction);
      if (filterEntity) params.set('entityType', filterEntity);
      if (filterFrom) params.set('from', filterFrom);
      if (filterTo) params.set('to', filterTo);
      const res = await adminApiClient.get(`/audit?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filterAction, filterEntity, filterFrom, filterTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / limit);
  const hasFilters = filterAction || filterEntity || filterFrom || filterTo;

  const clearFilters = () => {
    setFilterAction('');
    setFilterEntity('');
    setFilterFrom('');
    setFilterTo('');
    setPage(1);
  };

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="h-subtitle">{t('settings.totalRecords', { n: String(total) })}</span>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-reset-btn"
            >
              <X size={14} />
              {t('settings.resetFilters')}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-filter-btn ${showFilters ? 'h-filter-btn-on' : 'h-filter-btn-off'}`}
          >
            <Filter size={15} />
            {t('settings.filters')}
            {hasFilters && (
              <span
                className="h-filter-count"
                style={{
                  background: showFilters ? 'rgba(255,255,255,0.3)' : 'var(--color-h-purple)',
                  color: '#FFFFFF',
                }}
              >
                {[filterAction, filterEntity, filterFrom, filterTo].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="h-filter-panel grid grid-cols-4 gap-3.5">
          <div>
            <label className="h-label">{t('settings.filterAction')}</label>
            <select
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
              className="h-select"
            >
              <option value="">{t('settings.filterAll')}</option>
              {Object.entries(ACTION_MAP).map(([val, { labelKey }]) => (
                <option key={val} value={val}>{t(labelKey)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="h-label">{t('settings.filterEntity')}</label>
            <select
              value={filterEntity}
              onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }}
              className="h-select"
            >
              <option value="">{t('settings.filterAll')}</option>
              {ENTITY_TYPES.map((et) => (
                <option key={et} value={et}>{et}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="h-label">{t('settings.filterDateFrom')}</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => { setFilterFrom(e.target.value); setPage(1); }}
              className="h-input"
            />
          </div>
          <div>
            <label className="h-label">{t('settings.filterDateTo')}</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => { setFilterTo(e.target.value); setPage(1); }}
              className="h-input"
            />
          </div>
        </div>
      )}

      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                {[t('settings.thAuditId'), t('settings.thAuditAction'), t('settings.thAuditEntity'), t('settings.thAuditEntityId'), t('settings.thAuditAuthor'), t('settings.thAuditIp'), t('settings.thAuditDate'), ''].map((col, idx) => (
                  <th
                    key={idx}
                    className="h-th"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td colSpan={8} className="h-td">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-empty">
                    <Shield size={40} className="h-empty-icon" />
                    <div>{hasFilters ? t('settings.noAuditFiltered') : t('settings.noAuditEntries')}</div>
                  </td>
                </tr>
              ) : (
                items.map((a) => {
                  const act = ACTION_MAP[a.action] || { labelKey: a.action, badgeClass: 'h-badge h-badge-gray' };
                  const isExpanded = expandedId === a.id;
                  const hasDetails = a.before || a.after;

                  // Compute changed fields
                  const changedFields: { field: string; oldVal: any; newVal: any }[] = [];
                  if (a.before && a.after) {
                    const allKeys = new Set([...Object.keys(a.before), ...Object.keys(a.after)]);
                    for (const key of allKeys) {
                      const bv = a.before[key];
                      const av = a.after[key];
                      if (JSON.stringify(bv) !== JSON.stringify(av)) {
                        changedFields.push({ field: key, oldVal: bv, newVal: av });
                      }
                    }
                  } else if (a.after && !a.before) {
                    for (const [key, val] of Object.entries(a.after)) {
                      changedFields.push({ field: key, oldVal: undefined, newVal: val });
                    }
                  } else if (a.before && !a.after) {
                    for (const [key, val] of Object.entries(a.before)) {
                      changedFields.push({ field: key, oldVal: val, newVal: undefined });
                    }
                  }

                  const fmtVal = (v: any) => {
                    if (v === undefined || v === null) return '—';
                    if (typeof v === 'boolean') return v ? 'true' : 'false';
                    if (typeof v === 'object') return JSON.stringify(v);
                    return String(v);
                  };

                  return (
                    <Fragment key={a.id}>
                      <tr
                        className={`h-tr ${hasDetails ? 'cursor-pointer' : ''}`}
                        onClick={() => hasDetails && setExpandedId(isExpanded ? null : a.id)}
                      >
                        <td className="h-td h-td-id">{a.id}</td>
                        <td className="h-td">
                          <span className={act.badgeClass}>
                            {t(act.labelKey)}
                          </span>
                        </td>
                        <td className="h-td h-td-mono h-td-navy">
                          {a.entityType}
                        </td>
                        <td className="h-td h-td-navy">{a.entityId}</td>
                        <td className="h-td h-td-navy">{a.actor ? (a.actor.name || a.actor.email) : t('settings.auditSystem')}</td>
                        <td className="h-td h-td-mono h-td-gray">
                          {a.ipAddress || '—'}
                        </td>
                        <td className="h-td h-td-gray whitespace-nowrap text-[13px]">
                          {fmtDateTime(a.createdAt)}
                        </td>
                        <td className="h-td text-center" style={{ width: 40 }}>
                          {hasDetails && (
                            <ChevronDown
                              size={16}
                              className="text-[var(--color-h-gray)] transition-transform"
                              style={{ transform: isExpanded ? 'rotate(180deg)' : undefined }}
                            />
                          )}
                        </td>
                      </tr>
                      {isExpanded && hasDetails && (
                        <tr key={`${a.id}-details`} className="h-tr">
                          <td colSpan={8} className="h-td" style={{ padding: '12px 16px' }}>
                            {changedFields.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr>
                                      <th className="text-left py-1.5 px-2 font-semibold text-[var(--color-h-gray)]" style={{ width: '30%' }}>
                                        {t('settings.auditField')}
                                      </th>
                                      <th className="text-left py-1.5 px-2 font-semibold text-[var(--color-h-gray)]" style={{ width: '35%' }}>
                                        {t('settings.auditOldValue')}
                                      </th>
                                      <th className="text-left py-1.5 px-2 font-semibold text-[var(--color-h-gray)]" style={{ width: '35%' }}>
                                        {t('settings.auditNewValue')}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {changedFields.map((cf) => (
                                      <tr key={cf.field} style={{ borderTop: '1px solid var(--color-h-border, #eee)' }}>
                                        <td className="py-1.5 px-2 font-medium text-[var(--color-h-navy)]">{cf.field}</td>
                                        <td className="py-1.5 px-2 font-mono text-red-500 dark:text-red-400" style={{ wordBreak: 'break-all' }}>
                                          {fmtVal(cf.oldVal)}
                                        </td>
                                        <td className="py-1.5 px-2 font-mono text-green-600 dark:text-green-400" style={{ wordBreak: 'break-all' }}>
                                          {fmtVal(cf.newVal)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <span className="text-[var(--color-h-gray)] text-[13px]">
                                {t('settings.auditNoChanges')}
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
              {t('settings.pagination', { page: String(page), pages: String(totalPages) })}
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
                  <span key={`e${i}`} className="h-page-ellipsis">...</span>
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

/* ── Profile Tab ── */

function ProfileTab() {
  const { t } = useAdminLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiClient
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-shimmer h-shimmer-lg"
          />
        ))}
      </div>
    );
  }

  if (!user) {
    return <p className="h-subtitle">{t('settings.profileLoadError')}</p>;
  }

  return (
    <div className="max-w-[440px]">
      <div className="h-card p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-icon-box h-icon-box-lg h-icon-box-purple shadow-[0_4px_12px_rgba(67,24,255,0.25)]">
            <User size={28} />
          </div>
          <div>
            <p className="text-base font-bold text-[var(--color-h-navy)] m-0">{user.email}</p>
            <p className="h-subtitle mt-0.5 m-0">ID: {user.id}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="h-profile-row">
            <span className="text-sm text-[var(--color-h-gray)]">{t('settings.roleLabel')}</span>
            <span className="h-badge h-badge-purple">
              {user.role}
            </span>
          </div>
          <div className="h-profile-row">
            <span className="text-sm text-[var(--color-h-gray)]">{t('settings.emailLabel')}</span>
            <span className="text-sm font-semibold text-[var(--color-h-navy)]">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── User Edit Modal ── */

function UserModal({
  user,
  onClose,
  onSaved,
}: {
  user: TeamUser | null; // null = create new
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useAdminLocale();
  const isNew = !user;
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role ?? 'manager');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [permissions, setPermissions] = useState<Permissions>(() => {
    if (user?.permissions && typeof user.permissions === 'object') {
      return user.permissions as Permissions;
    }
    const defaults: Permissions = {};
    for (const m of PERMISSION_MODULES) defaults[m.key] = 'full';
    return defaults;
  });
  const [saving, setSaving] = useState(false);

  const setPerm = (module: string, level: PermLevel) => {
    setPermissions((prev) => ({ ...prev, [module]: level }));
  };

  const handleSave = async () => {
    if (!email.trim()) return;
    if (isNew && !password.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await createUser({ email: email.trim(), password, name: name.trim(), role, permissions });
      } else {
        await updateUser(user.id, { name: name.trim(), role, permissions, isActive });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = role === 'admin';

  return (
    <div className="h-modal-overlay" style={{ alignItems: 'flex-start', paddingTop: 40, paddingBottom: 40 }}>
      <div className="h-modal" style={{ maxWidth: 560, maxHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="h-modal-title">
            {isNew ? t('settings.addUser') : t('settings.editUser')}
          </h3>
          <button type="button" onClick={onClose} className="h-action-btn">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.nameLabel')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-input"
              />
            </div>
            <div>
              <label className="h-label">{t('settings.emailLabel')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-input"
                disabled={!isNew}
              />
            </div>
          </div>

          {isNew && (
            <div>
              <label className="h-label">{t('settings.passwordLabel')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-input"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="h-label">{t('settings.roleLabel')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-select"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            {!isNew && (
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-2.5">
                  <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
                  <span className="text-sm text-[var(--color-h-navy)]">
                    {isActive ? t('settings.statusActive') : t('settings.statusInactive')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Permissions grid */}
          <div>
            <label className="h-label mb-2">{t('settings.permissionsLabel')}</label>
            {isAdmin ? (
              <p className="h-subtitle text-[13px]">{t('settings.adminFullAccess')}</p>
            ) : (
              <div className="h-card p-0 overflow-hidden">
                <table className="h-table" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr className="h-tr">
                      <th className="h-th" style={{ minWidth: 120 }}></th>
                      <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessFull')}</th>
                      <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessView')}</th>
                      <th className="h-th text-center" style={{ width: 80 }}>{t('settings.accessNone')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSION_MODULES.map((mod) => {
                      const val = permissions[mod.key] || 'none';
                      return (
                        <tr key={mod.key} className="h-tr">
                          <td className="h-td h-td-navy text-[13px] font-medium">{t(mod.labelKey)}</td>
                          {(['full', 'view', 'none'] as PermLevel[]).map((level) => (
                            <td key={level} className="h-td text-center">
                              <input
                                type="radio"
                                name={`perm-${mod.key}`}
                                checked={val === level}
                                onChange={() => setPerm(mod.key, level)}
                                className="accent-[var(--color-h-purple)]"
                                style={{ width: 16, height: 16 }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2.5 shrink-0 pt-3" style={{ borderTop: '1px solid var(--color-h-border, #eee)' }}>
          <button type="button" onClick={onClose} className="h-btn h-btn-outline">
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !email.trim() || (isNew && !password.trim())}
            className="h-btn h-btn-primary"
          >
            <Save size={16} />
            {saving ? t('common.saving') : isNew ? t('common.create') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Change Password Modal ── */

function PasswordModal({
  user,
  onClose,
}: {
  user: TeamUser;
  onClose: () => void;
}) {
  const { t } = useAdminLocale();
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!password.trim()) return;
    setSaving(true);
    try {
      await changeUserPassword(user.id, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-modal-overlay">
      <div className="h-modal" style={{ maxWidth: 400 }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="h-modal-title">{t('settings.changePasswordBtn')}</h3>
          <button type="button" onClick={onClose} className="h-action-btn">
            <X size={18} />
          </button>
        </div>
        <div>
          <label className="h-label">{t('settings.newPasswordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-input"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button type="button" onClick={onClose} className="h-btn h-btn-outline">
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !password.trim()}
            className="h-btn h-btn-primary"
          >
            <Save size={16} />
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Team Tab ── */

function TeamTab() {
  const { t } = useAdminLocale();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<TeamUser | null | undefined>(undefined);
  const [passwordTarget, setPasswordTarget] = useState<TeamUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.msg || 'Error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="h-subtitle">{users.length} {t('settings.tabTeam').toLowerCase()}</span>
        <button
          type="button"
          onClick={() => setEditTarget(null)}
          className="h-btn h-btn-sm h-btn-primary"
        >
          <Plus size={16} />
          {t('settings.addUser')}
        </button>
      </div>

      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr className="h-tr">
                <th className="h-th">ID</th>
                <th className="h-th">{t('settings.nameLabel')}</th>
                <th className="h-th">{t('settings.emailLabel')}</th>
                <th className="h-th">{t('settings.roleLabel')}</th>
                <th className="h-th">{t('settings.thStatus')}</th>
                <th className="h-th h-th-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="h-tr">
                    <td colSpan={6} className="h-td">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-empty">
                    <Users size={40} className="h-empty-icon" />
                    <div>{t('settings.noUsers')}</div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="h-tr">
                    <td className="h-td h-td-id">{u.id}</td>
                    <td className="h-td h-td-navy font-medium">{u.name || '—'}</td>
                    <td className="h-td h-td-navy">{u.email}</td>
                    <td className="h-td">
                      <span className={`h-badge ${u.role === 'admin' ? 'h-badge-purple' : 'h-badge-blue'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="h-td">
                      <span className={`h-badge ${u.isActive ? 'h-badge-green' : 'h-badge-gray'}`}>
                        {u.isActive ? t('settings.statusActive') : t('settings.statusInactive')}
                      </span>
                    </td>
                    <td className="h-td text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditTarget(u)}
                          className="h-action-btn"
                          title={t('settings.editUser')}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasswordTarget(u)}
                          className="h-action-btn"
                          title={t('settings.changePasswordBtn')}
                        >
                          <Key size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(u)}
                          className="h-action-btn h-action-btn-delete"
                          title={t('common.delete')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create modal */}
      {editTarget !== undefined && (
        <UserModal user={editTarget} onClose={() => setEditTarget(undefined)} onSaved={fetchUsers} />
      )}

      {/* Change password modal */}
      {passwordTarget && (
        <PasswordModal user={passwordTarget} onClose={() => setPasswordTarget(null)} />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="h-modal-overlay">
          <div className="h-modal" style={{ maxWidth: 400 }}>
            <h3 className="h-modal-title mb-4">
              {t('settings.confirmDeleteUser', { name: deleteTarget.name || deleteTarget.email })}
            </h3>
            <div className="flex justify-end gap-2.5">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-btn h-btn-outline">
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-btn h-btn-danger"
              >
                <Trash2 size={16} />
                {deleting ? '...' : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */

export default function SettingsPage() {
  const { t } = useAdminLocale();
  const [activeTab, setActiveTab] = useState<TabKey>('templates');

  return (
    <div className="h-page">
      {/* Header card */}
      <div className="h-header gap-3.5">
        <div className="h-icon-box h-icon-box-gray">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="h-title">{t('settings.title')}</h1>
          <span className="h-subtitle">{t('settings.subtitle')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="h-tabs mb-5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-tab ${isActive ? 'h-tab-active' : ''}`}
            >
              <TabIcon size={16} />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'templates' && <TemplatesTab />}
      {activeTab === 'audit' && <AuditTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'profile' && <ProfileTab />}
    </div>
  );
}
