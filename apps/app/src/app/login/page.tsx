import { getSession } from "@/lib/session";
import { AuthView } from "@/modules/auth/ui/views/auth-view";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(session.user.nicheTemplate ? "/" : "/onboarding");
  }

  return <AuthView />;
}
