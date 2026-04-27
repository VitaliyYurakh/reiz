'use client';

import { useEffect, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { logError } from '@/lib/log';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { User, ShieldCheck, ShieldOff, Copy, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/app/admin/(dashboard)/settings/components/types';

interface TotpStatus { enabled: boolean; remainingRecoveryCodes: number }
interface TotpSetup { qrDataUri: string; otpauth: string; secret: string }

type Mode = 'view' | 'setup' | 'codes' | 'disable';

export function ProfileTab() {
  const { t } = useAdminLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 2FA state
  const [totp, setTotp] = useState<TotpStatus | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [code, setCode] = useState('');
  const [pass, setPass] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const refreshTotp = () => adminApiClient.get<TotpStatus>('/auth/2fa/status')
    .then((r) => setTotp(r.data))
    .catch(logError);

  useEffect(() => {
    adminApiClient
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(logError)
      .finally(() => setLoading(false));
    refreshTotp();
  }, []);

  const startSetup = async () => {
    setBusy(true); setErr('');
    try {
      const res = await adminApiClient.post<TotpSetup>('/auth/2fa/setup');
      setSetup(res.data);
      setMode('setup');
      setCode('');
    } catch (e: any) {
      setErr(e?.response?.data?.msg ?? 'Setup failed');
    } finally { setBusy(false); }
  };

  const confirmEnable = async () => {
    if (code.trim().length < 6) return;
    setBusy(true); setErr('');
    try {
      const res = await adminApiClient.post<{ recoveryCodes: string[] }>('/auth/2fa/enable', { code: code.trim() });
      setRecoveryCodes(res.data.recoveryCodes);
      setMode('codes');
      setCode('');
    } catch (e: any) {
      setErr(e?.response?.data?.msg ?? 'Invalid code');
    } finally { setBusy(false); }
  };

  const finishCodes = async () => {
    setMode('view');
    setSetup(null);
    setRecoveryCodes([]);
    await refreshTotp();
    // Server cleared the cookie on enable — next request 401s. Push to login.
    window.location.href = '/admin/login';
  };

  const startDisable = () => { setMode('disable'); setCode(''); setPass(''); setErr(''); };

  const confirmDisable = async () => {
    if (!pass || code.trim().length < 6) return;
    setBusy(true); setErr('');
    try {
      await adminApiClient.post('/auth/2fa/disable', { pass, code: code.trim() });
      setMode('view');
      setCode(''); setPass('');
      // Cookie cleared — re-login.
      window.location.href = '/admin/login';
    } catch (e: any) {
      setErr(e?.response?.data?.msg ?? 'Could not disable');
    } finally { setBusy(false); }
  };

  const copyCodes = () => {
    void navigator.clipboard.writeText(recoveryCodes.join('\n'));
  };

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
    <div className="max-w-[520px] flex flex-col gap-5">
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

      {/* ── 2FA ──────────────────────────────────────────────────── */}
      <div className="h-card p-7">
        <div className="flex items-start gap-4">
          <div className={`h-icon-box h-icon-box-lg ${totp?.enabled ? 'h-icon-box-green' : 'h-icon-box-purple'}`}>
            {totp?.enabled ? <ShieldCheck size={26} /> : <ShieldOff size={26} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--color-h-navy)] m-0">{t('settings.twofaTitle')}</p>
            <p className="h-subtitle mt-1">
              {totp?.enabled
                ? t('settings.twofaEnabledHint', { count: totp.remainingRecoveryCodes })
                : t('settings.twofaDisabledHint')}
            </p>
          </div>
        </div>

        {err && <div className="mt-4 text-[13px] text-red-600">{err}</div>}

        {mode === 'view' && (
          <div className="mt-5">
            {totp?.enabled ? (
              <button type="button" onClick={startDisable} className="h-btn-outline">
                {t('settings.twofaDisable')}
              </button>
            ) : (
              <button type="button" onClick={startSetup} disabled={busy} className="h-btn-primary">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                <span>{t('settings.twofaEnable')}</span>
              </button>
            )}
          </div>
        )}

        {mode === 'setup' && setup && (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setup.qrDataUri} alt="QR" width={200} height={200} className="rounded-[12px] border border-[var(--color-h-border)]" />
              <p className="text-[12.5px] text-[var(--color-h-gray)] text-center max-w-[320px]">{t('settings.twofaScanHint')}</p>
              <div className="text-[11.5px] text-[var(--color-h-gray)] font-mono break-all bg-[var(--color-h-bg-2)] px-3 py-2 rounded-[8px]">
                {setup.secret}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[var(--color-h-navy)] mb-1.5">
                {t('settings.twofaCodeLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123 456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-input tracking-widest"
                maxLength={8}
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={confirmEnable} disabled={busy || code.trim().length < 6} className="h-btn-primary">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                <span>{t('settings.twofaConfirm')}</span>
              </button>
              <button type="button" onClick={() => { setMode('view'); setSetup(null); }} className="h-btn-outline">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}

        {mode === 'codes' && recoveryCodes.length > 0 && (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-[13px] text-[var(--color-h-navy)] font-medium">{t('settings.twofaRecoveryTitle')}</p>
            <p className="text-[12.5px] text-[var(--color-h-gray)]">{t('settings.twofaRecoveryHint')}</p>
            <div className="grid grid-cols-2 gap-2 bg-[var(--color-h-bg-2)] p-3 rounded-[10px] font-mono text-[13px]">
              {recoveryCodes.map((c) => (
                <div key={c} className="select-all">{c}</div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={copyCodes} className="h-btn-outline">
                <Copy size={14} />
                <span>{t('settings.twofaCopyCodes')}</span>
              </button>
              <button type="button" onClick={finishCodes} className="h-btn-primary">
                <span>{t('settings.twofaDone')}</span>
              </button>
            </div>
          </div>
        )}

        {mode === 'disable' && (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-[13px] text-[var(--color-h-navy)] font-medium">{t('settings.twofaDisableTitle')}</p>
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-h-navy)] mb-1.5">
                {t('settings.passwordLabel')}
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="h-input"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-h-navy)] mb-1.5">
                {t('settings.twofaCodeLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-input tracking-widest"
                maxLength={20}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={confirmDisable} disabled={busy || !pass || code.trim().length < 6} className="h-btn-danger">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
                <span>{t('settings.twofaDisable')}</span>
              </button>
              <button type="button" onClick={() => { setMode('view'); setCode(''); setPass(''); }} className="h-btn-outline">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
