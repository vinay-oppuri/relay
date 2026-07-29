import type { Message, MessagePart } from "@corsair-dev/gmail";

export type NormalizedGmailMessage = {
  providerMessageId: string;
  providerThreadId: string;
  senderEmail: string;
  senderName: string | null;
  recipients: { email: string }[];
  subject: string;
  snippet: string | null;
  bodyText: string;
  labels: string[];
  isUnread: boolean;
  receivedAt: Date;
};

function header(message: Message, name: string) {
  return message.payload?.headers?.find(
    (item) => item.name?.toLowerCase() === name.toLowerCase(),
  )?.value;
}

function emailAddresses(value = "") {
  // ponytail: this extracts RFC 5322 addr-spec values but not group syntax;
  // replace with a mail parser if group-address support becomes necessary.
  return Array.from(
    value.matchAll(
      /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/g,
    ),
    ([email]) => ({ email: email.toLowerCase() }),
  );
}

function senderName(value = "") {
  const name = value.split("<", 1)[0]?.trim().replace(/^"|"$/g, "");
  return name && !name.includes("@") ? name : null;
}

function textBody(part: MessagePart | undefined): string | null {
  if (!part) return null;

  if (part.mimeType === "text/plain" && part.body?.data) {
    return Buffer.from(part.body.data, "base64url").toString("utf8");
  }

  for (const child of part.parts ?? []) {
    const body = textBody(child);
    if (body) return body;
  }

  return null;
}

function receivedAt(message: Message) {
  if (message.internalDate) {
    const timestamp = Number(message.internalDate);
    const date = Number.isFinite(timestamp)
      ? new Date(timestamp)
      : new Date(message.internalDate);

    if (!Number.isNaN(date.getTime())) return date;
  }

  const date = new Date(header(message, "date") ?? "");
  return Number.isNaN(date.getTime()) ? null : date;
}

export function normalizeGmailMessage(
  message: Message,
): NormalizedGmailMessage | null {
  const from = header(message, "from");
  const sender = emailAddresses(from)[0]?.email;
  const date = receivedAt(message);

  if (!message.id || !sender || !date) return null;

  const recipients = emailAddresses(
    [header(message, "to"), header(message, "cc"), header(message, "bcc")]
      .filter(Boolean)
      .join(","),
  );

  return {
    providerMessageId: message.id,
    providerThreadId: message.threadId ?? message.id,
    senderEmail: sender,
    senderName: senderName(from),
    recipients,
    subject: header(message, "subject")?.trim() || "(no subject)",
    snippet: message.snippet?.trim() || null,
    bodyText:
      textBody(message.payload)?.trim() || message.snippet?.trim() || "",
    labels: message.labelIds ?? [],
    isUnread: message.labelIds?.includes("UNREAD") ?? false,
    receivedAt: date,
  };
}
