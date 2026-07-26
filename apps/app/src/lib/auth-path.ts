export function safeNextPath(value: string | null, fallback = "/") {
  if (!value) {
    return fallback;
  }

  try {
    const base = new URL("https://relay.local");
    const destination = new URL(value, base);

    return destination.origin === base.origin
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
