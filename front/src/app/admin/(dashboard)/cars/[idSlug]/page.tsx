'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/tabs';
import {
  addPhoto,
  addPreview,
  deletePhoto,
  getOneCar,
  getSegments,
  updateCar,
  updatePhoto,
  updateRentalTariffs,
  getConfigurationOptions,
  type ConfigurationOption,
} from '@/lib/api/admin';
import { Car, RentalTariff, Segment } from '@/types/cars';
import { BASE_URL } from '@/config/environment';
import { cn } from '@/lib/utils';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  ArrowLeft,
  Camera,
  Check,
  DollarSign,
  Fuel,
  Gauge,
  ImagePlus,
  Info,
  List,
  Monitor,
  Pencil,
  Plus,
  Save,
  Settings,
  Smartphone,
  Sparkles,
  Tag,
  Trash2,
  Search,
  Upload,
  X,
} from 'lucide-react';

// --- CONSTANTS & DICTIONARIES ---

const LANGUAGES = [
  { code: 'uk', label: 'UA' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
  { code: 'ro', label: 'RO' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

const ENGINE_TYPES = [
  { value: 'petrol', label: { uk: 'Бензин', ru: 'Бензин', en: 'Petrol', pl: 'Benzyna', ro: 'Benzină' } },
  { value: 'diesel', label: { uk: 'Дизель', ru: 'Дизель', en: 'Diesel', pl: 'Diesel', ro: 'Diesel' } },
  { value: 'electric', label: { uk: 'Електро', ru: 'Электро', en: 'Electric', pl: 'Elektryczny', ro: 'Electric' } },
  { value: 'hybrid', label: { uk: 'Гібрид', ru: 'Гибрид', en: 'Hybrid', pl: 'Hybryda', ro: 'Hibrid' } },
];

const TRANSMISSION_TYPES = [
  { value: 'automatic', label: { uk: 'Автомат', ru: 'Автомат', en: 'Automatic', pl: 'Automatyczna', ro: 'Automată' } },
  { value: 'manual', label: { uk: 'Механіка', ru: 'Механика', en: 'Manual', pl: 'Manualna', ro: 'Manuală' } },
  { value: 'robot', label: { uk: 'Робот', ru: 'Робот', en: 'Robot', pl: 'Zrobotyzowana', ro: 'Robotizată' } },
  { value: 'variator', label: { uk: 'Варіатор', ru: 'Вариатор', en: 'CVT', pl: 'CVT', ro: 'CVT' } },
];

const DRIVE_TYPES = [
  { value: 'front', label: { uk: 'Передній', ru: 'Передний', en: 'Front', pl: 'Przedni', ro: 'Față' } },
  { value: 'rear', label: { uk: 'Задній', ru: 'Задний', en: 'Rear', pl: 'Tylny', ro: 'Spate' } },
  { value: 'full', label: { uk: 'Повний', ru: 'Полный', en: 'AWD', pl: '4x4', ro: '4x4' } },
];

const normalizeMultiLang = (val: any): { uk: string; ru: string; en: string; pl: string; ro: string } => {
  if (!val) return { uk: '', ru: '', en: '', pl: '', ro: '' };
  if (typeof val === 'object' && val !== null) {
    return { uk: val.uk || '', ru: val.ru || '', en: val.en || '', pl: val.pl || '', ro: val.ro || '' };
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object' && ('uk' in parsed || 'ru' in parsed || 'en' in parsed)) {
        return { uk: parsed.uk || '', ru: parsed.ru || '', en: parsed.en || '', pl: parsed.pl || '', ro: parsed.ro || '' };
      }
    } catch (e) {}
    return { uk: val, ru: val, en: val, pl: val, ro: val };
  }
  return { uk: '', ru: '', en: '', pl: '', ro: '' };
};

function findSelectValue(attributeObj: any, options: any[]) {
  if (!attributeObj) return '';
  const valEn = attributeObj.en;
  const found = options.find((o) => o.label.en === valEn);
  return found ? found.value : '';
}

// --- MAIN COMPONENT ---

export default function CarEditPage() {
  const params = useParams();
  const router = useRouter();
  const { H } = useAdminTheme();
  const id = Number(params.idSlug);

  const [car, setCar] = useState<Car | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<LangCode>('uk');
  const [description, setDescription] = useState<{ uk: string; ru: string; en: string; pl: string; ro: string }>({ uk: '', ru: '', en: '', pl: '', ro: '' });
  const [attributes, setAttributes] = useState<any>({});
  const [tariffs, setTariffs] = useState<RentalTariff[]>([]);
  const [deposit, setDeposit] = useState<number>(0);
  const [configurationList, setConfigurationList] = useState<{ uk: string; ru: string; en: string; pl: string; ro: string }[]>([]);
  const [newConfigItem, setNewConfigItem] = useState({ uk: '', ru: '', en: '', pl: '', ro: '' });
  const [currentDiscount, setCurrentDiscount] = useState<number | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [saving, setSaving] = useState<string | null>(null);

  // --- Configuration suggestions ---
  const [configOptions, setConfigOptions] = useState<ConfigurationOption[]>([]);
  const [configSearch, setConfigSearch] = useState('');
  const [showConfigSuggestions, setShowConfigSuggestions] = useState(false);
  const configSearchRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      const [carData, segmentsData] = await Promise.all([getOneCar(id.toString()), getSegments()]);
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
      setConfigurationList(parsedConfig.map((item: any) => normalizeMultiLang(item)));
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

  // Fetch config options when modal opens
  useEffect(() => {
    if (isConfigModalOpen) {
      getConfigurationOptions()
        .then(setConfigOptions)
        .catch(() => setConfigOptions([]));
      setConfigSearch('');
      setNewConfigItem({ uk: '', ru: '', en: '', pl: '', ro: '' });
    }
  }, [isConfigModalOpen]);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (configSearchRef.current && !configSearchRef.current.contains(e.target as Node)) {
        setShowConfigSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter config options: exclude already added + match search query
  const availableConfigOptions = useMemo(() => {
    const addedKeys = new Set(configurationList.map((c) => c.uk.toLowerCase()));
    const q = configSearch.toLowerCase().trim();
    return configOptions
      .filter((opt) => !addedKeys.has(opt.uk.toLowerCase()))
      .filter(
        (opt) =>
          !q ||
          opt.uk.toLowerCase().includes(q) ||
          opt.ru.toLowerCase().includes(q) ||
          opt.en.toLowerCase().includes(q) ||
          opt.pl.toLowerCase().includes(q),
      );
  }, [configOptions, configurationList, configSearch]);

  // --- PHOTO HANDLERS ---
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
    } catch (e) {
      alert(String(e));
    }
  };

  const handleEditPhotoAlt = async (photoId: number, currentAlt: string = '') => {
    const alt = prompt(`Текущий alt: ${currentAlt}`, currentAlt);
    if (!alt) return;
    try {
      await updatePhoto(id, { photoId, alt });
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

  // --- SAVE HANDLERS ---
  const showSaved = (section: string) => {
    setSaving(section);
    setTimeout(() => setSaving(null), 1500);
  };

  const handleSaveDescription = async () => {
    try {
      await updateCar(id, { description: JSON.stringify(description) });
      await loadData();
      showSaved('description');
    } catch (e) {
      alert(String(e));
    }
  };

  const handleSaveAttributes = async () => {
    try {
      await updateCar(id, { ...attributes, seats: Number(attributes.seats) });
      await loadData();
      showSaved('attributes');
    } catch (e) {
      alert(String(e));
    }
  };

  const handleAttributeSelectChange = (key: string, optionValue: string, optionsList: any[]) => {
    const selectedOption = optionsList.find((o) => o.value === optionValue);
    if (selectedOption) {
      setAttributes({ ...attributes, [key]: selectedOption.label });
    }
  };

  const updateLocalTariff = (min: number, max: number, value: string) => {
    const price = Number(value);
    const existingIndex = tariffs.findIndex((t) => t.minDays === min && t.maxDays === max);
    const newTariffs = [...tariffs];
    if (existingIndex >= 0) {
      newTariffs[existingIndex] = { ...newTariffs[existingIndex], dailyPrice: price };
    } else {
      newTariffs.push({ minDays: min, maxDays: max, dailyPrice: price, deposit: deposit } as RentalTariff);
    }
    setTariffs(newTariffs);
  };

  const handleSaveTariffs = async () => {
    const tariffsToSend = tariffs.map((t) => ({ ...t, deposit: Number(deposit) }));
    try {
      await updateRentalTariffs(id, tariffsToSend);
      await loadData();
      showSaved('tariffs');
    } catch (e) {
      alert(String(e));
    }
  };

  const handleSaveNewConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    const newList = [...configurationList, newConfigItem];
    try {
      await updateCar(id, { configuration: newList });
      setIsConfigModalOpen(false);
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

  const handleDeleteConfigItem = async (idx: number) => {
    const newList = configurationList.filter((_, i) => i !== idx);
    try {
      await updateCar(id, { configuration: newList });
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

  const handleChangeDiscount = async (val: string) => {
    let discountValue: number | null = null;
    if (val !== 'none') discountValue = parseInt(val) * -1;
    try {
      await updateCar(id, { discount: discountValue });
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

  const handleToggleNew = async () => {
    try {
      await updateCar(id, { isNew: !isNew });
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

  const handleToggleAvailable = async () => {
    try {
      await updateCar(id, { isAvailable: !isAvailable });
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

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
    if (segmentId) reqData.segmentIds = [Number(segmentId)];
    try {
      await updateCar(id, reqData);
      setIsSettingsModalOpen(false);
      await loadData();
    } catch (e) {
      alert(String(e));
    }
  };

  // ── Loading Skeleton ──
  if (!car) {
    return (
      <div style={{ maxWidth: 1100, fontFamily: H.font }} className="space-y-5">
        <div style={{ height: 100, borderRadius: 20, background: H.white, boxShadow: H.shadow }} className="animate-pulse" />
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ height: 72, borderRadius: 16, background: H.white, boxShadow: H.shadow }} className="animate-pulse" />
          ))}
        </div>
        <div style={{ height: 300, borderRadius: 20, background: H.white, boxShadow: H.shadow }} className="animate-pulse" />
      </div>
    );
  }

  const segmentInfo = car.segment?.length ? car.segment[0] : null;
  const pcPhotos = car.carPhoto.filter((p) => p.type === 'PC');
  const mobilePhotos = car.carPhoto.filter((p) => p.type === 'MOBILE');
  const displayName = `${car.brand || ''} ${car.model || ''}`.trim() || segmentInfo?.name || `Авто #${car.id}`;

  return (
    <div style={{ maxWidth: 1100, fontFamily: H.font }} className="space-y-5">
      {/* ═══ Header Card ═══ */}
      <div
        style={{
          background: H.white,
          borderRadius: 20,
          boxShadow: H.shadow,
          padding: '24px 32px',
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/cars')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: H.bg,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: H.navy,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget.style.background = H.grayLight); }}
              onMouseLeave={(e) => { (e.currentTarget.style.background = H.bg); }}
            >
              <ArrowLeft style={{ width: 18, height: 18 }} />
            </button>
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: H.navyDark,
                  lineHeight: '32px',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {displayName}
              </h1>
              <div className="mt-1.5 flex items-center gap-2.5">
                {car.plateNumber && (
                  <span
                    style={{
                      display: 'inline-block',
                      background: H.bg,
                      borderRadius: 8,
                      padding: '3px 10px',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: H.navy,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {car.plateNumber}
                  </span>
                )}
                {car.yearOfManufacture && (
                  <span style={{ fontSize: 13, fontWeight: 500, color: H.gray }}>
                    {car.yearOfManufacture} г.
                  </span>
                )}
                {segmentInfo && (
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, rgba(134,140,255,0.12) 0%, rgba(67,24,255,0.12) 100%)',
                      borderRadius: 49,
                      padding: '3px 12px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: H.purple,
                    }}
                  >
                    {segmentInfo.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleAvailable}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 49,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: isAvailable ? H.greenBg : H.redBg,
                color: isAvailable ? H.green : H.red,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isAvailable ? H.green : H.red,
                }}
              />
              {isAvailable ? 'Доступно' : 'Недоступно'}
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 49,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
                color: '#fff',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget.style.boxShadow = '0 6px 20px rgba(67, 24, 255, 0.35)'); }}
              onMouseLeave={(e) => { (e.currentTarget.style.boxShadow = '0 4px 12px rgba(67, 24, 255, 0.25)'); }}
            >
              <Settings style={{ width: 15, height: 15 }} />
              Редактировать
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Info Grid ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Марка', value: car.brand },
          { label: 'Модель', value: car.model },
          { label: 'Номер', value: car.plateNumber },
          { label: 'VIN', value: car.VIN },
          { label: 'Год', value: car.yearOfManufacture },
          { label: 'Цвет', value: car.color },
          { label: 'Сегмент', value: segmentInfo?.name },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: H.white,
              borderRadius: 16,
              padding: '14px 16px',
              boxShadow: H.shadow,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              {item.label}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: H.navy, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.value || '—'}
            </p>
          </div>
        ))}
      </div>

      {/* ═══ Tabs ═══ */}
      <Tabs defaultValue="media" className="w-full">
        <div
          style={{
            display: 'inline-flex',
            background: H.white,
            borderRadius: 49,
            padding: 5,
            boxShadow: H.shadow,
          }}
        >
          <TabsList
            className="h-auto gap-1 rounded-none border-0 bg-transparent p-0"
          >
            {[
              { value: 'media', icon: Camera, label: 'Фото' },
              { value: 'details', icon: Info, label: 'Описание' },
              { value: 'pricing', icon: DollarSign, label: 'Цены' },
              { value: 'config', icon: List, label: 'Комплектация' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="car-tab-trigger"
                style={{ fontFamily: H.font }}
              >
                <tab.icon style={{ width: 15, height: 15 }} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <style>{`
          .car-tab-trigger {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            border-radius: 49px;
            padding: 9px 20px;
            font-size: 13px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            background: transparent;
            color: ${H.gray};
            box-shadow: none;
            outline: none;
          }
          .car-tab-trigger:hover {
            color: ${H.navy};
            background: ${H.bg};
          }
          .car-tab-trigger[data-state="active"] {
            background: ${H.navy} !important;
            color: ${H.white} !important;
            box-shadow: 0 4px 12px rgba(43, 54, 116, 0.2) !important;
          }
        `}</style>

        {/* ═══ TAB: Media ═══ */}
        <TabsContent value="media" className="mt-5">
          <div className="space-y-5">
            <HCard title="Превью фото" subtitle="1000 x 560" icon={Camera}>
              <div className="flex flex-wrap gap-4">
                {car.previewUrl && (
                  <div
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: `1px solid ${H.grayLight}`,
                    }}
                    className="w-full max-w-md"
                  >
                    <img
                      src={`${BASE_URL}static/${car.previewUrl}`}
                      alt="Preview"
                      className="w-full aspect-[16/9] object-cover"
                    />
                  </div>
                )}
                <HFileUpload onUpload={(f) => handleAddPhoto('PREVIEW', f)} label="Загрузить превью" />
              </div>
            </HCard>

            <HCard title="Фото для ПК" subtitle="Формат 16:9" icon={Monitor}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {pcPhotos.map((photo) => (
                  <HPhotoCard
                    key={photo.id}
                    photo={photo}
                    baseUrl={BASE_URL}
                    onDelete={handleDeletePhoto}
                    onEdit={handleEditPhotoAlt}
                  />
                ))}
                <HFileUpload onUpload={(f) => handleAddPhoto('PC', f)} label="Добавить" compact />
              </div>
            </HCard>

            <HCard title="Фото для мобильных" subtitle="Формат 1:1" icon={Smartphone}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {mobilePhotos.map((photo) => (
                  <HPhotoCard
                    key={photo.id}
                    photo={photo}
                    baseUrl={BASE_URL}
                    onDelete={handleDeletePhoto}
                    onEdit={handleEditPhotoAlt}
                    square
                  />
                ))}
                <HFileUpload onUpload={(f) => handleAddPhoto('MOBILE', f)} label="Добавить" compact square />
              </div>
            </HCard>
          </div>
        </TabsContent>

        {/* ═══ TAB: Details ═══ */}
        <TabsContent value="details" className="mt-5">
          <div className="space-y-5">
            <HCard
              title="Описание"
              icon={Info}
              headerRight={<HLangSwitcher current={activeLang} onChange={setActiveLang} />}
              footer={<HSaveButton onClick={handleSaveDescription} saved={saving === 'description'} />}
            >
              <textarea
                value={description[activeLang] || ''}
                onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                placeholder={`Описание на ${LANGUAGES.find((l) => l.code === activeLang)?.label}...`}
                rows={5}
                style={{
                  width: '100%',
                  borderRadius: 16,
                  border: 'none',
                  background: H.bg,
                  padding: '14px 18px',
                  fontSize: 14,
                  fontWeight: 400,
                  color: H.navy,
                  fontFamily: H.font,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'box-shadow 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,24,255,0.15)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              />
            </HCard>

            <HCard
              title="Характеристики"
              icon={Gauge}
              headerRight={<HLangSwitcher current={activeLang} onChange={setActiveLang} />}
              footer={<HSaveButton onClick={handleSaveAttributes} saved={saving === 'attributes'} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <HInput
                  label="Объём двигателя"
                  value={attributes.engineVolume || ''}
                  onChange={(v) => setAttributes({ ...attributes, engineVolume: v })}
                  placeholder="напр. 2.0"
                />
                <HSelect
                  label="Тип двигателя"
                  value={findSelectValue(attributes.engineType, ENGINE_TYPES)}
                  options={ENGINE_TYPES}
                  lang={activeLang}
                  onChange={(v) => handleAttributeSelectChange('engineType', v, ENGINE_TYPES)}
                />
                <HSelect
                  label="Трансмиссия"
                  value={findSelectValue(attributes.transmission, TRANSMISSION_TYPES)}
                  options={TRANSMISSION_TYPES}
                  lang={activeLang}
                  onChange={(v) => handleAttributeSelectChange('transmission', v, TRANSMISSION_TYPES)}
                />
                <HInput
                  label="Расход топлива"
                  value={attributes.fuelConsumption || ''}
                  onChange={(v) => setAttributes({ ...attributes, fuelConsumption: v })}
                  placeholder="л/100км"
                />
                <HSelect
                  label="Привод"
                  value={findSelectValue(attributes.driveType, DRIVE_TYPES)}
                  options={DRIVE_TYPES}
                  lang={activeLang}
                  onChange={(v) => handleAttributeSelectChange('driveType', v, DRIVE_TYPES)}
                />
                <HInput
                  label="Число мест"
                  value={String(attributes.seats || '')}
                  onChange={(v) => setAttributes({ ...attributes, seats: v })}
                  type="number"
                  placeholder="5"
                />
              </div>
            </HCard>
          </div>
        </TabsContent>

        {/* ═══ TAB: Pricing ═══ */}
        <TabsContent value="pricing" className="mt-5">
          <div className="space-y-5">
            <HCard
              title="Стоимость аренды"
              subtitle="USD / сутки"
              icon={DollarSign}
              footer={<HSaveButton onClick={handleSaveTariffs} saved={saving === 'tariffs'} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <HTariffField label="1–2 дня" min={1} max={2} tariffs={tariffs} onChange={updateLocalTariff} />
                <HTariffField label="3–7 дней" min={3} max={7} tariffs={tariffs} onChange={updateLocalTariff} />
                <HTariffField label="8–29 дней" min={8} max={29} tariffs={tariffs} onChange={updateLocalTariff} />
                <HTariffField label="30+ дней" min={30} max={0} tariffs={tariffs} onChange={updateLocalTariff} />
                <HInput
                  label="Залог (USD)"
                  value={String(deposit)}
                  onChange={(v) => setDeposit(Number(v))}
                  type="number"
                  placeholder="0"
                />
                <HInput
                  label="Перепробег ($/км)"
                  value={String(segmentInfo?.overmileagePrice || '')}
                  onChange={() => {}}
                  disabled
                />
              </div>
            </HCard>

            <HCard title="Скидки и атрибуты" icon={Tag}>
              <div className="space-y-6">
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Скидка
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeDiscount('none')}
                      style={{
                        borderRadius: 49,
                        padding: '8px 18px',
                        fontSize: 13,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: currentDiscount === null || currentDiscount === 0
                          ? H.navy
                          : H.bg,
                        color: currentDiscount === null || currentDiscount === 0
                          ? H.white
                          : H.gray,
                      }}
                    >
                      Без скидки
                    </button>
                    {[5, 10, 15, 20, 25, 30, 35].map((val) => {
                      const isActive = currentDiscount === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleChangeDiscount(`-${val}`)}
                          style={{
                            borderRadius: 49,
                            padding: '8px 18px',
                            fontSize: 13,
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            background: isActive
                              ? 'linear-gradient(135deg, #FFB547 0%, #FF9100 100%)'
                              : H.bg,
                            color: isActive ? H.white : '#FF9100',
                            boxShadow: isActive ? '0 4px 12px rgba(255, 145, 0, 0.25)' : 'none',
                          }}
                        >
                          -{val}%
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Метки
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleToggleNew}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        borderRadius: 49,
                        padding: '10px 22px',
                        fontSize: 13,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: isNew
                          ? `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`
                          : H.bg,
                        color: isNew ? H.white : H.purple,
                        boxShadow: isNew ? '0 4px 12px rgba(67, 24, 255, 0.25)' : 'none',
                      }}
                    >
                      <Sparkles style={{ width: 15, height: 15 }} /> NEW
                    </button>
                  </div>
                </div>
              </div>
            </HCard>
          </div>
        </TabsContent>

        {/* ═══ TAB: Configuration ═══ */}
        <TabsContent value="config" className="mt-5">
          <div className="space-y-5">
            <HCard
              title="Комплектация"
              icon={List}
              headerRight={<HLangSwitcher current={activeLang} onChange={setActiveLang} />}
              footer={
                <button
                  type="button"
                  onClick={() => {
                    setNewConfigItem({ uk: '', ru: '', en: '', pl: '', ro: '' });
                    setIsConfigModalOpen(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 49,
                    padding: '10px 22px',
                    fontSize: 13,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: H.bg,
                    color: H.navy,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget.style.background = H.grayLight); }}
                  onMouseLeave={(e) => { (e.currentTarget.style.background = H.bg); }}
                >
                  <Plus style={{ width: 15, height: 15 }} /> Добавить
                </button>
              }
            >
              {configurationList.length === 0 ? (
                <p style={{ fontSize: 14, color: H.gray }}>Список пуст</p>
              ) : (
                <div className="space-y-2">
                  {configurationList.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between"
                      style={{
                        borderRadius: 12,
                        background: H.bg,
                        padding: '12px 16px',
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 500, color: H.navy }}>
                        {item[activeLang] || '—'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteConfigItem(idx)}
                        className="opacity-0 group-hover:opacity-100"
                        style={{
                          borderRadius: 8,
                          padding: 6,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: H.red,
                          transition: 'all 0.15s',
                        }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </HCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══ Settings Modal ═══ */}
      {isSettingsModalOpen && (
        <HModalOverlay onClose={() => setIsSettingsModalOpen(false)}>
          <form
            onSubmit={handleSettingsSubmit}
            style={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 20,
              background: H.white,
              padding: 32,
              boxShadow: H.shadowMd,
              fontFamily: H.font,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: H.navyDark, margin: 0 }}>Основные данные</h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: 'none',
                  background: H.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: H.gray,
                  transition: 'all 0.15s',
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div className="space-y-4">
              <HModalField label="Марка" name="brand" defaultValue={car.brand || ''} />
              <HModalField label="Модель" name="model" defaultValue={car.model || ''} />
              <HModalField label="Номер" name="plateNumber" defaultValue={car.plateNumber || ''} />
              <HModalField label="VIN" name="VIN" defaultValue={car.VIN || ''} />
              <HModalField label="Год выпуска" name="yearOfManufacture" defaultValue={String(car.yearOfManufacture || '')} />
              <HModalField label="Цвет" name="color" defaultValue={car.color || ''} />
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Сегмент
                </label>
                <select
                  name="segmentId"
                  defaultValue={segmentInfo?.id || ''}
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 16,
                    border: 'none',
                    background: H.bg,
                    padding: '0 16px',
                    fontSize: 14,
                    fontWeight: 500,
                    color: H.navy,
                    fontFamily: H.font,
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23A3AED0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em 1.25em',
                  }}
                >
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end" style={{ marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                style={{
                  borderRadius: 49,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  background: H.bg,
                  color: H.navy,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                style={{
                  borderRadius: 49,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)',
                  transition: 'all 0.15s',
                }}
              >
                Сохранить
              </button>
            </div>
          </form>
        </HModalOverlay>
      )}

      {/* ═══ Configuration Add Modal ═══ */}
      {isConfigModalOpen && (
        <HModalOverlay onClose={() => setIsConfigModalOpen(false)}>
          <form
            onSubmit={handleSaveNewConfiguration}
            style={{
              width: '100%',
              maxWidth: 440,
              borderRadius: 20,
              background: H.white,
              padding: 32,
              boxShadow: H.shadowMd,
              fontFamily: H.font,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: H.navyDark, margin: 0 }}>Новый пункт</h3>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: 'none',
                  background: H.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: H.gray,
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            {/* Search from existing options */}
            <div ref={configSearchRef} style={{ position: 'relative', marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${H.grayLight}`,
                  background: H.bg,
                }}
              >
                <Search style={{ width: 16, height: 16, color: H.gray, flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Пошук з існуючих..."
                  value={configSearch}
                  onChange={(e) => {
                    setConfigSearch(e.target.value);
                    setShowConfigSuggestions(true);
                  }}
                  onFocus={() => setShowConfigSuggestions(true)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: 14,
                    color: H.navyDark,
                    fontFamily: H.font,
                  }}
                />
              </div>
              {showConfigSuggestions && availableConfigOptions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    maxHeight: 200,
                    overflowY: 'auto',
                    background: H.white,
                    borderRadius: 12,
                    border: `1px solid ${H.grayLight}`,
                    boxShadow: H.shadowMd,
                    zIndex: 50,
                  }}
                >
                  {availableConfigOptions.map((opt) => (
                    <button
                      key={opt.uk}
                      type="button"
                      onClick={() => {
                        setNewConfigItem({ uk: opt.uk, ru: opt.ru, en: opt.en, pl: opt.pl, ro: opt.ro || '' });
                        setConfigSearch('');
                        setShowConfigSuggestions(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: 14,
                        color: H.navyDark,
                        fontFamily: H.font,
                        borderBottom: `1px solid ${H.grayLight}`,
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = H.bg;
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{opt.uk}</span>
                      <span style={{ color: H.gray, marginLeft: 8, fontSize: 12 }}>
                        {opt.en}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                color: H.gray,
                fontSize: 12,
              }}
            >
              <div style={{ flex: 1, height: 1, background: H.grayLight }} />
              або введіть вручну
              <div style={{ flex: 1, height: 1, background: H.grayLight }} />
            </div>

            {/* 4 language fields */}
            <div className="space-y-4">
              <HModalFieldControlled
                label="Значення (UA)"
                value={newConfigItem.uk}
                onChange={(v) => setNewConfigItem({ ...newConfigItem, uk: v })}
                required
              />
              <HModalFieldControlled
                label="Значение (RU)"
                value={newConfigItem.ru}
                onChange={(v) => setNewConfigItem({ ...newConfigItem, ru: v })}
                required
              />
              <HModalFieldControlled
                label="Value (EN)"
                value={newConfigItem.en}
                onChange={(v) => setNewConfigItem({ ...newConfigItem, en: v })}
                required
              />
              <HModalFieldControlled
                label="Wartość (PL)"
                value={newConfigItem.pl}
                onChange={(v) => setNewConfigItem({ ...newConfigItem, pl: v })}
                required
              />
            </div>
            <div className="flex gap-3 justify-end" style={{ marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                style={{
                  borderRadius: 49,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  background: H.bg,
                  color: H.navy,
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                style={{
                  borderRadius: 49,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)',
                }}
              >
                Добавить
              </button>
            </div>
          </form>
        </HModalOverlay>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HELPER COMPONENTS — Horizon UI styled
// ═══════════════════════════════════════════════════

function HCard({
  title,
  subtitle,
  icon: Icon,
  children,
  headerRight,
  footer,
}: {
  title: string;
  subtitle?: string;
  icon?: any;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { H } = useAdminTheme();
  return (
    <div
      style={{
        background: H.white,
        borderRadius: 20,
        padding: 24,
        boxShadow: H.shadow,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(134,140,255,0.15) 0%, rgba(67,24,255,0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon style={{ width: 17, height: 17, color: H.purple }} />
            </div>
          )}
          <div className="min-w-0">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: H.navyDark, margin: 0, lineHeight: '22px' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: 12, fontWeight: 500, color: H.gray, margin: '2px 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {headerRight}
      </div>

      <div style={{ marginTop: 20 }}>{children}</div>

      {footer && (
        <div
          className="flex justify-end"
          style={{
            marginTop: 20,
            paddingTop: 20,
            borderTop: `1px solid ${H.bg}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function HLangSwitcher({ current, onChange }: { current: LangCode; onChange: (l: LangCode) => void }) {
  const { H } = useAdminTheme();
  return (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 49,
        background: H.bg,
        padding: 4,
      }}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          style={{
            borderRadius: 49,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: current === lang.code ? H.white : 'transparent',
            color: current === lang.code ? H.navy : H.gray,
            boxShadow: current === lang.code ? '0 2px 8px rgba(112,144,176,0.12)' : 'none',
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

function HPhotoCard({
  photo,
  baseUrl,
  onDelete,
  onEdit,
  square = false,
}: {
  photo: any;
  baseUrl: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, alt: string) => void;
  square?: boolean;
}) {
  const { H } = useAdminTheme();
  return (
    <div
      className="group relative"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: H.shadow,
      }}
    >
      <img
        src={`${baseUrl}static/${photo.url}`}
        alt={photo.alt || 'photo'}
        className={cn('w-full object-cover', square ? 'aspect-square' : 'aspect-[16/9]')}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(photo.id, photo.alt || '')}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: H.navy,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Pencil style={{ width: 13, height: 13 }} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(photo.id)}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: H.red,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Trash2 style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );
}

function HFileUpload({
  onUpload,
  label,
  compact = false,
  square = false,
}: {
  onUpload: (f: File) => void;
  label?: string;
  compact?: boolean;
  square?: boolean;
}) {
  const { H } = useAdminTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) onUpload(file);
  };

  return (
    <>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center',
          compact
            ? square ? 'aspect-square' : 'aspect-[16/9]'
            : 'w-full max-w-[200px] aspect-[16/9]',
        )}
        style={{
          borderRadius: 16,
          border: `2px dashed ${dragOver ? H.purple : H.grayLight}`,
          background: dragOver ? 'rgba(67,24,255,0.04)' : H.bg,
          color: dragOver ? H.purple : H.gray,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {dragOver ? (
          <>
            <Upload style={{ width: compact ? 20 : 24, height: compact ? 20 : 24, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Отпустите файл</span>
          </>
        ) : (
          <>
            <ImagePlus style={{ width: compact ? 20 : 24, height: compact ? 20 : 24, marginBottom: 4 }} />
            {label && <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>}
          </>
        )}
      </button>
    </>
  );
}

function HInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { H } = useAdminTheme();
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 16,
          border: 'none',
          background: H.bg,
          padding: '0 16px',
          fontSize: 14,
          fontWeight: 500,
          color: H.navy,
          fontFamily: H.font,
          outline: 'none',
          transition: 'box-shadow 0.15s',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => { if (!disabled) e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,24,255,0.15)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function HSelect({
  label,
  value,
  options,
  lang,
  onChange,
}: {
  label: string;
  value: string;
  options: any[];
  lang: LangCode;
  onChange: (v: string) => void;
}) {
  const { H } = useAdminTheme();
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 16,
          border: 'none',
          background: H.bg,
          padding: '0 16px',
          paddingRight: 36,
          fontSize: 14,
          fontWeight: 500,
          color: H.navy,
          fontFamily: H.font,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23A3AED0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundPosition: 'right 12px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
          transition: 'box-shadow 0.15s',
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,24,255,0.15)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      >
        <option value="">Не выбрано</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}

function HTariffField({
  label,
  min,
  max,
  tariffs,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  tariffs: RentalTariff[];
  onChange: (min: number, max: number, val: string) => void;
}) {
  const tariff = tariffs.find((t) => t.minDays === min && t.maxDays === max);
  return (
    <HInput
      label={label}
      value={String(tariff?.dailyPrice ?? '')}
      onChange={(v) => onChange(min, max, v)}
      type="number"
      placeholder="0"
    />
  );
}

function HSaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  const { H } = useAdminTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 49,
        padding: '10px 22px',
        fontSize: 13,
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: saved
          ? H.greenBg
          : `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
        color: saved ? H.green : H.white,
        boxShadow: saved ? 'none' : '0 4px 12px rgba(67, 24, 255, 0.25)',
      }}
    >
      {saved ? (
        <><Check style={{ width: 15, height: 15 }} /> Сохранено</>
      ) : (
        <><Save style={{ width: 15, height: 15 }} /> Сохранить</>
      )}
    </button>
  );
}

function HModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(27, 37, 89, 0.4)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function HModalField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  const { H } = useAdminTheme();
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </label>
      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 16,
          border: 'none',
          background: H.bg,
          padding: '0 16px',
          fontSize: 14,
          fontWeight: 500,
          color: H.navy,
          fontFamily: H.font,
          outline: 'none',
          transition: 'box-shadow 0.15s',
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,24,255,0.15)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function HModalFieldControlled({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const { H } = useAdminTheme();
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: H.gray, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 16,
          border: 'none',
          background: H.bg,
          padding: '0 16px',
          fontSize: 14,
          fontWeight: 500,
          color: H.navy,
          fontFamily: H.font,
          outline: 'none',
          transition: 'box-shadow 0.15s',
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,24,255,0.15)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
