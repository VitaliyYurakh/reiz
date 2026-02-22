'use client';

import type { ThemeTokens } from '@/context/AdminThemeContext';

export function CalendarStyles({ H }: { H: ThemeTokens }) {
  return (
    <style>{`
      .cal-bar {
        position: absolute;
        display: flex;
        align-items: center;
        border-radius: 8px;
        padding: 0 8px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
        overflow: hidden;
        color: #fff;
        font-family: ${H.font};
        user-select: none;
      }
      .cal-bar:hover {
        transform: translateY(-2px);
        filter: brightness(1.08);
      }
      .cal-bar-conflict {
        animation: conflictPulse 2s ease-in-out infinite;
      }
      @keyframes conflictPulse {
        0%, 100% { box-shadow: 0 0 0 2px ${H.red}; }
        50% { box-shadow: 0 0 0 2px ${H.red}, 0 0 10px rgba(238, 93, 80, 0.4); }
      }
      @keyframes modalIn {
        from { opacity: 0; transform: scale(0.95) translateY(8px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .cal-modal {
        animation: modalIn 0.2s ease-out;
      }
      .cal-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 10px 24px;
        border-radius: 49px;
        border: none;
        background: linear-gradient(135deg, ${H.purple} 0%, ${H.purpleLight} 100%);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        font-family: ${H.font};
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(67, 24, 255, 0.3);
        transition: all 0.2s;
      }
      .cal-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(67, 24, 255, 0.4);
      }
      .cal-btn-secondary {
        padding: 10px 24px;
        border-radius: 49px;
        border: none;
        background: ${H.white};
        color: ${H.gray};
        font-size: 13px;
        font-weight: 700;
        font-family: ${H.font};
        cursor: pointer;
        box-shadow: ${H.shadowMd};
        transition: all 0.2s;
      }
      .cal-btn-secondary:hover {
        color: ${H.navy};
        transform: translateY(-1px);
      }
      .cal-nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 49px;
        border: none;
        background: transparent;
        color: ${H.gray};
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cal-nav-btn:hover {
        background: ${H.bg};
        color: ${H.navy};
      }
      @keyframes todayPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
      @keyframes nowDotPulse {
        0%, 100% { box-shadow: 0 0 0 0 ${H.red}60; }
        50% { box-shadow: 0 0 0 4px ${H.red}20; }
      }
      .now-line-dot {
        animation: nowDotPulse 2s ease-in-out infinite;
      }
    `}</style>
  );
}
