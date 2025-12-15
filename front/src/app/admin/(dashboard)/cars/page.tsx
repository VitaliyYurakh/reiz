'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {createCar, deleteCar, getAllCars} from "@/lib/api/admin";
import {Car} from "@/types/cars";

export default function CarListPage() {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            const data = await getAllCars();
            setCars(data.cars);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleAddCar = async () => {
        try {
            const newCar = await createCar({});
            router.push(`/admin/cars/${newCar.id}`);
        } catch (e) {
            alert('Ошибка при создании авто');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Подтвердить удаление')) return;
        try {
            await deleteCar(id);
            setCars((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {
            alert('Ошибка удаления');
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <>
            <nav className="cabinet-nav">
                <ul>
                    <li><button className="grey-btn">Поиск авто</button></li>
                    <li><button className="grey-btn">Сортировка и фильтры</button></li>
                    <li><button className="grey-btn">Расположение авто</button></li>
                    <li>
                        <button onClick={handleAddCar} className="grey-btn add-car">
                            Добавить авто
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="cabinet-table">
                <ul className="cabinet-table__list">
                    <li className="cabinet-table__row">
                        <span className="cabinet-table__title">НАЗВАНИЕ</span>
                        <span className="cabinet-table__title">НОМЕР</span>
                        <span className="cabinet-table__title">СТАТУС</span>
                        <span className="cabinet-table__title">СТАТУС ТО</span>
                        <span className="cabinet-table__title">ЛОКАЦИЯ</span>
                        <span className="cabinet-table__title">ЗАГРУЗКА</span>
                        <span className="cabinet-table__title">СТРАХОВКА ДО</span>
                        <span className="cabinet-table__title">ДЕЙСТВИЯ</span>
                    </li>

                    {cars.map((car) => (
                        <li key={car.id} className="cabinet-table__row">
                            <span className="cabinet-table__value">{car.brand} {car.model}</span>
                            <span className="cabinet-table__value">{car.plateNumber || '-'}</span>
                            <span className="cabinet-table__status">Свободен ✅</span>
                            <span className="cabinet-table__value">ТО через 1200 км</span>
                            <span className="cabinet-table__value">Львов</span>
                            <span className="cabinet-table__value">60%</span>
                            <span className="cabinet-table__value">20.07.2025</span>
                            <div className="cabinet-table__box">
                                <Link href={`/admin/cars/${car.id}`} className="grey-btn edit">
                                    Редактировать
                                </Link>
                                <button onClick={() => handleDelete(car.id)} className="grey-btn delete">
                                    <i className="sprite">
                                        <svg fill="#ff0000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11,4.5l10,0c0.828,-0 1.5,-0.672 1.5,-1.5c-0,-0.828 -0.672,-1.5 -1.5,-1.5l-10,0c-0.828,-0 -1.5,0.672 -1.5,1.5c-0,0.828 0.672,1.5 1.5,1.5Z"/>
                                            <path d="M5,9.5l0,16.5c0,2.761 2.239,5 5,5l12,0c2.761,0 5,-2.239 5,-5l0,-16.5l1.645,0c0.748,-0 1.355,-0.672 1.355,-1.5c-0,-0.828 -0.607,-1.5 -1.355,-1.5l-25.29,0c-0.748,-0 -1.355,0.672 -1.355,1.5c-0,0.828 0.607,1.5 1.355,1.5l1.645,0Zm7,3.5l0,12c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-12c-0,-0.552 -0.448,-1 -1,-1c-0.552,0 -1,0.448 -1,1Zm6,-0l0,12c0,0.552 0.448,1 1,1c0.552,-0 1,-0.448 1,-1l0,-12c0,-0.552 -0.448,-1 -1,-1c-0.552,-0 -1,0.448 -1,1Z"/>
                                        </svg>
                                    </i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}