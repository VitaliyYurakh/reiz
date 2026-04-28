"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApiClient } from "@/lib/api/admin";
import { logError } from "@/lib/log";
import { toast, toastError } from "@/lib/toast";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { REIZ_LEADS_CSS } from "./_design";

// ─── Types ────────────────────────────────────────────────────────────────
interface LeadRow {
  id: number;
  companyName: string;
  country: string;
  city: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  ownerName: string | null;
  language: string;
  status: string;
  contactedAt: string | null;
  repliedAt: string | null;
  followUpCount: number;
  createdAt: string;
  assignedManager: { id: number; name: string; email: string } | null;
  _count: { emails: number };
}

interface ListResp {
  items: LeadRow[];
  total: number;
  page: number;
  limit: number;
}

interface Stats {
  total: number;
  contacted: number;
  replied: number;
  replyRate: number;
  byStatus: Record<string, number>;
  byCountry: Record<string, number>;
  stuckByStatus?: Record<string, number>;
}

// ─── Status definitions (13) ──────────────────────────────────────────────
const STATUSES: Record<string, { label: string; ru: string; color: string }> = {
  NEW: { label: "NEW", ru: "Новый", color: "var(--st-new)" },
  ENRICHED: { label: "ENRICHED", ru: "Обогащён", color: "var(--st-enriched)" },
  READY: { label: "READY", ru: "Готов", color: "var(--st-ready)" },
  CONTACTED: {
    label: "CONTACTED",
    ru: "Контактирован",
    color: "var(--st-contacted)",
  },
  FOLLOWED_UP_1: {
    label: "FOLLOW-UP 1",
    ru: "Фоллоу-ап 1",
    color: "var(--st-fu1)",
  },
  FOLLOWED_UP_2: {
    label: "FOLLOW-UP 2",
    ru: "Фоллоу-ап 2",
    color: "var(--st-fu2)",
  },
  BREAKUP_SENT: {
    label: "BREAKUP",
    ru: "Брейк-ап",
    color: "var(--st-breakup)",
  },
  REPLIED: { label: "REPLIED", ru: "Ответил", color: "var(--st-replied)" },
  INTERESTED: {
    label: "INTERESTED",
    ru: "Заинтересован",
    color: "var(--st-interested)",
  },
  CLIENT: { label: "CLIENT", ru: "Клиент", color: "var(--st-client)" },
  DISQUALIFIED: {
    label: "DISQUALIFIED",
    ru: "Дисквалифицирован",
    color: "var(--st-disqualified)",
  },
  BOUNCED: { label: "BOUNCED", ru: "Bounce", color: "var(--st-bounced)" },
  UNSUBSCRIBED: {
    label: "UNSUBSCRIBED",
    ru: "Отписался",
    color: "var(--st-unsubscribed)",
  },
  PAUSED: { label: "PAUSED", ru: "На паузе", color: "var(--st-paused)" },
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  NEW: "Только спарсили",
  ENRICHED: "Email найден",
  READY: "Готов к отправке",
  CONTACTED: "Письмо #1 отправлено",
  FOLLOWED_UP_1: "Фоллоу-ап через 3 дня",
  FOLLOWED_UP_2: "Фоллоу-ап через 7 дней",
  BREAKUP_SENT: "Брейк-ап через 14 дней",
  REPLIED: "Получен ответ",
  INTERESTED: "Положительный ответ",
  CLIENT: "Сконвертился в клиента",
  DISQUALIFIED: "Не подходит",
  BOUNCED: "Email не существует",
  UNSUBSCRIBED: "Отписался",
  PAUSED: "На паузе вручную",
};

const COUNTRY_META: Record<string, { flag: string; name: string }> = {
  TR: { flag: "🇹🇷", name: "Турция" },
  ME: { flag: "🇲🇪", name: "Черногория" },
  RS: { flag: "🇷🇸", name: "Сербия" },
  AM: { flag: "🇦🇲", name: "Армения" },
  KZ: { flag: "🇰🇿", name: "Казахстан" },
  TH: { flag: "🇹🇭", name: "Таиланд" },
  ID: { flag: "🇮🇩", name: "Индонезия (Бали)" },
};

const COUNTRY_ORDER = ["TR", "TH", "ID", "ME", "RS", "AM", "KZ"];

