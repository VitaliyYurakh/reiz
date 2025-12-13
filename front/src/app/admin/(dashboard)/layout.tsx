'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {checkAuthReq} from "@/lib/api/admin";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token');
                const isAuth = await checkAuthReq();
                if(!isAuth) throw new Error('Not authorized');
                setIsAuthorized(true);
            } catch (error) {
                localStorage.removeItem('token')
                router.push('/admin/login');
            }
        };
        checkAuth();
    }, [router]);

    if (!isAuthorized) return null;

    return (
        <main className="main">
            <section className="cabinet-section">
                <div className="container">
                    <div className="cabinet-section__box">

                        {/* --- SIDEBAR --- */}
                        <aside className="aside">
                            <div className="aside__top">
                                <Link href="/admin/cars" className="aside__title">REIZ</Link>
                                <p>CAR RENTAL IN UKRAINE</p>
                            </div>

                            <nav className="main-nav">
                                <ul>
                                    <li>
                                        <Link
                                            href="/admin/analytics"
                                            className={pathname.includes('/analytics') ? 'active' : ''}
                                        >
                                            АНАЛИТИКА
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/cars"
                                            className={pathname.includes('/cars') ? 'active' : ''}
                                        >
                                            АВТОМОБИЛИ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#">БРОНИРОВАНИЯ</Link>
                                    </li>
                                    <li>
                                        <Link href="#">КАЛЕНДАРЬ</Link>
                                    </li>
                                    <li>
                                        <Link href="#">КЛИЕНТЫ</Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>
                        {/* --- END SIDEBAR --- */}

                        <div className="cabinet-section__inner">
                            {children}
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
