export type UsageCap = {
  used: number;
  limit: number;
  resetAt?: Date;
};

export type UsageCapStatus = UsageCap & {
  allowed: boolean;
  remaining: number;
};

export class UsageCapExceededError extends Error {
  readonly resetAt?: Date;

  constructor(resetAt?: Date) {
    super("AI usage cap exceeded");
    this.name = "UsageCapExceededError";
    this.resetAt = resetAt;
  }
}

export function getUsageCapStatus(cap: UsageCap): UsageCapStatus {
  if (!Number.isFinite(cap.used) || !Number.isFinite(cap.limit)) {
    throw new TypeError("Usage values must be finite numbers");
  }

  if (cap.used < 0 || cap.limit < 0) {
    throw new RangeError("Usage values cannot be negative");
  }

  const remaining = Math.max(0, cap.limit - cap.used);

  return {
    ...cap,
    allowed: remaining > 0,
    remaining,
  };
}

export function assertWithinUsageCap(cap: UsageCap) {
  const status = getUsageCapStatus(cap);

  if (!status.allowed) {
    throw new UsageCapExceededError(status.resetAt);
  }

  return status;
}
