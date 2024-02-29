ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "updated_at" SET NOT NULL;