import { auth } from "@/lib/auth";
import { syncGmailMessages } from "@repo/corsair";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    return Response.json(await syncGmailMessages(session.user.id));
  } catch (error) {
    console.error("Gmail sync failed", error);
    return Response.json(
      { error: "gmail_sync_failed", message: "Could not sync Gmail." },
      { status: 502 },
    );
  }
}
