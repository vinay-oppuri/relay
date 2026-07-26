import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { connections } from "./connections";
import { meetings } from "./meetings";
import { workflows } from "./workflows";
import type {
  ActionType,
  IntegrationProvider,
  PendingActionStatus,
} from "../domain";

export const pendingActions = pgTable(
  "pending_actions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workflowId: uuid("workflow_id").references(() => workflows.id, {
      onDelete: "set null",
    }),
    meetingId: uuid("meeting_id").references(() => meetings.id, {
      onDelete: "set null",
    }),
    connectionId: uuid("connection_id").references(() => connections.id, {
      onDelete: "set null",
    }),
    actionType: text("action_type").$type<ActionType>().notNull(),
    integration: text("integration").$type<IntegrationProvider>().notNull(),
    title: text("title").notNull(),
    status: text("status")
      .$type<PendingActionStatus>()
      .default("pending")
      .notNull(),
    riskLevel: text("risk_level").default("sensitive").notNull(),
    originalPayload: jsonb("original_payload")
      .$type<Record<string, unknown>>()
      .notNull(),
    editedPayload: jsonb("edited_payload").$type<Record<string, unknown>>(),
    previewText: text("preview_text"),
    rejectionReason: text("rejection_reason"),
    idempotencyKey: text("idempotency_key").notNull(),
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    executedAt: timestamp("executed_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("pending_actions_user_idempotency_unique").on(
      table.userId,
      table.idempotencyKey,
    ),
    index("pending_actions_user_status_requested_idx").on(
      table.userId,
      table.status,
      table.requestedAt,
    ),
    index("pending_actions_workflow_id_idx").on(table.workflowId),
    index("pending_actions_meeting_id_idx").on(table.meetingId),
  ],
);

export type PendingAction = typeof pendingActions.$inferSelect;
export type NewPendingAction = typeof pendingActions.$inferInsert;
