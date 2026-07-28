import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type {
  ActionType,
  IntegrationProvider,
  PendingActionStatus,
} from "../domain";
import { users } from "./auth";
import { chatMessages } from "./chat";
import { connections } from "./connections";
import { mailItems } from "./mail";
import { schedulingRequests } from "./scheduling";

export const pendingActions = pgTable(
  "pending_actions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceMessageId: uuid("source_message_id").references(
      () => chatMessages.id,
      { onDelete: "set null" },
    ),
    mailItemId: uuid("mail_item_id").references(() => mailItems.id, {
      onDelete: "set null",
    }),
    schedulingRequestId: uuid("scheduling_request_id").references(
      () => schedulingRequests.id,
      { onDelete: "set null" },
    ),
    connectionId: uuid("connection_id").references(() => connections.id, {
      onDelete: "set null",
    }),
    actionType: text("action_type").$type<ActionType>().notNull(),
    integration: text("integration").$type<IntegrationProvider>().notNull(),
    status: text("status")
      .$type<PendingActionStatus>()
      .default("draft")
      .notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    previewText: text("preview_text"),
    idempotencyKey: text("idempotency_key").notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    executedAt: timestamp("executed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("pending_actions_user_idempotency_unique").on(
      table.userId,
      table.idempotencyKey,
    ),
    index("pending_actions_user_status_idx").on(table.userId, table.status),
    index("pending_actions_source_message_idx").on(table.sourceMessageId),
  ],
);

export type PendingAction = typeof pendingActions.$inferSelect;
export type NewPendingAction = typeof pendingActions.$inferInsert;
