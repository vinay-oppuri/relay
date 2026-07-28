export const NICHE_TEMPLATES = ["recruiter", "sales", "solo-founder"] as const;
export type NicheTemplate = (typeof NICHE_TEMPLATES)[number];

export const AI_PROVIDERS = ["openai", "anthropic", "gemini"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

export const INTEGRATION_PROVIDERS = [
  "gmail",
  "google-calendar",
  "slack",
  "calendly",
] as const;
export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export const MAIL_URGENCY_LEVELS = ["low", "normal", "high", "urgent"] as const;
export type MailUrgency = (typeof MAIL_URGENCY_LEVELS)[number];

export const CHAT_MESSAGE_ROLES = ["user", "assistant", "tool"] as const;
export type ChatMessageRole = (typeof CHAT_MESSAGE_ROLES)[number];

export const SCHEDULING_REQUEST_STATUSES = [
  "detected",
  "awaiting-selection",
  "confirmed",
  "booked",
  "dismissed",
  "failed",
] as const;
export type SchedulingRequestStatus =
  (typeof SCHEDULING_REQUEST_STATUSES)[number];

export const PENDING_ACTION_STATUSES = [
  "draft",
  "confirmed",
  "executing",
  "executed",
  "cancelled",
  "failed",
] as const;
export type PendingActionStatus = (typeof PENDING_ACTION_STATUSES)[number];

export const ACTION_TYPES = [
  "email-reply",
  "calendar-event",
  "slack-message",
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];
