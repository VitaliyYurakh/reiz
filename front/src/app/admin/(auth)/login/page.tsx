'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from "@/lib/api/admin";
import './styles.scss'

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await adminApi.post('/auth/login', {
                nickname: email,
                pass: password,
            });

            const token = res.data.token;
            localStorage.setItem('token', token);

            router.push('/admin/cars');
        } catch (err) {
            console.error(err);
            alert('Ошибка авторизации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container_admin page-login-wrapper">
            <div className="top"></div>
            <div className="bottom"></div>
            <form onSubmit={handleLogin} className="center">
                <h2>Please Sign In</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <h2>&nbsp;</h2>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
