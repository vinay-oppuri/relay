import assert from "node:assert/strict";
import test from "node:test";

import { normalizeGmailMessage } from "./gmail-message.ts";

test("normalizeGmailMessage extracts headers, recipients, body, and labels", () => {
  const message = normalizeGmailMessage({
    id: "message-1",
    threadId: "thread-1",
    internalDate: "1722254400000",
    labelIds: ["INBOX", "UNREAD"],
    snippet: "Fallback",
    payload: {
      headers: [
        { name: "From", value: '"Ada Lovelace" <ADA@example.com>' },
        {
          name: "To",
          value: "Grace <grace@example.com>, team@example.com",
        },
        { name: "Subject", value: "Project update" },
      ],
      parts: [
        {
          mimeType: "text/plain",
          body: {
            data: Buffer.from("The project is ready.").toString("base64url"),
          },
        },
      ],
    },
  });

  assert.deepEqual(message, {
    providerMessageId: "message-1",
    providerThreadId: "thread-1",
    senderEmail: "ada@example.com",
    senderName: "Ada Lovelace",
    recipients: [{ email: "grace@example.com" }, { email: "team@example.com" }],
    subject: "Project update",
    snippet: "Fallback",
    bodyText: "The project is ready.",
    labels: ["INBOX", "UNREAD"],
    isUnread: true,
    receivedAt: new Date("2024-07-29T12:00:00.000Z"),
  });
});

test("normalizeGmailMessage rejects messages without trusted identifiers", () => {
  assert.equal(normalizeGmailMessage({ id: "message-1" }), null);
});
