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

export const TABS: { key: TabKey; label: string; icon: typeof DollarSign }[] = [
  { key: 'ratePlans', label: 'Тарифы', icon: Tag },
  { key: 'addOns', label: 'Доп. услуги', icon: Package },
  { key: 'coveragePackages', label: 'Покрытие', icon: Shield },
];

export const PRICING_MODES = ['PER_DAY', 'ONE_TIME', 'MANUAL_QTY'] as const;

export const PRICING_MODE_LABELS: Record<string, string> = {
  PER_DAY: 'За день',
  ONE_TIME: 'Разово',
  MANUAL_QTY: 'За кол-во',
};

export { fmtMoney as formatMoney } from '@/app/admin/lib/format';
