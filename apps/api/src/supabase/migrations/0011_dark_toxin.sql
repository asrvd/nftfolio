ALTER TABLE "assets" ADD COLUMN "owner_email" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets" ADD CONSTRAINT "assets_owner_email_profiles_email_fk" FOREIGN KEY ("owner_email") REFERENCES "public"."profiles"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
