'use client';

import React from 'react';
import { Gauge, Info } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { HCard, HLangSwitcher, HSaveButton, HInput, HSelect } from './ui-primitives';
import {
  LANGUAGES,
  ENGINE_TYPES,
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  findSelectValue,
  type LangCode,
  type MultiLang,
} from './constants';

interface DetailsTabProps {
  activeLang: LangCode;
  setActiveLang: (lang: LangCode) => void;
  description: MultiLang;
  setDescription: (desc: MultiLang) => void;
  attributes: any;
  setAttributes: (attrs: any) => void;
  saving: string | null;
  onSaveDescription: () => void;
  onSaveAttributes: () => void;
  onAttributeSelectChange: (key: string, optionValue: string, optionsList: any[]) => void;
}

export function DetailsTab({
  activeLang,
  setActiveLang,
  description,
  setDescription,
  attributes,
  setAttributes,
  saving,
  onSaveDescription,
  onSaveAttributes,
  onAttributeSelectChange,
}: DetailsTabProps) {
  const { H } = useAdminTheme();

  return (
    <div className="space-y-5">
      <HCard
        title="Описание"
        icon={Info}
        headerRight={<HLangSwitcher current={activeLang} onChange={setActiveLang} />}
        footer={<HSaveButton onClick={onSaveDescription} saved={saving === 'description'} />}
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
        footer={<HSaveButton onClick={onSaveAttributes} saved={saving === 'attributes'} />}
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
            onChange={(v) => onAttributeSelectChange('engineType', v, ENGINE_TYPES)}
          />
          <HSelect
            label="Трансмиссия"
            value={findSelectValue(attributes.transmission, TRANSMISSION_TYPES)}
            options={TRANSMISSION_TYPES}
            lang={activeLang}
            onChange={(v) => onAttributeSelectChange('transmission', v, TRANSMISSION_TYPES)}
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
            onChange={(v) => onAttributeSelectChange('driveType', v, DRIVE_TYPES)}
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
  );
}
