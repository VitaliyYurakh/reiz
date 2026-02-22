'use client';

import React, { useRef, useState } from 'react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/cn';
import {
  Check,
  ImagePlus,
  Pencil,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { LANGUAGES, type LangCode } from './constants';
import type { RentalTariff } from '@/types/cars';

// ═══════════════════════════════════════════════════
// HCard
// ═══════════════════════════════════════════════════

export function HCard({
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

// ═══════════════════════════════════════════════════
// HLangSwitcher
// ═══════════════════════════════════════════════════

export function HLangSwitcher({ current, onChange }: { current: LangCode; onChange: (l: LangCode) => void }) {
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

// ═══════════════════════════════════════════════════
// HPhotoCard
// ═══════════════════════════════════════════════════

export function HPhotoCard({
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

// ═══════════════════════════════════════════════════
// HFileUpload
// ═══════════════════════════════════════════════════

export function HFileUpload({
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

// ═══════════════════════════════════════════════════
// HInput
// ═══════════════════════════════════════════════════

export function HInput({
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

// ═══════════════════════════════════════════════════
// HSelect
// ═══════════════════════════════════════════════════

export function HSelect({
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

// ═══════════════════════════════════════════════════
// HTariffField
// ═══════════════════════════════════════════════════

export function HTariffField({
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

// ═══════════════════════════════════════════════════
// HSaveButton
// ═══════════════════════════════════════════════════

export function HSaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
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

// ═══════════════════════════════════════════════════
// HModalOverlay
// ═══════════════════════════════════════════════════

export function HModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
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

// ═══════════════════════════════════════════════════
// HModalField
// ═══════════════════════════════════════════════════

export function HModalField({
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

// ═══════════════════════════════════════════════════
// HModalFieldControlled
// ═══════════════════════════════════════════════════

export function HModalFieldControlled({
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
