'use client';

import type { ThemeTokens } from '@/context/AdminThemeContext';

export function CalendarStyles({ H }: { H: ThemeTokens }) {
  return (
    <style>{`
      .cal-page { display: flex; flex-direction: column; gap: 16px; }

      /* ── Toolbar ── */
      .cal-toolbar {
        background: ${H.white};
        border-radius: 20px;
        box-shadow: ${H.shadow};
        padding: 16px 22px;
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }
      .cal-toolbar-spacer { flex: 1; min-width: 12px; }

      .cal-title { display: flex; align-items: center; gap: 14px; min-width: 0; }
      .cal-title-icon {
        width: 44px; height: 44px;
        border-radius: 14px;
        background: ${H.purple}1A;
        color: ${H.purple};
        display: grid; place-items: center;
        flex-shrink: 0;
      }
      .cal-title-icon svg { width: 22px; height: 22px; }
      .cal-title-text h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: ${H.navy};
        line-height: 1.1;
      }
      .cal-title-text .sub {
        font-size: 13px;
        color: ${H.gray};
        margin-top: 4px;
        font-variant-numeric: tabular-nums;
      }

      /* Pill controls */
      .cal-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0 14px;
        border-radius: 999px;
        background: ${H.bg};
        font-size: 13px;
        font-weight: 500;
        color: ${H.gray};
        height: 40px;
        white-space: nowrap;
        transition: background 160ms, color 160ms, box-shadow 160ms;
      }
      .cal-pill:hover { color: ${H.navy}; }
      .cal-pill:focus-within { box-shadow: 0 0 0 2px ${H.purple}40; }
      .cal-pill svg { width: 15px; height: 15px; }
      .cal-pill input {
        background: transparent;
        border: 0;
        outline: 0;
        font: inherit;
        color: ${H.navy};
        width: 180px;
        padding: 0;
      }
      .cal-pill input::placeholder { color: ${H.gray}; }
      .cal-pill.cal-select {
        cursor: pointer;
        position: relative;
        padding-right: 30px;
      }
      .cal-pill.cal-select select {
        appearance: none;
        background: transparent;
        border: 0;
        outline: 0;
        font: inherit;
        font-weight: 600;
        color: ${H.navy};
        cursor: pointer;
        padding-right: 4px;
      }
      .cal-pill.cal-select::after {
        content: '';
        position: absolute;
        right: 14px;
        top: 50%;
        width: 7px; height: 7px;
        border-right: 1.5px solid ${H.gray};
        border-bottom: 1.5px solid ${H.gray};
        transform: translateY(-70%) rotate(45deg);
        pointer-events: none;
      }

      /* Date nav */
      .cal-datenav {
        display: inline-flex;
        align-items: center;
        background: ${H.bg};
        border-radius: 999px;
        padding: 4px;
        gap: 2px;
        height: 40px;
      }
      .cal-datenav button {
        width: 32px; height: 32px;
        border: 0;
        background: transparent;
        border-radius: 50%;
        display: grid; place-items: center;
        color: ${H.gray};
        cursor: pointer;
        transition: background 160ms, color 160ms;
      }
      .cal-datenav button:hover { background: ${H.white}; color: ${H.navy}; }
      .cal-datenav button svg { width: 14px; height: 14px; }
      .cal-datenav .today {
        width: auto;
        padding: 0 16px;
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        height: 32px;
        background: #5B9CFF;
      }
      .cal-datenav .today:hover { background: #4A8FE8; color: #fff; }

      .cal-icon-btn {
        width: 40px; height: 40px;
        border: 0;
        border-radius: 50%;
        background: ${H.bg};
        display: grid; place-items: center;
        color: ${H.gray};
        cursor: pointer;
        transition: background 160ms, color 160ms;
      }
      .cal-icon-btn:hover { color: ${H.navy}; }
      .cal-icon-btn svg { width: 16px; height: 16px; }
      .cal-icon-btn:disabled { opacity: 0.5; cursor: default; }

      /* Filter row */
      .cal-filters {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .cal-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0 14px 0 12px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -0.01em;
        background: ${H.bg};
        color: ${H.gray};
        border: 0;
        cursor: pointer;
        transition: all 160ms;
        white-space: nowrap;
        height: 36px;
      }
      .cal-chip .swatch {
        width: 8px; height: 8px; border-radius: 50%;
        flex-shrink: 0;
      }
      .cal-chip .count {
        font-family: ${H.font};
        font-size: 11.5px;
        font-weight: 600;
        background: ${H.white};
        padding: 1px 7px;
        border-radius: 999px;
        color: ${H.gray};
        font-variant-numeric: tabular-nums;
      }
      .cal-chip:hover { color: ${H.navy}; }
      .cal-chip.active.cal-chip-rental { background: rgba(16,185,129,0.14); color: #0EA572; }
      .cal-chip.active.cal-chip-rental .count { background: #fff; color: #0EA572; }
      .cal-chip.active.cal-chip-reservation { background: ${H.purple}1F; color: ${H.purple}; }
      .cal-chip.active.cal-chip-reservation .count { background: #fff; color: ${H.purple}; }
      .cal-chip.active.cal-chip-service { background: rgba(245,158,11,0.18); color: #B45309; }
      .cal-chip.active.cal-chip-service .count { background: #fff; color: #B45309; }
      .cal-chip.muted { opacity: 0.55; }
      .cal-chip.muted .swatch { background: ${H.grayLight} !important; }

      .cal-filter-divider {
        width: 1px; height: 22px;
        background: ${H.grayLight};
        margin: 0 4px;
      }

      .cal-availability-btn {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0 18px;
        height: 40px;
        border: 0;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        background: #14172A;
        color: #fff;
        cursor: pointer;
        transition: all 160ms;
      }
      .cal-availability-btn:hover { transform: translateY(-1px); box-shadow: ${H.shadowMd}; }
      .cal-availability-btn.active {
        background: #5B9CFF;
        box-shadow: 0 8px 20px -6px rgba(91, 156, 255, 0.5);
      }
      .cal-availability-btn svg { width: 14px; height: 14px; }

      /* Availability bar */
      .cal-availability-bar {
        background: ${H.white};
        border-radius: 16px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: ${H.shadowMd};
        flex-wrap: wrap;
        border-left: 4px solid ${H.purple};
        margin-top: 12px;
      }
      .cal-availability-bar .label {
        font-size: 13px;
        font-weight: 700;
        color: ${H.navy};
        letter-spacing: -0.01em;
      }
      .cal-availability-bar .field {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: ${H.bg};
        padding: 0 14px;
        border-radius: 999px;
        height: 36px;
      }
      .cal-availability-bar .field label {
        font-size: 11px;
        color: ${H.gray};
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;
      }
      .cal-availability-bar .field input {
        background: transparent; border: 0; outline: 0;
        font: inherit; font-size: 13px; font-weight: 600;
        color: ${H.navy};
        font-family: ${H.font};
      }
      .cal-availability-bar .result {
        margin-left: auto;
        font-size: 13px;
        font-weight: 600;
        color: ${H.navy};
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .cal-availability-bar .result strong { color: ${H.green}; font-size: 16px; font-weight: 800; }

      /* ── Calendar surface ── */
      .cal-surface {
        background: ${H.white};
        border-radius: 20px;
        box-shadow: ${H.shadow};
        overflow: hidden;
        position: relative;
      }
      .cal-grid-wrap {
        position: relative;
        overflow: auto;
        max-height: calc(100vh - 280px);
      }

      /* Header — month band */
      .cal-month-band {
        height: ${36}px;
        position: relative;
        border-bottom: 1px solid ${H.grayLight};
        background: ${H.bg};
      }
      .cal-month-label {
        position: absolute;
        top: 0; bottom: 0;
        display: flex;
        align-items: center;
        padding: 0 14px;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: ${H.navy};
        text-transform: capitalize;
        white-space: nowrap;
      }
      .cal-month-label.alt { color: ${H.gray}; }
      .cal-month-divider {
        position: absolute;
        top: 0; bottom: 0;
        width: 1px;
        background: ${H.grayLight};
      }

      /* Day cells (header) */
      .cal-day-head {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: ${H.gray};
        border-right: 1px solid ${H.grayLight}40;
        padding: 6px 4px;
        position: relative;
        font-feature-settings: 'tnum';
        background: ${H.bg};
      }
      .cal-day-head .dow {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: ${H.gray};
        font-weight: 700;
        line-height: 1;
      }
      .cal-day-head .num {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        display: grid;
        place-items: center;
        font-size: 14px;
        font-weight: 700;
        color: ${H.navy};
        letter-spacing: -0.02em;
        background: ${H.white};
        line-height: 1;
        font-family: ${H.font};
      }
      .cal-day-head.weekend { background: ${H.bg}; }
      .cal-day-head.weekend .dow { color: ${H.red}; }
      .cal-day-head.weekend .num { background: ${H.redBg}; color: ${H.red}; }
      .cal-day-head.today .dow { color: #5B9CFF; }
      .cal-day-head.today .num {
        background: #5B9CFF;
        color: #fff;
        box-shadow: 0 4px 12px -2px rgba(91, 156, 255, 0.5);
      }
      .cal-day-head.week-start { border-left: 1px solid ${H.grayLight}; }
      .cal-day-head.month-start { border-left: 2px solid ${H.purple}; }

      /* Occupancy band */
      .cal-occ-cell {
        height: 32px;
        border-right: 1px solid ${H.grayLight}40;
        display: grid;
        place-items: center;
        font-size: 10.5px;
        font-variant-numeric: tabular-nums;
        position: relative;
        background: ${H.white};
      }
      .cal-occ-cell.weekend { background: ${H.bg}80; }
      .cal-occ-bar {
        position: absolute;
        left: 4px; right: 4px; bottom: 4px;
        height: 4px;
        border-radius: 999px;
        background: ${H.bg};
        overflow: hidden;
      }
      .cal-occ-bar-fill {
        height: 100%;
        border-radius: 999px;
        background: ${H.green};
        transition: width 320ms ease;
      }
      .cal-occ-bar-fill.warm { background: ${H.orange}; }
      .cal-occ-bar-fill.hot { background: ${H.red}; }
      .cal-occ-cell .occ-label {
        font-weight: 700;
        color: ${H.gray};
        font-size: 10px;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        padding-bottom: 6px;
      }
      .cal-occ-cell.today .occ-label { color: ${H.purple}; }

      /* Car-column header — fleet stat panel */
      .cal-fleet-head {
        background: ${H.white};
        border-right: 1px solid ${H.grayLight};
        display: flex; flex-direction: column;
      }
      .cal-fleet-head .h-month {
        height: ${36}px;
        display: flex; align-items: center;
        padding: 0 18px;
        gap: 8px;
        border-bottom: 1px solid ${H.grayLight};
        background: ${H.bg};
      }
      .cal-fleet-head .h-month svg { width: 14px; height: 14px; flex-shrink: 0; color: ${H.gray}; }
      .cal-fleet-head .h-month .park-label {
        color: ${H.navy};
        font-weight: 700;
        font-size: 13px;
        letter-spacing: -0.01em;
      }
      .cal-fleet-head .h-month .park-count {
        margin-left: auto;
        font-size: 11px;
        font-weight: 700;
        background: ${H.white};
        color: ${H.gray};
        padding: 3px 9px;
        border-radius: 999px;
        font-variant-numeric: tabular-nums;
      }
      .cal-fleet-head .h-summary {
        display: flex;
        align-items: stretch;
        padding: 12px 18px;
        gap: 14px;
        height: ${64 + 32}px;
      }
      .cal-fleet-head .sum-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        min-width: 0;
      }
      .cal-fleet-head .sum-val {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: ${H.navy};
        font-variant-numeric: tabular-nums;
        line-height: 1;
        display: flex;
        align-items: baseline;
        gap: 2px;
        font-family: ${H.font};
      }
      .cal-fleet-head .sum-val .suf {
        font-size: 13px;
        font-weight: 700;
        color: ${H.gray};
        letter-spacing: -0.02em;
      }
      .cal-fleet-head .sum-key {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: ${H.gray};
        font-weight: 700;
      }
      .cal-fleet-head .sum-bar {
        margin-top: 4px;
        height: 4px;
        background: ${H.bg};
        border-radius: 999px;
        overflow: hidden;
      }
      .cal-fleet-head .sum-bar-fill {
        height: 100%;
        background: ${H.green};
        border-radius: 999px;
        transition: width 320ms ease;
      }
      .cal-fleet-head .sum-bar-fill.warm { background: ${H.orange}; }
      .cal-fleet-head .sum-bar-fill.hot { background: ${H.red}; }
      .cal-fleet-head .sum-divider {
        width: 1px;
        background: ${H.grayLight};
        align-self: stretch;
      }

      /* Car-row cell */
      .cal-car-cell {
        background: ${H.white};
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 12px;
        padding: 0 16px 0 18px;
        border-bottom: 1px solid ${H.grayLight}40;
        border-right: 1px solid ${H.grayLight};
        cursor: pointer;
        transition: background 160ms;
      }
      .cal-car-cell:hover { background: ${H.bg}; }

      .cal-car-thumb {
        width: 40px; height: 40px;
        border-radius: 12px;
        flex-shrink: 0;
        display: grid; place-items: center;
        background: ${H.bg};
        position: relative;
        overflow: hidden;
      }
      .cal-car-thumb .car-icon {
        width: 24px; height: 24px;
        color: ${H.gray};
      }
      .cal-car-thumb .car-tag {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 4px;
      }
      .cal-car-cell:hover .cal-car-thumb { background: ${H.white}; box-shadow: inset 0 0 0 1px ${H.grayLight}; }
      .cal-car-cell:hover .cal-car-thumb .car-icon { color: ${H.navy}; }

      .cal-car-info { min-width: 0; }
      .cal-car-name {
        font-size: 13.5px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: ${H.navy};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }
      .cal-car-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
        font-size: 11px;
        color: ${H.gray};
        white-space: nowrap;
      }
      .cal-car-meta .plate {
        font-family: ${H.font};
        letter-spacing: 0.04em;
        color: ${H.navy};
        font-weight: 700;
        background: ${H.bg};
        padding: 2px 7px;
        border-radius: 5px;
        font-size: 10.5px;
      }
      .cal-car-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: ${H.grayLight}; flex-shrink: 0; }

      /* Load donut */
      .cal-car-load {
        position: relative;
        width: 36px; height: 36px;
        flex-shrink: 0;
        display: grid; place-items: center;
      }
      .cal-car-load svg {
        width: 36px; height: 36px;
        transform: rotate(-90deg);
      }
      .cal-car-load svg .track { stroke: ${H.bg}; }
      .cal-car-load svg .bar { stroke: ${H.green}; transition: stroke-dashoffset 320ms ease; }
      .cal-car-load.warm svg .bar { stroke: ${H.orange}; }
      .cal-car-load.hot svg .bar { stroke: ${H.red}; }
      .cal-car-load .pct {
        position: absolute;
        font-size: 10px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        color: ${H.gray};
        letter-spacing: -0.04em;
        font-family: ${H.font};
      }
      .cal-car-load.warm .pct { color: ${H.orange}; }
      .cal-car-load.hot .pct { color: ${H.red}; }

      /* Day cells body */
      .cal-cell {
        position: relative;
        cursor: pointer;
        transition: background 140ms;
        border-right: 1px solid ${H.grayLight}40;
      }
      .cal-cell:hover { background: ${H.purple}10; }
      .cal-cell.weekend { background: ${H.bg}80; }
      .cal-cell.weekend:hover { background: ${H.purple}10; }
      .cal-cell.today { background: ${H.purple}0F; }
      .cal-cell.today:hover { background: ${H.purple}1A; }
      .cal-cell.avail-match { background: ${H.green}1A; }
      .cal-cell.avail-miss { background: ${H.red}10; }
      .cal-cell.week-start { border-left: 1px solid ${H.grayLight}; }
      .cal-cell.month-start { border-left: 2px solid ${H.purple}; }
      .cal-cell::before {
        content: attr(data-day);
        position: absolute;
        top: 4px; left: 6px;
        font-size: 10px;
        font-weight: 600;
        font-family: ${H.font};
        color: ${H.gray};
        opacity: 0.45;
        pointer-events: none;
        z-index: 0;
        font-variant-numeric: tabular-nums;
      }

      /* Booking bars */
      .cal-bar {
        position: absolute;
        border-radius: 8px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: -0.005em;
        color: #fff;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        z-index: 1;
        transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms;
        font-family: ${H.font};
        user-select: none;
      }
      .cal-bar.compact { font-size: 11.5px; padding: 0 8px; gap: 5px; }
      .cal-bar.compact .bar-when { display: none; }
      .cal-bar:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px -8px rgba(16,24,40,0.4);
        z-index: 3;
        filter: brightness(1.06);
      }
      .cal-bar .bar-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cal-bar .bar-when {
        opacity: 0.78;
        font-weight: 500;
        font-size: 11px;
        font-family: ${H.font};
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
      }
      .cal-bar.cancelled,
      .cal-bar.no_show {
        background: repeating-linear-gradient(45deg, ${H.gray} 0 6px, ${H.grayLight} 6px 12px) !important;
        color: ${H.white};
        text-decoration: line-through;
      }
      .cal-bar .status-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: rgba(255,255,255,0.85);
        flex-shrink: 0;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
      }
      .cal-bar.confirmed .status-dot { background: #FFF; }
      .cal-bar.picked_up .status-dot,
      .cal-bar.issued .status-dot { background: #FFE08A; box-shadow: 0 0 0 2px rgba(255,224,138,0.3); }
      .cal-bar.active .status-dot { background: #5DFFB6; box-shadow: 0 0 0 2px rgba(93,255,182,0.3); }
      .cal-bar.completed .status-dot { background: rgba(255,255,255,0.5); }

      .cal-bar.clip-l {
        border-top-left-radius: 2px !important;
        border-bottom-left-radius: 2px !important;
      }
      .cal-bar.clip-r {
        border-top-right-radius: 2px !important;
        border-bottom-right-radius: 2px !important;
      }
      .cal-bar .clip-arrow {
        width: 12px; height: 12px;
        display: grid; place-items: center;
        flex-shrink: 0;
        opacity: 0.85;
      }
      .cal-bar .clip-arrow.left { transform: scaleX(-1); }
      .cal-bar .clip-arrow svg { width: 12px; height: 12px; }

      .cal-conflict {
        position: absolute;
        top: 4px; right: 4px;
        width: 18px; height: 18px;
        background: ${H.red};
        color: #fff;
        border-radius: 50%;
        display: grid;
        place-items: center;
        z-index: 4;
        box-shadow: 0 0 0 3px ${H.white};
      }
      .cal-conflict svg { width: 11px; height: 11px; }
      .cal-bar.has-conflict {
        outline: 2px solid ${H.red};
        outline-offset: -2px;
        animation: cal-pulse 2s infinite;
      }
      @keyframes cal-pulse {
        0%, 100% { outline-color: ${H.red}; }
        50% { outline-color: ${H.red}40; }
      }

      /* Now line */
      .cal-now-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: ${H.red};
        z-index: 6;
        pointer-events: none;
        box-shadow: 0 0 0 1px ${H.red}30;
      }
      .cal-now-line::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -3px;
        width: 8px; height: 8px;
        background: ${H.red};
        border-radius: 50%;
        animation: cal-now-pulse 2s ease-in-out infinite;
      }
      .cal-now-badge {
        background: ${H.red};
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        font-family: ${H.font};
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 0.02em;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
      @keyframes cal-now-pulse {
        0%, 100% { box-shadow: 0 0 0 0 ${H.red}80; }
        50% { box-shadow: 0 0 0 5px ${H.red}10; }
      }
      @keyframes todayPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.18); }
        100% { transform: scale(1); }
      }

      /* Legend */
      .cal-legend {
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 14px 22px;
        border-top: 1px solid ${H.grayLight}40;
        flex-wrap: wrap;
        font-size: 12px;
        color: ${H.gray};
        background: ${H.white};
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }
      .cal-legend-item { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
      .cal-legend-item .swatch { width: 14px; height: 8px; border-radius: 3px; }
      .cal-legend-item .swatch.now {
        background: ${H.red};
        width: 2px; height: 14px;
        border-radius: 2px;
      }
      .cal-legend-item .swatch.cancelled {
        background: repeating-linear-gradient(45deg, ${H.gray} 0 3px, transparent 3px 6px);
      }
      .cal-legend-divider { width: 1px; height: 14px; background: ${H.grayLight}; }

      /* Empty state */
      .cal-empty {
        padding: 56px 24px;
        text-align: center;
        color: ${H.gray};
        font-size: 14px;
        font-family: ${H.font};
      }

      /* Modal helpers */
      @keyframes modalIn {
        from { opacity: 0; transform: scale(0.95) translateY(8px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .cal-modal { animation: modalIn 0.2s ease-out; }
      .cal-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 10px 24px;
        border-radius: 49px;
        border: none;
        background: linear-gradient(to right, ${H.purple}, ${H.purpleLight});
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        font-family: ${H.font};
        cursor: pointer;
        box-shadow: 0 2px 8px ${H.purple}40;
        transition: all 0.2s;
      }
      .cal-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px ${H.purple}60; }
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
      .cal-btn-secondary:hover { color: ${H.navy}; transform: translateY(-1px); }
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
      .cal-nav-btn:hover { background: ${H.bg}; color: ${H.navy}; }
    `}</style>
  );
}
