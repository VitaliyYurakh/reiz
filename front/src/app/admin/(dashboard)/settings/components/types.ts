import {
  Bell,
  Shield,
  ShieldCheck,
  Users,
  User,
  MessageSquare,
  Mail,
} from 'lucide-react';

/* ── Types ── */

export interface NotificationTemplate {
  id: number;
  code: string;
  channel: string;
  subject: string | null;
  bodyTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: number;
  actorId: number | null;
  actor: { id: number; name: string; email: string } | null;
  entityType: string;
  entityId: number;
  action: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  email: string;
  role: { id: number; name: string; isSystem: boolean } | null;
}

export type TabKey = 'templates' | 'audit' | 'profile' | 'team' | 'roles';

export const TABS: { key: TabKey; labelKey: string; icon: typeof Bell }[] = [
  { key: 'templates', labelKey: 'settings.tabTemplates', icon: Bell },
  { key: 'audit', labelKey: 'settings.tabAuditLog', icon: Shield },
  { key: 'team', labelKey: 'settings.tabTeam', icon: Users },
  { key: 'roles', labelKey: 'settings.tabRoles', icon: ShieldCheck },
  { key: 'profile', labelKey: 'settings.tabProfile', icon: User },
];

// Kept in sync with `api/app/types/permissions.ts → PERMISSION_MODULES`.
// Adding a module requires updating both files + the i18n labels in the
// 5 admin locales (settings.modXxx).
export const PERMISSION_MODULES = [
  { key: 'dashboard', labelKey: 'settings.modDashboard' },
  { key: 'requests', labelKey: 'settings.modRequests' },
  { key: 'reservations', labelKey: 'settings.modReservations' },
  { key: 'rentals', labelKey: 'settings.modRentals' },
  { key: 'crm', labelKey: 'settings.modCrm' },
  { key: 'calendar', labelKey: 'settings.modCalendar' },
  { key: 'clients', labelKey: 'settings.modClients' },
  { key: 'cars', labelKey: 'settings.modCars' },
  { key: 'locations', labelKey: 'settings.modLocations' },
  { key: 'pricing', labelKey: 'settings.modPricing' },
  { key: 'finance', labelKey: 'settings.modFinance' },
  { key: 'service', labelKey: 'settings.modService' },
  { key: 'reports', labelKey: 'settings.modReports' },
  { key: 'mail', labelKey: 'settings.modMail' },
  { key: 'settings', labelKey: 'settings.modSettings' },
  { key: 'users', labelKey: 'settings.modUsers' },
  { key: 'audit', labelKey: 'settings.modAudit' },
] as const;

export type PermLevel = 'full' | 'view' | 'none';
export type Permissions = Record<string, PermLevel>;

export interface Role {
  id: number;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permissions;
  _count?: { users: number };
  createdAt?: string;
  updatedAt?: string;
}

// Post-RBAC: a user has exactly one role (FK relation), which carries
// the permission map. Old shape — `role: string` + per-user `permissions`
// — is gone.
export interface TeamUser {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  role: {
    id: number;
    name: string;
    isSystem: boolean;
    permissions: Permissions;
  };
}

export const CHANNEL_MAP: Record<string, { label: string; badgeClass: string; icon: typeof MessageSquare }> = {
  TELEGRAM: { label: 'Telegram', badgeClass: 'h-badge h-badge-blue', icon: MessageSquare },
  EMAIL: { label: 'Email', badgeClass: 'h-badge h-badge-purple', icon: Mail },
};

export const ACTION_MAP: Record<string, { labelKey: string; badgeClass: string }> = {
  CREATE: { labelKey: 'settings.actionCreate', badgeClass: 'h-badge h-badge-green' },
  UPDATE: { labelKey: 'settings.actionUpdate', badgeClass: 'h-badge h-badge-orange' },
  DELETE: { labelKey: 'settings.actionDelete', badgeClass: 'h-badge h-badge-red-solid' },
  STATUS_CHANGE: { labelKey: 'settings.actionStatusChange', badgeClass: 'h-badge h-badge-blue' },
};

export const ENTITY_TYPES = [
  'Client', 'Rental', 'Reservation', 'RentalRequest', 'Car',
  'Transaction', 'Fine', 'Inspection', 'ServiceEvent', 'Document',
];
