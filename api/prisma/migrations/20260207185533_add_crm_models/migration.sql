-- CreateEnum
CREATE TYPE "AddOnPricingMode" AS ENUM ('PER_DAY', 'ONE_TIME', 'MANUAL_QTY');

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "driver_license_no" TEXT,
    "driver_license_exp" TIMESTAMP(3),
    "passport_no" TEXT,
    "national_id" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'UA',
    "notes" TEXT,
    "rating" INTEGER,
    "rating_reason" TEXT,
    "rating_author_id" INTEGER,
    "source" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_document" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_request" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "status" TEXT NOT NULL DEFAULT 'new',
    "client_id" INTEGER,
    "booking_request_id" INTEGER,
    "car_id" INTEGER,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "pickup_location" TEXT,
    "return_location" TEXT,
    "pickup_date" TIMESTAMP(3),
    "return_date" TIMESTAMP(3),
    "flight_number" TEXT,
    "comment" TEXT,
    "website_snapshot" JSONB,
    "rejection_reason" TEXT,
    "assigned_to_user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coverage_package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" JSONB,
    "deposit_percent" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coverage_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "add_on" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" JSONB,
    "pricing_mode" "AddOnPricingMode" NOT NULL,
    "unit_price_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "default_qty" TEXT,
    "qty_editable" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "car_id" INTEGER NOT NULL,
    "min_days" INTEGER NOT NULL,
    "max_days" INTEGER NOT NULL,
    "daily_price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "rental_request_id" INTEGER,
    "client_id" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,
    "coverage_package_id" INTEGER,
    "pickup_location" TEXT NOT NULL,
    "return_location" TEXT NOT NULL,
    "pickup_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "price_snapshot" JSONB NOT NULL,
    "delivery_fee" INTEGER NOT NULL DEFAULT 0,
    "delivery_currency" TEXT NOT NULL DEFAULT 'UAH',
    "cancel_reason" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "no_show_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_add_on" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "add_on_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "total_minor" INTEGER NOT NULL,

    CONSTRAINT "reservation_add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "reservation_id" INTEGER,
    "client_id" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,
    "contract_number" TEXT,
    "pickup_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "actual_return_date" TIMESTAMP(3),
    "pickup_location" TEXT NOT NULL,
    "return_location" TEXT NOT NULL,
    "pickup_odometer" INTEGER,
    "return_odometer" INTEGER,
    "allowed_mileage" INTEGER,
    "price_snapshot" JSONB NOT NULL,
    "deposit_amount" INTEGER NOT NULL DEFAULT 0,
    "deposit_currency" TEXT NOT NULL DEFAULT 'UAH',
    "deposit_returned" BOOLEAN NOT NULL DEFAULT false,
    "cancel_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_add_on" (
    "id" SERIAL NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "add_on_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "total_minor" INTEGER NOT NULL,

    CONSTRAINT "rental_add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_extension" (
    "id" SERIAL NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "old_return_date" TIMESTAMP(3) NOT NULL,
    "new_return_date" TIMESTAMP(3) NOT NULL,
    "extra_days" INTEGER NOT NULL,
    "daily_rate_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "total_minor" INTEGER NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rental_extension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection" (
    "id" SERIAL NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "inspector_id" INTEGER,
    "odometer" INTEGER,
    "fuel_level" INTEGER,
    "cleanliness_ok" BOOLEAN NOT NULL DEFAULT true,
    "checklist" JSONB,
    "damages" JSONB,
    "notes" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_photo" (
    "id" SERIAL NOT NULL,
    "inspection_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspection_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fine" (
    "id" SERIAL NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_event" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "blocks_booking" BOOLEAN NOT NULL DEFAULT true,
    "cost_minor" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "odometer" INTEGER,
    "vendor" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "amount_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "fx_rate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "amount_uah_minor" INTEGER NOT NULL,
    "description" TEXT,
    "client_id" INTEGER,
    "reservation_id" INTEGER,
    "rental_id" INTEGER,
    "fine_id" INTEGER,
    "created_by_user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "rental_id" INTEGER,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "template_version" TEXT,
    "data_snapshot" JSONB,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_template" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "subject" TEXT,
    "body_template" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_log" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "actor_id" INTEGER,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "client_phone_idx" ON "client"("phone");

-- CreateIndex
CREATE INDEX "client_email_idx" ON "client"("email");

-- CreateIndex
CREATE INDEX "client_last_name_first_name_idx" ON "client"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "client_deleted_at_idx" ON "client"("deleted_at");

-- CreateIndex
CREATE INDEX "client_document_client_id_idx" ON "client_document"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "rental_request_booking_request_id_key" ON "rental_request"("booking_request_id");

-- CreateIndex
CREATE INDEX "rental_request_status_idx" ON "rental_request"("status");

-- CreateIndex
CREATE INDEX "rental_request_client_id_idx" ON "rental_request"("client_id");

-- CreateIndex
CREATE INDEX "rental_request_car_id_idx" ON "rental_request"("car_id");

-- CreateIndex
CREATE INDEX "rental_request_created_at_idx" ON "rental_request"("created_at");

-- CreateIndex
CREATE INDEX "coverage_package_is_active_idx" ON "coverage_package"("is_active");

-- CreateIndex
CREATE INDEX "add_on_is_active_idx" ON "add_on"("is_active");

-- CreateIndex
CREATE INDEX "rate_plan_car_id_is_active_idx" ON "rate_plan"("car_id", "is_active");

-- CreateIndex
CREATE INDEX "rate_plan_deleted_at_idx" ON "rate_plan"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_rental_request_id_key" ON "reservation"("rental_request_id");

-- CreateIndex
CREATE INDEX "reservation_status_idx" ON "reservation"("status");

-- CreateIndex
CREATE INDEX "reservation_car_id_pickup_date_return_date_idx" ON "reservation"("car_id", "pickup_date", "return_date");

-- CreateIndex
CREATE INDEX "reservation_client_id_idx" ON "reservation"("client_id");

-- CreateIndex
CREATE INDEX "reservation_pickup_date_idx" ON "reservation"("pickup_date");

-- CreateIndex
CREATE INDEX "reservation_return_date_idx" ON "reservation"("return_date");

-- CreateIndex
CREATE UNIQUE INDEX "rental_reservation_id_key" ON "rental"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rental_contract_number_key" ON "rental"("contract_number");

-- CreateIndex
CREATE INDEX "rental_status_idx" ON "rental"("status");

-- CreateIndex
CREATE INDEX "rental_car_id_pickup_date_return_date_idx" ON "rental"("car_id", "pickup_date", "return_date");

-- CreateIndex
CREATE INDEX "rental_client_id_idx" ON "rental"("client_id");

-- CreateIndex
CREATE INDEX "rental_contract_number_idx" ON "rental"("contract_number");

-- CreateIndex
CREATE INDEX "inspection_rental_id_idx" ON "inspection"("rental_id");

-- CreateIndex
CREATE INDEX "inspection_type_idx" ON "inspection"("type");

-- CreateIndex
CREATE INDEX "fine_rental_id_idx" ON "fine"("rental_id");

-- CreateIndex
CREATE INDEX "fine_is_paid_idx" ON "fine"("is_paid");

-- CreateIndex
CREATE INDEX "service_event_car_id_start_date_end_date_idx" ON "service_event"("car_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "service_event_blocks_booking_idx" ON "service_event"("blocks_booking");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_fine_id_key" ON "transaction"("fine_id");

-- CreateIndex
CREATE INDEX "transaction_account_id_idx" ON "transaction"("account_id");

-- CreateIndex
CREATE INDEX "transaction_client_id_idx" ON "transaction"("client_id");

-- CreateIndex
CREATE INDEX "transaction_rental_id_idx" ON "transaction"("rental_id");

-- CreateIndex
CREATE INDEX "transaction_reservation_id_idx" ON "transaction"("reservation_id");

-- CreateIndex
CREATE INDEX "transaction_created_at_idx" ON "transaction"("created_at");

-- CreateIndex
CREATE INDEX "transaction_type_idx" ON "transaction"("type");

-- CreateIndex
CREATE INDEX "document_rental_id_idx" ON "document"("rental_id");

-- CreateIndex
CREATE INDEX "document_type_idx" ON "document"("type");

-- CreateIndex
CREATE UNIQUE INDEX "notification_template_code_key" ON "notification_template"("code");

-- CreateIndex
CREATE INDEX "notification_log_template_id_idx" ON "notification_log"("template_id");

-- CreateIndex
CREATE INDEX "notification_log_status_idx" ON "notification_log"("status");

-- CreateIndex
CREATE INDEX "notification_log_created_at_idx" ON "notification_log"("created_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_id_idx" ON "audit_log"("actor_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_rating_author_id_fkey" FOREIGN KEY ("rating_author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_document" ADD CONSTRAINT "client_document_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_request" ADD CONSTRAINT "rental_request_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_request" ADD CONSTRAINT "rental_request_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "BookingRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_request" ADD CONSTRAINT "rental_request_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_request" ADD CONSTRAINT "rental_request_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_plan" ADD CONSTRAINT "rate_plan_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_rental_request_id_fkey" FOREIGN KEY ("rental_request_id") REFERENCES "rental_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_coverage_package_id_fkey" FOREIGN KEY ("coverage_package_id") REFERENCES "coverage_package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_add_on" ADD CONSTRAINT "reservation_add_on_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_add_on" ADD CONSTRAINT "reservation_add_on_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "add_on"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_add_on" ADD CONSTRAINT "rental_add_on_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_add_on" ADD CONSTRAINT "rental_add_on_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "add_on"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_extension" ADD CONSTRAINT "rental_extension_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection" ADD CONSTRAINT "inspection_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection" ADD CONSTRAINT "inspection_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_photo" ADD CONSTRAINT "inspection_photo_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fine" ADD CONSTRAINT "fine_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_event" ADD CONSTRAINT "service_event_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_fine_id_fkey" FOREIGN KEY ("fine_id") REFERENCES "fine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "notification_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
