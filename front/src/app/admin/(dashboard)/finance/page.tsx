'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Receipt,
} from 'lucide-react';
import { IosSelect } from '@/components/admin/ios-select';

/* ── Types ── */

interface Account {
  id: number;
  name: string;
  type: string;
  currency: string;
  isActive: boolean;
}

interface TransactionClient {
  id: number;
  firstName: string;
  lastName: string;
}

interface TransactionRental {
  id: number;
  contractNumber: string;
}

interface Transaction {
  id: number;
  type: string;
  direction: string;
  amountMinor: number;
  currency: string;
  fxRate: number | null;
  amountUahMinor: number | null;
  description: string | null;
  createdAt: string;
  account: { id: number; name: string; type: string } | null;
  client: TransactionClient | null;
  rental: TransactionRental | null;
}

interface CreateTransactionForm {
  type: string;
  accountId: string;
  direction: string;
  amount: string;
  currency: string;
  amountUah: string;
  description: string;
  clientId: string;
  rentalId: string;
}

const TRANSACTION_TYPES = [
  'PAYMENT',
  'DEPOSIT_RECEIVED',
  'DEPOSIT_RETURNED',
  'REFUND',
  'FINE_PAYMENT',
  'SERVICE_COST',
  'ADDON_PAYMENT',
  'EXTENSION_PAYMENT',
] as const;

const TYPE_LABEL_KEYS: Record<string, string> = {
  PAYMENT: 'finance.typePayment',
  DEPOSIT_RECEIVED: 'finance.typeDepositReceived',
  DEPOSIT_RETURNED: 'finance.typeDepositReturned',
  REFUND: 'finance.typeRefund',
  FINE_PAYMENT: 'finance.typeFinePayment',
  SERVICE_COST: 'finance.typeServiceCost',
  ADDON_PAYMENT: 'finance.typeAddonPayment',
  EXTENSION_PAYMENT: 'finance.typeExtensionPayment',
};

const CURRENCIES = ['UAH', 'USD', 'EUR', 'ILS'] as const;

const initialCreateForm: CreateTransactionForm = {
  type: 'PAYMENT',
  accountId: '',
  direction: 'IN',
  amount: '',
  currency: 'ILS',
  amountUah: '',
  description: '',
  clientId: '',
  rentalId: '',
};

function formatMoney(minor: number, currency?: string) {
  const formatted = (minor / 100).toLocaleString('uk-UA', { minimumFractionDigits: 2 });
  return currency ? `${formatted} ${currency}` : formatted;
}

function fmtDateTime(d: string | null) {
  if (!d) return '—';
  const dt = new Date(d);
  return `${dt.toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${dt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}`;
}

const ACCOUNT_STYLE: Record<string, { icon: typeof CreditCard; tint: string }> = {
  cash: { icon: Wallet, tint: 'h-icon-box-tint-green' },
  bank_account: { icon: CreditCard, tint: 'h-icon-box-tint-purple' },
  bank_card: { icon: CreditCard, tint: 'h-icon-box-tint-blue' },
};

const ACCOUNT_TYPE_LABEL_KEYS: Record<string, string> = {
  CASH: 'finance.accountTypeCash',
  BANK_ACCOUNT: 'finance.accountTypeBank',
  BANK_CARD: 'finance.accountTypeCard',
};

/* ── Main ── */

