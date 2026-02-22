'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
  Filter,
} from 'lucide-react';
import { fmtDateTime } from '@/app/admin/(dashboard)/settings/components/utils';
import { ACTION_MAP, ENTITY_TYPES } from '@/app/admin/(dashboard)/settings/components/types';
import type { AuditEntry } from '@/app/admin/(dashboard)/settings/components/types';

export function AuditTab() {
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
