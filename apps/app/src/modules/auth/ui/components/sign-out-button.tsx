"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.replace("/login");
        router.refresh();
      }}
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
