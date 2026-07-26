import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import type { AiProvider } from "../domain";

export const aiCredentials = pgTable(
  "ai_credentials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").$type<AiProvider>().notNull(),
    label: text("label").notNull(),
    encryptedKey: text("encrypted_key").notNull(),
    keyIv: text("key_iv").notNull(),
    keyAuthTag: text("key_auth_tag").notNull(),
    encryptionVersion: integer("encryption_version").default(1).notNull(),
    keyHint: text("key_hint"),
    status: text("status").default("active").notNull(),
    lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("ai_credentials_user_id_idx").on(table.userId),
    index("ai_credentials_user_provider_status_idx").on(
      table.userId,
      table.provider,
      table.status,
    ),
  ],
);

export const aiUsagePolicies = pgTable(
  "ai_usage_policies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dailyCallLimit: integer("daily_call_limit").default(20).notNull(),
    monthlyCallLimit: integer("monthly_call_limit").default(500).notNull(),
    warningThresholdPercent: integer("warning_threshold_percent")
      .default(80)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("ai_usage_policies_user_unique").on(table.userId)],
);

export const aiUsageEvents = pgTable(
  "ai_usage_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    credentialId: uuid("credential_id").references(() => aiCredentials.id, {
      onDelete: "set null",
    }),
    provider: text("provider").notNull(),
    model: text("model").notNull(),
    operation: text("operation").notNull(),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    totalTokens: integer("total_tokens"),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("ai_usage_events_user_occurred_at_idx").on(
      table.userId,
      table.occurredAt,
    ),
  ],
);

export type AiCredential = typeof aiCredentials.$inferSelect;
export type AiUsagePolicy = typeof aiUsagePolicies.$inferSelect;
export type AiUsageEvent = typeof aiUsageEvents.$inferSelect;
