import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const corsairIntegrations = pgTable("corsair_integrations", {
  id: text("id").primaryKey(),
  ...timestamps,
  name: text("name").notNull(),
  config: jsonb("config")
    .$type<Record<string, unknown>>()
    .default({})
    .notNull(),
  dek: text("dek"),
});

export const corsairAccounts = pgTable(
  "corsair_accounts",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    tenantId: text("tenant_id").notNull(),
    integrationId: text("integration_id")
      .notNull()
      .references(() => corsairIntegrations.id, { onDelete: "cascade" }),
    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    dek: text("dek"),
  },
  (table) => [
    index("corsair_accounts_tenant_id_idx").on(table.tenantId),
    index("corsair_accounts_integration_id_idx").on(table.integrationId),
  ],
);

export const corsairEntities = pgTable(
  "corsair_entities",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    accountId: text("account_id")
      .notNull()
      .references(() => corsairAccounts.id, { onDelete: "cascade" }),
    entityId: text("entity_id").notNull(),
    entityType: text("entity_type").notNull(),
    version: text("version").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().default({}).notNull(),
  },
  (table) => [
    uniqueIndex("corsair_entities_account_entity_unique").on(
      table.accountId,
      table.entityId,
      table.entityType,
    ),
  ],
);

export const corsairEvents = pgTable(
  "corsair_events",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    accountId: text("account_id")
      .notNull()
      .references(() => corsairAccounts.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    status: text("status").default("pending"),
  },
  (table) => [index("corsair_events_account_id_idx").on(table.accountId)],
);

export const corsairPermissions = pgTable(
  "corsair_permissions",
  {
    id: text("id").primaryKey(),
    ...timestamps,
    token: text("token").notNull(),
    plugin: text("plugin").notNull(),
    endpoint: text("endpoint").notNull(),
    args: text("args").notNull(),
    tenantId: text("tenant_id").default("default").notNull(),
    status: text("status").default("pending").notNull(),
    expiresAt: text("expires_at").notNull(),
    error: text("error"),
  },
  (table) => [
    uniqueIndex("corsair_permissions_token_unique").on(table.token),
    index("corsair_permissions_tenant_status_idx").on(
      table.tenantId,
      table.status,
    ),
  ],
);
