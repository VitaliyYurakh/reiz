'use client';

import React from 'react';
import { List, Plus, Trash2 } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { HCard, HLangSwitcher } from './ui-primitives';
import type { LangCode, MultiLang } from './constants';

interface ConfigurationTabProps {
  activeLang: LangCode;
  setActiveLang: (lang: LangCode) => void;
  configurationList: MultiLang[];
  onDeleteConfigItem: (idx: number) => void;
  onOpenAddModal: () => void;
}

export function ConfigurationTab({
  activeLang,
  setActiveLang,
  configurationList,
  onDeleteConfigItem,
  onOpenAddModal,
}: ConfigurationTabProps) {
  const { H } = useAdminTheme();

  return (
    <div className="space-y-5">
      <HCard
        title="Комплектация"
        icon={List}
        headerRight={<HLangSwitcher current={activeLang} onChange={setActiveLang} />}
        footer={
          <button
            type="button"
            onClick={onOpenAddModal}
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
                  onClick={() => onDeleteConfigItem(idx)}
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
  );
}
