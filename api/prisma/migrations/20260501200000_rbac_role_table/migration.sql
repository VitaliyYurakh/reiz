-- Replace the `User.role` enum + `User.permissions` Json blob with a
-- proper RBAC structure (`Role` table + `User.role_id` FK).
--
-- WHY: the previous design encoded access control twice — `role` told
-- you "this user is an admin/manager" and `permissions` was a per-user
-- Json map. They drifted: an admin's `permissions` was an empty `{}`
-- because the middleware had a hard-coded `if (user.role === 'admin')`
-- bypass. Auditing access required reading every user row individually.
--
-- AFTER: there is one `Role` row per access pattern, with the full
-- permission map stored once. Users link to a role via `role_id`. To
-- audit "what can the Office Manager role do" you SELECT one row.
--
-- DATA SAFETY: existing per-user permissions are NOT discarded. We
-- create one role per existing user (named "Custom (<email>)") whose
-- `permissions` Json mirrors what that user had. Zero behaviour change
-- on the first request after deploy. The admin can later dedupe these
-- per-user roles into shared ones via the upcoming /admin/roles UI.

-- ─── 1. Create `role` table ──────────────────────────────────────────────
CREATE TABLE role (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_system   BOOLEAN      NOT NULL DEFAULT false,
    permissions JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- ─── 2. Seed the built-in Admin role ─────────────────────────────────────
-- All 17 modules at level 'full'. Kept in sync with PERMISSION_MODULES
-- in app/types/permissions.ts. `is_system = true` so admin UI should
-- forbid delete/rename (editing permissions is fine).
INSERT INTO role (name, description, is_system, permissions) VALUES (
    'Admin',
    'Full access. System role — cannot be deleted.',
    true,
    '{
        "dashboard":"full","cars":"full","clients":"full","rentals":"full",
        "reservations":"full","requests":"full","crm":"full","finance":"full",
        "service":"full","settings":"full","reports":"full","mail":"full",
        "calendar":"full","locations":"full","pricing":"full",
        "users":"full","audit":"full"
    }'::jsonb
);

-- ─── 3. Create one role per existing user ────────────────────────────────
-- Preserves each user's effective permissions. For users with the old
-- `admin` enum, give them the all-full Admin permissions even though
-- their `permissions` Json was probably empty (the middleware used to
-- short-circuit on role='admin').
INSERT INTO role (name, description, is_system, permissions)
SELECT
    'Custom (' || email || ')',
    'Auto-created on RBAC migration; mirrors user''s pre-migration permissions.',
    false,
    CASE
        WHEN role::text = 'admin' THEN
            '{
                "dashboard":"full","cars":"full","clients":"full","rentals":"full",
                "reservations":"full","requests":"full","crm":"full","finance":"full",
                "service":"full","settings":"full","reports":"full","mail":"full",
                "calendar":"full","locations":"full","pricing":"full",
                "users":"full","audit":"full"
            }'::jsonb
        ELSE permissions
    END
FROM "user";

-- ─── 4. Add `role_id` FK column to `user`, backfill, enforce NOT NULL ───
ALTER TABLE "user" ADD COLUMN role_id INT;

UPDATE "user" u
SET role_id = (
    SELECT r.id FROM role r WHERE r.name = 'Custom (' || u.email || ')'
);

ALTER TABLE "user" ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE "user"
    ADD CONSTRAINT user_role_id_fkey
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX user_role_id_idx ON "user"(role_id);

-- ─── 5. Drop old columns + enum ─────────────────────────────────────────
ALTER TABLE "user" DROP COLUMN role;
ALTER TABLE "user" DROP COLUMN permissions;

DROP TYPE "UserRole";
