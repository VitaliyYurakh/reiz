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
   * `inline` — compact pill suitable for tables / tight rows
   * `block`  — bigger block with "link to partner page" affordance
   */
  size?: 'inline' | 'block';
  /** Include "own fleet" placeholder when partner is null */
  showOwnFleet?: boolean;
}

/**
 * Visual marker that a car (and therefore this rental/reservation/request)
 * belongs to an external partner rather than to Reiz's own fleet.
 *
 * When a partner exists, renders a cyan chip with a handshake icon that
 * links to the partner's statement page. When there's no partner and
 * `showOwnFleet` is true, renders a subtle "власне авто" gray chip.
 */
export function PartnerBadge({ partner, size = 'inline', showOwnFleet }: PartnerBadgeProps) {
  if (!partner) {
    if (!showOwnFleet) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        Reiz · власне авто
      </span>
    );
  }

  const label = partner.companyName || partner.fullName;

  if (size === 'block') {
    return (
      <Link
        href={`/admin/partners/${partner.id}`}
        className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-500/25"
      >
        <Handshake className="h-3.5 w-3.5" />
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/admin/partners/${partner.id}`}
      className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 transition-colors hover:bg-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-500/25"
      title={`Партнерське авто · ${label}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Handshake className="h-2.5 w-2.5" />
      <span className="truncate max-w-[140px]">{label}</span>
    </Link>
  );
}
