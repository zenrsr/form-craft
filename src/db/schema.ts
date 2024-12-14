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
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fields: jsonb("fields").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  urlId: uuid("url_id").defaultRandom().notNull(), // Auto-generate valid UUID
});

// Submissions Table
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey(),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade", onUpdate: "cascade" }),
  email: text("email").notNull(),
  responses: jsonb("responses").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
