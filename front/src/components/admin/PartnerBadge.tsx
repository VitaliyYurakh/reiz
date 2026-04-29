import Link from 'next/link';
import { Handshake } from 'lucide-react';

interface PartnerLike {
  id: number;
  fullName: string;
  companyName: string | null;
}

interface PartnerBadgeProps {
  partner: PartnerLike | null | undefined;
  /**
   * `inline` — compact pill for tables / tight rows.
   * `block`  — bigger affordance with circular icon aside, suitable for
   *            entity headers (rental detail, reservation detail).
   */
  size?: 'inline' | 'block';
  /** When partner is null, render a muted "власне авто" placeholder. */
  showOwnFleet?: boolean;
}

/**
 * Marks an entity (rental / reservation / request) as belonging to an
 * external partner rather than to Reiz's own fleet.
 *
 * Uses the brand purple family (`--c-brand-*`) so the badge sits inside
 * the unified palette instead of the orphan cyan it used to be — keeps
 * the table/row visual language coherent with the rest of the admin.
 */
export function PartnerBadge({ partner, size = 'inline', showOwnFleet }: PartnerBadgeProps) {
  if (!partner) {
    if (!showOwnFleet) return null;
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
        style={{
          background: 'var(--c-surface-muted)',
          color: 'var(--c-text-muted)',
        }}
      >
        Reiz · власне авто
      </span>
    );
  }

  const label = partner.companyName || partner.fullName;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  if (size === 'block') {
    return (
      <Link
        href={`/admin/partners/${partner.id}`}
        onClick={stop}
        className="group rounded-xl text-sm font-semibold transition-all hover:shadow-sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--c-brand-bg)',
          color: 'var(--c-brand-dark)',
          border: '1px solid color-mix(in srgb, var(--c-brand) 22%, transparent)',
          padding: '6px 12px 6px 6px',
        }}
        title={`Партнерське авто · ${label}`}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{
            background: 'var(--c-brand)',
            color: '#fff',
          }}
        >
          <Handshake style={{ width: 12, height: 12 }} strokeWidth={2.4} />
        </span>
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/admin/partners/${partner.id}`}
      onClick={stop}
      title={`Партнерське авто · ${label}`}
      className="group transition-colors hover:opacity-90"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'var(--c-brand-bg)',
        color: 'var(--c-brand-dark)',
        border: '1px solid color-mix(in srgb, var(--c-brand) 20%, transparent)',
        borderRadius: 9999,
        padding: '1px 8px 1px 5px',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: 0.1,
        lineHeight: '16px',
      }}
    >
      <Handshake style={{ width: 10, height: 10 }} strokeWidth={2.5} />
      <span
        className="truncate"
        style={{ maxWidth: 140 }}
      >
        {label}
      </span>
    </Link>
  );
}