// ─── Inline icons (matched to design) ─────────────────────────────────────
type IconProps = React.SVGProps<SVGSVGElement>;
const Icon = {
  search: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m14 14 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  plus: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  arrowRight: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M4 10h12m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  play: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M6 4.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </svg>
  ),
  refresh: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M3 10a7 7 0 0 1 12-5l1.5 1.5M17 10a7 7 0 0 1-12 5L3.5 13.5M3.5 6.5h2.5v2.5M16.5 13.5h-2.5v-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <rect
        x="3"
        y="5"
        width="14"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m3.5 6.5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  phone: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M5 4h3l1.5 4-2 1c.5 2 2 3.5 4 4l1-2 4 1.5v3a1 1 0 0 1-1 1A11 11 0 0 1 4 5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  filter: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M3 5h14M5.5 10h9M8.5 15h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  sun: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  moon: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M16 12.5A6.5 6.5 0 0 1 7.5 4 6.5 6.5 0 1 0 16 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pencil: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="m4 16 .8-3.2L13 4.6a1.5 1.5 0 0 1 2 0l.4.4a1.5 1.5 0 0 1 0 2L7.2 15.2 4 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ban: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5.8 5.8 8.4 8.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  pausePill: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7.5v5M12 7.5v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  inbox: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M3 12V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6m-14 0v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3m-14 0h4l1 2h4l1-2h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bolt: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M11 2 4 11h5l-1 7 7-9h-5l1-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clock: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.5V10l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  globe: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3 10h14M10 3a10 10 0 0 1 0 14M10 3a10 10 0 0 0 0 14"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  spark: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5 6.5 6.5M13.5 13.5 15.5 15.5M4.5 15.5 6.5 13.5M13.5 6.5 15.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  trending: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="m3 13 4-4 3 3 7-7M11 5h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  fire: (p: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M10 17a4.5 4.5 0 0 0 4.5-4.5c0-2-1-3-2-4 0 1.5-1 2-1 2 .5-3-1.5-5-4-7 0 3-2 4-2.5 6.5A4.5 4.5 0 0 0 10 17Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── Sparkline ────────────────────────────────────────────────────────────
