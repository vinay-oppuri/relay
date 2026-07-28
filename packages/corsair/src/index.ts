import { toNextJsHandler, type ManagementHandlerOptions } from "corsair";

import { getCorsair } from "./corsair";

export { getCorsair, type RelayCorsair } from "./corsair";

type RelayHandlerOptions = ManagementHandlerOptions & {
  getTenantId: (request: Request) => Promise<string | null>;
};

export function createCorsairNextHandlers({
  getTenantId,
  ...options
}: RelayHandlerOptions) {
  const handle =
    (method: "GET" | "OPTIONS" | "POST") => async (request: Request) => {
      const tenantId = await getTenantId(request);

      if (!tenantId) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }

      const corsair = getCorsair().withTenant(tenantId);
      return toNextJsHandler(corsair, options)[method](request);
    };

  return {
    GET: handle("GET"),
    OPTIONS: handle("OPTIONS"),
    POST: handle("POST"),
  };
}
