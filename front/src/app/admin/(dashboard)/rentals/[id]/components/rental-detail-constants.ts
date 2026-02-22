import {
    Eye,
    ClipboardCheck,
    AlertTriangle,
    Banknote,
    FileText,
} from 'lucide-react';
import type { TabKey } from './rental-detail-types';

export const STATUS_CLASS_MAP: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
};

export const INSPECTION_TYPE_CLASS: Record<string, string> = {
    PICKUP: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    RETURN: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
};

export const FINE_TYPE_CLASS: Record<string, string> = {
    OVERMILEAGE: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
    DAMAGE: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
    LATE_RETURN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300',
    FUEL: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    CLEANING: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300',
    TRAFFIC: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
    OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
};

export const FINE_TYPE_KEYS = ['OVERMILEAGE', 'DAMAGE', 'LATE_RETURN', 'FUEL', 'CLEANING', 'TRAFFIC', 'OTHER'];

export const TAB_KEYS: TabKey[] = ['overview', 'inspections', 'fines', 'payments', 'documents'];

export const TAB_ICONS: Record<TabKey, typeof Eye> = {
    overview: Eye,
    inspections: ClipboardCheck,
    fines: AlertTriangle,
    payments: Banknote,
    documents: FileText,
};

export const DOC_TYPE_KEYS = ['RENTAL_CONTRACT', 'PICKUP_ACT', 'RETURN_ACT', 'INVOICE'];
