'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    addPhoto,
    addPreview,
    deletePhoto,
    getOneCar,
    getSegments,
    updateCar,
    updatePhoto,
    updateRentalTariffs
} from "@/lib/api/admin";
import { Car, RentalTariff, Segment } from "@/types/cars";
import { BASE_URL } from "@/config/environment";
import './style.scss'

// --- CONSTANTS & DICTIONARIES ---

const LANGUAGES = [
    { code: 'uk', label: 'UA' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' }
] as const;

type LangCode = typeof LANGUAGES[number]['code'];

// Словари для селектов
const ENGINE_TYPES = [
    { value: 'petrol', label: { uk: 'Бензин', ru: 'Бензин', en: 'Petrol' } },
    { value: 'diesel', label: { uk: 'Дизель', ru: 'Дизель', en: 'Diesel' } },
    { value: 'electric', label: { uk: 'Електро', ru: 'Электро', en: 'Electric' } },
    { value: 'hybrid', label: { uk: 'Гібрид', ru: 'Гибрид', en: 'Hybrid' } },
];

const TRANSMISSION_TYPES = [
    { value: 'automatic', label: { uk: 'Автомат', ru: 'Автомат', en: 'Automatic' } },
    { value: 'manual', label: { uk: 'Механіка', ru: 'Механика', en: 'Manual' } },
    { value: 'robot', label: { uk: 'Робот', ru: 'Робот', en: 'Robot' } },
    { value: 'variator', label: { uk: 'Варіатор', ru: 'Вариатор', en: 'CVT' } },
];

const DRIVE_TYPES = [
    { value: 'front', label: { uk: 'Передній', ru: 'Передний', en: 'Front' } },
    { value: 'rear', label: { uk: 'Задній', ru: 'Задний', en: 'Rear' } },
    { value: 'full', label: { uk: 'Повний', ru: 'Полный', en: 'AWD' } },
];

// Хелпер для нормализации данных (строка -> объект языков)
const normalizeMultiLang = (val: any): { uk: string, ru: string, en: string } => {
    if (!val) return { uk: '', ru: '', en: '' };

    // Если это объект (уже нормальный формат)
    if (typeof val === 'object' && val !== null) {
        return {
            uk: val.uk || '',
            ru: val.ru || '',
            en: val.en || ''
        };
    }

    // Если это строка, она может быть JSON-строкой или просто текстом
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            // Проверяем, похоже ли это на наш объект локализации
            if (parsed && typeof parsed === 'object' && ('uk' in parsed || 'ru' in parsed || 'en' in parsed)) {
                return {
                    uk: parsed.uk || '',
                    ru: parsed.ru || '',
                    en: parsed.en || ''
                };
            }
        } catch (e) {
            // Это не JSON, значит просто обычная строка (старые данные)
            // Дублируем её для всех языков, чтобы не терять
        }
        return { uk: val, ru: val, en: val };
    }

    return { uk: '', ru: '', en: '' };
};

