CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"email" text NOT NULL,
	"responses" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;