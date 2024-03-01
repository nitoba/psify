ALTER TABLE "psychologists" RENAME COLUMN "crm" TO "crp";--> statement-breakpoint
ALTER TABLE "psychologists" DROP CONSTRAINT "psychologists_crm_unique";--> statement-breakpoint
ALTER TABLE "psychologists" ADD CONSTRAINT "psychologists_crp_unique" UNIQUE("crp");