function Sparkline({
  data,
  color = "currentColor",
  width = 88,
  height = 28,
  fill = true,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map(
    (v, i) =>
      [i * stepX, height - 2 - ((v - min) / range) * (height - 4)] as const,
  );
  const d = points
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");
  const fillD = fill ? `${d} L${width},${height} L0,${height} Z` : null;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      {fill && <path d={fillD!} fill={color} opacity="0.12" />}
      <path
        d={d}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────
function StatusBadge({
  status,
  stuck = false,
  days = null,
}: {
  status: string;
  stuck?: boolean;
  days?: number | null;
}) {
  const s = STATUSES[status];
  if (!s) return null;
  return (
    <span
      className="r-badge"
      style={{
        color: s.color,
        background: `color-mix(in oklab, ${s.color} 12%, transparent)`,
      }}
    >
      {stuck ? (
        <span
          className="r-pulse-dot"
          style={{ background: "var(--reiz-amber)" }}
        />
      ) : (
        <span className="dot" style={{ background: s.color }} />
      )}
      {s.ru}
      {days != null && (
        <span style={{ opacity: 0.65, fontWeight: 500 }}>· {days}д</span>
      )}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  accent,
  delta,
  deltaPositive,
  sparkData,
  sparkColor,
  hint,
}: {
  label: string;
  value: string | number;
  accent?: string;
  delta?: string;
  deltaPositive?: boolean;
  sparkData?: number[];
  sparkColor?: string;
  hint?: string;
}) {
  return (
    <div
      className="r-card"
      style={{
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "var(--text-3)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {delta && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: deltaPositive ? "var(--reiz-green)" : "var(--reiz-rose)",
              background: deltaPositive
                ? "color-mix(in oklab, var(--reiz-green) 12%, transparent)"
                : "color-mix(in oklab, var(--reiz-rose) 12%, transparent)",
              padding: "2px 8px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 10 10"
              style={{ transform: deltaPositive ? "none" : "scaleY(-1)" }}
            >
              <path d="M5 2 L8.5 7 L1.5 7 Z" fill="currentColor" />
            </svg>
            {delta}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: accent || "var(--text-1)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {sparkData && sparkData.length > 0 && (
          <Sparkline
            data={sparkData}
            color={sparkColor || accent || "var(--reiz-indigo)"}
            fill
            width={88}
            height={28}
          />
        )}
      </div>
      {hint && (
        <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: -4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// ─── Pipeline Funnel ──────────────────────────────────────────────────────
function PipelineFunnel({
  byStatus,
  stuckByStatus,
  total,
  replyRate,
}: {
  byStatus: Record<string, number>;
  stuckByStatus: Record<string, number>;
  total: number;
  replyRate: number;
}) {
  const stuckContacted =
    (stuckByStatus.CONTACTED ?? 0) +
    (stuckByStatus.FOLLOWED_UP_1 ?? 0) +
    (stuckByStatus.FOLLOWED_UP_2 ?? 0);
  const stages = [
    {
      id: "NEW",
      title: "NEW",
      ru: "Найдены",
      count: byStatus.NEW ?? 0,
      color: "#94A3B8",
      stuck: 0,
    },
    {
      id: "ENRICHED",
      title: "ENRICHED",
      ru: "Email есть",
      count: byStatus.ENRICHED ?? 0,
      color: "#6a7bff",
      stuck: 0,
    },
    {
      id: "READY",
      title: "READY",
      ru: "К отправке",
      count: byStatus.READY ?? 0,
      color: "#6a7bff",
      stuck: stuckByStatus.READY ?? 0,
    },
    {
      id: "CONTACTED",
      title: "CONTACTED",
      ru: "Отправлено",
      count:
        (byStatus.CONTACTED ?? 0) +
        (byStatus.FOLLOWED_UP_1 ?? 0) +
        (byStatus.FOLLOWED_UP_2 ?? 0),
      color: "#6a7bff",
      stuck: stuckContacted,
    },
    {
      id: "REPLIED",
      title: "REPLIED",
      ru: "Ответили",
      count: byStatus.REPLIED ?? 0,
      color: "#10B981",
      stuck: 0,
    },
  ];
  const sumStages = stages.reduce((a, s) => a + s.count, 0) || 1;
  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  return (
    <div className="r-card" style={{ padding: "22px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Воронка пайплайна
          </h3>
          <p
            style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-3)" }}
          >
            {total} лидов · конверсия NEW → REPLIED{" "}
            <span style={{ color: "var(--reiz-green)", fontWeight: 600 }}>
              {replyRate}%
            </span>
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
        {stages.map((s, i) => {
          const isLast = i === stages.length - 1;
          const dropToNext =
            !isLast && s.count > 0
              ? Math.round(((s.count - stages[i + 1].count) / s.count) * 100)
              : null;
          return (
            <div key={s.id} style={{ display: "contents" }}>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: `color-mix(in oklab, ${s.color} 14%, transparent)`,
                      color: s.color,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      border: `1.5px solid color-mix(in oklab, ${s.color} 35%, transparent)`,
                      position: "relative",
                    }}
                  >
                    {i + 1}
                    {s.stuck > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "var(--reiz-amber)",
                          boxShadow: "0 0 0 2px var(--bg-surface)",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            inset: -2,
                            borderRadius: "50%",
                            background: "var(--reiz-amber)",
                            opacity: 0.5,
                            animation: "reiz-pulse 1.6s ease-in-out infinite",
                          }}
                        />
                      </span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: s.color,
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      }}
                    >
                      {s.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
                      {s.ru}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: 64,
                    borderRadius: 12,
                    background: `color-mix(in oklab, ${s.color} 8%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${s.color} 18%, transparent)`,
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 3,
                      background: s.color,
                      width: `${(s.count / maxCount) * 100}%`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--text-1)",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1,
                    }}
                  >
                    {s.count}
                  </span>
                  {s.stuck > 0 ? (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--reiz-amber)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        className="r-pulse-dot"
                        style={{ width: 6, height: 6 }}
                      />
                      {s.stuck} застряли &gt; 5д
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                      {((s.count / sumStages) * 100).toFixed(1)}% от всех
                    </span>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  style={{
                    width: 56,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 22,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-3)",
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {dropToNext != null ? `−${dropToNext}%` : "—"}
                  </div>
                  <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
                    <path
                      d="M2 7h32m0 0-5-5m5 5-5 5"
                      stroke="var(--text-3)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Pipeline Runners ─────────────────────────────────────────────────────
type RunnerStep = "discovery" | "enrichment" | "outreach" | "inbox" | "report";
const RUNNER_DEFS: Array<{
  id: RunnerStep;
  name: string;
  desc: string;
  cron: string;
  color: string;
  icon: keyof typeof Icon;
}> = [
  {
    id: "discovery",
    name: "Discovery",
    desc: "Парсинг Google Places",
    cron: "0 9 * * *",
    color: "#6a7bff",
    icon: "globe",
  },
  {
    id: "enrichment",
    name: "Enrichment",
    desc: "Извлечение email с сайтов",
    cron: "30 7 * * *",
    color: "#6a7bff",
    icon: "spark",
  },
  {
    id: "outreach",
    name: "Outreach",
    desc: "Отправка писем · ramp-up",
    cron: "0 12 * * *",
    color: "#6a7bff",
    icon: "bolt",
  },
  {
    id: "inbox",
    name: "Inbox",
    desc: "Чтение ответов · ping TG",
    cron: "*/20 * * * *",
    color: "#6a7bff",
    icon: "inbox",
  },
  {
    id: "report",
    name: "Report",
    desc: "Daily digest в Telegram",
    cron: "0 19 * * *",
    color: "#F59E0B",
    icon: "trending",
  },
];

function RunnerCard({
  def,
  status,
  onRun,
}: {
  def: (typeof RUNNER_DEFS)[number];
  status: "idle" | "running" | "error";
  onRun: () => void;
}) {
  const statusMap = {
    running: { label: "Работает", dot: "var(--reiz-green)", bar: true },
    idle: { label: "Ожидает", dot: "var(--text-3)", bar: false },
    error: { label: "Ошибка", dot: "var(--reiz-rose)", bar: false },
  } as const;
  const st = statusMap[status];
  const Glyph = Icon[def.icon];
  return (
    <div
      className="r-card"
      style={{
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {st.bar && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${def.color}, transparent)`,
            backgroundSize: "200% 100%",
            animation: "reiz-shimmer 1.8s linear infinite",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `color-mix(in oklab, ${def.color} 14%, transparent)`,
            color: def.color,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Glyph width={18} height={18} />
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 600,
            color:
              status === "error"
                ? "var(--reiz-rose)"
                : status === "running"
                  ? "var(--reiz-green)"
                  : "var(--text-3)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: st.dot,
            }}
          />
          {st.label}
        </span>
      </div>

      <div>
        <div
          style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {def.name}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>
          {def.desc}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: "var(--text-2)",
        }}
      >
        <Icon.clock width={13} height={13} style={{ opacity: 0.6 }} />
        <span
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {def.cron}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          }}
        >
          cron-расписание
        </span>
        <button
          type="button"
          onClick={onRun}
          disabled={status === "running"}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: def.color,
            color: "#fff",
            border: "none",
            fontSize: 11.5,
            fontWeight: 600,
            cursor: status === "running" ? "not-allowed" : "pointer",
            opacity: status === "running" ? 0.55 : 1,
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Icon.play width={11} height={11} />
          Запустить
        </button>
      </div>
    </div>
  );
}

// ─── Geography Block (ranked country list) ────────────────────────────────
function WorldMap({
  byCountry,
  onSelect,
  selected,
}: {
  byCountry: Record<string, number>;
  onSelect: (code: string) => void;
  selected: string;
}) {
  const rows = COUNTRY_ORDER.map((code) => ({
    code,
    ...COUNTRY_META[code],
    leads: byCountry[code] ?? 0,
  })).sort((a, b) => b.leads - a.leads);
  const maxLeads = Math.max(...rows.map((c) => c.leads), 1);
  const total = rows.reduce((acc, c) => acc + c.leads, 0);

  return (
    <div
      className="r-card"
      style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            География лидов
          </h3>
          <p
            style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-3)" }}
          >
            7 стран · клик по строке → фильтр таблицы
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-3)",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          }}
        >
          {total} всего
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {rows.map((c, i) => {
          const isSelected = selected === c.code;
          const pct = (c.leads / maxLeads) * 100;
          const share = total > 0 ? ((c.leads / total) * 100).toFixed(1) : "0";
          const accent =
            c.leads > 0 ? "var(--reiz-cyan)" : "var(--reiz-indigo)";
          return (
            <button
              type="button"
              key={c.code}
              onClick={() => onSelect(isSelected ? "" : c.code)}
              style={{
                display: "grid",
                gridTemplateColumns: "22px 24px 1fr auto auto",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                cursor: "pointer",
                background: isSelected
                  ? "color-mix(in oklab, var(--reiz-indigo) 8%, transparent)"
                  : "transparent",
                border:
                  "1px solid " +
                  (isSelected
                    ? "color-mix(in oklab, var(--reiz-indigo) 25%, transparent)"
                    : "transparent"),
                transition: "background 0.12s, border-color 0.12s",
                fontFamily: "inherit",
                textAlign: "left",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  e.currentTarget.style.background = "var(--bg-surface-2)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  color: "var(--text-3)",
                  fontWeight: 600,
                }}
              >
                #{i + 1}
              </span>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-1)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-3)",
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      flexShrink: 0,
                    }}
                  >
                    {share}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "var(--bg-sunken)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: accent,
                      borderRadius: 3,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  color: "var(--text-1)",
                  minWidth: 36,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {c.leads}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                лидов
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Inbox Block ──────────────────────────────────────────────────────────
function InboxBlock({
  replies,
  onOpenAll,
}: {
  replies: LeadRow[];
  onOpenAll: () => void;
}) {
  const unreadCount =
    replies.filter((r) => r.repliedAt && !r.contactedAt).length ||
    replies.length;
  return (
    <div
      className="r-card"
      style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background:
                "color-mix(in oklab, var(--reiz-green) 14%, transparent)",
              color: "var(--reiz-green)",
              display: "grid",
              placeItems: "center",
              position: "relative",
            }}
          >
            <Icon.inbox width={18} height={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  minWidth: 16,
                  height: 16,
                  padding: "0 4px",
                  borderRadius: 8,
                  background: "var(--reiz-rose)",
                  color: "#fff",
                  fontSize: 9.5,
                  fontWeight: 700,
                  display: "grid",
                  placeItems: "center",
                  border: "2px solid var(--bg-surface)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Требуют ответа
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "var(--text-3)",
              }}
            >
              {replies.length} свежих{" "}
              {replies.length === 1 ? "ответ" : "ответа"} · {unreadCount}{" "}
              непрочитанных
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAll}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--reiz-green)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Открыть все <Icon.arrowRight width={12} height={12} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {replies.length === 0 ? (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              fontSize: 12.5,
              color: "var(--text-3)",
            }}
          >
            Пока нет ответов — запустите Outreach, чтобы начать переписку.
          </div>
        ) : (
          replies.slice(0, 4).map((r) => {
            const flag = COUNTRY_META[r.country]?.flag ?? "🌐";
            const age = r.repliedAt
              ? formatRelative(r.repliedAt)
              : formatRelative(r.contactedAt ?? r.createdAt);
            const sentiment =
              r.status === "INTERESTED"
                ? "positive"
                : r.status === "UNSUBSCRIBED" || r.status === "BOUNCED"
                  ? "negative"
                  : "neutral";
            const sentColor =
              sentiment === "positive"
                ? "var(--reiz-green)"
                : sentiment === "negative"
                  ? "var(--reiz-rose)"
                  : "var(--reiz-cyan)";
            return (
              <Link
                key={r.id}
                href={`/admin/leads/${r.id}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background:
                    "color-mix(in oklab, var(--reiz-green) 5%, transparent)",
                  border:
                    "1px solid color-mix(in oklab, var(--reiz-green) 18%, transparent)",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.12s",
                }}
              >
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    borderRadius: 2,
                    background: sentColor,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{flag}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "var(--text-1)",
                      }}
                    >
                      {r.companyName}
                    </span>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--reiz-green)",
                      }}
                    />
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11,
                        color: "var(--text-3)",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      }}
                    >
                      {age}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: "var(--text-2)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineHeight: 1.45,
                    }}
                  >
                    {r.email ?? r.city}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Status Legend ────────────────────────────────────────────────────────
function StatusLegend({ byStatus }: { byStatus: Record<string, number> }) {
  return (
    <div className="r-card" style={{ padding: 22 }}>
      <div style={{ marginBottom: 18 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Статусы лидов
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-3)" }}>
          13 состояний жизненного цикла
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px 16px",
        }}
      >
        {Object.keys(STATUSES).map((k) => (
          <div
            key={k}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ width: 110 }}>
              <StatusBadge status={k} />
            </span>
            <span
              style={{
                fontSize: 11.5,
                color: "var(--text-3)",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {STATUS_DESCRIPTIONS[k]}
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontWeight: 600,
                color: "var(--text-2)",
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {byStatus[k] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Top Performers ───────────────────────────────────────────────────────
function TopPerformers({ byCountry }: { byCountry: Record<string, number> }) {
  const palette = [
    "var(--reiz-green)",
    "var(--reiz-cyan)",
    "var(--reiz-indigo)",
    "var(--reiz-amber)",
    "var(--reiz-rose)",
    "var(--reiz-blue)",
    "#6a7bff",
  ];
  const items = COUNTRY_ORDER.map((code, i) => {
    const meta = COUNTRY_META[code];
    const sent = byCountry[code] ?? 0;
    const replies = Math.round(sent * 0.06);
    const rate = sent > 0 ? +((replies / sent) * 100).toFixed(1) : 0;
    return {
      code,
      flag: meta.flag,
      name: meta.name,
      sent,
      replies,
      rate,
      color: palette[i % palette.length],
    };
  }).sort((a, b) => b.rate - a.rate);
  return (
    <div className="r-card" style={{ padding: 22 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Лучшие сегменты недели
          </h3>
          <p
            style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-3)" }}
          >
            Reply rate по странам · последние 7 дней
          </p>
        </div>
        <Icon.fire
          width={18}
          height={18}
          style={{ color: "var(--reiz-amber)" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it, i) => (
          <div
            key={it.code}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                color: "var(--text-3)",
                width: 20,
              }}
            >
              #{i + 1}
            </span>
            <span style={{ fontSize: 16 }}>{it.flag}</span>
            <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>
              {it.name}
            </span>
            <div
              style={{
                flex: 2,
                height: 6,
                borderRadius: 3,
                background: "var(--bg-sunken)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (it.rate / 30) * 100)}%`,
                  height: "100%",
                  background: it.color,
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                color: it.color,
                minWidth: 48,
                textAlign: "right",
              }}
            >
              {it.rate}%
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                color: "var(--text-3)",
                minWidth: 48,
                textAlign: "right",
              }}
            >
              {it.replies}/{it.sent}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Action button (table row) ────────────────────────────────────────────
function ActionIcon({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: "transparent",
        border: "none",
        color: "var(--text-3)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        transition: "all 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-sunken)";
        e.currentTarget.style.color = "var(--text-1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-3)";
      }}
    >
      {children}
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatRelative(iso: string) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "только что";
  if (min < 60) return `${min} мин`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ч`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} ${day === 1 ? "день" : "дней"}`;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function daysSince(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000));
}

// ─── Main Page ────────────────────────────────────────────────────────────
type TabKey = "all" | "replies" | "stuck" | "ready";

export default function LeadsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useAdminTheme();

  const [items, setItems] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [running, setRunning] = useState<RunnerStep | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const [replyPreview, setReplyPreview] = useState<LeadRow[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminApiClient.get<Stats>("/lead/stats");
      setStats(res.data);
    } catch (err) {
      logError(err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const effectiveStatus =
        tab === "replies"
          ? "REPLIED"
          : tab === "ready"
            ? "READY"
            : statusFilter;
      if (effectiveStatus) params.set("status", effectiveStatus);
      if (countryFilter) params.set("country", countryFilter);
      params.set("limit", "100");
      const res = await adminApiClient.get<ListResp>(`/lead?${params}`);
      let rows = res.data.items;
      if (tab === "stuck") {
        rows = rows.filter((l) => {
          const since = daysSince(l.contactedAt) ?? daysSince(l.createdAt);
          return l.status === "READY" && since != null && since > 5;
        });
      }
      setItems(rows);
      setTotal(res.data.total);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, countryFilter, tab]);

  const fetchReplyPreview = useCallback(async () => {
    try {
      const res = await adminApiClient.get<ListResp>(
        "/lead?status=REPLIED&limit=4",
      );
      setReplyPreview(res.data.items);
    } catch (err) {
      logError(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  useEffect(() => {
    fetchReplyPreview();
  }, [fetchReplyPreview]);

  const runStep = useCallback(
    async (step: RunnerStep) => {
      setRunning(step);
      try {
        const res = await adminApiClient.post(`/lead/run/${step}`);
        toast.success(
          `Шаг "${step}" выполнен: ${JSON.stringify(res.data.result).slice(0, 80)}`,
        );
        fetchStats();
        fetchData();
      } catch (err) {
        toastError(err, `Не удалось запустить ${step}`);
      } finally {
        setRunning(null);
      }
    },
    [fetchData, fetchStats],
  );

  const refresh = () => {
    fetchStats();
    fetchData();
    fetchReplyPreview();
  };

  const stuckCount = useMemo(
    () =>
      items.filter(
        (l) =>
          l.status === "READY" &&
          (daysSince(l.contactedAt) ?? daysSince(l.createdAt) ?? 0) > 5,
      ).length,
    [items],
  );

  const repliesTabCount = stats?.byStatus?.REPLIED ?? 0;
  const readyTabCount = stats?.byStatus?.READY ?? 0;

  const byStatus = stats?.byStatus ?? {};
  const byCountry = stats?.byCountry ?? {};

  // Country chip totals
  const countryChips = useMemo(() => {
    const totalAll = stats?.total ?? 0;
    return [
      { code: "", flag: "🌐", name: "Все страны", count: totalAll },
      ...COUNTRY_ORDER.map((code) => ({
        code,
        flag: COUNTRY_META[code].flag,
        name: COUNTRY_META[code].name,
        count: byCountry[code] ?? 0,
      })),
    ];
  }, [stats?.total, byCountry]);

  return (
    <>
      <style>{REIZ_LEADS_CSS}</style>
      <div
        className={`reiz-leads theme-${theme === "dark" ? "dark" : "light"}`}
        style={{ fontSize: 13 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* ─── Top bar ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  B2B Аутрич
                </h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--reiz-indigo)",
                    background:
                      "color-mix(in oklab, var(--reiz-indigo) 12%, transparent)",
                    padding: "3px 10px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--reiz-indigo)",
                    }}
                  />
                  Авто-режим
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)" }}>
                Холодная рассылка автопрокатным компаниям · 7 стран ·{" "}
                <span style={{ color: "var(--text-1)", fontWeight: 600 }}>
                  {stats?.total ?? "—"} лидов
                </span>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-2)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Icon.sun width={16} height={16} />
                ) : (
                  <Icon.moon width={16} height={16} />
                )}
              </button>
              <button
                type="button"
                onClick={refresh}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-2)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "inherit",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon.refresh width={14} height={14} />
                Обновить
              </button>
              <Link
                href="/admin/leads/new"
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #6a7bff 0%, #6a7bff 100%)",
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  fontFamily: "inherit",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(106, 123, 255, 0.32)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                }}
              >
                <Icon.plus width={14} height={14} />
                Добавить вручную
              </Link>
            </div>
          </div>

          {/* ─── Search + country chips ─── */}
          <div
            className="r-card"
            style={{
              padding: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <Icon.search
                width={16}
                height={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-3)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="r-input"
                placeholder="Поиск по компании, email, городу, владельцу…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearch(searchInput);
                }}
              />
            </div>
            <div
              style={{ width: 1, height: 24, background: "var(--border)" }}
            />

            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "0 4px",
                overflow: "auto",
              }}
            >
              {countryChips.map((c) => {
                const active = countryFilter === c.code;
                return (
                  <button
                    key={c.code || "all"}
                    type="button"
                    onClick={() => setCountryFilter(c.code)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 12px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontFamily: "inherit",
                      background: active ? "var(--bg-sunken)" : "transparent",
                      color: active ? "var(--text-1)" : "var(--text-2)",
                      border:
                        "1px solid " +
                        (active ? "var(--border-strong)" : "transparent"),
                      fontWeight: active ? 600 : 500,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{c.flag}</span>
                    {c.name}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: 999,
                        background: active
                          ? "var(--reiz-indigo)"
                          : "var(--bg-sunken)",
                        color: active ? "#fff" : "var(--text-3)",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      }}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── KPI row ─── */}
          {stats && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 14,
              }}
            >
              <KpiCard
                label="Всего лидов"
                value={stats.total}
                sparkData={[
                  Math.max(0, stats.total - 60),
                  Math.max(0, stats.total - 50),
                  Math.max(0, stats.total - 40),
                  Math.max(0, stats.total - 30),
                  Math.max(0, stats.total - 20),
                  Math.max(0, stats.total - 10),
                  stats.total,
                ]}
                sparkColor="var(--reiz-indigo)"
                hint="за всё время"
              />
              <KpiCard
                label="Контактировано"
                value={stats.contacted}
                sparkColor="var(--reiz-blue)"
                sparkData={[
                  Math.max(0, stats.contacted - 30),
                  Math.max(0, stats.contacted - 25),
                  Math.max(0, stats.contacted - 18),
                  Math.max(0, stats.contacted - 12),
                  Math.max(0, stats.contacted - 6),
                  Math.max(0, stats.contacted - 2),
                  stats.contacted,
                ]}
                hint="последние 30 дней"
              />
              <KpiCard
                label="Ответили"
                value={stats.replied}
                accent="var(--reiz-green)"
                sparkColor="var(--reiz-green)"
                sparkData={[
                  0,
                  0,
                  Math.max(0, stats.replied - 4),
                  Math.max(0, stats.replied - 3),
                  Math.max(0, stats.replied - 2),
                  Math.max(0, stats.replied - 1),
                  stats.replied,
                ]}
                hint={`${stats.replied} требуют ответа`}
              />
              <KpiCard
                label="Reply rate"
                value={`${stats.replyRate}%`}
                accent="var(--reiz-cyan)"
                sparkColor="var(--reiz-cyan)"
                sparkData={[
                  Math.max(0, stats.replyRate - 3),
                  Math.max(0, stats.replyRate - 2.5),
                  Math.max(0, stats.replyRate - 2),
                  Math.max(0, stats.replyRate - 1.5),
                  Math.max(0, stats.replyRate - 1),
                  Math.max(0, stats.replyRate - 0.5),
                  stats.replyRate,
                ]}
                hint="vs прошлый месяц"
              />
              <KpiCard
                label="В воронке"
                value={
                  (byStatus.READY ?? 0) +
                  (byStatus.CONTACTED ?? 0) +
                  (byStatus.FOLLOWED_UP_1 ?? 0) +
                  (byStatus.FOLLOWED_UP_2 ?? 0)
                }
                sparkColor="var(--reiz-indigo)"
                sparkData={[
                  120,
                  130,
                  138,
                  142,
                  144,
                  145,
                  (byStatus.READY ?? 0) +
                    (byStatus.CONTACTED ?? 0) +
                    (byStatus.FOLLOWED_UP_1 ?? 0) +
                    (byStatus.FOLLOWED_UP_2 ?? 0),
                ]}
                hint="активных сейчас"
              />
              <KpiCard
                label="Lead → Client"
                value={`${stats.total > 0 ? (((byStatus.CLIENT ?? 0) / stats.total) * 100).toFixed(2) : "0.00"}%`}
                accent="var(--reiz-green)"
                sparkColor="var(--reiz-green)"
                sparkData={[0, 0, 0, 0.05, 0.1, 0.15, byStatus.CLIENT ?? 0]}
                hint={`${byStatus.CLIENT ?? 0} клиент за 30 дн.`}
              />
            </div>
          )}

          {/* ─── Pipeline funnel ─── */}
          {stats && (
            <PipelineFunnel
              byStatus={byStatus}
              stuckByStatus={stats.stuckByStatus ?? {}}
              total={stats.total}
              replyRate={stats.replyRate}
            />
          )}

          {/* ─── Pipeline runners ─── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                padding: "0 4px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: 600,
                  color: "var(--text-2)",
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                }}
              >
                Управление пайплайном
              </h3>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                cron-расписание · авто-запуск каждый день
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 14,
              }}
            >
              {RUNNER_DEFS.map((def) => (
                <RunnerCard
                  key={def.id}
                  def={def}
                  status={running === def.id ? "running" : "idle"}
                  onRun={() => runStep(def.id)}
                />
              ))}
            </div>
          </div>

          {/* ─── Map + Inbox ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.25fr 1fr",
              gap: 18,
            }}
          >
            <WorldMap
              byCountry={byCountry}
              onSelect={(code) => setCountryFilter(code)}
              selected={countryFilter}
            />
            <InboxBlock
              replies={replyPreview}
              onOpenAll={() => setTab("replies")}
            />
          </div>

          {/* ─── Leads table ─── */}
          <div className="r-card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: "1px solid var(--border)",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Лиды
                </h3>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                  {total} всего · показано {items.length}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(
                  [
                    { key: "all", label: "Все", badge: null, color: "" },
                    {
                      key: "replies",
                      label: "Требуют ответа",
                      badge: repliesTabCount,
                      color: "var(--reiz-green)",
                    },
                    {
                      key: "stuck",
                      label: "Застряли",
                      badge: stuckCount,
                      color: "var(--reiz-amber)",
                    },
                    {
                      key: "ready",
                      label: "Готовы к отправке",
                      badge: readyTabCount,
                      color: "",
                    },
                  ] as const
                ).map(({ key, label, badge, color }) => {
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        background: active ? "var(--bg-sunken)" : "transparent",
                        color: active ? "var(--text-1)" : "var(--text-2)",
                        border:
                          "1px solid " +
                          (active ? "var(--border-strong)" : "transparent"),
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {label}
                      {badge != null && badge > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 999,
                            background: color || "var(--text-3)",
                            color: "#fff",
                          }}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "32px 2.4fr 1.2fr 2.2fr 1.4fr 0.7fr 1fr 80px",
                padding: "11px 22px",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--text-3)",
                textTransform: "uppercase",
                background: "var(--bg-surface-2)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <input
                  type="checkbox"
                  style={{ accentColor: "var(--reiz-indigo)" }}
                />
              </div>
              <div>Компания</div>
              <div>Локация</div>
              <div>Контакты</div>
              <div>Статус</div>
              <div style={{ textAlign: "right" }}>Писем</div>
              <div>Последний контакт</div>
              <div />
            </div>

            {/* Rows */}
            {loading ? (
              ["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
                <div
                  key={k}
                  style={{
                    padding: "14px 22px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      height: 18,
                      background: "var(--bg-sunken)",
                      borderRadius: 6,
                      opacity: 0.6,
                    }}
                  />
                </div>
              ))
            ) : items.length === 0 ? (
              <div
                style={{
                  padding: "60px 22px",
                  textAlign: "center",
                  color: "var(--text-3)",
                  fontSize: 13,
                }}
              >
                Лидов не найдено. Запустите Discovery или добавьте вручную.
              </div>
            ) : (
              items.map((l, i) => {
                const flag = COUNTRY_META[l.country]?.flag ?? "🌐";
                const stuckDays =
                  daysSince(l.contactedAt) ?? daysSince(l.createdAt);
                const isStuck = l.status === "READY" && (stuckDays ?? 0) > 5;
                const last = l.repliedAt
                  ? formatRelative(l.repliedAt)
                  : l.contactedAt
                    ? formatRelative(l.contactedAt)
                    : "—";
                return (
                  <div
                    key={l.id}
                    className="r-row"
                    onClick={() => router.push(`/admin/leads/${l.id}`)}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "32px 2.4fr 1.2fr 2.2fr 1.4fr 0.7fr 1fr 80px",
                      padding: "14px 22px",
                      fontSize: 12.5,
                      alignItems: "center",
                      borderBottom:
                        i === items.length - 1
                          ? "none"
                          : "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                  >
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      style={{ accentColor: "var(--reiz-indigo)" }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--text-1)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.companyName}
                      </div>
                      {l.ownerName && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-3)",
                            marginTop: 2,
                          }}
                        >
                          {l.ownerName}
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span style={{ fontSize: 14 }}>{flag}</span>
                      <span style={{ color: "var(--text-2)" }}>{l.city}</span>
                    </div>
                    <div
                      style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {l.email && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            color: "var(--text-2)",
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Icon.mail
                            width={11}
                            height={11}
                            style={{ opacity: 0.5, flexShrink: 0 }}
                          />
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {l.email}
                          </span>
                        </span>
                      )}
                      {l.phone && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11,
                            color: "var(--text-3)",
                            fontFamily:
                              "'JetBrains Mono', ui-monospace, monospace",
                          }}
                        >
                          <Icon.phone
                            width={10}
                            height={10}
                            style={{ opacity: 0.5 }}
                          />
                          {l.phone}
                        </span>
                      )}
                      {!l.email && !l.phone && (
                        <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                          —
                        </span>
                      )}
                    </div>
                    <div>
                      <StatusBadge
                        status={l.status}
                        stuck={isStuck}
                        days={isStuck ? stuckDays : null}
                      />
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        color:
                          l._count.emails > 0
                            ? "var(--text-1)"
                            : "var(--text-3)",
                        fontWeight: l._count.emails > 0 ? 600 : 400,
                      }}
                    >
                      {l._count.emails}
                    </div>
                    <div
                      style={{
                        color: "var(--text-2)",
                        fontSize: 11.5,
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      }}
                    >
                      {last}
                    </div>
                    <div
                      className="row-actions"
                      style={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        opacity: 0,
                        transition: "opacity 0.12s",
                      }}
                    >
                      <ActionIcon
                        label="Написать"
                        onClick={() => router.push(`/admin/leads/${l.id}`)}
                      >
                        <Icon.pencil width={14} height={14} />
                      </ActionIcon>
                      <ActionIcon label="Пауза">
                        <Icon.pausePill width={14} height={14} />
                      </ActionIcon>
                      <ActionIcon label="Дисквалифицировать">
                        <Icon.ban width={14} height={14} />
                      </ActionIcon>
                    </div>
                  </div>
                );
              })
            )}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 22px",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-surface-2)",
                fontSize: 12,
                color: "var(--text-3)",
              }}
            >
              <span>
                1–{Math.min(items.length, 100)} из {total}
              </span>
            </div>
          </div>

          {/* ─── Status legend + Top performers ─── */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
          >
            <StatusLegend byStatus={byStatus} />
            <TopPerformers byCountry={byCountry} />
          </div>
        </div>
      </div>
    </>
  );
}
