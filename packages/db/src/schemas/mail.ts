import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

import type { MailUrgency } from "../domain";
import { users } from "./auth";
import { connections } from "./connections";

export type MailRecipient = {
  email: string;
  name?: string;
};

export const mailItems = pgTable(
  "mail_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    providerMessageId: text("provider_message_id").notNull(),
    providerThreadId: text("provider_thread_id").notNull(),
    senderEmail: text("sender_email").notNull(),
    senderName: text("sender_name"),
    recipients: jsonb("recipients").$type<MailRecipient[]>().notNull(),
    subject: text("subject").notNull(),
    snippet: text("snippet"),
    bodyText: text("body_text").notNull(),
    labels: jsonb("labels").$type<string[]>().default([]).notNull(),
    isUnread: boolean("is_unread").default(true).notNull(),
    urgency: text("urgency").$type<MailUrgency>(),
    importanceScore: integer("importance_score"),
    meetingIntent: boolean("meeting_intent"),
    classificationConfidence: integer("classification_confidence"),
    classificationReason: text("classification_reason"),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    indexedAt: timestamp("indexed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("mail_items_user_provider_message_unique").on(
      table.userId,
      table.providerMessageId,
    ),
    index("mail_items_user_received_at_idx").on(table.userId, table.receivedAt),
    index("mail_items_user_thread_idx").on(
      table.userId,
      table.providerThreadId,
    ),
    index("mail_items_user_urgency_received_idx").on(
      table.userId,
      table.urgency,
      table.receivedAt,
    ),
  ],
);

export const mailChunks = pgTable(
  "mail_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mailItemId: uuid("mail_item_id")
      .notNull()
      .references(() => mailItems.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(),
    content: text("content").notNull(),
    tokenCount: integer("token_count"),
    // ponytail: v1 normalizes embeddings to 1536 dimensions; split stores by
    // model before supporting providers with arbitrary embedding dimensions.
    embedding: vector("embedding", { dimensions: 1536 }),
    embeddingModel: text("embedding_model"),
    embeddedAt: timestamp("embedded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("mail_chunks_item_index_unique").on(
      table.mailItemId,
      table.chunkIndex,
    ),
    index("mail_chunks_user_id_idx").on(table.userId),
    index("mail_chunks_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export type MailItem = typeof mailItems.$inferSelect;
export type NewMailItem = typeof mailItems.$inferInsert;
export type MailChunk = typeof mailChunks.$inferSelect;
export type NewMailChunk = typeof mailChunks.$inferInsert;
