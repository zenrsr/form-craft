import {
  pgTable,
  serial,
  text,
  jsonb,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

// Forms Table
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  title: text("title").notNull(), // Form title
  description: text("description").notNull(), // Form description
  fields: jsonb("fields").notNull(), // JSON to store form fields
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  urlId: uuid("url_id").defaultRandom().notNull(), // Unique URL identifier
});

// Submissions Table
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey(), // Primary key as UUID
  formId: integer("form_id")
    .notNull()
    .references(() => forms.id), // Foreign key to forms
  email: text("email").notNull(), // Email of the respondent
  responses: jsonb("responses").notNull(), // Stores responses as JSON
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(), // Submission timestamp
});
