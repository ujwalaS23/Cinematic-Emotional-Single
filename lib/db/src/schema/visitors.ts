import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const visitorsTable = pgTable("birthday_visitors", {
  id: serial("id").primaryKey(),
  googleSubject: text("google_subject").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  firstVisitAt: timestamp("first_visit_at", { withTimezone: true }).notNull(),
  lastVisitAt: timestamp("last_visit_at", { withTimezone: true }).notNull(),
  visitCount: integer("visit_count").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVisitorSchema = createInsertSchema(visitorsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitorsTable.$inferSelect;