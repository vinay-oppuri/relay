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

export const WORKFLOW_STATUSES = ["draft", "active", "paused"] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export const PENDING_ACTION_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "executing",
  "executed",
  "failed",
  "expired",
] as const;
export type PendingActionStatus = (typeof PENDING_ACTION_STATUSES)[number];

export const ACTION_TYPES = [
  "email-reply",
  "calendar-event",
  "slack-message",
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];
