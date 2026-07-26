import { createCorsairNextHandlers } from "@repo/corsair";

export const runtime = "nodejs";

export const { GET, POST, OPTIONS } = createCorsairNextHandlers({
  basePath: "/api/corsair",
});
