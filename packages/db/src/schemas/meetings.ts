import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { connections } from "./connections";
import { users } from "./auth";

export type MeetingAttendee = {
  email: string;
  name?: string;
  responseStatus?: string;
};

export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id").references(() => connections.id, {
      onDelete: "set null",
    }),
    provider: text("provider").notNull(),
    externalId: text("external_id").notNull(),
    emailThreadId: text("email_thread_id"),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    attendees: jsonb("attendees")
      .$type<MeetingAttendee[]>()
      .default([])
      .notNull(),
    prepContext: jsonb("prep_context").$type<Record<string, unknown>>(),
    prepSummary: text("prep_summary"),
    prepSentAt: timestamp("prep_sent_at", { withTimezone: true }),
    recap: text("recap"),
    recapSentAt: timestamp("recap_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("meetings_user_provider_external_unique").on(
      table.userId,
      table.provider,
      table.externalId,
    ),
    index("meetings_user_starts_at_idx").on(table.userId, table.startsAt),
  ],
);

export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = typeof meetings.$inferInsert;
