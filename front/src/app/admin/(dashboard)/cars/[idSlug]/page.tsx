'use client';

import React, { useEffect, useState } from 'react';
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
} from '@/lib/api/admin';
import { Car, RentalTariff, Segment } from '@/types/cars';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Camera, DollarSign, Info, List } from 'lucide-react';
import { normalizeMultiLang, type LangCode, type MultiLang } from './components/constants';
import { HeaderCard, InfoGrid } from './components/header-card';
import { MediaTab } from './components/media-tab';
import { DetailsTab } from './components/details-tab';
import { PricingTab } from './components/pricing-tab';
import { ConfigurationTab } from './components/configuration-tab';
import { SettingsModal } from './components/settings-modal';
import { ConfigurationModal } from './components/configuration-modal';

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
  const [description, setDescription] = useState<MultiLang>({ uk: '', ru: '', en: '', pl: '', ro: '' });
  const [attributes, setAttributes] = useState<any>({});
  const [tariffs, setTariffs] = useState<RentalTariff[]>([]);
  const [deposit, setDeposit] = useState<number>(0);
  const [configurationList, setConfigurationList] = useState<MultiLang[]>([]);
  const [newConfigItem, setNewConfigItem] = useState<MultiLang>({ uk: '', ru: '', en: '', pl: '', ro: '' });
  const [currentDiscount, setCurrentDiscount] = useState<number | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [saving, setSaving] = useState<string | null>(null);

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
  const displayName = `${car.brand || ''} ${car.model || ''}`.trim() || segmentInfo?.name || `Авто #${car.id}`;

  return (
    <div style={{ maxWidth: 1100, fontFamily: H.font }} className="space-y-5">
      {/* Header Card */}
      <HeaderCard
        car={car}
        segmentInfo={segmentInfo}
        displayName={displayName}
        isAvailable={isAvailable}
        onToggleAvailable={handleToggleAvailable}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onBack={() => router.push('/admin/cars')}
      />

      {/* Info Grid */}
      <InfoGrid car={car} segmentInfo={segmentInfo} />

      {/* Tabs */}
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

        <TabsContent value="media" className="mt-5">
          <MediaTab
            car={car}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onEditPhotoAlt={handleEditPhotoAlt}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-5">
          <DetailsTab
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            description={description}
            setDescription={setDescription}
            attributes={attributes}
            setAttributes={setAttributes}
            saving={saving}
            onSaveDescription={handleSaveDescription}
            onSaveAttributes={handleSaveAttributes}
            onAttributeSelectChange={handleAttributeSelectChange}
          />
        </TabsContent>

        <TabsContent value="pricing" className="mt-5">
          <PricingTab
            tariffs={tariffs}
            deposit={deposit}
            setDeposit={setDeposit}
            segmentInfo={segmentInfo}
            saving={saving}
            onUpdateLocalTariff={updateLocalTariff}
            onSaveTariffs={handleSaveTariffs}
            currentDiscount={currentDiscount}
            onChangeDiscount={handleChangeDiscount}
            isNew={isNew}
            onToggleNew={handleToggleNew}
          />
        </TabsContent>

        <TabsContent value="config" className="mt-5">
          <ConfigurationTab
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            configurationList={configurationList}
            onDeleteConfigItem={handleDeleteConfigItem}
            onOpenAddModal={() => {
              setNewConfigItem({ uk: '', ru: '', en: '', pl: '', ro: '' });
              setIsConfigModalOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          car={car}
          segments={segments}
          segmentInfo={segmentInfo}
          onClose={() => setIsSettingsModalOpen(false)}
          onSubmit={handleSettingsSubmit}
        />
      )}

      {/* Configuration Add Modal */}
      <ConfigurationModal
        isOpen={isConfigModalOpen}
        configurationList={configurationList}
        onClose={() => setIsConfigModalOpen(false)}
        onSubmit={handleSaveNewConfiguration}
        newConfigItem={newConfigItem}
        setNewConfigItem={setNewConfigItem}
      />
    </div>
  );
}
