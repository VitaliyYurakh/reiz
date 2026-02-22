'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { getConfigurationOptions, type ConfigurationOption } from '@/lib/api/admin';
import { HModalOverlay, HModalFieldControlled } from './ui-primitives';
import type { MultiLang } from './constants';

interface ConfigurationModalProps {
  isOpen: boolean;
  configurationList: MultiLang[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newConfigItem: MultiLang;
  setNewConfigItem: (item: MultiLang) => void;
}

export function ConfigurationModal({
  isOpen,
  configurationList,
  onClose,
  onSubmit,
  newConfigItem,
  setNewConfigItem,
}: ConfigurationModalProps) {
  const { H } = useAdminTheme();
  const [configOptions, setConfigOptions] = useState<ConfigurationOption[]>([]);
  const [configSearch, setConfigSearch] = useState('');
  const [showConfigSuggestions, setShowConfigSuggestions] = useState(false);
  const configSearchRef = useRef<HTMLDivElement>(null);

  // Fetch config options when modal opens
  useEffect(() => {
    if (isOpen) {
      getConfigurationOptions()
        .then(setConfigOptions)
        .catch(() => setConfigOptions([]));
      setConfigSearch('');
      setNewConfigItem({ uk: '', ru: '', en: '', pl: '', ro: '' });
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <HModalOverlay onClose={onClose}>
      <form
        onSubmit={onSubmit}
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
            onClick={onClose}
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
            onClick={onClose}
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
  );
}
