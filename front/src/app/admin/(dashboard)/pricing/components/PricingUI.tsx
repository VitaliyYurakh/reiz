'use client';

import { useAdminTheme } from '@/context/AdminThemeContext';
import type { Pencil } from 'lucide-react';

export function HInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { H } = useAdminTheme();
  return (
    <input
      {...props}
      style={{
        width: '100%',
        height: 42,
        borderRadius: 16,
        border: 'none',
        background: H.bg,
        padding: '0 16px',
        fontSize: 13,
        fontWeight: 500,
        color: H.navy,
        fontFamily: H.font,
        outline: 'none',
        transition: 'box-shadow 0.15s',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px rgba(67,24,255,0.15)`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

export function HTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { H } = useAdminTheme();
  return (
    <textarea
      {...props}
      style={{
        width: '100%',
        minHeight: 70,
        borderRadius: 16,
        border: 'none',
        background: H.bg,
        padding: '12px 16px',
        fontSize: 13,
        fontWeight: 500,
        color: H.navy,
        fontFamily: H.font,
        outline: 'none',
        resize: 'vertical',
        transition: 'box-shadow 0.15s',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px rgba(67,24,255,0.15)`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

export function HLabel({ children }: { children: React.ReactNode }) {
  const { H } = useAdminTheme();
  return (
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: H.gray,
        marginBottom: 6,
        fontFamily: H.font,
      }}
    >
      {children}
    </label>
  );
}

export function HToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  const { H } = useAdminTheme();
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontFamily: H.font,
      }}
    >
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: checked
            ? `linear-gradient(135deg, ${H.purpleLight}, ${H.purple})`
            : H.grayLight,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: H.white,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            transition: 'left 0.2s',
          }}
        />
      </button>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 500, color: H.navy }}>
          {label}
        </span>
      )}
    </label>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  const { H } = useAdminTheme();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 49,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: H.font,
        background: active ? H.greenBg : H.bg,
        color: active ? H.green : H.gray,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: active ? H.green : H.gray,
        }}
      />
      {active ? 'Активен' : 'Неактивен'}
    </span>
  );
}

export function ActionButton({
  icon: Icon,
  onClick,
  title,
  variant = 'default',
  disabled,
}: {
  icon: typeof Pencil;
  onClick: () => void;
  title: string;
  variant?: 'default' | 'danger' | 'success';
  disabled?: boolean;
}) {
  const { H, theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const colors = {
    default: { bg: H.bg, color: H.navy, hoverBg: isDark ? 'rgba(255,255,255,0.06)' : '#E9EDF7' },
    danger: { bg: H.redBg, color: H.red, hoverBg: isDark ? 'rgba(252,129,129,0.15)' : '#FFE0DE' },
    success: { bg: H.greenBg, color: H.green, hoverBg: isDark ? 'rgba(72,187,120,0.15)' : '#D0FFE8' },
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 10,
        border: 'none',
        background: colors.bg,
        color: colors.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = colors.hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.bg;
      }}
    >
      <Icon style={{ width: 15, height: 15 }} />
    </button>
  );
}
