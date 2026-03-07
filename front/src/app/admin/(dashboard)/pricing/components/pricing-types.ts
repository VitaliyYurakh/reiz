import { DollarSign, Package, Shield, Tag } from 'lucide-react';

/* ── Types ── */

export interface RatePlanCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}

export interface RatePlan {
  id: number;
  name: string;
  carId: number;
  minDays: number;
  maxDays: number;
  dailyPrice: number;
  currency: string;
  isActive: boolean;
  car: RatePlanCar;
}

export interface AddOn {
  id: number;
  name: string;
  pricingMode: string;
  unitPriceMinor: number;
  currency: string;
  isActive: boolean;
}

export interface CoveragePackage {
  id: number;
  name: string;
  depositPercent: number;
  description: string | null;
  isActive: boolean;
}

export type TabKey = 'ratePlans' | 'addOns' | 'coveragePackages';

export const TABS: { key: TabKey; labelKey: string; icon: typeof DollarSign }[] = [
  { key: 'ratePlans', labelKey: 'pricing.tabRatePlans', icon: Tag },
  { key: 'addOns', labelKey: 'pricing.tabAddOns', icon: Package },
  { key: 'coveragePackages', labelKey: 'pricing.tabCoverage', icon: Shield },
];

export const PRICING_MODES = ['PER_DAY', 'ONE_TIME', 'MANUAL_QTY'] as const;

export const PRICING_MODE_LABELS: Record<string, string> = {
  PER_DAY: 'pricing.modePerDay',
  ONE_TIME: 'pricing.modeOneTime',
  MANUAL_QTY: 'pricing.modeManualQty',
};

export { fmtMoney as formatMoney } from '@/app/admin/lib/format';
