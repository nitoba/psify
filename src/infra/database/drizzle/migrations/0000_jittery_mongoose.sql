CREATE TABLE IF NOT EXISTS "psychologists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" text NOT NULL,
	"crm" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "psychologists_email_unique" UNIQUE("email"),
	CONSTRAINT "psychologists_crm_unique" UNIQUE("crm")
);
