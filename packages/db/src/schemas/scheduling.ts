import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import type { SchedulingRequestStatus } from "../domain";
import { users } from "./auth";
import { connections } from "./connections";
import { mailItems } from "./mail";

export type CandidateTimeSlot = {
  start: string;
  end: string;
  source: "google-calendar" | "calendly";
};

export const schedulingRequests = pgTable(
  "scheduling_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mailItemId: uuid("mail_item_id")
      .notNull()
      .references(() => mailItems.id, { onDelete: "cascade" }),
    calendarConnectionId: uuid("calendar_connection_id").references(
      () => connections.id,
      { onDelete: "set null" },
    ),
    status: text("status")
      .$type<SchedulingRequestStatus>()
      .default("detected")
      .notNull(),
    title: text("title").notNull(),
    attendeeEmails: jsonb("attendee_emails")
      .$type<string[]>()
      .default([])
      .notNull(),
    timezone: text("timezone").notNull(),
    candidateSlots: jsonb("candidate_slots")
      .$type<CandidateTimeSlot[]>()
      .default([])
      .notNull(),
    selectedStart: timestamp("selected_start", { withTimezone: true }),
    selectedEnd: timestamp("selected_end", { withTimezone: true }),
    externalEventId: text("external_event_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    bookedAt: timestamp("booked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("scheduling_requests_user_status_idx").on(table.userId, table.status),
    index("scheduling_requests_mail_item_idx").on(table.mailItemId),
  ],
);

export type SchedulingRequest = typeof schedulingRequests.$inferSelect;
export type NewSchedulingRequest = typeof schedulingRequests.$inferInsert;
