import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  passage: text("passage").notNull(),
  lectioNotes: text("lectio_notes"),
  meditatioNotes: text("meditatio_notes"),
  oratioNotes: text("oratio_notes"),
  contemplatioNotes: text("contemplatio_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type CreateSessionRequest = InsertSession;
export type SessionResponse = Session;
export type SessionsListResponse = Session[];
