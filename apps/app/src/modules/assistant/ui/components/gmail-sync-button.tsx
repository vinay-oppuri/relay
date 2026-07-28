"use client";

import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GmailSyncButtonProps = {
  connected: boolean;
};

function errorMessage(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }

  return "Could not connect to Gmail. Please try again.";
}

export function GmailSyncButton({ connected }: GmailSyncButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sync() {
    const response = await fetch("/api/mail/sync", { method: "POST" });
    const result: unknown = await response.json();

    if (!response.ok) throw result;

    router.refresh();
  }

  async function connectOrSync() {
    setPending(true);
    setError(null);

    try {
      if (connected) {
        await sync();
        return;
      }

      const statusResponse = await fetch("/api/corsair/connection-status");
      const status: unknown = await statusResponse.json();

      if (!statusResponse.ok) throw status;

      if (
        status &&
        typeof status === "object" &&
        "gmail" in status &&
        status.gmail === "connected"
      ) {
        await sync();
        return;
      }

      const linkResponse = await fetch("/api/corsair/connect/links", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const link: unknown = await linkResponse.json();

      if (
        !linkResponse.ok ||
        !link ||
        typeof link !== "object" ||
        !("connectUrl" in link) ||
        typeof link.connectUrl !== "string"
      ) {
        throw link;
      }

      const connectUrl = new URL(link.connectUrl);

      if (connectUrl.protocol !== "https:") {
        throw new Error("Corsair returned an invalid connection URL.");
      }

      window.location.assign(connectUrl);
    } catch (cause) {
      setError(errorMessage(cause));
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button disabled={pending} onClick={connectOrSync} type="button">
        {pending ? "Working..." : connected ? "Sync Gmail" : "Connect Gmail"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
