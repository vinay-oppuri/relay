import { toNextJsHandler, type ManagementHandlerOptions } from "corsair";

import { ensureCorsairIntegrationCredentials, getCorsair } from "./corsair";
import { isCorsairDeliveryRequest } from "./corsair-request";

export {
  ensureCorsairIntegrationCredentials,
  getCorsair,
  type RelayCorsair,
} from "./corsair";
export { syncGmailMessages } from "./plugins/gmail-sync";

type RelayHandlerOptions = ManagementHandlerOptions & {
  getTenantId: (request: Request) => Promise<string | null>;
};

export function createCorsairNextHandlers({
  getTenantId,
  ...options
}: RelayHandlerOptions) {
  const basePath = (options.basePath ?? "/api/corsair").replace(/\/$/, "");

  const handle =
    (method: "GET" | "OPTIONS" | "POST") => async (request: Request) => {
      const pathname = new URL(request.url).pathname.replace(/\/$/, "");

      if (isCorsairDeliveryRequest(request, basePath)) {
        return toNextJsHandler(getCorsair(), options)[method](request);
      }

      const tenantId = await getTenantId(request);

      if (!tenantId) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }

      await ensureCorsairIntegrationCredentials();

      const corsair = getCorsair();

      try {
        if (method === "GET" && pathname === `${basePath}/connection-status`) {
          return Response.json(
            await corsair.manage.connectionStatus.get({ tenantId }),
          );
        }

        if (method === "POST" && pathname === `${basePath}/connect/links`) {
          return Response.json(
            await corsair.manage.connect.createLink({
              plugin: "gmail",
              tenantId,
              oauthMode: "byo",
            }),
          );
        }
      } catch (error) {
        console.error("Corsair management request failed", error);
        return Response.json(
          {
            error: "corsair_request_failed",
            message: "Could not complete the Corsair request.",
          },
          { status: 502 },
        );
      }

      return Response.json({ error: "not_found" }, { status: 404 });
    };

  return {
    GET: handle("GET"),
    OPTIONS: handle("OPTIONS"),
    POST: handle("POST"),
  };
}
