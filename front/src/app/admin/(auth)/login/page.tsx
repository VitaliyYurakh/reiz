'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/api/admin';
import { Lock, Mail, LogIn, Car, ShieldCheck } from 'lucide-react';
import { useAdminLocale } from '@/context/AdminLocaleContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  // step=password until the API tells us 2FA is required for this user.
  // Then we keep email+password in state and ask only for the code.
  const [step, setStep] = useState<'password' | 'totp'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminApi.post('/auth/login', {
        nickname: email,
        pass: password,
        ...(step === 'totp' ? { totpCode: totpCode.trim() } : {}),
      });

      // 200 + {requires2fa: true} → password was correct, prompt for TOTP
      if (res.data?.requires2fa) {
        setStep('totp');
        setError('');
        return;
      }

      // Token is set as httpOnly cookie by the server
      router.push('/admin/dashboard');
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.msg || err?.response?.data?.message;
      const msg = status
        ? `[${status}] ${serverMsg || t('login.error')}`
        : `[network] ${t('login.networkError')}`;
      setError(msg);
      // Wrong code shouldn't drop us back to the password step — let the
      // user retry the code with the same password (rate limiter still
      // applies on the server).
    } finally {
      setLoading(false);
    }
  };

  const resetToPassword = () => {
    setStep('password');
    setTotpCode('');
    setError('');
  };

  return (
    <div className="h-login-bg p-5">
      {/* Decorative circles */}
      <div className="h-login-circle -top-[120px] -right-[120px] w-[340px] h-[340px]" />
      <div className="h-login-circle -bottom-[80px] -left-[80px] w-[260px] h-[260px]" />

      <div className="h-login-card">
        {/* Logo */}
        <div className="h-login-logo">
          <Car size={28} />
        </div>
        <h1 className="h-login-title">REIZ Admin</h1>
        <p className="h-login-subtitle">{t('login.subtitle')}</p>

        {/* Error */}
        {error && (
          <div className="h-login-error">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          {step === 'password' ? (
            <>
              {/* Email */}
              <div className="mb-[18px]">
                <label className="block text-[13px] font-medium text-h-navy mb-1.5">
                  {t('login.emailLabel')}
                </label>
                <div className="h-login-input-wrap">
                  <Mail size={18} className="h-login-input-icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@reiz.co.il"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-login-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-7">
                <label className="block text-[13px] font-medium text-h-navy mb-1.5">
                  {t('login.passwordLabel')}
                </label>
                <div className="h-login-input-wrap">
                  <Lock size={18} className="h-login-input-icon" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-login-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-login-btn text-white"
              >
                <LogIn size={18} />
                {loading ? t('login.submitting') : t('login.submit')}
              </button>
            </>
          ) : (
            <>
              <div className="mb-3 text-[13px] text-h-navy/80">
                {t('login.totpHint')}
              </div>
              <div className="mb-7">
                <label className="block text-[13px] font-medium text-h-navy mb-1.5">
                  {t('login.totpLabel')}
                </label>
                <div className="h-login-input-wrap">
                  <ShieldCheck size={18} className="h-login-input-icon" />
                  <input
                    name="totp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123 456"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    required
                    autoFocus
                    className="h-login-input tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.trim().length < 6}
                className="h-login-btn text-white"
              >
                <ShieldCheck size={18} />
                {loading ? t('login.submitting') : t('login.totpSubmit')}
              </button>

              <button
                type="button"
                onClick={resetToPassword}
                className="block w-full text-center text-[12.5px] text-h-navy/60 hover:text-h-navy mt-3 underline-offset-2 hover:underline"
              >
                {t('login.totpBack')}
              </button>
            </>
          )}
        </form>

      </div>
    </div>
  );
}