export default function FinancePage() {
  const { t } = useAdminLocale();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const limit = 20;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateTransactionForm>(initialCreateForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApiClient.get('/finance/account');
        setAccounts(res.data.accounts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAccounts(false);
      }
    })();
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoadingTx(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      const res = await adminApiClient.get(`/finance/transaction?${params}`);
      setTransactions(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTx(false);
    }
  }, [page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const totalPages = Math.ceil(total / limit);

  const updateCreateField = (key: keyof CreateTransactionForm, value: string) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetCreateForm = () => {
    setCreateForm(initialCreateForm);
    setCreateError(null);
  };

  const handleToggleForm = () => {
    if (showCreateForm) resetCreateForm();
    setShowCreateForm((prev) => !prev);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    const amountVal = parseFloat(createForm.amount);
    const amountUahVal = parseFloat(createForm.amountUah);

    if (isNaN(amountVal) || amountVal <= 0) {
      setCreateError(t('finance.amountError'));
      setCreating(false);
      return;
    }
    if (isNaN(amountUahVal) || amountUahVal <= 0) {
      setCreateError(t('finance.amountUahError'));
      setCreating(false);
      return;
    }

    try {
      const body: Record<string, unknown> = {
        type: createForm.type,
        accountId: parseInt(createForm.accountId),
        direction: createForm.direction,
        amountMinor: Math.round(amountVal * 100),
        currency: createForm.currency,
        amountUahMinor: Math.round(amountUahVal * 100),
      };
      if (createForm.description.trim()) body.description = createForm.description.trim();
      if (createForm.clientId.trim()) body.clientId = parseInt(createForm.clientId);
      if (createForm.rentalId.trim()) body.rentalId = parseInt(createForm.rentalId);

      await adminApiClient.post('/finance/transaction', body);
      resetCreateForm();
      setShowCreateForm(false);
      setPage(1);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        t('finance.createError');
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2);

  return (
    <div className="h-page">
      {/* Header */}
      <div className="h-header justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-icon-box h-icon-box-green">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="h-title">{t('finance.title')}</h1>
            <span className="h-subtitle">{t('finance.subtitle')}</span>
          </div>
          <div className="h-count ml-3">
            {total} {t('finance.transactions')}
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleForm}
          className={`h-btn ${showCreateForm ? 'h-btn-danger' : 'h-btn-primary'}`}
        >
          {showCreateForm ? <><X size={18} /> {t('common.cancel')}</> : <><Plus size={18} /> {t('finance.sectionNewTx')}</>}
        </button>
      </div>

      {/* Account Cards */}
      {!loadingAccounts && accounts.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5 mb-6">
          {accounts.map((a) => {
            const style = ACCOUNT_STYLE[a.type.toLowerCase()] || { icon: CreditCard, tint: 'h-icon-box-tint-purple' };
            const Icon = style.icon;
            return (
              <div
                key={a.id}
                className={`h-account-card ${!a.isActive ? 'h-account-card-inactive' : ''}`}
              >
                <div className={style.tint}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-h-navy m-0">{a.name}</p>
                  <p className="text-xs text-h-gray m-0">
                    {t(ACCOUNT_TYPE_LABEL_KEYS[a.type]) || a.type} · {a.currency}
                  </p>
                </div>
                <span className={`h-account-status ${a.isActive ? 'h-account-status-active' : 'h-account-status-inactive'}`}>
                  {a.isActive ? t('finance.active') : t('finance.inactive')}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Transaction Form */}
      {showCreateForm && (
        <div className="h-card p-7 mb-6">
          <h2 className="text-[17px] font-bold text-h-navy mb-5">
            {t('finance.sectionNewTx')}
          </h2>

          {createError && (
            <div className="h-alert-error">
              {createError}
            </div>
          )}

          <form onSubmit={handleCreateSubmit}>
            <div className="h-form-grid">
              <div>
                <label className="h-label">{t('finance.type')} <span className="h-required">*</span></label>
                <IosSelect
                  required
                  value={createForm.type}
                  onChange={(v) => updateCreateField('type', v)}
                  options={TRANSACTION_TYPES.map((tp) => ({ value: tp, label: t(TYPE_LABEL_KEYS[tp]) || tp }))}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.account')} <span className="h-required">*</span></label>
                <IosSelect
                  required
                  value={createForm.accountId}
                  onChange={(v) => updateCreateField('accountId', v)}
                  options={accounts.map((a) => ({ value: String(a.id), label: `${a.name} (${a.currency})` }))}
                  placeholder={t('finance.selectPlaceholder')}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.direction')} <span className="h-required">*</span></label>
                <IosSelect
                  required
                  value={createForm.direction}
                  onChange={(v) => updateCreateField('direction', v)}
                  options={[
                    { value: 'IN', label: t('finance.directionIn') },
                    { value: 'OUT', label: t('finance.directionOut') },
                  ]}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.amount')} <span className="h-required">*</span></label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={createForm.amount}
                  onChange={(e) => updateCreateField('amount', e.target.value)}
                  className="h-input"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.currency')} <span className="h-required">*</span></label>
                <IosSelect
                  required
                  value={createForm.currency}
                  onChange={(v) => updateCreateField('currency', v)}
                  options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.amountUah')} <span className="h-required">*</span></label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={createForm.amountUah}
                  onChange={(e) => updateCreateField('amountUah', e.target.value)}
                  className="h-input"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.description')}</label>
                <input
                  type="text"
                  placeholder={t('finance.commentPlaceholder')}
                  value={createForm.description}
                  onChange={(e) => updateCreateField('description', e.target.value)}
                  className="h-input"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.clientId')}</label>
                <input
                  type="number"
                  min="1"
                  placeholder={t('finance.optionalPlaceholder')}
                  value={createForm.clientId}
                  onChange={(e) => updateCreateField('clientId', e.target.value)}
                  className="h-input"
                />
              </div>
              <div>
                <label className="h-label">{t('finance.rentalId')}</label>
                <input
                  type="number"
                  min="1"
                  placeholder={t('finance.optionalPlaceholder')}
                  value={createForm.rentalId}
                  onChange={(e) => updateCreateField('rentalId', e.target.value)}
                  className="h-input"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={creating}
                className="h-btn h-btn-sm h-btn-primary"
              >
                <Plus size={14} />
                {creating ? t('finance.creating') : t('finance.submit')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="h-table-card">
        <div className="overflow-x-auto">
          <table className="h-table">
            <thead>
              <tr>
                <th className="h-th">{t('finance.thId')}</th>
                <th className="h-th">{t('finance.thDirection')}</th>
                <th className="h-th">{t('finance.thType')}</th>
                <th className="h-th">{t('finance.thAmount')}</th>
                <th className="h-th">{t('finance.thAccount')}</th>
                <th className="h-th">{t('finance.thClient')}</th>
                <th className="h-th">{t('finance.thRental')}</th>
                <th className="h-th">{t('finance.thDescription')}</th>
                <th className="h-th">{t('finance.thDate')}</th>
              </tr>
            </thead>
            <tbody>
              {loadingTx ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-4 py-3.5">
                      <div className="h-shimmer" />
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="h-empty">
                    <Receipt size={32} className="h-empty-icon" />
                    <p className="text-sm text-h-gray">{t('finance.emptyTitle')}</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIn = tx.direction === 'IN';
                  return (
                    <tr key={tx.id} className="h-tr">
                      <td className="h-td h-td-gray text-xs font-semibold">
                        {tx.id}
                      </td>
                      <td className="h-td">
                        <span className={`h-badge h-badge-sm ${isIn ? 'h-badge-in' : 'h-badge-out'}`}>
                          {isIn ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                          {isIn ? 'IN' : 'OUT'}
                        </span>
                      </td>
                      <td className="h-td text-xs">
                        <span className="h-type-badge">
                          {t(TYPE_LABEL_KEYS[tx.type]) || tx.type}
                        </span>
                      </td>
                      <td className="h-td">
                        <div className={isIn ? 'h-money-green' : 'h-money-red'}>
                          {isIn ? '+' : '-'}{formatMoney(tx.amountMinor, tx.currency)}
                        </div>
                        {tx.amountUahMinor != null && tx.currency !== 'UAH' && (
                          <div className="h-money-sub">
                            {formatMoney(tx.amountUahMinor, 'UAH')}
                            {tx.fxRate != null && ` (×${tx.fxRate})`}
                          </div>
                        )}
                      </td>
                      <td className="h-td h-td-gray text-xs">
                        {tx.account?.name || '—'}
                      </td>
                      <td className="h-td text-xs">
                        {tx.client ? (
                          <a
                            href={`/admin/clients/${tx.client.id}`}
                            className="h-link"
                          >
                            {tx.client.firstName} {tx.client.lastName}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="h-td h-td-mono h-td-gray">
                        {tx.rental ? (
                          <a
                            href={`/admin/rentals/${tx.rental.id}`}
                            className="h-link"
                          >
                            {tx.rental.contractNumber}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="h-td h-td-gray h-td-truncate">
                        {tx.description || '—'}
                      </td>
                      <td className="h-td h-td-gray text-xs whitespace-nowrap">
                        {fmtDateTime(tx.createdAt)}
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
              {t('common.page', { page: String(page), pages: String(totalPages) })}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-page-nav"
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers.map((p, i) => {
                const prev = pageNumbers[i - 1];
                const showEllipsis = prev != null && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="h-page-ellipsis">...</span>}
                    <button
                      type="button"
                      onClick={() => setPage(p)}
                      className={`h-page-num ${p === page ? 'h-page-num-active' : ''}`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
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
