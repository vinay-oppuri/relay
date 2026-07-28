import "server-only";

import { aiCredentials, connections, db, mailItems } from "@repo/db";
import { and, desc, eq } from "drizzle-orm";

export async function getAssistantOverview(userId: string) {
  const [gmailConnection, aiCredential, recentMail] = await Promise.all([
    db
      .select({ status: connections.status })
      .from(connections)
      .where(
        and(eq(connections.userId, userId), eq(connections.provider, "gmail")),
      )
      .limit(1),
    db
      .select({ id: aiCredentials.id })
      .from(aiCredentials)
      .where(
        and(
          eq(aiCredentials.userId, userId),
          eq(aiCredentials.status, "active"),
        ),
      )
      .limit(1),
    db
      .select({
        id: mailItems.id,
        senderName: mailItems.senderName,
        senderEmail: mailItems.senderEmail,
        subject: mailItems.subject,
        snippet: mailItems.snippet,
        urgency: mailItems.urgency,
        receivedAt: mailItems.receivedAt,
      })
      .from(mailItems)
      .where(eq(mailItems.userId, userId))
      .orderBy(desc(mailItems.receivedAt))
      .limit(8),
  ]);

  return {
    gmailReady: gmailConnection[0]?.status === "active",
    aiReady: aiCredential.length > 0,
    recentMail,
  };
}

export type AssistantOverview = Awaited<
  ReturnType<typeof getAssistantOverview>
>;
