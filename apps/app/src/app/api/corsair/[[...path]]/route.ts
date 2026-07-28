import { createCorsairNextHandlers } from "@repo/corsair";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export const { GET, POST, OPTIONS } = createCorsairNextHandlers({
  basePath: "/api/corsair",
  getTenantId: async (request) => {
    const session = await auth.api.getSession({ headers: request.headers });
    return session?.user.id ?? null;
  },
});