export default function CarEditPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.idSlug);

    // Состояния
    const [car, setCar] = useState<Car | null>(null);
    const [segments, setSegments] = useState<Segment[]>([]);

    // Модалки
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false); // Для добавления комплектации

    // Глобальный язык редактирования (для вкладок)
    const [activeLang, setActiveLang] = useState<LangCode>('uk');

    // Поля формы
    const [description, setDescription] = useState<{ uk: string, ru: string, en: string }>({ uk: '', ru: '', en: '' });
    const [attributes, setAttributes] = useState<any>({});
    const [tariffs, setTariffs] = useState<RentalTariff[]>([]);
    const [deposit, setDeposit] = useState<number>(0);
    const [configurationList, setConfigurationList] = useState<{ uk: string, ru: string, en: string }[]>([]);

    // Стейт для добавления нового пункта комплектации
    const [newConfigItem, setNewConfigItem] = useState({ uk: '', ru: '', en: '' });

    const [currentDiscount, setCurrentDiscount] = useState<number | null>(null);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);

    const loadData = async () => {
        try {
            const [carData, segmentsData] = await Promise.all([
                getOneCar(id.toString()),
                getSegments()
            ]);

            setCar(carData);
            setSegments(segmentsData);
            syncLocalState(carData);
        } catch (e) {
            console.error(e);
            router.push('/admin/cars');
        }
    };

    const syncLocalState = (data: Car) => {
        setDescription(normalizeMultiLang(data.description));

        setAttributes({
            engineVolume: data.engineVolume,
            engineType: normalizeMultiLang(data.engineType),
            transmission: normalizeMultiLang(data.transmission),
            fuelConsumption: data.fuelConsumption,
            driveType: normalizeMultiLang(data.driveType),
            seats: data.seats,
        });

        setTariffs(data.rentalTariff || []);
        setDeposit(data.rentalTariff?.[0]?.deposit || 0);

        try {
            const parsedConfig = data.configuration || [];
            // Проходимся по элементам массива. Элементы могут быть строками (JSON) или объектами.
            const normalizedConfig = parsedConfig.map((item: any) => normalizeMultiLang(item));
            setConfigurationList(normalizedConfig);
        } catch (e) {
            setConfigurationList([]);
        }

        setCurrentDiscount(data.discount || null);
        setIsNew(data.isNew || false);
        setIsAvailable(data.isAvailable || false);
    };

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    // --- ФОТО ---
    const handleAddPhoto = async (type: 'PREVIEW' | 'PC' | 'MOBILE', file: File) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('car', file);

        try {
            if (type === 'PREVIEW') {
                await addPreview(id, formData);
            } else {
                formData.append('type', type);
                formData.append('alt', car?.brand || 'auto');
                await addPhoto(id, formData);
            }
            await loadData();
        } catch (e) {
            alert('Ошибка загрузки фото: ' + e);
        }
    };

    const handleDeletePhoto = async (photoId: number) => {
        if (!confirm('Удалить фото?')) return;
        try {
            await deletePhoto(id, photoId);
            await loadData();
        } catch (e) { alert(e); }
    };

    const handleEditPhotoAlt = async (photoId: number, currentAlt: string = '') => {
        const alt = prompt(`Текущий alt: ${currentAlt}`, currentAlt);
        if (!alt) return;
        try {
            await updatePhoto(id, { photoId, alt });
            await loadData();
        } catch (e) { alert(e); }
    };

    // --- ОПИСАНИЕ ---
    const handleSaveDescription = async () => {
        try {
            await updateCar(id, { description: JSON.stringify(description) });
            await loadData();
            alert('Описание сохранено');
        } catch (e) { alert(e); }
    };

    // --- ХАРАКТЕРИСТИКИ ---
    const handleSaveAttributes = async () => {
        try {
            await updateCar(id, {
                ...attributes,
                seats: Number(attributes.seats)
            });
            await loadData();
            alert('Характеристики сохранены');
        } catch (e) { alert(e); }
    };

    const handleAttributeSelectChange = (key: string, optionValue: string, optionsList: any[]) => {
        const selectedOption = optionsList.find(o => o.value === optionValue);
        if (selectedOption) {
            setAttributes({ ...attributes, [key]: selectedOption.label });
        }
    };

    const updateLocalTariff = (min: number, max: number, value: string) => {
        const price = Number(value);
        const existingIndex = tariffs.findIndex(t => t.minDays === min && t.maxDays === max);
        const newTariffs = [...tariffs];
        if (existingIndex >= 0) {
            newTariffs[existingIndex] = { ...newTariffs[existingIndex], dailyPrice: price };
        } else {
            newTariffs.push({ minDays: min, maxDays: max, dailyPrice: price, deposit: deposit } as RentalTariff);
        }
        setTariffs(newTariffs);
    };

    const handleSaveTariffs = async () => {
        const tariffsToSend = tariffs.map(t => ({ ...t, deposit: Number(deposit) }));
        try {
            await updateRentalTariffs(id, tariffsToSend);
            await loadData();
            alert('Тарифы сохранены');
        } catch (e) { alert(e); }
    };

    // --- КОМПЛЕКТАЦИЯ (CONFIGURATION) ---

    // Открытие модалки добавления
    const openAddConfigModal = () => {
        setNewConfigItem({ uk: '', ru: '', en: '' });
        setIsConfigModalOpen(true);
    };

    // Сохранение нового пункта комплектации
    const handleSaveNewConfiguration = async (e: React.FormEvent) => {
        e.preventDefault();

        // Добавляем новый объект в список
        const newList = [...configurationList, newConfigItem];

        try {
            await updateCar(id, { configuration: newList });
            setIsConfigModalOpen(false);
            await loadData();
        } catch (e) { alert(e); }
    };

    // --- СКИДКИ ---
    const handleChangeDiscount = async (val: string) => {
        let discountValue: number | null = null;
        if (val !== 'none') {
            discountValue = parseInt(val) * -1;
        }
        try {
            await updateCar(id, { discount: discountValue });
            await loadData();
        } catch (e) { alert(e); }
    };

    // --- АТРИБУТИ (NEW, AVAILABLE) ---
    const handleToggleNew = async () => {
        try {
            await updateCar(id, { isNew: !isNew });
            await loadData();
        } catch (e) { alert(e); }
    };

    const handleToggleAvailable = async () => {
        try {
            await updateCar(id, { isAvailable: !isAvailable });
            await loadData();
        } catch (e) { alert(e); }
    };

    // --- ГЛАВНЫЕ НАСТРОЙКИ (Settings Modal) ---
    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        const segmentId = data.segmentId;
        const reqData: any = {
            brand: data.brand,
            model: data.model,
            plateNumber: data.plateNumber,
            VIN: data.VIN,
            color: data.color,
            yearOfManufacture: Number(data.yearOfManufacture),
        };

        if (segmentId) {
            reqData.segmentIds = [Number(segmentId)];
        }

        try {
            await updateCar(id, reqData);
            setIsSettingsModalOpen(false);
            await loadData();
        } catch (e) { alert(e); }
    };


    if (!car) return <div className="container">Загрузка...</div>;

    const segmentInfo = car.segment && car.segment.length > 0 ? car.segment[0] : null;

    return (
        <div className="cabinet-section__inner" id="carForm">
            <style jsx>{`
                .lang-switcher {
                    display: inline-flex;
                    margin-left: 15px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    overflow: hidden;
                    vertical-align: middle;
                }

                .attr-select {
                    width: 100%;
                    padding: 8px 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: transparent;
                    color: inherit;
                    font-family: inherit;
                }

                .main-info__label span {
                    width: 120%;
                }
            `}</style>

            <div className="cabinet-info">
                <div className="cabinet-info__top">
                    <h1 className="cabinet-info__title">
                        Название: <span>{car.brand}</span>
                    </h1>

                    <div className="cabinet-info__btns">
                        <button className="grey-btn">ТО и события</button>
                        <button className="grey-btn green" onClick={() => setIsSettingsModalOpen(true)}>
                            Редактировать
                        </button>
                        <button onClick={() => router.back()} className="grey-btn">Назад</button>
                    </div>
                </div>
                {/* Info List (Read Only) */}
                <ul className="cabinet-info__list">
                    <li className="cabinet-info__item head">
                        <span className="cabinet-info__value">Характеристики</span>
                        <span className="cabinet-info__value">Состояние / Статистика</span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">Марка: <span>{car.brand}</span></span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">Модель: <span>{car.model}</span></span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">Номер: <span>{car.plateNumber}</span></span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">VIN: <span>{car.VIN}</span></span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">Год: <span>{car.yearOfManufacture}</span></span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">Цвет: <span>{car.color}</span></span>
                    </li>
                    <li className="cabinet-info__item">
                        <span className="cabinet-info__value">Сегмент: <span>{segmentInfo?.name}</span></span>
                    </li>
                </ul>
            </div>

            {/* --- PREVIEW PHOTO --- */}
            <div className="main-info single mode" data-upload-group="PREVIEW">
                <div className="main-info__top">
                    <span className="main-info__title">ФОТО НА ПРЕВЬЮ 1000x560</span>
                </div>
                <div className="main-info__content">
                    <div className="main-info__wrapp">
                        <div id="preview" className="main-info__list">
                            {car.previewUrl && (
                                <div className="main-info__item">
                                    <img
                                        src={`${BASE_URL}static/${car.previewUrl}`}
                                        alt="Preview"
                                        style={{width: '100%', aspectRatio: '16/9', objectFit: 'cover'}}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <FileUploadButton onUpload={(f) => handleAddPhoto('PREVIEW', f)} />
                </div>
            </div>

            {/* --- PC PHOTOS --- */}
            <PhotoGroup
                title="ФОТО НА ПК ВЕРСИЮ ФОРМАТ: 16/9"
                photos={car.carPhoto.filter(p => p.type === 'PC')}
                type="PC"
                onUpload={(f: File) => handleAddPhoto('PC', f)}
                onDelete={handleDeletePhoto}
                onEdit={handleEditPhotoAlt}
                baseUrl={BASE_URL}
            />

            {/* --- MOBILE PHOTOS --- */}
            <PhotoGroup
                title="ФОТО НА МОБ ВЕРСИЮ ФОРМАТ: 1/1"
                photos={car.carPhoto.filter(p => p.type === 'MOBILE')}
                type="MOBILE"
                onUpload={(f: File) => handleAddPhoto('MOBILE', f)}
                onDelete={handleDeletePhoto}
                onEdit={handleEditPhotoAlt}
                baseUrl={BASE_URL}
                isMobileList={true}
            />

            {/* --- DESCRIPTION --- */}
            <div className="main-info">
                <div className="main-info__top">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="main-info__title">ОПИСАНИЕ АВТО</span>
                        <LangSwitcher current={activeLang} onChange={setActiveLang} />
                    </div>
                </div>
                <div className="main-info__inner">
                    <div className="main-info__box">
                        <label style={{width: '100%'}}>
                            <textarea
                                name="mess"
                                id="mess"
                                value={description[activeLang] || ''}
                                onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                                placeholder={`Описание (${LANGUAGES.find(l=>l.code===activeLang)?.label})`}
                            ></textarea>
                        </label>
                    </div>
                    <button onClick={handleSaveDescription} className="grey-btn" id="edit-description">Сохранить</button>
                </div>
            </div>

            {/* --- ATTRIBUTES (CHARACTERISTICS) --- */}
            <div className="main-info">
                <div className="main-info__top">
                    <div  style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="main-info__title">ХАРАКТЕРИСТИКИ АВТО</span>
                        <LangSwitcher current={activeLang} onChange={setActiveLang} />
                    </div>
                </div>
                <div className="main-info__inner">
                    <div className="main-info__box">
                        {/* Двигатель (объем) - оставляем текстовым, обычно цифры одинаковы */}
                        <AttributeInput
                            label="ДВИГАТЕЛЬ"
                            value={attributes.engineVolume}
                            onChange={(v: string) => setAttributes({...attributes, engineVolume: v})}
                            inputStyles={{ width: '34px' }}
                        />

                        {/* Тип двигателя - Селект */}
                        <label className="main-info__label">
                            <span>ТИП ДВИГАТЕЛЯ: </span>
                            <select
                                className="attr-select"
                                value={findSelectValue(attributes.engineType, ENGINE_TYPES)}
                                onChange={(e) => handleAttributeSelectChange('engineType', e.target.value, ENGINE_TYPES)}
                            >
                                <option value="">Не выбрано</option>
                                {ENGINE_TYPES.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label[activeLang]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* Трансмиссия - Селект */}
                        <label className="main-info__label">
                            <span>ТРАНСМИССИЯ: </span>
                            <select
                                className="attr-select"
                                value={findSelectValue(attributes.transmission, TRANSMISSION_TYPES)}
                                onChange={(e) => handleAttributeSelectChange('transmission', e.target.value, TRANSMISSION_TYPES)}
                            >
                                <option value="">Не выбрано</option>
                                {TRANSMISSION_TYPES.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label[activeLang]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* Расход топлива - Текст */}
                        <AttributeInput
                            label="РАСХОД ТОПЛИВА"
                            value={attributes.fuelConsumption}
                            onChange={(v: string) => setAttributes({...attributes, fuelConsumption: v})}
                            inputStyles={{ width: '34px' }}
                        />

                        {/* Привод - Селект */}
                        <label className="main-info__label">
                            <span>ПРИВОД: </span>
                            <select
                                className="attr-select"
                                value={findSelectValue(attributes.driveType, DRIVE_TYPES)}
                                onChange={(e) => handleAttributeSelectChange('driveType', e.target.value, DRIVE_TYPES)}
                            >
                                <option value="">Не выбрано</option>
                                {DRIVE_TYPES.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label[activeLang]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* Число мест - Число */}
                        <AttributeInput
                            label="ЧИСЛО МЕСТ"
                            value={attributes.seats}
                            type="number"
                            onChange={(v: string) => setAttributes({...attributes, seats: v})}
                            inputStyles={{ width: '15px' }}
                        />
                    </div>
                    <button onClick={handleSaveAttributes} className="grey-btn" id="edit-attr">Сохранить</button>
                </div>
            </div>

            {/* --- TARIFFS --- */}
            <div className="main-info">
                <div className="main-info__top">
                    <span className="main-info__title">СТОИМОСТЬ АРЕНДЫ USD / СУТКИ</span>
                </div>
                <div className="main-info__inner">
                    <div className="main-info__box">
                        <TariffInput inputStyles={{ minWidth: '24px' }} label="1—2 дня" min={1} max={2} tariffs={tariffs} onChange={updateLocalTariff} />
                        <TariffInput inputStyles={{ minWidth: '24px' }} label="3—7 дня" min={3} max={7} tariffs={tariffs} onChange={updateLocalTariff} />
                        <TariffInput inputStyles={{ minWidth: '24px' }} label="8—29 дня" min={8} max={29} tariffs={tariffs} onChange={updateLocalTariff} />
                        <TariffInput inputStyles={{ minWidth: '24px' }} label="БОЛЕЕ 29 дней" min={30} max={0} tariffs={tariffs} onChange={updateLocalTariff} />

                        <label className="main-info__label">
                            <span>ЗАЛОГ: </span>
                            <AdaptiveInput
                                type="number"
                                style={{minWidth: '24px'}}
                                value={deposit}
                                onChange={(value) => setDeposit(Number(value))}
                            />
                        </label>
                        <label className="main-info__label">
                                <span>СТОИМОСТЬ ПЕРЕПРОБЕГА ЗА 1КМ: </span>
                            <input type="text" style={{width: '24px'}} value={segmentInfo?.overmileagePrice || ''} disabled />
                        </label>
                    </div>
                    <button onClick={handleSaveTariffs} className="grey-btn" id="edit-tariff">Сохранить</button>
                </div>
            </div>

            {/* --- DISCOUNTS --- */}
            <div className="main-info mode">
                <div className="main-info__top">
                    <span className="main-info__title">СКИДКИ И ДРУГИЕ АТРИБУТЫ</span>
                </div>
                <div className="main-info__inner">
                    <div id="discount" className="main-info__box">
                        <label className="radio-checkbox mode">
                            <input
                                type="radio"
                                name="discount"
                                value="none"
                                className="radio-checkbox__field"
                                checked={currentDiscount === null || currentDiscount === 0}
                                onChange={() => handleChangeDiscount('none')}
                            />
                            <span className="radio-checkbox__content">Без скидки</span>
                        </label>
                        {['-5%', '-10%', '-15%', '-20%', '-25%', '-30%', '-35%'].map(val => {
                            const numVal = parseInt(val) * -1;
                            const isChecked = currentDiscount === numVal;
                            return (
                                <label key={val} className="radio-checkbox mode">
                                    <input
                                        type="radio"
                                        name="discount"
                                        value={val}
                                        className="radio-checkbox__field"
                                        checked={isChecked}
                                        onChange={() => handleChangeDiscount(val)}
                                    />
                                    <span className="radio-checkbox__content">{val}</span>
                                </label>
                            )
                        })}
                        <label className="radio-checkbox mode">
                            <input
                                type="checkbox"
                                name="new"
                                className="radio-checkbox__field"
                                checked={isNew}
                                onChange={handleToggleNew}
                            />
                            <span className="radio-checkbox__content">NEW</span>
                        </label>
                        <label className="radio-checkbox mode">
                            <input
                                type="checkbox"
                                name="available"
                                className="radio-checkbox__field"
                                checked={isAvailable}
                                onChange={handleToggleAvailable}
                            />
                            <span className="radio-checkbox__content">Доступно</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* --- CONFIGURATION --- */}
            <div className="main-info mode">
                <div className="main-info__top">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="main-info__title">КОМПЛЕКТАЦИЯ АВТО</span>
                        <LangSwitcher current={activeLang} onChange={setActiveLang} />
                    </div>
                </div>
                <div className="main-info__inner">
                    <div id="configuration" className="main-info__box">
                        {configurationList.map((item, idx) => (
                            <label key={idx} className="main-info__label">
                                <span>{item[activeLang]}</span>
                            </label>
                        ))}
                        {configurationList.length === 0 && <span style={{opacity: 0.5}}>Список пуст</span>}
                    </div>
                    <button onClick={openAddConfigModal} className="grey-btn" id="add-configuration">Добавить</button>
                </div>
            </div>

            {/* --- SETTINGS MODAL (Основные данные) --- */}
            {isSettingsModalOpen && (
                <div className="overlay fixed-block active" onClick={(e) => { if(e.target === e.currentTarget) setIsSettingsModalOpen(false) }}>
                    <form className="cabinet-modal modal mode active" style={{display: 'flex', opacity: 1}} onSubmit={handleSettingsSubmit}>
                        <div className="modal__top">
                            <span className="modal__title">Название:</span>
                            <div className="modal__btns">
                                <button type="submit" className="grey-btn">Сохранить</button>
                                <button type="button" className="grey-btn close" onClick={() => setIsSettingsModalOpen(false)}>Назад</button>
                            </div>
                        </div>

                        <div className="modal__box mode">
                            <div className="modal__form">
                                <label className="modal__label">
                                    <span>Марка: </span>
                                    <input name="brand" type="text" defaultValue={car.brand || ''} />
                                </label>
                                <label className="modal__label">
                                    <span>Модель: </span>
                                    <input name="model" type="text" defaultValue={car.model || ''} />
                                </label>
                                <label className="modal__label">
                                    <span>Номер: </span>
                                    <input name="plateNumber" type="text" defaultValue={car.plateNumber || ''} />
                                </label>
                                <label className="modal__label">
                                    <span>VIN: </span>
                                    <input name="VIN" type="text" defaultValue={car.VIN || ''} />
                                </label>
                                <label className="modal__label">
                                    <span>Год: </span>
                                    <input name="yearOfManufacture" type="text" defaultValue={car.yearOfManufacture || ''} />
                                </label>
                                <label className="modal__label">
                                    <span>Цвет: </span>
                                    <input name="color" type="text" defaultValue={car.color || ''} />
                                </label>
                                <div className="modal__label">
                                    <label className="modal__label">
                                        <span>Сегмент:</span>
                                        <select name="segmentId" defaultValue={car.segment?.[0].name} className="select-field" style={{display:'block', width:'100%', height:'40px', background: 'transparent', outline: 'none', borderRadius: '12px'}}>
                                            {segments.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* --- CONFIGURATION ADD MODAL (Модалка добавления комплектации) --- */}
            {isConfigModalOpen && (
                <div className="overlay fixed-block active" onClick={(e) => { if(e.target === e.currentTarget) setIsConfigModalOpen(false) }}>
                    <form className="cabinet-modal modal mode active" style={{display: 'flex', opacity: 1}} onSubmit={handleSaveNewConfiguration}>
                        <div className="modal__top">
                            <span className="modal__title">Добавить комплектацию</span>
                            <div className="modal__btns">
                                <button type="submit" className="grey-btn">Добавить</button>
                                <button type="button" className="grey-btn close" onClick={() => setIsConfigModalOpen(false)}>Отмена</button>
                            </div>
                        </div>

                        <div className="modal__box mode">
                            <div className="modal__form">
                                <label className="modal__label">
                                    <span>Значение (UA): </span>
                                    <input
                                        type="text"
                                        value={newConfigItem.uk}
                                        onChange={(e) => setNewConfigItem({...newConfigItem, uk: e.target.value})}
                                        required
                                    />
                                </label>
                                <label className="modal__label">
                                    <span>Значение (RU): </span>
                                    <input
                                        type="text"
                                        value={newConfigItem.ru}
                                        onChange={(e) => setNewConfigItem({...newConfigItem, ru: e.target.value})}
                                        required
                                    />
                                </label>
                                <label className="modal__label">
                                    <span>Значение (EN): </span>
                                    <input
                                        type="text"
                                        value={newConfigItem.en}
                                        onChange={(e) => setNewConfigItem({...newConfigItem, en: e.target.value})}
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

function LangSwitcher({ current, onChange }: { current: LangCode, onChange: (l: LangCode) => void }) {
    return (
        <div className="lang-switcher" style={{display: 'flex', gap: '10px'}}>
            {LANGUAGES.map(lang => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => onChange(lang.code)}
                    style={{
                        width: '30px',
                        height: '30px',
                        border: current === lang.code ? '1px solid #214230' : '1px solid #848484',
                        borderRadius: '8px',
                        color: current === lang.code ? '#fff' : '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: current === lang.code ? '#214230' : '#fff',
                        cursor: 'pointer'
                    }}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}

// Поиск значения для селекта (сравниваем объект из базы с объектами в словаре по EN ключу)
function findSelectValue(attributeObj: any, options: any[]) {
    if (!attributeObj) return '';
    const valEn = attributeObj.en;
    const found = options.find(o => o.label.en === valEn);
    return found ? found.value : '';
}

function PhotoGroup({ title, photos, type, onUpload, onDelete, onEdit, baseUrl, isMobileList = false }: any) {
    return (
        <div className="main-info mode" data-upload-group={type}>
            <div className="main-info__top">
                <span className="main-info__title">{title}</span>
            </div>
            <div className="main-info__content">
                <div className="main-info__wrapp">
                    <ul className={`main-info__list ${isMobileList ? 'mob' : ''}`} id={isMobileList ? 'mobile' : 'photo'}>
                        {photos.map((item: any) => (
                            <li key={item.id} className="main-info__item" data-photo={item.id}>
                                <button type="button" className="edit-btn" onClick={() => onEdit(item.id, item.alt)}>
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                    </svg>
                                </button>
                                <button type="button" className="delete-btn" onClick={() => onDelete(item.id)}>
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4z"/>
                                    </svg>
                                </button>
                                <img src={`${baseUrl}static/${item.url}`} alt={item.alt || 'photo'} style={{width: '100%', aspectRatio: '16/9', objectFit: 'cover'}} />
                            </li>
                        ))}
                    </ul>
                </div>
                <FileUploadButton onUpload={onUpload} />
            </div>
        </div>
    );
}

function FileUploadButton({ onUpload }: { onUpload: (f: File) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <input
                type="file"
                hidden
                ref={inputRef}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        onUpload(e.target.files[0]);
                        e.target.value = '';
                    }
                }}
            />
            <button className="main-info__add" onClick={() => inputRef.current?.click()}>+</button>
        </>
    );
}

function AttributeInput({ label, value, onChange, type = 'text', disabled = false, inputStyles }: any) {
    return (
        <label className="main-info__label">
            <span>{label}: </span>
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                style={inputStyles || {}}
            />
        </label>
    );
}

function TariffInput({ label, min, max, tariffs, onChange, inputStyles }: any) {
    const tariff = tariffs.find((t: any) => t.minDays === min && t.maxDays === max);
    const value = tariff ? tariff.dailyPrice : '';

    return (
        <label className="main-info__label">
            <span>{label}: </span>
            <AdaptiveInput
                type="number"
                value={value}
                style={inputStyles || {}}
                onChange={(val) => onChange(min, max, val)}
            />
        </label>
    );
}


interface IAdaptiveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value?: string | number;
    onChange: (v: string) => void;
}

function AdaptiveInput(props: IAdaptiveInputProps) {
    const { value, onChange, type = 'text', disabled = false, ...rest } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!inputRef.current || !measureRef.current) return;

        const width = measureRef.current.offsetWidth;
        inputRef.current.style.width = `${width + 3}px`;
    }, [value]);

    return (
        <>
            <input
                ref={inputRef}
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
    <span
        ref={measureRef}
        style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'pre',
            font: 'inherit',
        }}
    >
        {value || 0}
      </span>
    </>
    );
}
