-- AlterTable
ALTER TABLE "User" ADD COLUMN     "token_version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
