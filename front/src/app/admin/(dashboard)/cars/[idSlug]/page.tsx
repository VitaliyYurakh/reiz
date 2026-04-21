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
  updateCountingRules,
} from '@/lib/api/admin';
import { toast, toastError } from '@/lib/toast';
import { logError } from '@/lib/log';import { useConfirm } from '@/components/admin/ConfirmProvider';
import { Car, CarCountingRule, RentalTariff, Segment } from '@/types/cars';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Camera, DollarSign, Info, List, MapPin } from 'lucide-react';
import { normalizeMultiLang, type LangCode, type MultiLang } from './components/constants';
import { HeaderCard, InfoGrid } from './components/header-card';
import { MediaTab } from './components/media-tab';
import { DetailsTab } from './components/details-tab';
import { PricingTab } from './components/pricing-tab';
import { ConfigurationTab } from './components/configuration-tab';
import { SettingsModal } from './components/settings-modal';
import { ConfigurationModal } from './components/configuration-modal';
import { CitiesTab } from './components/cities-tab';

export default function CarEditPage() {
  const params = useParams();
  const router = useRouter();
  const { H } = useAdminTheme();
  const confirm = useConfirm();
  const id = Number(params.idSlug);

  const [car, setCar] = useState<Car | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingAlt, setEditingAlt] = useState<{ photoId: number; value: string } | null>(null);
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
  const [countingRules, setCountingRules] = useState<CarCountingRule[]>([]);
  const [rentalConditions, setRentalConditions] = useState({
    freeDeliveryThreshold: 0,
    cancellationHours: 24,
    paymentMethods: '',
    minRentalDays: 1,
    dailyMileageLimit: 300,
    overmileagePrice: 0,
    driverAge: 21,
    driverExperience: 2,
    fuelPolicy: 'full_to_full',
    weeklyMileageLimit: 0,
    monthlyMileageLimit: 0,
    unlimitedMileage: false,
    maxRentalDays: 0,
    allowCrossBorder: false,
    crossBorderFee: 0,
    crossBorderDailyFee: 0,
    allowedCountries: '',
    lateReturnGraceMin: 0,
    lateReturnFeePerHour: 0,
    youngerDriverAge: 0,
    youngerDriverSurcharge: 0,
    petAllowed: false,
    cleaningFee: 0,
    unlimitedMileagePrice1Day: 0,
    unlimitedMileagePrice2to7: 0,
    unlimitedMileageFreeFromDays: 0,
    intercityDeliveryPrice: 0,
    carWashPrice: 0,
    emptyTankFee: 0,
    additionalDriverFee: 0,
    equipmentRentalPrice: 0,
    afterHoursServiceFee: 0,
    workingHoursStart: '',
    workingHoursEnd: '',
    damageTiresFee: 0,
    damageGlassChipFee: 0,
    damageLostKeysFee: 0,
    damageBrokenGlassFee: 0,
    damageTotalLossPercent: 0,
    damageScratchesFee: 0,
    damageSmokingFee: 0,
    depositMultiplier: 0,
  });
  const [saving, setSaving] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [carData, segmentsData] = await Promise.all([getOneCar(id.toString()), getSegments()]);
      setCar(carData);
      setSegments(segmentsData);
      syncLocalState(carData);
    } catch (e) {
      logError(e);
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
    setCountingRules(data.carCountingRule || []);
    try {
      const parsedConfig = data.configuration || [];
      setConfigurationList(parsedConfig.map((item: any) => normalizeMultiLang(item)));
    } catch (e) {
      setConfigurationList([]);
    }
    setCurrentDiscount(data.discount || null);
    setIsNew(data.isNew || false);
    setIsAvailable(data.isAvailable || false);
    setRentalConditions({
      freeDeliveryThreshold: data.freeDeliveryThreshold ?? 0,
      cancellationHours: data.cancellationHours ?? 24,
      paymentMethods: data.paymentMethods ?? '',
      minRentalDays: data.minRentalDays ?? 1,
      dailyMileageLimit: data.dailyMileageLimit ?? 300,
      overmileagePrice: data.overmileagePrice ?? data.segment?.[0]?.overmileagePrice ?? 0,
      driverAge: data.driverAge ?? data.segment?.[0]?.driverAge ?? 21,
      driverExperience: data.driverExperience ?? data.segment?.[0]?.experience ?? 2,
      fuelPolicy: data.fuelPolicy ?? 'full_to_full',
      weeklyMileageLimit: data.weeklyMileageLimit ?? 0,
      monthlyMileageLimit: data.monthlyMileageLimit ?? 0,
      unlimitedMileage: data.unlimitedMileage ?? false,
      maxRentalDays: data.maxRentalDays ?? 0,
      allowCrossBorder: data.allowCrossBorder ?? false,
      crossBorderFee: data.crossBorderFee ?? 0,
      crossBorderDailyFee: data.crossBorderDailyFee ?? 0,
      allowedCountries: (data.allowedCountries ?? []).join(', '),
      lateReturnGraceMin: data.lateReturnGraceMin ?? 0,
      lateReturnFeePerHour: data.lateReturnFeePerHour ?? 0,
      youngerDriverAge: data.youngerDriverAge ?? 0,
      youngerDriverSurcharge: data.youngerDriverSurcharge ?? 0,
      petAllowed: data.petAllowed ?? false,
      cleaningFee: data.cleaningFee ?? 0,
      unlimitedMileagePrice1Day: data.unlimitedMileagePrice1Day ?? 0,
      unlimitedMileagePrice2to7: data.unlimitedMileagePrice2to7 ?? 0,
      unlimitedMileageFreeFromDays: data.unlimitedMileageFreeFromDays ?? 0,
      intercityDeliveryPrice: data.intercityDeliveryPrice ?? 0,
      carWashPrice: data.carWashPrice ?? 0,
      emptyTankFee: data.emptyTankFee ?? 0,
      additionalDriverFee: data.additionalDriverFee ?? 0,
      equipmentRentalPrice: data.equipmentRentalPrice ?? 0,
      afterHoursServiceFee: data.afterHoursServiceFee ?? 0,
      workingHoursStart: data.workingHoursStart ?? '',
      workingHoursEnd: data.workingHoursEnd ?? '',
      damageTiresFee: data.damageTiresFee ?? 0,
      damageGlassChipFee: data.damageGlassChipFee ?? 0,
      damageLostKeysFee: data.damageLostKeysFee ?? 0,
      damageBrokenGlassFee: data.damageBrokenGlassFee ?? 0,
      damageTotalLossPercent: data.damageTotalLossPercent ?? 0,
      damageScratchesFee: data.damageScratchesFee ?? 0,
      damageSmokingFee: data.damageSmokingFee ?? 0,
      depositMultiplier: data.depositMultiplier ?? 0,
    });
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
      toast.success('Фото завантажено');
    } catch (e) {
      toastError(e, 'Помилка завантаження фото');
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    const ok = await confirm({
      title: 'Видалити фото?',
      message: 'Цю дію не можна скасувати.',
      confirmLabel: 'Видалити',
      danger: true,
    });
    if (!ok) return;
    try {
      await deletePhoto(id, photoId);
      await loadData();
      toast.success('Фото видалено');
    } catch (e) {
      toastError(e, 'Не вдалося видалити фото');
    }
  };

  const handleEditPhotoAlt = (photoId: number, currentAlt: string = '') => {
    setEditingAlt({ photoId, value: currentAlt });
  };

  const submitEditAlt = async () => {
    if (!editingAlt) return;
    const alt = editingAlt.value.trim();
    if (!alt) {
      toast.error('Alt не може бути порожнім');
      return;
    }
    try {
      await updatePhoto(id, { photoId: editingAlt.photoId, alt });
      setEditingAlt(null);
      await loadData();
      toast.success('Alt оновлено');
    } catch (e) {
      toastError(e, 'Не вдалося оновити alt');
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
      toastError(e, 'Не вдалося зберегти опис');
    }
  };

  const handleSaveAttributes = async () => {
    try {
      await updateCar(id, { ...attributes, seats: Number(attributes.seats) });
      await loadData();
      showSaved('attributes');
    } catch (e) {
      toastError(e, 'Не вдалося зберегти характеристики');
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
    // Sequential (audit M-14): if overmileagePrice update fails, don't persist tariffs
    // at a different price expectation. Tariffs second because they are the bigger op.
    try {
      await updateCar(id, { overmileagePrice: Number(rentalConditions.overmileagePrice) || 0 });
      await updateRentalTariffs(id, tariffsToSend);
      await loadData();
      showSaved('tariffs');
    } catch (e) {
      toastError(e, 'Не вдалося зберегти тарифи');
    }
  };

  const handleSaveCoverage = async () => {
    try {
      const rulesToSend = countingRules.map((r) => ({
        pricePercent: r.pricePercent,
        depositPercent: r.depositPercent,
        priceFixed: r.priceFixed ?? null,
        priceFixed30: r.priceFixed30 ?? null,
        depositFixed: r.depositFixed ?? null,
      }));
      await updateCountingRules(id, rulesToSend);
      await loadData();
      showSaved('coverage');
    } catch (e) {
      toastError(e, 'Не вдалося зберегти правила покриття');
    }
  };

  const handleSaveRentalConditions = async () => {
    try {
      await updateCar(id, {
        freeDeliveryThreshold: Number(rentalConditions.freeDeliveryThreshold) || 0,
        cancellationHours: Number(rentalConditions.cancellationHours) || 0,
        paymentMethods: rentalConditions.paymentMethods || null,
        minRentalDays: Number(rentalConditions.minRentalDays) || 1,
        dailyMileageLimit: Number(rentalConditions.dailyMileageLimit) || 0,
        overmileagePrice: Number(rentalConditions.overmileagePrice) || 0,
        driverAge: Number(rentalConditions.driverAge) || 21,
        driverExperience: Number(rentalConditions.driverExperience) || 2,
        fuelPolicy: rentalConditions.fuelPolicy || null,
        weeklyMileageLimit: Number(rentalConditions.weeklyMileageLimit) || null,
        monthlyMileageLimit: Number(rentalConditions.monthlyMileageLimit) || null,
        unlimitedMileage: rentalConditions.unlimitedMileage,
        maxRentalDays: Number(rentalConditions.maxRentalDays) || null,
        allowCrossBorder: rentalConditions.allowCrossBorder,
        crossBorderFee: Number(rentalConditions.crossBorderFee) || null,
        crossBorderDailyFee: Number(rentalConditions.crossBorderDailyFee) || null,
        allowedCountries: rentalConditions.allowedCountries ? rentalConditions.allowedCountries.split(',').map((s: string) => s.trim()).filter(Boolean) : null,
        lateReturnGraceMin: Number(rentalConditions.lateReturnGraceMin) || null,
        lateReturnFeePerHour: Number(rentalConditions.lateReturnFeePerHour) || null,
        youngerDriverAge: Number(rentalConditions.youngerDriverAge) || null,
        youngerDriverSurcharge: Number(rentalConditions.youngerDriverSurcharge) || null,
        petAllowed: rentalConditions.petAllowed,
        cleaningFee: Number(rentalConditions.cleaningFee) || null,
        unlimitedMileagePrice1Day: Number(rentalConditions.unlimitedMileagePrice1Day) || null,
        unlimitedMileagePrice2to7: Number(rentalConditions.unlimitedMileagePrice2to7) || null,
        unlimitedMileageFreeFromDays: Number(rentalConditions.unlimitedMileageFreeFromDays) || null,
        intercityDeliveryPrice: Number(rentalConditions.intercityDeliveryPrice) || null,
        carWashPrice: Number(rentalConditions.carWashPrice) || null,
        emptyTankFee: Number(rentalConditions.emptyTankFee) || null,
        additionalDriverFee: Number(rentalConditions.additionalDriverFee) || null,
        equipmentRentalPrice: Number(rentalConditions.equipmentRentalPrice) || null,
        afterHoursServiceFee: Number(rentalConditions.afterHoursServiceFee) || null,
        workingHoursStart: rentalConditions.workingHoursStart || null,
        workingHoursEnd: rentalConditions.workingHoursEnd || null,
        damageTiresFee: Number(rentalConditions.damageTiresFee) || null,
        damageGlassChipFee: Number(rentalConditions.damageGlassChipFee) || null,
        damageLostKeysFee: Number(rentalConditions.damageLostKeysFee) || null,
        damageBrokenGlassFee: Number(rentalConditions.damageBrokenGlassFee) || null,
        damageTotalLossPercent: Number(rentalConditions.damageTotalLossPercent) || null,
        damageScratchesFee: Number(rentalConditions.damageScratchesFee) || null,
        damageSmokingFee: Number(rentalConditions.damageSmokingFee) || null,
        depositMultiplier: Number(rentalConditions.depositMultiplier) || null,
      });
      await loadData();
      showSaved('rentalConditions');
    } catch (e) {
      toastError(e, 'Не вдалося зберегти умови оренди');
    }
  };

  const handleSaveNewConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    const newList = [...configurationList, newConfigItem];
    try {
      await updateCar(id, { configuration: newList });
      setIsConfigModalOpen(false);
      await loadData();
      toast.success('Комплектацію додано');
    } catch (e) {
      toastError(e, 'Не вдалося зберегти комплектацію');
    }
  };

  const handleDeleteConfigItem = async (idx: number) => {
    const newList = configurationList.filter((_, i) => i !== idx);
    try {
      await updateCar(id, { configuration: newList });
      await loadData();
    } catch (e) {
      toastError(e, 'Не вдалося видалити пункт комплектації');
    }
  };

  const handleChangeDiscount = async (val: string) => {
    let discountValue: number | null = null;
    if (val !== 'none') discountValue = parseInt(val) * -1;
    try {
      await updateCar(id, { discount: discountValue });
      await loadData();
    } catch (e) {
      toastError(e, 'Не вдалося змінити знижку');
    }
  };

  const handleToggleNew = async () => {
    try {
      await updateCar(id, { isNew: !isNew });
      await loadData();
    } catch (e) {
      toastError(e, 'Не вдалося оновити позначку "новинка"');
    }
  };

  const handleToggleAvailable = async () => {
    try {
      await updateCar(id, { isAvailable: !isAvailable });
      await loadData();
    } catch (e) {
      toastError(e, 'Не вдалося оновити доступність');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const segmentIds = formData.getAll('segmentIds').map(Number);
    const reqData: any = {
      brand: data.brand,
      model: data.model,
      plateNumber: data.plateNumber,
      VIN: data.VIN,
      color: data.color,
      yearOfManufacture: Number(data.yearOfManufacture),
      segmentIds,
    };
    if (!segmentIds.length) {
      toast.error('Оберіть хоча б один сегмент');
      return;
    }
    try {
      await updateCar(id, reqData);
      setIsSettingsModalOpen(false);
      await loadData();
      toast.success('Дані авто збережено');
    } catch (e: unknown) {
      const errData = (e as { response?: { data?: { errors?: string[] } } })?.response?.data;
      const msg = errData?.errors?.length ? errData.errors.join(', ') : undefined;
      if (msg) {
        toast.error(msg);
      } else {
        toastError(e, 'Помилка збереження');
      }
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
        displayName={displayName}
        isAvailable={isAvailable}
        onToggleAvailable={handleToggleAvailable}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onBack={() => router.push('/admin/cars')}
      />

      {/* Info Grid */}
      <InfoGrid car={car} />

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
              { value: 'cities', icon: MapPin, label: 'Мiста' },
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
            countingRules={countingRules}
            setCountingRules={setCountingRules}
            onSaveCoverage={handleSaveCoverage}
            rentalConditions={rentalConditions}
            setRentalConditions={setRentalConditions}
            onSaveRentalConditions={handleSaveRentalConditions}
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

        <TabsContent value="cities" className="mt-5">
          <CitiesTab
            carId={id}
            saving={saving}
            onSaved={showSaved}
          />
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          car={car}
          segments={segments}
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

      {/* Edit Photo Alt Modal — replaces legacy window.prompt */}
      {editingAlt && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(27, 37, 89, 0.4)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: H.font,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditingAlt(null); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingAlt(null);
            if (e.key === 'Enter') submitEditAlt();
          }}
        >
          <div
            style={{
              background: H.white,
              borderRadius: 16,
              padding: 24,
              width: 'min(440px, calc(100vw - 32px))',
              boxShadow: H.shadowMd,
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: H.navyDark }}>
              Редагувати alt фото
            </h3>
            <p style={{ fontSize: 13, color: H.gray, marginTop: 6, marginBottom: 16 }}>
              Текст для атрибуту alt (SEO та accessibility).
            </p>
            <input
              type="text"
              autoFocus
              value={editingAlt.value}
              onChange={(e) => setEditingAlt({ ...editingAlt, value: e.target.value })}
              style={{
                width: '100%',
                height: 40,
                padding: '0 14px',
                borderRadius: 10,
                border: `1px solid ${H.grayLight}`,
                fontSize: 14,
                background: H.bg,
                color: H.navy,
                outline: 'none',
                fontFamily: H.font,
              }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setEditingAlt(null)}
                style={{
                  borderRadius: 49,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  background: H.bg,
                  color: H.navy,
                  cursor: 'pointer',
                }}
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={submitEditAlt}
                style={{
                  borderRadius: 49,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  background: `linear-gradient(135deg, ${H.purpleLight} 0%, ${H.purple} 100%)`,
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)',
                  cursor: 'pointer',
                }}
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
