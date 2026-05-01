// Permission registry — single source of truth for what permissions exist
// in the platform. Used by:
//   * `requirePermission(module, level)` middleware (typed module argument)
//   * `Role.permissions` Json default (Admin role gets all-full from here)
//   * Admin role-management UI (renders one row per module)
//
// Adding a new module = add it to PERMISSION_MODULES below + decide what
// the Admin role grants (defaults to `full`). Existing roles keep
// whatever they had — the new module reads as `none` until a role is
// edited to grant access.

export const PERMISSION_MODULES = [
    'dashboard',
    'cars',
    'clients',
    'rentals',
    'reservations',
    'requests',
    'crm',
    'finance',
    'service',
    'settings',
    'reports',
    'mail',
    'calendar',
    'locations',
    'pricing',
    // Sensitive: user management + audit-log access. Previously gated by
    // `requireRole('admin')`, now first-class permissions so an "Office
    // manager" role can be granted audit-view without admin rights.
    'users',
    'audit',
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

export const PERMISSION_LEVELS = ['none', 'view', 'full'] as const;
export type PermissionLevel = (typeof PERMISSION_LEVELS)[number];

export type Permissions = Record<PermissionModule, PermissionLevel>;

const buildUniform = (level: PermissionLevel): Permissions =>
    Object.fromEntries(PERMISSION_MODULES.map((m) => [m, level])) as Permissions;

// Default Admin role gets `full` for every module. Used by seed and the
// migration's INSERT for the system Admin row.
export const ADMIN_PERMISSIONS: Permissions = buildUniform('full');

// Default Manager template — view across the board, full only for the
// modules a typical desk manager actively works in. Edit via admin UI.
export const MANAGER_PERMISSIONS: Permissions = {
    ...buildUniform('view'),
    rentals: 'full',
    reservations: 'full',
    clients: 'full',
    requests: 'full',
    calendar: 'full',
    // No access by default — sensitive surfaces.
    finance: 'none',
    settings: 'none',
    users: 'none',
    audit: 'none',
};

export const EMPTY_PERMISSIONS: Permissions = buildUniform('none');

// Runtime check helper. `level === 'view'` succeeds for both 'view' and 'full';
// `level === 'full'` requires exactly 'full'. Mirrors the old middleware.
export function hasPermission(
    perms: Partial<Permissions> | null | undefined,
    moduleName: PermissionModule,
    level: 'view' | 'full',
): boolean {
    const granted = perms?.[moduleName] ?? 'none';
    if (level === 'view') return granted === 'view' || granted === 'full';
    return granted === 'full';
}
