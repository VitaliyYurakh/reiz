'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/api/admin';
import { Lock, Mail, LogIn, Car } from 'lucide-react';
import { useAdminLocale } from '@/context/AdminLocaleContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminApi.post('/auth/login', {
        nickname: email,
        pass: password,
      });

      // Token is set as httpOnly cookie by the server
      router.push('/admin/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        t('login.error');
      setError(msg);
    } finally {
      setLoading(false);
    }
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="h-login-btn"
          >
            <LogIn size={18} />
            {loading ? t('login.submitting') : t('login.submit')}
          </button>
        </form>

      </div>
    </div>
  );
}
