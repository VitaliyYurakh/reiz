-- Promote 18 status / type / category columns from String to Postgres
-- ENUM types. Postgres now rejects any INSERT/UPDATE that doesn't match
-- the value list (e.g. a typo like `'avtive'` no longer silently sits
-- in a status column). The TS-side const-objects in
-- `app/utils/constants.ts` are still around for centralised labels and
-- iteration helpers, but the canonical shape now lives in this schema.
--
-- Pre-flight audit confirmed every existing row already matches an enum
-- value, so the USING casts cannot fail. All ALTER statements below run
-- inside the implicit migration transaction — if any one of them fails,
-- the whole batch rolls back and the database returns to the previous
-- String-typed state with zero data loss.
--
-- Currency is intentionally kept as String for now: it appears in 13
-- columns and would force every `currency: string` service signature to
-- widen, plus fxRateService.getRate() takes runtime input from NBU API
-- responses that may include codes outside the closed enum. Tracked
-- separately.

-- ─── Create ENUM types ────────────────────────────────────────────────────

CREATE TYPE "ReservationStatus"     AS ENUM ('confirmed', 'picked_up', 'cancelled', 'no_show');
CREATE TYPE "RentalStatus"          AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE "RentalRequestStatus"   AS ENUM ('new', 'in_review', 'approved', 'rejected', 'cancelled');
CREATE TYPE "AccountType"           AS ENUM ('CASH', 'BANK_ACCOUNT', 'BANK_CARD');
CREATE TYPE "TransactionType"       AS ENUM ('PAYMENT', 'DEPOSIT_RECEIVED', 'DEPOSIT_RETURNED', 'REFUND', 'FINE_PAYMENT', 'SERVICE_COST', 'ADDON_PAYMENT', 'EXTENSION_PAYMENT', 'PARTNER_COMMISSION', 'TRANSFER');
CREATE TYPE "TransactionDirection"  AS ENUM ('in', 'out');
CREATE TYPE "LeadStatus"            AS ENUM ('NEW', 'ENRICHED', 'READY', 'CONTACTED', 'FOLLOWED_UP_1', 'FOLLOWED_UP_2', 'BREAKUP_SENT', 'REPLIED', 'INTERESTED', 'CLIENT', 'DISQUALIFIED', 'BOUNCED', 'UNSUBSCRIBED', 'PAUSED');
CREATE TYPE "LeadEmailDirection"    AS ENUM ('OUTBOUND', 'INBOUND');
CREATE TYPE "AccidentFault"         AS ENUM ('CLIENT', 'COMPANY', 'THIRD_PARTY', 'UNKNOWN');
CREATE TYPE "AccidentStatus"        AS ENUM ('REPORTED', 'INVESTIGATING', 'AWAITING_PAYOUT', 'RESOLVED', 'CLOSED');
CREATE TYPE "InventoryCategory"     AS ENUM ('TOOL', 'EQUIPMENT', 'ACCESSORY', 'KEYS', 'OTHER');
CREATE TYPE "InventoryStatus"       AS ENUM ('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'LOST', 'WRITTEN_OFF');
CREATE TYPE "RentalDepositStatus"   AS ENUM ('PENDING', 'RECEIVED', 'RETURNED', 'FORFEITED');
CREATE TYPE "PartnerPaymentStatus"  AS ENUM ('paid', 'partial', 'disputed', 'refunded');
CREATE TYPE "ComplaintCategory"     AS ENUM ('DEPOSIT', 'DAMAGE', 'FINE', 'SERVICE', 'GDPR', 'OTHER');
CREATE TYPE "ComplaintPriority"     AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE "ComplaintStatus"       AS ENUM ('open', 'in_review', 'awaiting_client', 'resolved', 'rejected');
CREATE TYPE "ComplaintAuthorType"   AS ENUM ('client', 'staff', 'system');
CREATE TYPE "DocumentTemplateKind"  AS ENUM ('RENTAL_AGREEMENT', 'ACT_TRANSFER', 'ACT_RETURN', 'INVOICE', 'INSURANCE_CLAIM', 'OTHER');
CREATE TYPE "FxRateSource"          AS ENUM ('NBU', 'manual');
CREATE TYPE "UserRole"              AS ENUM ('admin', 'manager', 'operator');

-- ─── Convert columns ──────────────────────────────────────────────────────
-- Pattern: drop default → ALTER TYPE with USING cast → re-add typed default.
-- Each block is for ONE column.

-- user.role
ALTER TABLE "user" ALTER COLUMN role DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN role TYPE "UserRole" USING role::"UserRole";
ALTER TABLE "user" ALTER COLUMN role SET DEFAULT 'manager'::"UserRole";

-- account.type
ALTER TABLE account ALTER COLUMN type TYPE "AccountType" USING type::"AccountType";

-- reservation.status
ALTER TABLE reservation ALTER COLUMN status DROP DEFAULT;
ALTER TABLE reservation ALTER COLUMN status TYPE "ReservationStatus" USING status::"ReservationStatus";
ALTER TABLE reservation ALTER COLUMN status SET DEFAULT 'confirmed'::"ReservationStatus";

-- rental.status
ALTER TABLE rental ALTER COLUMN status DROP DEFAULT;
ALTER TABLE rental ALTER COLUMN status TYPE "RentalStatus" USING status::"RentalStatus";
ALTER TABLE rental ALTER COLUMN status SET DEFAULT 'active'::"RentalStatus";

-- rental_request.status
ALTER TABLE rental_request ALTER COLUMN status DROP DEFAULT;
ALTER TABLE rental_request ALTER COLUMN status TYPE "RentalRequestStatus" USING status::"RentalRequestStatus";
ALTER TABLE rental_request ALTER COLUMN status SET DEFAULT 'new'::"RentalRequestStatus";

-- transaction.type
ALTER TABLE transaction ALTER COLUMN type TYPE "TransactionType" USING type::"TransactionType";

-- transaction.direction
ALTER TABLE transaction ALTER COLUMN direction TYPE "TransactionDirection" USING direction::"TransactionDirection";

-- lead.status
ALTER TABLE lead ALTER COLUMN status DROP DEFAULT;
ALTER TABLE lead ALTER COLUMN status TYPE "LeadStatus" USING status::"LeadStatus";
ALTER TABLE lead ALTER COLUMN status SET DEFAULT 'NEW'::"LeadStatus";

-- lead_email.direction
ALTER TABLE lead_email ALTER COLUMN direction TYPE "LeadEmailDirection" USING direction::"LeadEmailDirection";

-- accident.fault, accident.status
ALTER TABLE accident ALTER COLUMN fault DROP DEFAULT;
ALTER TABLE accident ALTER COLUMN fault TYPE "AccidentFault" USING fault::"AccidentFault";
ALTER TABLE accident ALTER COLUMN fault SET DEFAULT 'UNKNOWN'::"AccidentFault";
ALTER TABLE accident ALTER COLUMN status DROP DEFAULT;
ALTER TABLE accident ALTER COLUMN status TYPE "AccidentStatus" USING status::"AccidentStatus";
ALTER TABLE accident ALTER COLUMN status SET DEFAULT 'REPORTED'::"AccidentStatus";

-- inventory_item.category, inventory_item.status
ALTER TABLE inventory_item ALTER COLUMN category DROP DEFAULT;
ALTER TABLE inventory_item ALTER COLUMN category TYPE "InventoryCategory" USING category::"InventoryCategory";
ALTER TABLE inventory_item ALTER COLUMN category SET DEFAULT 'TOOL'::"InventoryCategory";
ALTER TABLE inventory_item ALTER COLUMN status DROP DEFAULT;
ALTER TABLE inventory_item ALTER COLUMN status TYPE "InventoryStatus" USING status::"InventoryStatus";
ALTER TABLE inventory_item ALTER COLUMN status SET DEFAULT 'AVAILABLE'::"InventoryStatus";

-- rental_deposit.status
ALTER TABLE rental_deposit ALTER COLUMN status DROP DEFAULT;
ALTER TABLE rental_deposit ALTER COLUMN status TYPE "RentalDepositStatus" USING status::"RentalDepositStatus";
ALTER TABLE rental_deposit ALTER COLUMN status SET DEFAULT 'PENDING'::"RentalDepositStatus";

-- partner_payment.status
ALTER TABLE partner_payment ALTER COLUMN status DROP DEFAULT;
ALTER TABLE partner_payment ALTER COLUMN status TYPE "PartnerPaymentStatus" USING status::"PartnerPaymentStatus";
ALTER TABLE partner_payment ALTER COLUMN status SET DEFAULT 'paid'::"PartnerPaymentStatus";

-- complaint.category, .priority, .status
ALTER TABLE complaint ALTER COLUMN category TYPE "ComplaintCategory" USING category::"ComplaintCategory";
ALTER TABLE complaint ALTER COLUMN priority DROP DEFAULT;
ALTER TABLE complaint ALTER COLUMN priority TYPE "ComplaintPriority" USING priority::"ComplaintPriority";
ALTER TABLE complaint ALTER COLUMN priority SET DEFAULT 'normal'::"ComplaintPriority";
ALTER TABLE complaint ALTER COLUMN status DROP DEFAULT;
ALTER TABLE complaint ALTER COLUMN status TYPE "ComplaintStatus" USING status::"ComplaintStatus";
ALTER TABLE complaint ALTER COLUMN status SET DEFAULT 'open'::"ComplaintStatus";

-- complaint_message.author_type
ALTER TABLE complaint_message ALTER COLUMN author_type TYPE "ComplaintAuthorType" USING author_type::"ComplaintAuthorType";

-- document_template.kind
ALTER TABLE document_template ALTER COLUMN kind TYPE "DocumentTemplateKind" USING kind::"DocumentTemplateKind";

-- daily_fx_rate.source
ALTER TABLE daily_fx_rate ALTER COLUMN source DROP DEFAULT;
ALTER TABLE daily_fx_rate ALTER COLUMN source TYPE "FxRateSource" USING source::"FxRateSource";
ALTER TABLE daily_fx_rate ALTER COLUMN source SET DEFAULT 'NBU'::"FxRateSource";
