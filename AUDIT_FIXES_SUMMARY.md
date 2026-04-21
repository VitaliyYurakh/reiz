# Audit fixes — summary

This document tracks what the 2026-04-21 admin-panel audit asked for and
what landed on disk. Every branch below is isolated and can be merged
independently after review.

## Branches

| Branch | Commits | Topic |
|---|---|---|
| `fix/audit-block-1-critical-finance-data` | 4 | C-4 unit fix, C-7 static gate, C-8 trust proxy, C-9 pricing auth |
| `fix/audit-block-2-seed-migrations-policy` | 2 | C-2 idempotent admin upsert, C-3 migrations policy doc |
| `fix/audit-block-3-transactions` | 3 | H-3 createOne, H-4/H-5 update atomicity, H-8 pdf cleanup |
| `fix/audit-block-4-security-audit` | 5 | H-1 tokenVersion, H-2 notification casing, H-6 edge auth gate, H-7 search, H-11..H-14 micro-fixes |
| `fix/audit-block-5-medium-priority` | 11 | M-1, M-2, M-5, M-7, M-8, M-9, M-12, M-13, M-14 |

## Not fixed in this pass (owner action or deferred)

| ID | Reason |
|---|---|
| **C-1** Admin password reset on prod | Owner fixes manually via admin UI — blocked on human decision of the new credential |
| **L-1 … L-11** Low-priority backlog | Out of scope; candidates for next cleanup sprint |
| **H-9** Rate limiter / lockout in process memory | Single-replica prod today; redis store is a future scaling task |
| **H-10** `sameSite: 'strict'` vs cross-origin | Not a bug today (single-origin deployment); documented in audit only |
| **M-6** `any` usages | Large typing pass; scheduled as a separate refactor ticket |
| **M-11** `updated_at` drift in admin record | Read-only observation; no code action required |
| **N-1** Notification templates are defined but never triggered | Feature gap surfaced during 5.2; see `DEFERRED_FIXES.md` |

## Key policy docs introduced

- `api/prisma/MIGRATIONS_POLICY.md` — seven golden rules that make the
  C-3-style mistake structurally impossible to repeat.
- `README.md#production-setup` — `.env` permission and admin-password
  rotation steps, plus `POSTGRES_PASSWORD` rotation recipe.

## Cross-cutting infrastructure

- `front/src/lib/toast.ts` — sonner wrapper + `extractErrorMessage`.
- `front/src/components/admin/ConfirmProvider.tsx` — context-based
  promise confirm.
- `front/src/lib/log.ts` — centralised `logError`, the single hook point
  for a future Sentry integration.
