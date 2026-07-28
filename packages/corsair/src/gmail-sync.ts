import { connections, db, mailItems, type NewMailItem } from "@repo/db";
import { and, eq, sql } from "drizzle-orm";

import { getCorsair } from "./corsair";
import { normalizeGmailMessage } from "./gmail-message";

const PAGE_SIZE = 50;

function metadataString(
  metadata: Record<string, unknown> | undefined,
  key: string,
) {
  const value = metadata?.[key];
  return typeof value === "string" && value ? value : undefined;
}

export async function syncGmailMessages(userId: string) {
  const [existing] = await db
    .select()
    .from(connections)
    .where(
      and(eq(connections.userId, userId), eq(connections.provider, "gmail")),
    )
    .limit(1);

  const previousMetadata = existing?.metadata ?? {};
  const pageToken = metadataString(previousMetadata, "gmailPageToken");
  const startedAt =
    metadataString(previousMetadata, "gmailSyncStartedAt") ??
    new Date().toISOString();
  const query =
    metadataString(previousMetadata, "gmailSyncQuery") ??
    (existing?.lastSyncedAt
      ? `after:${Math.floor(existing.lastSyncedAt.getTime() / 1000)}`
      : "newer_than:90d");
  const gmail = getCorsair().withTenant(userId).gmail;
  const page = await gmail.api.messages.list({
    userId: "me",
    q: query,
    maxResults: PAGE_SIZE,
    pageToken,
  });
  const now = new Date();

  const [connection] = await db
    .insert(connections)
    .values({
      userId,
      provider: "gmail",
      corsairTenantId: userId,
      status: "active",
      metadata: previousMetadata,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [
        connections.userId,
        connections.provider,
        connections.corsairTenantId,
      ],
      set: { status: "active", updatedAt: now },
    })
    .returning({ id: connections.id });

  if (!connection) throw new Error("Could not persist the Gmail connection.");

  const messages = [];
  const messageIds = (page.messages ?? [])
    .map((message) => message.id)
    .filter((id): id is string => Boolean(id));

  for (let index = 0; index < messageIds.length; index += 10) {
    const batch = await Promise.all(
      messageIds
        .slice(index, index + 10)
        .map((id) =>
          gmail.api.messages.get({ userId: "me", id, format: "full" }),
        ),
    );
    messages.push(...batch);
  }

  const values = messages
    .map(normalizeGmailMessage)
    .filter((message): message is NonNullable<typeof message> =>
      Boolean(message),
    )
    .map(
      (message): NewMailItem => ({
        ...message,
        userId,
        connectionId: connection.id,
        syncedAt: now,
        updatedAt: now,
      }),
    );

  if (values.length) {
    await db
      .insert(mailItems)
      .values(values)
      .onConflictDoUpdate({
        target: [mailItems.userId, mailItems.providerMessageId],
        set: {
          connectionId: sql`excluded.connection_id`,
          providerThreadId: sql`excluded.provider_thread_id`,
          senderEmail: sql`excluded.sender_email`,
          senderName: sql`excluded.sender_name`,
          recipients: sql`excluded.recipients`,
          subject: sql`excluded.subject`,
          snippet: sql`excluded.snippet`,
          bodyText: sql`excluded.body_text`,
          labels: sql`excluded.labels`,
          isUnread: sql`excluded.is_unread`,
          receivedAt: sql`excluded.received_at`,
          syncedAt: now,
          updatedAt: now,
        },
      });
  }

  const metadata = { ...previousMetadata };

  if (page.nextPageToken) {
    metadata.gmailPageToken = page.nextPageToken;
    metadata.gmailSyncQuery = query;
    metadata.gmailSyncStartedAt = startedAt;
  } else {
    delete metadata.gmailPageToken;
    delete metadata.gmailSyncQuery;
    delete metadata.gmailSyncStartedAt;
  }

  await db
    .update(connections)
    .set({
      lastSyncedAt: page.nextPageToken
        ? existing?.lastSyncedAt
        : new Date(startedAt),
      metadata,
      status: "active",
      updatedAt: now,
    })
    .where(eq(connections.id, connection.id));

  return {
    synced: values.length,
    hasMore: Boolean(page.nextPageToken),
  };
}
